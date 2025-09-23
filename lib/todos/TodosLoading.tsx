import Skeleton from "@/lib/components/ui/skeleton";

export default function TodosLoading() {
  return (
    <>
      {Array.from({length: 4}).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: loading component
        <Skeleton key={i} className="h-40 rounded-md"/>
      ))}
    </>
  );
}
