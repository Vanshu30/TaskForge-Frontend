import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import React from 'react';

interface PricingSectionProps {
  onSelectPlan?: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-jira-text">Simple pricing, for everyone</h2>
        <p className="text-gray-600 mb-12">
          No hidden fees. No credit card required. Free forever for small teams.
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow p-8 max-w-xs w-full">
            <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
            <p className="text-3xl font-bold mb-4">$0 <span className="text-base font-medium text-gray-500">/mo</span></p>
            <ul className="text-left mb-6 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Up to 10 users
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Unlimited projects
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Basic analytics
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Email support
              </li>
            </ul>
            <Button className="w-full text-sm py-2" onClick={onSelectPlan}>
              Get started for free
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow p-8 max-w-xs w-full">
            <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
            <p className="text-3xl font-bold mb-4">$15 <span className="text-base font-medium text-gray-500">/mo</span></p>
            <ul className="text-left mb-6 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Up to 50 users
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Advanced analytics
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Priority email support
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Customizable features
              </li>
            </ul>
            <Button className="w-full text-sm py-2" onClick={onSelectPlan}>
              Upgrade to Pro
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-lg shadow p-8 max-w-xs w-full">
            <h3 className="text-xl font-semibold mb-2">Enterprise Plan</h3>
            <p className="text-3xl font-bold mb-4">$49 <span className="text-base font-medium text-gray-500">/mo</span></p>
            <ul className="text-left mb-6 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Unlimited users
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Advanced security features
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                24/7 dedicated support
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                Dedicated account manager
              </li>
            </ul>
            <Button className="w-full text-sm py-2" onClick={onSelectPlan}>
              Contact us for pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
