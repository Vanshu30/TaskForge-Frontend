
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handlePlanSelection = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <FeatureSection />
      <PricingSection onSelectPlan={handlePlanSelection} />
      <Footer />
    </div>
  );
};

export default Index;
