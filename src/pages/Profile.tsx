import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from "lucide-react";
import AvatarUpload from "@/components/AvatarUpload";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string | null>(null);

  // If no user is logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Function to get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Manager':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'Developer':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Viewer':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Back arrow in header */}
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="go back">
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold ml-2">My Profile</h1>
      </div>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-24 h-24 mx-auto rounded-full object-cover border"
                />
              ) : (
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <CardTitle className="mt-4">{user.name}</CardTitle>
              <Badge className={`mt-2 ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </Badge>
              <CardDescription className="mt-2">{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AvatarUpload onChange={setAvatar} />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Organization</h3>
                  <p className="mt-1">{user.organizationName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Organization ID</h3>
                  <p className="mt-1">{user.organizationId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                  <p className="mt-1">April 2025</p>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="text-sm text-center text-muted-foreground">
                <p className="italic">Role permissions are fixed and cannot be changed after account creation.</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Role Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Role Information</CardTitle>
              <CardDescription>
                Details about your role and permissions in the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">You are a <span className="text-primary">{user.role}</span></h3>
                  <p className="mt-2 text-muted-foreground">
                    {user.role === 'Admin' && 'As an Administrator, you have full access to all features and settings of the organization.'}
                    {user.role === 'Manager' && 'As a Manager, you have access to most features and can manage projects and teams.'}
                    {user.role === 'Developer' && 'As a Developer, you can work on assigned tasks and contribute to projects.'}
                    {user.role === 'Viewer' && 'As a Viewer, you have read-only access to projects and tasks.'}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-base font-medium mb-2">Your Permissions</h3>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm">Create Projects</div>
                      <div>
                        {(user.role === 'Admin' || user.role === 'Manager') ? (
                          <span className="inline-flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            No
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm">Manage Users</div>
                      <div>
                        {user.role === 'Admin' ? (
                          <span className="inline-flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            No
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm">Create Tasks</div>
                      <div>
                        {(user.role === 'Admin' || user.role === 'Manager' || user.role === 'Developer') ? (
                          <span className="inline-flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            No
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm">View Reports</div>
                      <div>
                        {(user.role === 'Admin' || user.role === 'Manager') ? (
                          <span className="inline-flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            No
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm">Edit Organization Settings</div>
                      <div>
                        {user.role === 'Admin' ? (
                          <span className="inline-flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            No
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;

