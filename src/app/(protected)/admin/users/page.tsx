"use client";
import { useAdminUsers } from "./hook";

export default function AdminUsersPage() {
  const { users, form, loading, error, success, handleSubmit, updateForm } = useAdminUsers();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin: User Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => updateForm("name", e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => updateForm("email", e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => updateForm("password", e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Role</label>
          <select
            value={form.role}
            onChange={e => updateForm("role", e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="SUPERLEADER">SUPERLEADER</option>
            <option value="LEADER">LEADER</option>
            <option value="MEMBER">MEMBER</option>
            <option value="GUEST">GUEST</option>
          </select>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
      <h2 className="text-xl font-bold mb-2">All Users</h2>
      <ul className="divide-y">
        {users.map(u => (
          <li key={u.id} className="py-2 flex justify-between items-center">
            <span>{u.name} ({u.email}) - {u.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 