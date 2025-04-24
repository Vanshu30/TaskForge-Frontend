
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  createdAt: string;
}

const demoIssues: Issue[] = [
  {
    id: '1',
    title: 'Navigation menu not responsive on mobile',
    description: 'The navigation menu is not properly adapting to mobile screen sizes.',
    status: 'open',
    priority: 'high',
    assignee: 'John Doe',
    createdAt: '2025-04-23',
  },
  {
    id: '2',
    title: 'Login form validation not working',
    description: 'Form validation messages are not showing up when submitting invalid data.',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Jane Smith',
    createdAt: '2025-04-24',
  },
  {
    id: '3',
    title: 'Dashboard loading performance',
    description: 'Dashboard takes too long to load on initial render.',
    status: 'resolved',
    priority: 'low',
    assignee: 'Mike Johnson',
    createdAt: '2025-04-24',
  },
];

const Issues = () => {
  const [issues] = useState<Issue[]>(demoIssues);

  const getStatusBadge = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Open</Badge>;
      case 'in-progress':
        return <Badge variant="default"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Issues</h1>
          <p className="text-gray-600">Track and manage project issues</p>
        </div>
        <Button>New Issue</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{issue.title}</div>
                      <div className="text-sm text-gray-500">{issue.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(issue.status)}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getPriorityColor(issue.priority)}`}>
                      {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{issue.assignee}</TableCell>
                  <TableCell>{issue.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Issues;
