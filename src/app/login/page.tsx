"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Flower2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="container py-16 max-w-sm">
      <div className="text-center mb-8">
        <Flower2 className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h1 className="font-display text-2xl font-bold text-earth-900">Admin Login</h1>
        <p className="text-earth-500 text-sm mt-1">Sign in to manage the flower sale</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-earth-200 focus:ring-2 focus:ring-garden-400 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-earth-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-earth-200 focus:ring-2 focus:ring-garden-400 focus:border-transparent text-sm"
          />
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-garden-600 hover:bg-garden-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
