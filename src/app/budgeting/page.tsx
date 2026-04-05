"use client";
import { ConstructionPlaceholder } from "@/components/ConstructionPlaceholder";
import { BarChart3 } from "lucide-react";

export default function BudgetingPage() {
  return (
    <ConstructionPlaceholder 
      title="Budget Planner" 
      description="Set monthly spending limits, track budgets by category, and get alerts when you're close to your cap." 
      icon={BarChart3} 
    />
  );
}
