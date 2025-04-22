
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  StarOff, 
  Check, 
  Calendar, 
  CalendarDays, 
  Layers, 
  Filter, 
  ListOrdered, 
  ArrowUp, 
  ArrowDown,
  Activity,
  ListX,
  Keyboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data until Supabase integration
const MOCK_ISSUES = [
  {
    id: '1',
    title: 'Fix navigation bug in mobile view',
    description: 'The navigation menu overlaps with content on mobile devices smaller than 375px wide.',
    priority: 'High',
    status: 'Open',
    labels: ['Bug', 'UI', 'Mobile'],
    assignee: 'Alex Johnson',
    createdAt: '2025-04-15T10:30:00Z',
    updatedAt: '2025-04-20T14:22:00Z',
    project: 'Website Redesign',
    projectId: '1',
    dueDate: '2025-04-28T23:59:59Z',
    progress: 25,
    comments: 4,
    isStarred: true
  },
  {
    id: '2',
    title: 'Implement dark mode toggle',
    description: 'Add ability for users to switch between light and dark themes across the application.',
    priority: 'Medium',
    status: 'In Progress',
    labels: ['Feature', 'UI', 'Accessibility'],
    assignee: 'Maria Garcia',
    createdAt: '2025-04-12T09:15:00Z',
    updatedAt: '2025-04-21T11:05:00Z',
    project: 'Website Redesign',
    projectId: '1',
    dueDate: '2025-05-05T23:59:59Z',
    progress: 60,
    comments: 7,
    isStarred: false
  },
  {
    id: '3',
    title: 'Add export to CSV functionality',
    description: 'Users need to be able to export their project data to CSV format for external reporting.',
    priority: 'Low',
    status: 'Open',
    labels: ['Feature', 'Data'],
    assignee: 'David Kim',
    createdAt: '2025-04-18T15:40:00Z',
    updatedAt: '2025-04-19T10:30:00Z',
    project: 'Website Redesign',
    projectId: '1',
    dueDate: '2025-05-15T23:59:59Z',
    progress: 0,
    comments: 2,
    isStarred: false
  },
  {
    id: '4',
    title: 'Update payment processing API',
    description: 'Integrate with the new payment processing API to support additional payment methods.',
    priority: 'High',
    status: 'Open',
    labels: ['API', 'Backend'],
    assignee: 'Sarah Wilson',
    createdAt: '2025-04-14T13:20:00Z',
    updatedAt: '2025-04-22T09:45:00Z',
    project: 'Mobile App Development',
    projectId: '2',
    dueDate: '2025-04-30T23:59:59Z',
    progress: 15,
    comments: 3,
    isStarred: true
  },
  {
    id: '5',
    title: 'Optimize image loading for performance',
    description: 'Implement lazy loading and image optimization to improve page load times.',
    priority: 'Medium',
    status: 'In Progress',
    labels: ['Performance', 'Frontend'],
    assignee: 'Alex Johnson',
    createdAt: '2025-04-10T11:05:00Z',
    updatedAt: '2025-04-21T16:30:00Z',
    project: 'Website Redesign',
    projectId: '1',
    dueDate: '2025-05-10T23:59:59Z',
    progress: 75,
    comments: 5,
    isStarred: false
  }
];

const Issues = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for filters and view options
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('expanded');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [groupBy, setGroupBy] = useState<string>('none');
  const [sortBy, setSortBy] = useState<string>('updated');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [issues, setIssues] = useState(MOCK_ISSUES);

  // If user is not logged in, redirect to login page
  if (!user) {
    navigate('/login');
    return null;
  }

  // Function to toggle star status
  const toggleStar = (issueId: string) => {
    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, isStarred: !issue.isStarred } 
        : issue
    ));
  };

  // Filter and sort issues
  const filteredIssues = issues
    .filter(issue => {
      // Filter by priority
      if (priorityFilter !== 'all' && issue.priority !== priorityFilter) {
        return false;
      }
      
      // Filter by time
      if (timeFilter === 'recent' && new Date(issue.updatedAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
        return false;
      }
      
      // Search query
      if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !issue.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected option
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  // Group issues if needed
  const groupIssues = () => {
    if (groupBy === 'none') {
      return { 'All Issues': filteredIssues };
    }
    
    const grouped: Record<string, typeof issues> = {};
    
    filteredIssues.forEach(issue => {
      let groupKey: string;
      
      switch (groupBy) {
        case 'priority':
          groupKey = issue.priority;
          break;
        case 'status':
          groupKey = issue.status;
          break;
        case 'dueDate':
          const dueDate = new Date(issue.dueDate);
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          if (dueDate < today) {
            groupKey = 'Overdue';
          } else if (
            dueDate.getDate() === today.getDate() &&
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getFullYear() === today.getFullYear()
          ) {
            groupKey = 'Today';
          } else if (
            dueDate.getDate() === tomorrow.getDate() &&
            dueDate.getMonth() === tomorrow.getMonth() &&
            dueDate.getFullYear() === tomorrow.getFullYear()
          ) {
            groupKey = 'Tomorrow';
          } else {
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
            groupKey = dueDate.toLocaleDateString('en-US', options);
          }
          break;
        case 'project':
          groupKey = issue.project;
          break;
        case 'label':
          // For simplicity, group by first label
          groupKey = issue.labels[0] || 'No Label';
          break;
        default:
          groupKey = 'All Issues';
      }
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      
      grouped[groupKey].push(issue);
    });
    
    return grouped;
  };

  const groupedIssues = groupIssues();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Render an issue card based on the view mode
  const renderIssueCard = (issue: typeof MOCK_ISSUES[0]) => {
    return (
      <Card key={issue.id} className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className={`p-4 ${viewMode === 'expanded' ? '' : 'py-3'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 text-muted-foreground hover:text-yellow-500"
                  onClick={() => toggleStar(issue.id)}
                >
                  {issue.isStarred ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
                  <span className="sr-only">{issue.isStarred ? 'Unstar' : 'Star'}</span>
                </Button>
                <h3 className="font-medium text-sm sm:text-base truncate">
                  {issue.title}
                </h3>
              </div>
              
              {viewMode === 'expanded' && (
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {issue.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant={issue.priority === 'High' ? 'destructive' : issue.priority === 'Medium' ? 'default' : 'outline'}>
                  {issue.priority}
                </Badge>
                
                {issue.labels.slice(0, 2).map((label, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className={`
                      ${label === 'Bug' ? 'border-red-200 bg-red-50 text-red-700' :
                        label === 'Feature' ? 'border-green-200 bg-green-50 text-green-700' :
                        label === 'UI' ? 'border-purple-200 bg-purple-50 text-purple-700' :
                        label === 'API' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                        label === 'Performance' ? 'border-orange-200 bg-orange-50 text-orange-700' :
                        'border-gray-200 bg-gray-50 text-gray-700'}
                    `}
                  >
                    {label}
                  </Badge>
                ))}
                
                {issue.labels.length > 2 && (
                  <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
                    +{issue.labels.length - 2}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end ml-4">
              <Badge variant={issue.status === 'Open' ? 'outline' : issue.status === 'In Progress' ? 'secondary' : 'default'}>
                {issue.status}
              </Badge>
              
              <div className="text-xs text-muted-foreground mt-2">
                Updated {new Date(issue.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {viewMode === 'expanded' && (
            <>
              <div className="mt-3 flex items-center">
                <div className="text-xs text-muted-foreground">Progress:</div>
                <Progress value={issue.progress} className="h-2 ml-2 flex-1" />
                <div className="text-xs font-medium ml-2">{issue.progress}%</div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground mr-1">Assignee:</span>
                  <span className="font-medium">{issue.assignee}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground mr-1">Due:</span>
                  <span className={`font-medium ${new Date(issue.dueDate) < new Date() ? 'text-red-600' : ''}`}>
                    {formatDate(issue.dueDate)}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className="flex-1 overflow-auto">
        <Header />
        
        <main className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Issues</h1>
            <p className="text-muted-foreground">Track and manage project issues</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-2/3">
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex flex-1 gap-2">
              <Button 
                variant={viewMode === 'compact' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('compact')}
                className="flex-1"
              >
                <ChevronUp className="mr-1 h-4 w-4" />
                <span>Compact</span>
              </Button>
              
              <Button 
                variant={viewMode === 'expanded' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('expanded')}
                className="flex-1"
              >
                <ChevronDown className="mr-1 h-4 w-4" />
                <span>Expanded</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Group By</label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Group by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Grouping</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="label">Label</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Frame</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Time frame..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="recent">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredIssues.length} issues
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard Shortcuts
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Navigation</div>
                <DropdownMenuItem className="flex justify-between">
                  <span>Next issue</span>
                  <span className="text-muted-foreground">J</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between">
                  <span>Previous issue</span>
                  <span className="text-muted-foreground">K</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between">
                  <span>Open issue</span>
                  <span className="text-muted-foreground">O</span>
                </DropdownMenuItem>
                <Separator className="my-1" />
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Actions</div>
                <DropdownMenuItem className="flex justify-between">
                  <span>Star/Unstar</span>
                  <span className="text-muted-foreground">S</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between">
                  <span>Change view</span>
                  <span className="text-muted-foreground">V</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="space-y-8">
            {Object.entries(groupedIssues).map(([group, groupIssues]) => (
              <div key={group}>
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-semibold">{group}</h2>
                  <Badge variant="outline" className="ml-3">{groupIssues.length}</Badge>
                </div>
                
                <div className="space-y-4">
                  {groupIssues.map(issue => renderIssueCard(issue))}
                </div>
                
                {groupIssues.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="py-8">
                      <div className="text-center">
                        <ListX className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">No issues found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Try adjusting your filters to find what you're looking for.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Issues;
