import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Link,
  List,
  ListItem,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  taskId?: string;
}

type TaskData = {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

type FileData = {
  id: string;
  name: string;
  url: string;
};

type Comment = {
  id: string;
  content: string;
};

type Subtask = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

export default function TaskDialog({ open, onClose, taskId }: TaskDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm<TaskData>();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  useEffect(() => {
    if (taskId) {
      setLoading(true);
      axios.get(`/api/tasks/${taskId}`).then(res => {
        const task = res.data;
        setValue("title", task.title);
        setValue("status", task.status);
        setLoading(false);
      });

      axios.get(`/api/tasks/${taskId}/files`).then(res => {
        setFiles(res.data.files);
      });

      axios.get(`/api/tasks/${taskId}/comments`).then(res => {
        setComments(res.data.comments);
      });

      axios.get(`/api/tasks/${taskId}/subtasks`).then(res => {
        setSubtasks(res.data.subtasks);
      });
    } else {
      reset();
      setFiles([]);
      setComments([]);
      setSubtasks([]);
    }
  }, [taskId, setValue, reset]);

  const onSubmit = async (data: TaskData) => {
    if (!taskId) return;
    setLoading(true);
    await axios.put(`/api/tasks/${taskId}`, data);
    setLoading(false);
    onClose();
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    const res = await axios.post(`/api/tasks/${taskId}/comments`, { content: newComment });
    setComments([...comments, res.data.comment]);
    setNewComment("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !taskId) return;
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => {
      formData.append("file", file);
    });

    setUploading(true);
    const res = await axios.post(`/api/tasks/${taskId}/files`, formData);
    setFiles(prev => [...prev, ...res.data.files]);
    setUploading(false);
  };

  const createSubtask = async () => {
    if (!newSubtaskTitle.trim() || !taskId) return;
    const res = await axios.post(`/api/tasks`, {
      title: newSubtaskTitle,
      status: "TODO",
      parentId: taskId,
    });
    setSubtasks([...subtasks, res.data.task]);
    setNewSubtaskTitle("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{taskId ? "Edit Task" : "New Task"}</DialogTitle>

      <DialogContent>
        {loading && <LinearProgress />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register("title", { required: true })}
          />

          <TextField
            select
            label="Status"
            fullWidth
            margin="normal"
            defaultValue="TODO"
            {...register("status", { required: true })}
          >
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </TextField>

          <div style={{ marginTop: "1rem" }}>
            <Typography variant="subtitle1">Attach Files</Typography>
            <input type="file" multiple onChange={handleFileUpload} />
            {uploading && <LinearProgress />}
          </div>

          {files.length > 0 && (
            <List>
              {files.map((file) => (
                <ListItem key={file.id}>
                  <Link href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </Link>
                  <Button
                    size="small"
                    onClick={async () => {
                      await axios.delete(`/api/files/${file.id}`);
                      setFiles(files.filter((f) => f.id !== file.id));
                    }}
                  >
                    Delete
                  </Button>
                </ListItem>
              ))}
            </List>
          )}

          <div style={{ marginTop: "2rem" }}>
            <Typography variant="h6">Comments</Typography>
            <List>
              {comments.map((c) => (
                <ListItem key={c.id}>{c.content}</ListItem>
              ))}
            </List>
            <TextField
              fullWidth
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && postComment()}
              margin="normal"
            />
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Typography variant="h6">Subtasks</Typography>
            <List>
              {subtasks.map((sub) => (
                <ListItem key={sub.id}>
                  {sub.title} ({sub.status})
                </ListItem>
              ))}
            </List>
            <TextField
              fullWidth
              placeholder="New subtask title"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createSubtask()}
              margin="normal"
            />
          </div>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
