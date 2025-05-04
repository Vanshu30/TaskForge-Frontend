import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createTask } from '@/service/taskService'; // ✅ your backend function
import React, { useEffect, useState } from 'react';

interface Project {
  id: string;
  name: string;
}

interface CreateTaskFormProps {
  onTaskCreated?: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId) {
      alert('Please fill in all required fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a task.');
      return;
    }

    try {
      await createTask(
        projectId, 
        { 
          title, 
          description, 
          priority, 
          dueDate: dueDate || undefined,
          assignee: assigneeName || undefined
        }, 
        token
      );

      toast({
        title: 'Task Created!',
        description: `The task "${title}" was created successfully.`,
      });

      if (onTaskCreated) {
        onTaskCreated();
      }

      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setProjectId('');
      setAssigneeName('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[150px]">
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="flex-1 min-w-[150px]" />
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[150px]">
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input placeholder="Assignee Name (optional)" value={assigneeName} onChange={(e) => setAssigneeName(e.target.value)} className="flex-1 min-w-[150px]" />
      </div>

      <Button type="submit" className="w-full">
        Create Task
      </Button>
    </form>
  );
};

export default CreateTaskForm;
