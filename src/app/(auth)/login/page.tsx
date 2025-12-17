"use client";
import { signIn } from "@/apis/signin";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await signIn(username, password);
      console.log("Logged in:", data);

      // Store token in localStorage
      localStorage.setItem("token", data.access_token);

      // Redirect to home or movies page
      router.push("/movielist");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  };
  return (
    <>
      <main className="min-h-screen w-full bg-primary flex items-center justify-center relative overflow-hidden">
        <div className="z-10 w-full max-w-sm text-center">
          <h1 className="text-white text-3xl font-semibold mb-8">Sign in</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-error mb-2">{error}</p>}
            <input
              type="text"
              placeholder="Email"
              className="w-full rounded-md bg-input px-4 py-3 text-white placeholder-gray-300  focus:outline-none focus:ring-2 focus:ring-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md bg-input px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
              <input type="checkbox" id="remember" className="accent-accent" />
              <label htmlFor="remember">Remember me</label>
            </div>
            {/* <Link href="/moivelist"> */}
            <button
              type="submit"
              className="w-full bg-accent  transition-colors text-white font-semibold py-3 rounded-md"
            >
              Login
            </button>
            {/* </Link> */}
          </form>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[50px] md:h-[80px] lg:h-[100px]">
          <Image
            src="/Vectors.svg"
            alt="Bottom Wave"
            fill
            priority
            className="object-cover"
          />
        </div>
      </main>
    </>
  );
}
