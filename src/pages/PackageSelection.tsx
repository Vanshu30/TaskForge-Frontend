
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingSection, { PricingPlan } from '@/components/PricingSection';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const PackageSelection = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const navigate = useNavigate();

  const handlePlanSelection = (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "You need to select a plan to continue",
        variant: "destructive",
      });
      return;
    }

    // Store the selected plan in localStorage
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-600">
            Select the perfect plan for your team. You can always change it later.
          </p>
        </div>

        <PricingSection
          onSelectPlan={handlePlanSelection}
          selectedPlanId={selectedPlan?.id}
        />

        <div className="flex justify-center mt-12">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedPlan}
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageSelection;
