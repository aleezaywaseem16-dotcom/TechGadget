import { StarRating } from "./StarRating";
import type { Review } from "@/types";

interface ReviewListProps {
  reviews: (Review & { profile?: { full_name: string | null; avatar_url: string | null } | null })[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews.length) {
    return (
      <p className="text-muted-foreground text-sm py-8 text-center">
        No reviews yet. Be the first to review!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((r) => (
        <div key={r.id} className="border-b pb-6 last:border-0 last:pb-0">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
              {(r.profile?.full_name ?? "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-medium text-sm">{r.profile?.full_name ?? "Anonymous"}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
              <StarRating rating={r.rating} size="sm" className="mb-2" />
              {r.title && <p className="font-medium text-sm mb-1">{r.title}</p>}
              {r.comment && <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
