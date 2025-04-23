
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Mail, Phone, Calendar } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: 'active' | 'away' | 'busy' | 'offline';
  avatar?: string | null;
}

interface TeamTabProps {
  projectId: string;
  teamMembers: TeamMember[];
  onAddMember: (member: TeamMember) => void;
}

const TeamTab: React.FC<TeamTabProps> = ({ projectId, teamMembers, onAddMember }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <AddTeamMemberDialog onAddMember={onAddMember} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map(member => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const statusColors = {
    active: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-gray-400"
  };
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-5 flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-14 w-14">
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} />
            ) : (
              <AvatarFallback>
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
          {member.status && (
            <span 
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${statusColors[member.status]} ring-2 ring-white`}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{member.name}</h3>
          <p className="text-sm text-muted-foreground">{member.role || 'Team Member'}</p>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <Mail className="mr-1 h-3 w-3" />
            <span className="truncate">{member.email}</span>
          </div>
        </div>
      </div>
      <div className="bg-muted/40 p-3 flex justify-between items-center">
        <Badge
          variant={member.status === 'active' ? 'default' : 'outline'}
          className="text-xs capitalize"
        >
          {member.status || 'active'}
        </Badge>
        <Button variant="ghost" size="sm">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          Schedule
        </Button>
      </div>
    </div>
  );
};

const AddTeamMemberDialog: React.FC<{ onAddMember: (member: TeamMember) => void }> = ({ onAddMember }) => {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'Developer'
    },
  });

  const handleSubmit = (data: any) => {
    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'active',
      avatar: null,
    };
    
    onAddMember(newMember);
    setOpen(false);
    form.reset();
    
    toast({
      title: "Team member added",
      description: `${data.name} has been added to the project team.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...form.register('name', { required: true })}
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email', { required: true })}
              placeholder="john@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              onValueChange={(value) => form.setValue('role', value)} 
              defaultValue="Developer"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="QA">QA</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamTab;
