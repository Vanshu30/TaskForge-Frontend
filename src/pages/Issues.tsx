
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Issues = () => {
  const navigate = useNavigate();

  // This would typically fetch only recent issues from your data source
  const recentIssues = []; // You would populate this with your recent issues data

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Issues</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Issue
        </Button>
      </div>

      {recentIssues.length > 0 ? (
        <div className="grid gap-4">
          {recentIssues.map((issue) => (
            // Render your issues here
            <div key={issue.id} className="p-4 border rounded-lg">
              {/* Issue content */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No recent issues found.</p>
        </div>
      )}
    </div>
  );
};

export default Issues;
