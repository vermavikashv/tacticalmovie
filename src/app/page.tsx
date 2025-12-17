"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  // return redirect("/login");
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      router.replace("/movielist"); // logged in
    } else {
      router.replace("/login"); // not logged in
    }
  }, [router]);
}
