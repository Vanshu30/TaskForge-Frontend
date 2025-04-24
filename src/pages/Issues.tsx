
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Menu,
  Filter,
  Search,
  Pin,
  Star,
  ChevronDown,
  ArrowUpDown,
  List,
  LayoutGrid
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for issues
const mockIssues = [
  { 
    id: 'ISS-001', 
    title: 'Dashboard UI Improvements', 
    description: 'Implement the new dashboard layout with responsive design',
    priority: 'high', 
    labels: ['UI', 'Frontend'],
    assignee: 'John Doe',
    dueDate: '2025-05-10',
    progress: 75,
    isPinned: true,
  },
  { 
    id: 'ISS-002', 
    title: 'API Authentication Bug', 
    description: 'Fix token refresh mechanism for API requests',
    priority: 'high', 
    labels: ['Backend', 'Security'],
    assignee: 'Emily Wong',
    dueDate: '2025-04-30',
    progress: 50,
    isPinned: false,
  },
  { 
    id: 'ISS-003', 
    title: 'Task Filtering Feature', 
    description: 'Add multi-select filters for tasks in project view',
    priority: 'medium', 
    labels: ['Feature', 'Frontend'],
    assignee: 'Alex Smith',
    dueDate: '2025-05-15',
    progress: 25,
    isPinned: false,
  },
  { 
    id: 'ISS-004', 
    title: 'Documentation Update', 
    description: 'Update API documentation with new endpoints',
    priority: 'low', 
    labels: ['Docs'],
    assignee: 'Jane Cooper',
    dueDate: '2025-05-20',
    progress: 10,
    isPinned: false,
  },
  { 
    id: 'ISS-005', 
    title: 'Performance Optimization', 
    description: 'Optimize database queries for user dashboard',
    priority: 'medium', 
    labels: ['Backend', 'Performance'],
    assignee: 'Sam Green',
    dueDate: '2025-05-12',
    progress: 0,
    isPinned: true,
  },
];

const Issues = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('priority');
  const [issues, setIssues] = useState(mockIssues);

  // Set pinned status for an issue
  const togglePinned = (issueId: string) => {
    setIssues(issues.map(issue => 
      issue.id === issueId ? {...issue, isPinned: !issue.isPinned} : issue
    ));
  };

  // Filter issues based on search and filters
  const filteredIssues = issues.filter(issue => {
    // Search filter
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !issue.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Priority filter
    if (selectedPriority !== 'all' && issue.priority !== selectedPriority) {
      return false;
    }
    
    // Label filter
    if (selectedLabel !== 'all' && !issue.labels.includes(selectedLabel)) {
      return false;
    }
    
    return true;
  });

  // Sort issues
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    // First sort by pinned status
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by the selected criterion
    switch(sortBy) {
      case 'priority':
        const priorityValues = { high: 3, medium: 2, low: 1 };
        return priorityValues[b.priority as keyof typeof priorityValues] - 
               priorityValues[a.priority as keyof typeof priorityValues];
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'progress':
        return b.progress - a.progress;
      default:
        return 0;
    }
  });

  // Function to get badge color based on priority
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500 hover:bg-red-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          isMobile={isMobile} 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'w-full' : ''}`}>
          {isMobile && !sidebarOpen && (
            <Button 
              variant="outline" 
              size="icon" 
              className="mb-4" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </Button>
          )}
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-jira-text">Issues</h1>
            <p className="text-gray-600">Manage and track issues across your projects.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search issues..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Labels</SelectItem>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="UI">UI</SelectItem>
                  <SelectItem value="Feature">Feature</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Docs">Docs</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-md bg-white">
                <Button 
                  variant={viewMode === 'compact' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('compact')}
                  className="rounded-r-none"
                >
                  <List size={18} />
                </Button>
                <Button 
                  variant={viewMode === 'expanded' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('expanded')}
                  className="rounded-l-none"
                >
                  <LayoutGrid size={18} />
                </Button>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className={`grid gap-4 ${viewMode === 'compact' ? '' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {sortedIssues.map(issue => (
              <Card 
                key={issue.id} 
                className={`${viewMode === 'compact' ? 'p-0' : ''} hover:shadow-md transition-shadow cursor-pointer`}
              >
                {viewMode === 'compact' ? (
                  <div className="flex items-center p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                        <span className="text-sm font-medium text-gray-500">{issue.id}</span>
                        {issue.isPinned && <Pin size={14} className="text-primary" fill="currentColor" />}
                      </div>
                      <h3 className="font-medium">{issue.title}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        Due: {new Date(issue.dueDate).toLocaleDateString()}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinned(issue.id);
                        }}
                      >
                        {issue.isPinned ? <Pin size={16} fill="currentColor" /> : <Pin size={16} />}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                            <span className="text-sm font-medium text-gray-500">{issue.id}</span>
                          </div>
                          <CardTitle className="text-lg">{issue.title}</CardTitle>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinned(issue.id);
                          }}
                        >
                          {issue.isPinned ? <Pin size={16} fill="currentColor" /> : <Pin size={16} />}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{issue.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {issue.labels.map(label => (
                          <Badge key={label} variant="outline" className="bg-gray-100">
                            {label}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div>Assignee: {issue.assignee}</div>
                        <div className="text-gray-500">
                          Due: {new Date(issue.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{issue.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{width: `${issue.progress}%`}}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
            
            {filteredIssues.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No issues found matching your search criteria
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Issues;
