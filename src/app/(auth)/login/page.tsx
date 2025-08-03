"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLogin } from "./hook";


export default function LoginPage() {
  const { password, email, handleSubmit, setEmail, setPassword, error, loading, session } = useLogin();
  const router = useRouter()
  if (status === "loading") return <div>Loading...</div>;
  if (session?.user?.email) {
    return (
      <div className="max-w-sm mx-auto py-16">
        <h1 className="text-2xl font-bold mb-6">Already Logged In</h1>
        <p className="mb-4">You are already logged in as <b>{session.user.email}</b>.</p>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => router.push("/users/profile")}
          >
            Continue to Dashboard
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Log in with another account
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="my-6 text-center text-gray-500">or</div>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </button>
    </div>
  );
} 