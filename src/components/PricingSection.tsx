
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

interface PricingSectionProps {
  onSelectPlan?: (plan: PricingPlan) => void;
  selectedPlanId?: string;
  showYearlyPricing?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals and small teams',
    price: '$9',
    features: [
      'Up to 5 team members',
      '5GB storage',
      'Basic support',
      'Issue tracking',
      'API access',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Best for growing teams',
    price: '$29',
    features: [
      'Up to 20 team members',
      '20GB storage',
      'Priority support',
      'Advanced reporting',
      'Custom fields',
      'Timeline view',
      'Guest access',
    ],
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: '$99',
    features: [
      'Unlimited team members',
      'Unlimited storage',
      '24/7 support',
      'Custom integration',
      'Advanced security',
      'Custom branding',
      'SSO authentication',
      'Dedicated account manager',
    ],
  },
];

const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  selectedPlanId,
  showYearlyPricing = false,
}) => {
  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-600">
            Choose the perfect plan for your team. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden ${
                plan.isPopular ? 'border-primary shadow-lg scale-105' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-gray-600 mt-2">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-6 ${
                    selectedPlanId === plan.id ? 'bg-primary' : ''
                  }`}
                  variant={plan.isPopular ? 'default' : 'outline'}
                  onClick={() => onSelectPlan?.(plan)}
                >
                  {selectedPlanId === plan.id ? 'Selected' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
