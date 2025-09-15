import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/ui";

export default function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-6 w-full animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
