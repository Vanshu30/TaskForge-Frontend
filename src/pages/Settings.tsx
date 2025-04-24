
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
  Check,
  ArrowLeft,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [defaultProject, setDefaultProject] = useState('');
  const [customKeyboardShortcuts, setCustomKeyboardShortcuts] = useState(true);
  const [inlineCommentStyle, setInlineCommentStyle] = useState('stacked');
  const [languageFormat, setLanguageFormat] = useState('en-US');

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
              <TabsTrigger value="issueView">Issue View</TabsTrigger>
              <TabsTrigger value="defaults">Defaults & Sorting</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              <TabsTrigger value="shortcutsAndFormat">Shortcuts & Format</TabsTrigger>
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
                          <Monitor className="h-6 w-6 mb-1" />
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
              </div>
            </TabsContent>
            
            <TabsContent value="issueView">
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

                    <div className="space-y-2">
                      <Label>Inline Comment View Style</Label>
                      <RadioGroup value={inlineCommentStyle} onValueChange={setInlineCommentStyle}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="stacked" id="stacked" />
                          <Label htmlFor="stacked">Stacked comments</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="side-by-side" id="side-by-side" />
                          <Label htmlFor="side-by-side">Side-by-side comments</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Issue Grouping</CardTitle>
                    <CardDescription>Configure how issues are grouped</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Group Issues By</Label>
                      <RadioGroup defaultValue="status">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="status" id="group-status" />
                          <Label htmlFor="group-status">Status</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="assignee" id="group-assignee" />
                          <Label htmlFor="group-assignee">Assignee</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="priority" id="group-priority" />
                          <Label htmlFor="group-priority">Priority</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="label" id="group-label" />
                          <Label htmlFor="group-label">Label</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="due-date" id="group-due-date" />
                          <Label htmlFor="group-due-date">Due Date</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-closed">Show Closed Issues</Label>
                        <p className="text-sm text-muted-foreground">Include resolved issues in views</p>
                      </div>
                      <Switch id="show-closed" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="filter-label">Filter by Label</Label>
                        <p className="text-sm text-muted-foreground">Use labels to filter issues</p>
                      </div>
                      <Switch id="filter-label" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="defaults">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <Card>
                  <CardHeader>
                    <CardTitle>Default Project</CardTitle>
                    <CardDescription>Set your default project on login</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="default-project">Default Project</Label>
                      <Select value={defaultProject} onValueChange={setDefaultProject}>
                        <SelectTrigger id="default-project">
                          <SelectValue placeholder="Select default project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None (Show Dashboard)</SelectItem>
                          <SelectItem value="project-1">Website Redesign</SelectItem>
                          <SelectItem value="project-2">Mobile App</SelectItem>
                          <SelectItem value="project-3">API Integration</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        This project will be shown when you first log in
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Default Issue Activity Filter</Label>
                      <RadioGroup defaultValue="all">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all-issues" />
                          <Label htmlFor="all-issues">All issues</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="last-updated" id="last-updated" />
                          <Label htmlFor="last-updated">Last updated</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="recently-commented" id="recently-commented" />
                          <Label htmlFor="recently-commented">Recently commented</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="last-7-days" id="last-7-days" />
                          <Label htmlFor="last-7-days">Opened in last 7 days</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="accessibility">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Text Scaling</Label>
                      <div className="flex items-center">
                        <span className="text-sm pr-2">Small</span>
                        <input 
                          type="range" 
                          min="80" 
                          max="150" 
                          step="10" 
                          defaultValue="100"
                          className="w-full"
                        />
                        <span className="text-sm pl-2">Large</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Focus & Motion</CardTitle>
                    <CardDescription>Settings for focus and motion preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="focus-outlines">Focus Outlines</Label>
                        <p className="text-sm text-muted-foreground">Show outlines around focused elements</p>
                      </div>
                      <Switch id="focus-outlines" defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reduce-motion">Reduce Motion</Label>
                        <p className="text-sm text-muted-foreground">Minimize animations throughout the interface</p>
                      </div>
                      <Switch id="reduce-motion" defaultChecked={false} />
                    </div>

                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="screen-reader">Screen Reader Optimization</Label>
                        <p className="text-sm text-muted-foreground">Optimize layout for screen readers</p>
                      </div>
                      <Switch id="screen-reader" defaultChecked={false} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="shortcutsAndFormat">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Keyboard Shortcuts</CardTitle>
                    <CardDescription>Configure keyboard shortcut settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-shortcuts">Enable Keyboard Shortcuts</Label>
                        <p className="text-sm text-muted-foreground">Use keyboard shortcuts to navigate</p>
                      </div>
                      <Switch 
                        id="enable-shortcuts" 
                        checked={customKeyboardShortcuts}
                        onCheckedChange={setCustomKeyboardShortcuts}
                      />
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Create new issue</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">c</code>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Search</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">s</code>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Go to dashboard</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">g d</code>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Go to issues</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">g i</code>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Go to settings</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">g s</code>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Toggle sidebar</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">\</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Language & Date Format</CardTitle>
                    <CardDescription>Set your preferred language and date formats</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="language-format">Language</Label>
                      <Select value={languageFormat} onValueChange={setLanguageFormat}>
                        <SelectTrigger id="language-format">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                          <SelectItem value="fr-FR">Français</SelectItem>
                          <SelectItem value="de-DE">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <RadioGroup defaultValue="mdy">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mdy" id="mdy" />
                          <Label htmlFor="mdy">MM/DD/YYYY (US)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dmy" id="dmy" />
                          <Label htmlFor="dmy">DD/MM/YYYY (UK, EU)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ymd" id="ymd" />
                          <Label htmlFor="ymd">YYYY-MM-DD (ISO)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Time Format</Label>
                      <RadioGroup defaultValue="12h">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="12h" id="12h" />
                          <Label htmlFor="12h">12-hour (AM/PM)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="24h" id="24h" />
                          <Label htmlFor="24h">24-hour</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
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
