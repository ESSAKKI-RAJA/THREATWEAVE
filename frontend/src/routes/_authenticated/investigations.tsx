import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getInvestigations } from "@/api/investigations.api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInvestigation } from "@/api/investigations.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, User } from "lucide-react";

export const Route = createFileRoute("/_authenticated/investigations")({
  component: InvestigationsDashboard,
});

function InvestigationsDashboard() {
  const fetchInvestigations = useServerFn(getInvestigations);
  const createFn = useServerFn(createInvestigation);
  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["investigations"],
    queryFn: () => fetchInvestigations(),
  });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [assignee, setAssignee] = React.useState("");
  const [priority, setPriority] = React.useState("Medium");

  const createMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      assignee: string;
      priority: string;
      status: string;
    }) => {
      return createFn({ data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investigations"] });
      toast.success("New investigation case created.");
      setIsModalOpen(false);
      setTitle("");
      setAssignee("");
      setPriority("Medium");
    },
    onError: (err) => toast.error("Error creating investigation: " + String(err)),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !assignee) return toast.error("Please fill all required fields");
    createMutation.mutate({ title, assignee, priority, status: "Open" });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Active Investigations
          </h1>
          <p className="text-slate-400 mt-1">
            Card-based case management UI for collaborative forensic analysis.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Case
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c) => (
          <div
            key={c.id}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="p-5 border-b border-slate-800 flex-1">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">
                  {c.id}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    c.priority === "Critical"
                      ? "bg-red-900/30 text-red-400"
                      : c.priority === "High"
                        ? "bg-orange-900/30 text-orange-400"
                        : "bg-yellow-900/30 text-yellow-400"
                  }`}
                >
                  {c.priority}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">{c.title}</h3>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                {c.assignee}
              </p>
            </div>
            <div className="p-4 bg-slate-950/50 flex justify-between items-center text-sm">
              <span className="text-slate-500">{c.date}</span>
              <span
                className={`flex items-center gap-1.5 font-medium ${
                  c.status === "In Progress"
                    ? "text-teal-400"
                    : c.status === "Closed"
                      ? "text-slate-500"
                      : "text-blue-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    c.status === "In Progress"
                      ? "bg-teal-400"
                      : c.status === "Closed"
                        ? "bg-slate-500"
                        : "bg-blue-400"
                  }`}
                ></span>
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Create New Investigation Case</DialogTitle>
            <DialogDescription className="text-slate-400">
              Enter details for the new forensic investigation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Case Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-slate-950 border-slate-800 text-white"
                placeholder="e.g. Compromised S3 Bucket"
              />
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                required
                className="bg-slate-950 border-slate-800 text-white"
                placeholder="e.g. jdoe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-950 text-white border-slate-800 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 text-white hover:bg-teal-500"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Case"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
