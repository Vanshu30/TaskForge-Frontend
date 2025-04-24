
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0052CC] to-[#6554C0] text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-white/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Work at the speed of your team
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/80 max-w-lg mx-auto lg:mx-0">
              The #1 project management tool for high-performance teams — clear visibility, efficient workflows, unlimited possibilities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-white/50 text-white hover:bg-white/20 hover:border-white/70"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                  Get started
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/70">
              No credit card required. Free for teams up to 10 users.
            </p>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 shadow-2xl border border-white/20 animate-bounce-slow">
              <img 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
                alt="TaskFlow Dashboard" 
                className="rounded w-full h-auto shadow-lg"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              <div className="text-center">
                <div className="text-2xl">98%</div>
                <div className="text-xs">Customer<br/>satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 bg-white py-6 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-gray-500">
            <span className="text-lg font-medium text-jira-text">Trusted by top companies</span>
            <span className="text-xl font-bold text-gray-400">Microsoft</span>
            <span className="text-xl font-bold text-gray-400">Adobe</span>
            <span className="text-xl font-bold text-gray-400">Shopify</span>
            <span className="text-xl font-bold text-gray-400">Airbnb</span>
            <span className="text-xl font-bold text-gray-400">Spotify</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
