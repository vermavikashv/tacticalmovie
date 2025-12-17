/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getMovies } from "@/apis/movie";
import { useRequireAuth } from "@/lib/clientAuth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MovieList() {
  useRequireAuth();
  const router = useRouter();

  // State
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // items per page
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getMovies(pageNumber, limit); // pass page & limit
      setMovies(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setPage(res.meta?.page || 1);
    } catch (error) {
      console.error(error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch movies on mount or page change
  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  // Handle prev/next
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-primary flex items-center justify-center text-white">
        Loading...
      </main>
    );
  }

  // No movies
  if (movies.length === 0) {
    return (
      <main className="min-h-screen w-full bg-primary flex items-center justify-center relative overflow-hidden">
        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.clear();
            router.replace("/login");
          }}
          className="absolute top-4 right-6 md:top-6 md:right-20 flex items-center gap-2 text-sm hover:opacity-80 bg-card/30 px-3 py-2 rounded-md"
        >
          Logout <span>↪</span>
        </button>

        <div className="z-10 w-full max-w-sm text-center">
          <h1 className="text-white text-3xl font-semibold mb-8">
            Your movie list is empty
          </h1>
          <button
            onClick={() => router.push("/addmovie")}
            className="w-full bg-accent transition-colors text-white font-semibold py-3 rounded-md"
          >
            Add a new movie
          </button>
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
    );
  }

  return (
    <main className="min-h-screen bg-primary text-white relative pb-40">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-20 pt-10">
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
          My movies
          <Link href="/addmovie">
            <span className="text-xl">+</span>
          </Link>
        </h1>
        <button
          onClick={() => {
            localStorage.clear(); // Clear all stored data
            router.replace("/login"); // Redirect to login page
          }}
          className="flex items-center gap-2 text-sm hover:opacity-80"
        >
          Logout <span>↪</span>
        </button>
      </header>

      {/* Movies Grid */}
      <section className="px-6 md:px-20 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-card rounded-xl p-3 shadow-md hover:scale-[1.02] transition"
            >
              <Link href={`/editmovie/${movie.id}`}>
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                  <Image
                    src={
                      movie.image
                        ? `http://localhost:3001/uploads/${movie.image}`
                        : "/placeholder.jpg"
                    }
                    alt={movie.title || "Movie Poster"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-medium">{movie.title}</h3>
                  <p className="text-sm opacity-70">{movie.year}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination */}
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-14 flex-wrap">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          Prev
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded-md font-medium ${
              p === page
                ? "bg-accent text-black"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Bottom Wave */}
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
