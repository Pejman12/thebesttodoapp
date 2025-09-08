"use client";

import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-stone-800 text-white">
      <h1 className="text-xl font-bold">Todo App</h1>
      <UserButton />
    </nav>
  );
}
