import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Project {
  id: string;
  name: string;
}

interface CreateTaskFormProps {
  onTaskCreated?: () => void; // optional callback to refresh tasks after creation
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId) {
      alert('Please fill in all required fields.');
      return;
    }

    const newTask = {
      id: uuidv4(),
      title,
      description,
      priority,
      dueDate,
      assignee: {
        name: assigneeName || 'Unassigned',
      },
      type: 'task', // default to 'task'
      comments: [],
      projectId,
    };

    const projectTasksRaw = localStorage.getItem(`tasks_${projectId}`);
    const projectTasks = projectTasksRaw ? JSON.parse(projectTasksRaw) : {};

    projectTasks[newTask.id] = newTask;
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(projectTasks));

    // Dispatch an event so the parent page can refresh
    const event = new CustomEvent('taskAdd', { detail: newTask });
    window.dispatchEvent(event);

    toast({
        title: 'Task Created!',
        description: `The task "${newTask.title}" was created successfully.`,
      });
      
    if (onTaskCreated) {
      onTaskCreated();
    }

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setProjectId('');
    setAssigneeName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

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

        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
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

        <Input
          placeholder="Assignee Name (optional)"
          value={assigneeName}
          onChange={(e) => setAssigneeName(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
      </div>

      <Button type="submit" className="w-full">
        Create Task
      </Button>
    </form>
  );
};

export default CreateTaskForm;


