"use client";

import { useRequireAuth } from "@/lib/clientAuth";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMovieById, updateMovie, Movie } from "@/apis/movie";

export default function Editmovie() {
  useRequireAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch movie by ID
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (id) {
          const movie: Movie = await getMovieById(id);
          setTitle(movie.title || "");
          setYear(movie.year?.toString() || "");
          setPreview(
            movie.image ? `http://localhost:3001/uploads/${movie.image}` : null
          );
        }
      } catch (error) {
        alert("Failed to fetch movie");
      }
    };
    fetchMovie();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return alert("Only images allowed");
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB image");

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !year.trim()) return setError("Fill all fields");

    try {
      setLoading(true);
      await updateMovie(id, {
        title,
        year: Number(year),
        image: image || undefined,
      });
      router.push("/movielist");
    } catch (error) {
      alert("Failed to update movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary text-white relative pb-40">
      <h1 className="text-3xl md:text-4xl font-semibold px-6 md:px-20 pt-12">
        Edit Movie
      </h1>

      <section className="px-6 md:px-20 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Box */}
          <div className="relative border-2 border-dashed border-white/40 rounded-xl aspect-[3/4] flex flex-col items-center justify-center text-center bg-card/40">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <p className="text-sm opacity-80">Drop an image here</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
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
                {loading ? "Updating..." : "Update"}
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
