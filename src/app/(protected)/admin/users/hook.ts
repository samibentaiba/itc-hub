import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export function useAdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if ((session?.user as any)?.role !== "ADMIN") {
      router.push("/users/profile");
      return;
    }
    fetchUsers();
  }, [session, status, router]);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const usersData = await res.json();
        setUsers(usersData);
      }
    } catch (err) {
      setError("Failed to fetch users");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess("User created!");
        setForm({ name: "", email: "", password: "", role: "MEMBER" });
        await fetchUsers();
      } else {
        setError("Failed to create user");
      }
    } catch (err) {
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  function updateForm(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return {
    users,
    form,
    loading,
    error,
    success,
    handleSubmit,
    updateForm,
  };
}
