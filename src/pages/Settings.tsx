import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Keyboard, 
  Calendar, 
  Filter, 
  Check, 
  User,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const applyTheme = (theme: string) => {
  const root = document.documentElement;
  if (theme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", "system");
  } else {
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }
};

const Settings = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('blue');
  const [defaultLayout, setDefaultLayout] = useState('full-page');
  const [defaultSorting, setDefaultSorting] = useState('updated');
  const [weekStartDay, setWeekStartDay] = useState('monday');
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [bio, setBio] = useState('Product manager with 5+ years of experience in SaaS.');

  const keyboardShortcuts = [
    { action: 'Navigate to Dashboard', shortcut: 'g then d', enabled: true },
    { action: 'Navigate to Projects', shortcut: 'g then p', enabled: true },
    { action: 'Navigate to Issues', shortcut: 'g then i', enabled: true },
    { action: 'Create new issue', shortcut: 'c', enabled: true },
    { action: 'Save changes', shortcut: '⌘/Ctrl + s', enabled: true },
    { action: 'Search', shortcut: '/', enabled: true },
    { action: 'Close modal', shortcut: 'Esc', enabled: true },
  ];

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSaveSettings = () => {
    applyTheme(theme);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="flex items-center pl-4 pt-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="go back">
            <ArrowLeft />
          </Button>
          <h1 className="text-3xl font-bold ml-2">Settings</h1>
        </div>
        <Header />
        
        <main className="container mx-auto py-6 px-4">
          <p className="text-muted-foreground mb-6">Manage your account and application preferences</p>
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="keyboard">Keyboard Shortcuts</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>Customize the appearance of the application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Color Theme</Label>
                      <div className="flex space-x-4">
                        <div 
                          className={`cursor-pointer flex flex-col items-center p-3 rounded-md border ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                          onClick={() => setTheme('light')}
                        >
                          <Sun className="h-6 w-6 mb-1" />
                          <span className="text-sm">Light</span>
                        </div>
                        <div 
                          className={`cursor-pointer flex flex-col items-center p-3 rounded-md border ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                          onClick={() => setTheme('dark')}
                        >
                          <Moon className="h-6 w-6 mb-1" />
                          <span className="text-sm">Dark</span>
                        </div>
                        <div 
                          className={`cursor-pointer flex flex-col items-center p-3 rounded-md border ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                          onClick={() => setTheme('system')}
                        >
                          <SettingsIcon className="h-6 w-6 mb-1" />
                          <span className="text-sm">System</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {['blue', 'purple', 'green', 'orange', 'pink'].map(color => (
                          <div 
                            key={color}
                            className={`cursor-pointer h-8 rounded-md ${
                              color === 'blue' ? 'bg-blue-500' :
                              color === 'purple' ? 'bg-purple-500' :
                              color === 'green' ? 'bg-green-500' :
                              color === 'orange' ? 'bg-orange-500' :
                              'bg-pink-500'
                            } ${accentColor === color ? 'ring-2 ring-offset-2' : ''}`}
                            onClick={() => setAccentColor(color)}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility</CardTitle>
                    <CardDescription>Adjust settings for better accessibility</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="high-contrast">High Contrast Mode</Label>
                        <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                      </div>
                      <Switch 
                        id="high-contrast" 
                        checked={highContrastMode}
                        onCheckedChange={setHighContrastMode}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="large-text">Larger Text</Label>
                        <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                      </div>
                      <Switch 
                        id="large-text" 
                        checked={largeText}
                        onCheckedChange={setLargeText}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Issue View Settings</CardTitle>
                    <CardDescription>Configure how issues are displayed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Default Layout</Label>
                      <RadioGroup value={defaultLayout} onValueChange={setDefaultLayout}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="full-page" id="full-page" />
                          <Label htmlFor="full-page">Full-page view</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="side-panel" id="side-panel" />
                          <Label htmlFor="side-panel">Side panel view</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-fields">Default Fields</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="field-description" className="rounded border-gray-300" defaultChecked />
                          <Label htmlFor="field-description">Description</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="field-assignee" className="rounded border-gray-300" defaultChecked />
                          <Label htmlFor="field-assignee">Assignee</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="field-due-date" className="rounded border-gray-300" defaultChecked />
                          <Label htmlFor="field-due-date">Due Date</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="field-priority" className="rounded border-gray-300" defaultChecked />
                          <Label htmlFor="field-priority">Priority</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="field-progress" className="rounded border-gray-300" defaultChecked />
                          <Label htmlFor="field-progress">Progress</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Default Sorting and Filters</CardTitle>
                    <CardDescription>Set your preferred default options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="default-sorting">Default Sorting</Label>
                      <Select value={defaultSorting} onValueChange={setDefaultSorting}>
                        <SelectTrigger id="default-sorting">
                          <SelectValue placeholder="Select default sorting" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="updated">Last Updated</SelectItem>
                          <SelectItem value="created">Date Created</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                          <SelectItem value="due-date">Due Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="week-start">Week Starts On</Label>
                      <Select value={weekStartDay} onValueChange={setWeekStartDay}>
                        <SelectTrigger id="week-start">
                          <SelectValue placeholder="Select week start day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="saved-filters">Saved Filters</Label>
                        <p className="text-sm text-muted-foreground">Show saved filters on sidebar</p>
                      </div>
                      <Switch id="saved-filters" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="keyboard">
              <Card>
                <CardHeader>
                  <CardTitle>Keyboard Shortcuts</CardTitle>
                  <CardDescription>Customize keyboard shortcuts for faster navigation and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-shortcuts">Enable Keyboard Shortcuts</Label>
                      <Switch id="enable-shortcuts" defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      {keyboardShortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{shortcut.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {shortcut.shortcut}
                            </p>
                          </div>
                          <Switch checked={shortcut.enabled} />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <Button variant="outline">
                        <Keyboard className="mr-2 h-4 w-4" />
                        Customize Shortcuts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Email Notifications</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-assigned">When I'm assigned to an issue</Label>
                          <Switch id="notify-assigned" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-mentioned">When I'm mentioned in a comment</Label>
                          <Switch id="notify-mentioned" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-watching">When there's activity on issues I'm watching</Label>
                          <Switch id="notify-watching" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-due">When issues are due soon</Label>
                          <Switch id="notify-due" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">In-App Notifications</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-app-assigned">When I'm assigned to an issue</Label>
                          <Switch id="notify-app-assigned" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-app-mentioned">When I'm mentioned in a comment</Label>
                          <Switch id="notify-app-mentioned" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-app-watching">When there's activity on issues I'm watching</Label>
                          <Switch id="notify-app-watching" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-app-due">When issues are due soon</Label>
                          <Switch id="notify-app-due" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Notification Frequency</h3>
                      
                      <RadioGroup defaultValue="immediate">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="immediate" id="immediate" />
                          <Label htmlFor="immediate">Immediate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hourly" id="hourly" />
                          <Label htmlFor="hourly">Hourly digest</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="daily" id="daily" />
                          <Label htmlFor="daily">Daily digest</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Picture</CardTitle>
                      <CardDescription>Your avatar and banner</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                          <AvatarFallback className="text-2xl">
                            {user?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <label className="text-sm font-medium">Profile Banner</label>
                        <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md"></div>
                        
                        <div className="grid grid-cols-4 gap-2">
                          <div className="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md cursor-pointer"></div>
                          <div className="w-full h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-md cursor-pointer"></div>
                          <div className="w-full h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-md cursor-pointer"></div>
                          <div className="w-full h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-md cursor-pointer"></div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          Custom Banner
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your profile details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="display-name">Display Name</Label>
                        <Input 
                          id="display-name" 
                          value={displayName} 
                          onChange={(e) => setDisplayName(e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user?.email} readOnly disabled />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={user?.role} readOnly disabled />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)}
                          rows={4} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select defaultValue="utc-8">
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                            <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                            <SelectItem value="utc+0">UTC</SelectItem>
                            <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                            <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button onClick={handleProfileUpdate}>
                        <User className="mr-2 h-4 w-4" />
                        Update Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Button variant="outline" className="mr-2">Cancel</Button>
            <Button onClick={handleSaveSettings}>
              <Check className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
