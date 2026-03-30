import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProjectFormModal({ open, onClose }: ProjectFormModalProps) {
  const { addProject } = useAppContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      await addProject({ name, description });
      toast.success("Project created successfully");
      setName("");
      setDescription("");
      onClose();
    } catch {
      toast.error("Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="pname">Project Name *</Label>
            <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Website Redesign" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="pdesc">Description</Label>
            <Textarea id="pdesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this project about?" rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Create Project</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
