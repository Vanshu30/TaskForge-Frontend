import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          isMobile={isMobile} 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
        />
        
        <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'w-full' : ''}`}>
          {isMobile && !sidebarOpen && (
            <Button 
              variant="outline" 
              size="icon" 
              className="mb-4" 
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </Button>
          )}
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-jira-text">Welcome back, {user.name}</h1>
            <p className="text-gray-600">Here's what's happening in your workspace today.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Tasks</CardTitle>
                <CardDescription>Your assigned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">2 urgent, 5 in progress</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Projects</CardTitle>
                <CardDescription>Ongoing projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4</div>
                <p className="text-sm text-muted-foreground">2 need attention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Team Members</CardTitle>
                <CardDescription>Active collaborators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-sm text-muted-foreground">3 new this month</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks" onClick={() => navigate('/tasks')}>My Tasks</TabsTrigger>
              <TabsTrigger value="projects" onClick={() => navigate('/projects')}>Projects</TabsTrigger>
              <TabsTrigger value="calendar" onClick={() => navigate('/calendar')}>Calendar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    View and manage your assigned tasks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="py-3 px-4 text-left text-sm font-medium">Task</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Due Date</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Priority</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr className="hover:bg-muted/50">
                          <td className="py-3 px-4">Design new dashboard layout</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">In Progress</span>
                          </td>
                          <td className="py-3 px-4">Apr 28, 2025</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">High</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/50">
                          <td className="py-3 px-4">Update API documentation</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span>
                          </td>
                          <td className="py-3 px-4">Apr 25, 2025</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Medium</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/50">
                          <td className="py-3 px-4">Bug fixes for authentication module</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">To Review</span>
                          </td>
                          <td className="py-3 px-4">Apr 30, 2025</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">High</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>
                    Overview of your current projects.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Website Redesign</h3>
                          <p className="text-sm text-muted-foreground">Redesigning the company website with new branding</p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">In Progress</span>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-1">Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>45% completed</span>
                          <span>Due: May 15, 2025</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Mobile App Development</h3>
                          <p className="text-sm text-muted-foreground">Building a companion mobile app for our platform</p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Planning</span>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-1">Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>15% completed</span>
                          <span>Due: Aug 1, 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>
                    Your upcoming events and deadlines.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-10 text-muted-foreground">
                    <p>Calendar view is under development.</p>
                    <p>Check back soon for updates!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
