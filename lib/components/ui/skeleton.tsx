import { cn } from "@/lib/utils/ui";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-6 w-full animate-pulse rounded bg-muted", className)}
    />
  );
}
