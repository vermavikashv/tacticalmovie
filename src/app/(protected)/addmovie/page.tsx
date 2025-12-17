"use client";

import { createMovie } from "@/apis/movie";
import { useRequireAuth } from "@/lib/clientAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Addmovie() {
  useRequireAuth();
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Only images are allowed");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        alert("Image size must be less than 2MB");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !year.trim()) {
      setError("Please fill all fields");
    }

    try {
      setLoading(true);
      await createMovie({
        title,
        year: Number(year),
        image: image || undefined,
      });
      router.push("/movielist");
    } catch (error) {
      alert("Failed to add movie");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-primary text-white relative pb-40">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold px-6 md:px-20 pt-12">
        Create a new movie
      </h1>

      {/* Content */}
      <section className="px-6 md:px-20 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Box */}
          <div className=" relative border-2 border-dashed border-white/40 rounded-xl aspect-[3/4] flex flex-col items-center justify-center text-center bg-card/40">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <>
                <svg
                  className="w-6 h-6 mb-2 opacity-80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                </svg>
                <p className="text-sm opacity-80">Drop an image here</p>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Form */}
          <div className="max-w-md w-full space-y-6">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-input rounded-lg px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <input
              type="number"
              placeholder="Publishing year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-40 bg-input rounded-lg px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={() => router.back()}
                className="border border-white/60 px-6 py-3 rounded-lg hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-accent text-black px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                {loading ? "Adding..." : "Submit"}
              </button>
              {error && <p className="text-error mb-2">{error}</p>}
            </div>
          </div>
        </div>
      </section>

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
  );
}
