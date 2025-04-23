
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const Calendar = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className="flex-1 overflow-auto">
        <Header />
        
        {isMobile && !sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </Button>
        )}
        
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center mb-6">
            <Link 
              to="/dashboard" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-6">Calendar</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-muted-foreground">
                Selected date: {date?.toLocaleDateString()}
              </p>
              {/* Additional calendar details will go here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
