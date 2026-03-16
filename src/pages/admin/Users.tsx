import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  type User,
} from "../../lib/admin";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const [form, setForm] = useState<Partial<User>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      updateMutation.mutate(form as User);
    } else {
      createMutation.mutate(form as User);
    }
    setForm({});
  };

  const edit = (u: User) => setForm(u);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full"
        />
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={form.isAdmin || false}
            onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
          />
          <span className="ml-2">Admin</span>
        </label>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
          {form.id ? "Update" : "Create"}
        </button>
      </form>

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isAdmin ? "Yes" : "No"}</td>
              <td className="space-x-2">
                <button
                  onClick={() => edit(u)}
                  className="px-2 py-1 bg-yellow-400 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(u.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
