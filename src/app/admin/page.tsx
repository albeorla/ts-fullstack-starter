"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function AdminPage() {
  const { data: users, refetch } = api.user.getAll.useQuery();
  const { mutate: setUserRoles } = api.user.setUserRoles.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const [selectedRoles, setSelectedRoles] = useState<Record<string, string[]>>({});

  const handleRoleChange = (userId: string, roleName: string) => {
    setSelectedRoles((prev) => {
      const currentRoles = prev[userId] ?? [];
      const newRoles = currentRoles.includes(roleName)
        ? currentRoles.filter((r) => r !== roleName)
        : [...currentRoles, roleName];
      return { ...prev, [userId]: newRoles };
    });
  };

  const handleUpdateRoles = (userId: string) => {
    const roles = selectedRoles[userId];
    if (roles) {
      setUserRoles({ userId, roleNames: roles });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="mt-4">
        {users?.map((user) => (
          <div key={user.id} className="flex items-center justify-between border-b p-2">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                {["ADMIN", "USER"].map((role) => (
                  <label key={role} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selectedRoles[user.id]?.includes(role) ?? user.roles.some(r => r.role.name === role)}
                      onChange={() => handleRoleChange(user.id, role)}
                    />
                    {role}
                  </label>
                ))}
              </div>
              <button
                onClick={() => handleUpdateRoles(user.id)}
                className="rounded bg-blue-500 px-2 py-1 text-white"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}