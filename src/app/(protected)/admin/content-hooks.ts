// src/app/(protected)/admin/content-hooks.ts
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  Project,
  Vlog,
  ProjectFormData,
  VlogFormData,
  PendingProject,
  PendingVlog,
} from "./content-types";
import { projectFormSchema, vlogFormSchema } from "./content-types";

// ===== API HELPER =====
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "An unknown error occurred",
    }));
    throw new Error(errorData.error || "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

// ===== PROJECTS HOOK =====
export const useProjects = (initialProjects: Project[]) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSaveProject = async (data: ProjectFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit
      ? `/api/admin/projects/${data.id}`
      : "/api/admin/projects";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-project");

    try {
      // Transform tags from comma-separated string to array
      const projectData = {
        ...data,
        tags:
          typeof data.tags === "string"
            ? data.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : data.tags,
      };

      const savedProject = await apiRequest<Project>(url, {
        method,
        body: JSON.stringify(projectData),
      });

      if (isEdit) {
        setProjects((prev) =>
          prev.map((p) => (p.id === savedProject.id ? savedProject : p))
        );
      } else {
        setProjects((prev) => [savedProject, ...prev]);
      }

      toast({
        title: isEdit ? "Project Updated" : "Project Created",
        description: `"${savedProject.name}" has been saved successfully.`,
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error Saving Project";
      toast({
        title: "Error Saving Project",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setLoadingAction(`delete-${projectId}`);
    const originalProjects = projects;
    setProjects((prev) => prev.filter((p) => p.id !== projectId));

    try {
      await apiRequest<void>(`/api/admin/projects/${projectId}`, {
        method: "DELETE",
      });
      toast({
        title: "Project Deleted",
        description: "The project has been removed successfully.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error Deleting Project";
      toast({
        title: "Error Deleting Project",
        description: message,
        variant: "destructive",
      });
      setProjects(originalProjects);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateStatus = async (
    projectId: string,
    status: "draft" | "published" | "pending"
  ) => {
    setLoadingAction(`status-${projectId}`);

    try {
      const updatedProject = await apiRequest<Project>(
        `/api/admin/projects/${projectId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p))
      );

      toast({
        title: "Status Updated",
        description: `Project status changed to ${status}.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error Updating Status";
      toast({
        title: "Error Updating Status",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    projects,
    setProjects,
    loadingAction,
    handleSaveProject,
    handleDeleteProject,
    handleUpdateStatus,
  };
};

// ===== VLOGS HOOK =====
export const useVlogs = (initialVlogs: Vlog[]) => {
  const { toast } = useToast();
  const [vlogs, setVlogs] = useState<Vlog[]>(initialVlogs);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSaveVlog = async (data: VlogFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/vlogs/${data.id}` : "/api/admin/vlogs";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-vlog");

    try {
      const savedVlog = await apiRequest<Vlog>(url, {
        method,
        body: JSON.stringify(data),
      });

      if (isEdit) {
        setVlogs((prev) =>
          prev.map((v) => (v.id === savedVlog.id ? savedVlog : v))
        );
      } else {
        setVlogs((prev) => [savedVlog, ...prev]);
      }

      toast({
        title: isEdit ? "Vlog Updated" : "Vlog Created",
        description: `"${savedVlog.title}" has been saved successfully.`,
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error Saving Vlog";
      toast({
        title: "Error Saving Vlog",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteVlog = async (vlogId: string) => {
    setLoadingAction(`delete-${vlogId}`);
    const originalVlogs = vlogs;
    setVlogs((prev) => prev.filter((v) => v.id !== vlogId));

    try {
      await apiRequest<void>(`/api/admin/vlogs/${vlogId}`, {
        method: "DELETE",
      });
      toast({
        title: "Vlog Deleted",
        description: "The vlog has been removed successfully.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error Deleting Vlog";
      toast({
        title: "Error Deleting Vlog",
        description: message,
        variant: "destructive",
      });
      setVlogs(originalVlogs);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateStatus = async (
    vlogId: string,
    status: "draft" | "published" | "pending"
  ) => {
    setLoadingAction(`status-${vlogId}`);

    try {
      const updatedVlog = await apiRequest<Vlog>(
        `/api/admin/vlogs/${vlogId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      setVlogs((prev) => prev.map((v) => (v.id === vlogId ? updatedVlog : v)));

      toast({
        title: "Status Updated",
        description: `Vlog status changed to ${status}.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error Updating Status";
      toast({
        title: "Error Updating Status",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    vlogs,
    setVlogs,
    loadingAction,
    handleSaveVlog,
    handleDeleteVlog,
    handleUpdateStatus,
  };
};

// ===== CONTENT REQUESTS HOOK =====
export const useContentRequests = (
  initialPendingProjects: PendingProject[],
  initialPendingVlogs: PendingVlog[],
  onProjectApproved: (project: Project) => void,
  onVlogApproved: (vlog: Vlog) => void
) => {
  const { toast } = useToast();
  const [pendingProjects, setPendingProjects] =
    useState<PendingProject[]>(initialPendingProjects);
  const [pendingVlogs, setPendingVlogs] =
    useState<PendingVlog[]>(initialPendingVlogs);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleApproveProject = async (projectId: string) => {
    setLoadingAction(`approve-project-${projectId}`);

    try {
      const approvedProject = await apiRequest<Project>(
        `/api/admin/projects/${projectId}/approve`,
        { method: "POST" }
      );

      onProjectApproved(approvedProject);
      setPendingProjects((prev) => prev.filter((p) => p.id !== projectId));

      toast({
        title: "Project Approved",
        description: `"${approvedProject.name}" has been published.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error Approving Project";
      toast({
        title: "Error Approving Project",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectProject = async (projectId: string) => {
    setLoadingAction(`reject-project-${projectId}`);

    try {
      await apiRequest<void>(`/api/admin/projects/${projectId}/reject`, {
        method: "POST",
      });

      setPendingProjects((prev) => prev.filter((p) => p.id !== projectId));

      toast({
        title: "Project Rejected",
        description: "The project submission has been rejected.",
        variant: "destructive",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error Rejecting Project";
      toast({
        title: "Error Rejecting Project",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApproveVlog = async (vlogId: string) => {
    setLoadingAction(`approve-vlog-${vlogId}`);

    try {
      const approvedVlog = await apiRequest<Vlog>(
        `/api/admin/vlogs/${vlogId}/approve`,
        { method: "POST" }
      );

      onVlogApproved(approvedVlog);
      setPendingVlogs((prev) => prev.filter((v) => v.id !== vlogId));

      toast({
        title: "Vlog Approved",
        description: `"${approvedVlog.title}" has been published.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error Approving Vlog";
      toast({
        title: "Error Approving Vlog",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectVlog = async (vlogId: string) => {
    setLoadingAction(`reject-vlog-${vlogId}`);

    try {
      await apiRequest<void>(`/api/admin/vlogs/${vlogId}/reject`, {
        method: "POST",
      });

      setPendingVlogs((prev) => prev.filter((v) => v.id !== vlogId));

      toast({
        title: "Vlog Rejected",
        description: "The vlog submission has been rejected.",
        variant: "destructive",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error Rejecting Vlog";
      toast({
        title: "Error Rejecting Vlog",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    pendingProjects,
    pendingVlogs,
    loadingAction,
    handleApproveProject,
    handleRejectProject,
    handleApproveVlog,
    handleRejectVlog,
  };
};

// ===== FORM DIALOG HOOKS =====
export const useProjectFormDialog = ({
  isOpen,
  onSubmit,
  initialData,
}: {
  isOpen: boolean;
  onSubmit: (data: ProjectFormData & { id?: string }) => Promise<boolean>;
  initialData?: Project | null;
}) => {
  const isEditMode = !!initialData;
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
      projectLink: "",
      githubLink: "",
      demoLink: "",
      type: "SOFTWARE",
      tags: "",
      status: "published",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        form.reset({
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description,
          image: initialData.image || "",
          projectLink: initialData.projectLink || "",
          githubLink: initialData.githubLink || "",
          demoLink: initialData.demoLink || "",
          type: initialData.type,
          tags: initialData.tags ? initialData.tags.join(", ") : "",
          status: initialData.status || "published",
        });
      } else {
        form.reset({
          name: "",
          slug: "",
          description: "",
          image: "",
          projectLink: "",
          githubLink: "",
          demoLink: "",
          type: "SOFTWARE",
          tags: "",
          status: "published",
        });
      }
    }
  }, [isOpen, initialData, isEditMode, form]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    const success = await onSubmit({ ...data, id: initialData?.id });
    return success;
  };

  return { handleFormSubmit, isEditMode, form };
};

export const useVlogFormDialog = ({
  isOpen,
  onSubmit,
  initialData,
}: {
  isOpen: boolean;
  onSubmit: (data: VlogFormData & { id?: string }) => Promise<boolean>;
  initialData?: Vlog | null;
}) => {
  const isEditMode = !!initialData;
  const form = useForm<VlogFormData>({
    resolver: zodResolver(vlogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      image: "",
      status: "published",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        form.reset({
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description,
          image: initialData.image || "",
          status: initialData.status || "published",
        });
      } else {
        form.reset({
          title: "",
          slug: "",
          description: "",
          image: "",
          status: "published",
        });
      }
    }
  }, [isOpen, initialData, isEditMode, form]);

  const handleFormSubmit = async (data: VlogFormData) => {
    const success = await onSubmit({ ...data, id: initialData?.id });
    return success;
  };

  return { handleFormSubmit, isEditMode, form };
};
