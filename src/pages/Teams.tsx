
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { Menu, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Teams = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for teams (this would typically come from your backend)
  const mockTeams = [
    {
      id: 1,
      name: 'Website Redesign Team',
      members: ['Alex Johnson', 'Maria Garcia', 'David Kim', 'Sarah Wilson'],
    },
    {
      id: 2,
      name: 'Mobile App Team',
      members: ['John Doe', 'Jane Smith', 'Mike Brown'],
    },
    {
      id: 3,
      name: 'Marketing Campaign Team',
      members: ['Lisa Wong', 'Chris Taylor', 'Emma Davis'],
    },
  ];

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

          <h1 className="text-2xl font-bold mb-6">Teams</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTeams.map(team => (
              <Card key={team.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {team.members.map((member, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {member}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Teams;
