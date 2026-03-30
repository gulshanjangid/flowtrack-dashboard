import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/utils/constants";
import type { Task } from "@/utils/constants";
import { toast } from "sonner";

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  editTask?: Task;
}

export default function TaskFormModal({ open, onClose, editTask }: TaskFormModalProps) {
  const { projects, users, addTask, updateTask } = useAppContext();
  const [title, setTitle] = useState(editTask?.title ?? "");
  const [description, setDescription] = useState(editTask?.description ?? "");
  const [status, setStatus] = useState(editTask?.status ?? "To Do");
  const [priority, setPriority] = useState(editTask?.priority ?? "Medium");
  const [assignedUser, setAssignedUser] = useState(editTask?.assignedUser ?? "");
  const [dueDate, setDueDate] = useState(editTask?.dueDate ?? "");
  const [projectId, setProjectId] = useState(editTask?.projectId ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!dueDate) e.dueDate = "Due date is required";
    if (!projectId) e.projectId = "Project is required";
    if (!assignedUser) e.assignedUser = "Assigned user is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const project = projects.find((p) => p.id === projectId);
    try {
      if (editTask) {
        await updateTask(editTask.id, { title, description, status: status as any, priority: priority as any, assignedUser, dueDate, projectId, projectName: project?.name || "" });
        toast.success("Task updated successfully");
      } else {
        await addTask({ title, description, status: status as any, priority: priority as any, assignedUser, dueDate, projectId, projectName: project?.name || "" });
        toast.success("Task created successfully");
      }
      onClose();
    } catch {
      toast.error("Failed to save task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editTask ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the task..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Project *</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.projectId && <p className="text-xs text-destructive mt-1">{errors.projectId}</p>}
            </div>
            <div>
              <Label>Assignee *</Label>
              <Select value={assignedUser} onValueChange={setAssignedUser}>
                <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.assignedUser && <p className="text-xs text-destructive mt-1">{errors.assignedUser}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="due">Due Date *</Label>
            <Input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            {errors.dueDate && <p className="text-xs text-destructive mt-1">{errors.dueDate}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>{editTask ? "Update" : "Create"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
