import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Skeleton loader for PDF list items
 * Matches the layout of NoteCard component
 */
export const PDFCardSkeleton = () => (
  <Card className="overflow-hidden animate-pulse">
    <CardContent className="p-5">
      <div className="flex items-start gap-4">
        {/* Icon placeholder */}
        <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />

        <div className="flex-1 min-w-0 space-y-3">
          {/* Badge and Price */}
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-6 w-12 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>

          {/* Title */}
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-5 w-1/2 rounded" />

          {/* Buttons */}
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Skeleton loader for PDF list (multiple items)
 */
export const PDFListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <PDFCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Skeleton loader for category cards (grid)
 */
export const CategoryCardSkeleton = () => (
  <Card className="overflow-hidden animate-pulse h-full">
    <CardContent className="p-6 space-y-4">
      {/* Icon */}
      <Skeleton className="h-16 w-16 rounded-lg" />

      {/* Title */}
      <Skeleton className="h-6 w-3/4 rounded" />

      {/* Description lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>

      {/* Footer with count and button */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Skeleton className="h-5 w-12 rounded" />
        <Skeleton className="h-9 w-20 rounded" />
      </div>
    </CardContent>
  </Card>
);

/**
 * Skeleton loader for category grid
 */
export const CategoryGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CategoryCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Skeleton loader for search results header
 */
export const SearchResultsHeaderSkeleton = () => (
  <div className="space-y-3 mb-6 animate-pulse">
    <Skeleton className="h-7 w-1/2 rounded" />
    <Skeleton className="h-5 w-3/4 rounded" />
  </div>
);

/**
 * Skeleton loader for page header
 */
export const PageHeaderSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex gap-4 items-start">
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-8 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>
      <Skeleton className="h-20 w-32 rounded" />
    </div>
  </div>
);
