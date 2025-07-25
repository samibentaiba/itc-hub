import React, { useEffect, useState, useRef } from "react";
import { FilePreview } from "./file-preview";
import { getUsers, updateUser } from "@/services/userService";

interface UserProfileProps {
  userId: string;
  isEditable?: boolean;
}

export function UserProfile({ userId, isEditable }: UserProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState({ realName: "", bio: "", profilePic: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const users = await getUsers();
        const user = users.find((u: any) => u.id === userId);
        if (!user) throw new Error("User not found");
        setUser(user);
        setEditData({
          realName: user.profile?.realName || "",
          bio: user.profile?.bio || "",
          profilePic: "",
        });
      } catch (e) {
        setError("Could not load user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditData((prev) => ({ ...prev, profilePic: (reader.result as string).split(",")[1] }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      await updateUser(userId, editData);
      setSuccess("Profile updated!");
      setEditData((prev) => ({ ...prev, profilePic: "" }));
    } catch (e) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return null;

  const profilePicUrl = user.profile?.profilePic
    ? `data:image/*;base64,${Buffer.from(user.profile.profilePic.data).toString("base64")}`
    : undefined;

  return (
    <div className="max-w-md mx-auto p-4 border rounded">
      <div className="flex items-center gap-4 mb-4">
        {profilePicUrl ? (
          <img src={profilePicUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
            {user.name[0]}
          </div>
        )}
        <div>
          <div className="font-bold text-lg">{user.profile?.realName || user.name}</div>
          <div className="text-gray-500">{user.email}</div>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Bio:</div>
        {isEditable ? (
          <textarea
            name="bio"
            value={editData.bio}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        ) : (
          <div>{user.profile?.bio}</div>
        )}
      </div>
      <div className="mb-4">
        <div className="font-semibold">Achievements:</div>
        <ul className="list-disc ml-6">
          {user.profile?.achievements?.map((a: any) => (
            <li key={a.id}>
              {a.badge && <span className="mr-2">{a.badge}</span>}
              <span>{a.title}</span>
              {a.description && <span className="ml-1 text-gray-500">({a.description})</span>}
            </li>
          ))}
        </ul>
      </div>
      {isEditable && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Profile Picture:</label>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
        </div>
      )}
      {isEditable && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Real Name:</label>
          <input
            type="text"
            name="realName"
            value={editData.realName}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
      )}
      {isEditable && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      )}
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
} 