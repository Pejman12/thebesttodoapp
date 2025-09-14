import Skeleton from "@/lib/components/ui/skeleton";

export default function TodosLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: loading component
        <Skeleton key={i} className="h-40" />
      ))}
    </div>
  );
}
