"use client";

import { useEffect, useState } from "react";
import { UserPlus, Trash2, Shield, ShieldCheck, Eye, Plus, Heart, Pencil, Save, X } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "volunteer";
  created_at: string;
}

const roleLabels = {
  super_admin: { label: "Super Admin", icon: ShieldCheck, color: "bg-rose-100 text-rose-700" },
  admin: { label: "Admin", icon: Shield, color: "bg-garden-100 text-garden-700" },
  volunteer: { label: "Volunteer", icon: Eye, color: "bg-earth-100 text-earth-600" },
};

export default function SettingsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "volunteer">("volunteer");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [orgs, setOrgs] = useState<{ id: string; name: string; logo_url: string | null; active: boolean }[]>([]);
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgLogo, setNewOrgLogo] = useState("");
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [editOrgName, setEditOrgName] = useState("");
  const [editOrgLogo, setEditOrgLogo] = useState("");

  const loadOrgs = () => {
    fetch("/api/admin/organizations")
      .then((r) => r.json())
      .then((data) => setOrgs(data.organizations || []));
  };

  const loadUsers = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.users) {
          setUsers(data.users);
          setCurrentRole(data.currentRole);
        }
        setLoading(false);
      });
  };

  useEffect(() => { loadUsers(); loadOrgs(); }, []);

  const isSuperAdmin = currentRole === "super_admin";
  const isAdmin = currentRole === "admin" || isSuperAdmin;

  const handleAdd = async () => {
    if (!newEmail.trim()) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, name: newName, role: newRole }),
    });
    const data = await res.json();

    if (data.success) {
      setSuccess(`Added ${newEmail} as ${newRole}. Temporary password: ${data.tempPassword} — share this with them to log in.`);
      setNewEmail("");
      setNewName("");
      setShowAdd(false);
      loadUsers();
    } else {
      setError(data.error || "Failed to add user");
    }
    setSaving(false);
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, role }),
    });
    const data = await res.json();
    if (data.success) {
      loadUsers();
    } else {
      setError(data.error || "Failed to update role");
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Remove ${email} from admin access?`)) return;

    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    });
    const data = await res.json();
    if (data.success) {
      loadUsers();
    } else {
      setError(data.error || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Settings</h1>
        <p className="text-earth-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Settings</h1>

      {/* Role info */}
      <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-earth-900 mb-3">Role Permissions</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <strong>Super Admin:</strong>
            <span className="text-earth-500">Full access. Add/remove users, delete anything.</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-garden-600" />
            <strong>Admin:</strong>
            <span className="text-earth-500">Manage orders, products, add users. Cannot delete.</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-earth-500" />
            <strong>Volunteer:</strong>
            <span className="text-earth-500">View only. Can fulfill orders via QR scan.</span>
          </div>
        </div>
      </div>

      {/* Users list */}
      <div className="bg-white rounded-xl border border-earth-100 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-earth-100">
          <h2 className="font-semibold text-earth-900">Admin Users</h2>
          {isAdmin && (
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="inline-flex items-center gap-1.5 bg-garden-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-garden-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          )}
        </div>

        {/* Add user form */}
        {showAdd && (
          <div className="px-5 py-4 bg-garden-50 border-b border-earth-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="email"
                placeholder="Email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="px-3 py-2 rounded-lg border border-earth-200 text-sm"
              />
              <input
                type="text"
                placeholder="Name (optional)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="px-3 py-2 rounded-lg border border-earth-200 text-sm"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as "admin" | "volunteer")}
                className="px-3 py-2 rounded-lg border border-earth-200 text-sm"
              >
                <option value="volunteer">Volunteer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={saving || !newEmail.trim()}
                className="bg-garden-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-garden-700 disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add"}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="bg-earth-100 text-earth-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-earth-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="px-5 py-3 bg-rose-50 border-b border-rose-200 text-rose-700 text-sm">
            {error}
            <button onClick={() => setError("")} className="ml-2 underline">dismiss</button>
          </div>
        )}

        {success && (
          <div className="px-5 py-3 bg-garden-50 border-b border-garden-200 text-garden-700 text-sm">
            {success}
            <button onClick={() => setSuccess("")} className="ml-2 underline">dismiss</button>
          </div>
        )}

        <table className="w-full text-sm">
          <thead className="bg-earth-50 border-b border-earth-100">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-earth-600">Name</th>
              <th className="text-left px-5 py-3 font-medium text-earth-600">Email</th>
              <th className="text-left px-5 py-3 font-medium text-earth-600">Role</th>
              {isSuperAdmin && (
                <th className="text-left px-5 py-3 font-medium text-earth-600">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const roleInfo = roleLabels[user.role];
              return (
                <tr key={user.id} className="border-b border-earth-50 hover:bg-earth-50/50">
                  <td className="px-5 py-3 font-medium">{user.name || "—"}</td>
                  <td className="px-5 py-3 text-earth-500">{user.email}</td>
                  <td className="px-5 py-3">
                    {isSuperAdmin && user.role !== "super_admin" ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="px-2 py-1 rounded border border-earth-200 text-xs"
                      >
                        <option value="volunteer">Volunteer</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                        {roleInfo.label}
                      </span>
                    )}
                  </td>
                  {isSuperAdmin && (
                    <td className="px-5 py-3">
                      {user.role !== "super_admin" && (
                        <button
                          onClick={() => handleDelete(user.id, user.email)}
                          className="text-earth-400 hover:text-rose-600 transition-colors"
                          title="Remove user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Supporting Organizations */}
      <div className="bg-white rounded-xl border border-earth-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-earth-100">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h2 className="font-semibold text-earth-900">Supporting Organizations</h2>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddOrg(!showAddOrg)}
              className="inline-flex items-center gap-1.5 bg-garden-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-garden-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Organization
            </button>
          )}
        </div>

        {showAddOrg && (
          <div className="px-5 py-4 bg-garden-50 border-b border-earth-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Organization name"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                className="px-3 py-2 rounded-lg border border-earth-200 text-sm"
              />
              <input
                type="url"
                placeholder="Logo URL (optional)"
                value={newOrgLogo}
                onChange={(e) => setNewOrgLogo(e.target.value)}
                className="px-3 py-2 rounded-lg border border-earth-200 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (!newOrgName.trim()) return;
                  await fetch("/api/admin/organizations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newOrgName, logo_url: newOrgLogo || null }),
                  });
                  setNewOrgName("");
                  setNewOrgLogo("");
                  setShowAddOrg(false);
                  loadOrgs();
                }}
                disabled={!newOrgName.trim()}
                className="bg-garden-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-garden-700 disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddOrg(false)}
                className="bg-earth-100 text-earth-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-earth-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="p-4 space-y-3">
          {orgs.map((org) => (
            <div key={org.id} className="border border-earth-200 rounded-xl p-4">
              {editingOrgId === org.id ? (
                /* Edit mode */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-earth-500 mb-1">Name</label>
                      <input
                        type="text"
                        value={editOrgName}
                        onChange={(e) => setEditOrgName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-earth-500 mb-1">Logo URL</label>
                      <input
                        type="url"
                        value={editOrgLogo}
                        onChange={(e) => setEditOrgLogo(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm"
                      />
                    </div>
                  </div>
                  {editOrgLogo && (
                    <img src={editOrgLogo} alt="Preview" className="w-16 h-16 object-contain border border-earth-200 rounded-lg" />
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await fetch("/api/admin/organizations", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: org.id, name: editOrgName, logo_url: editOrgLogo || null }),
                        });
                        setEditingOrgId(null);
                        loadOrgs();
                      }}
                      className="inline-flex items-center gap-1 bg-garden-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-garden-700"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={() => setEditingOrgId(null)}
                      className="inline-flex items-center gap-1 bg-earth-100 text-earth-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-earth-200"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {org.logo_url ? (
                      <img src={org.logo_url} alt={org.name} className="w-10 h-10 object-contain rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-earth-100 rounded flex items-center justify-center text-earth-400 text-xs">No logo</div>
                    )}
                    <div>
                      <span className="font-medium text-earth-900">{org.name}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        org.active ? "bg-garden-100 text-garden-700" : "bg-earth-100 text-earth-500"
                      }`}>
                        {org.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setEditingOrgId(org.id);
                          setEditOrgName(org.name);
                          setEditOrgLogo(org.logo_url || "");
                        }}
                        className="text-earth-400 hover:text-garden-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {isSuperAdmin && (
                      <button
                        onClick={async () => {
                          if (!confirm(`Deactivate ${org.name}? Historical order data will be preserved.`)) return;
                          await fetch("/api/admin/organizations", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: org.id }),
                          });
                          loadOrgs();
                        }}
                        className="text-earth-400 hover:text-rose-600 transition-colors"
                        title="Deactivate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
