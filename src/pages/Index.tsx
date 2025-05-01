// src/pages/index.tsx
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PricingSection from '@/components/PricingSection';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <FeatureSection />
      <PricingSection onSelectPlan={() => navigate('/signup')} />
      <Footer />
    </div>
  );
};

export default Index;
