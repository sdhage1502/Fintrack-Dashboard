import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useAuthStore } from '../store/authStore';
import { LoginFormValues, SignupFormValues } from '../schemas/auth';

export const signUpUser = async (data: SignupFormValues) => {
  const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
  
  const newUser = {
    uid: user.uid,
    name: data.name,
    email: data.email,
    role: 'user' as const, // default role
    createdAt: new Date().toISOString()
  };

  // Add the user to the Firestore users collection
  await setDoc(doc(db, 'users', user.uid), newUser);
  
  return newUser;
};

export const loginUser = async (data: LoginFormValues) => {
  const { user } = await signInWithEmailAndPassword(auth, data.email, data.password);
  
  // Fetch user role from firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    throw new Error('User record not found in database');
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

// Auto Listener
export const initAuthListener = () => {
  return onAuthStateChanged(auth, async (user) => {
    const { setUser, setLoading } = useAuthStore.getState();
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: userData.uid,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            createdAt: userData.createdAt
          });
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  });
};
