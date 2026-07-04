import { cn } from "@/lib/utils";

interface SkeletonVizProps {
  type: "chart" | "matrix" | "graph" | "table" | "list";
  className?: string;
}

export function SkeletonViz({ type, className }: SkeletonVizProps) {
  if (type === "chart") {
    return (
      <div
        className={cn(
          "absolute inset-0 opacity-20 pointer-events-none flex items-end justify-between px-6 pb-6 pt-16",
          className,
        )}
      >
        <div className="w-1/12 h-[20%] bg-outline"></div>
        <div className="w-1/12 h-[35%] bg-outline"></div>
        <div className="w-1/12 h-[30%] bg-outline"></div>
        <div className="w-1/12 h-[50%] bg-outline"></div>
        <div className="w-1/12 h-[45%] bg-outline"></div>
        <div className="w-1/12 h-[80%] bg-outline"></div>
        <div className="w-1/12 h-[75%] bg-outline"></div>
      </div>
    );
  }

  if (type === "matrix") {
    return (
      <div className={cn("grid grid-cols-4 gap-1 h-full opacity-30", className)}>
        <div className="bg-outline h-8 mb-2"></div>
        <div className="bg-outline h-8 mb-2"></div>
        <div className="bg-outline h-8 mb-2"></div>
        <div className="bg-outline h-8 mb-2"></div>
        <div className="bg-outline-variant h-6"></div>
        <div className="bg-outline-variant h-6"></div>
        <div className="bg-outline-variant h-6"></div>
        <div className="bg-outline-variant h-6"></div>
        <div className="bg-outline-variant h-6"></div>
        <div className="bg-outline-variant h-6"></div>
        <div className="bg-outline-variant h-6 opacity-0"></div>
        <div className="bg-outline-variant h-6"></div>
        <div className="bg-outline-variant h-6"></div>
        <div className="bg-outline-variant h-6 opacity-0"></div>
        <div className="bg-outline-variant h-6 opacity-0"></div>
        <div className="bg-outline-variant h-6"></div>
      </div>
    );
  }

  if (type === "graph") {
    return (
      <div
        className={cn("absolute inset-0 opacity-20 flex items-center justify-center", className)}
      >
        <div className="relative w-full h-full text-outline-variant">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="20%"
              y1="50%"
              x2="50%"
              y2="30%"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <line
              x1="20%"
              y1="50%"
              x2="50%"
              y2="70%"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <line
              x1="50%"
              y1="30%"
              x2="80%"
              y2="50%"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <line
              x1="50%"
              y1="70%"
              x2="80%"
              y2="50%"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          <div className="absolute top-[50%] left-[20%] w-6 h-6 -ml-3 -mt-3 bg-outline rounded-full"></div>
          <div className="absolute top-[30%] left-[50%] w-8 h-8 -ml-4 -mt-4 bg-outline-variant rounded-md"></div>
          <div className="absolute top-[70%] left-[50%] w-8 h-8 -ml-4 -mt-4 bg-outline-variant rounded-md"></div>
          <div className="absolute top-[50%] left-[80%] w-10 h-10 -ml-5 -mt-5 bg-outline rounded-full border-4 border-surface"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2 w-full opacity-30", className)}>
      <div className="h-4 w-full skeleton-shimmer"></div>
      <div className="h-4 w-3/4 skeleton-shimmer"></div>
      <div className="h-4 w-1/2 skeleton-shimmer"></div>
    </div>
  );
}
