"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Star, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitReviewAction } from "@/actions/reviews";

interface ReviewFormProps {
  productId: string;
  productSlug: string;
  isLoggedIn: boolean;
}

export function ReviewForm({ productId, productSlug, isLoggedIn }: ReviewFormProps) {
  const [rating, setRating]       = useState(0);
  const [hovered, setHovered]     = useState(0);
  const [title, setTitle]         = useState("");
  const [comment, setComment]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-6 text-center">
        <p className="text-emerald-700 dark:text-emerald-400 font-medium">
          Thank you! Your review has been submitted.
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border bg-muted/40 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">Sign in to leave a review</p>
        <Button asChild size="sm">
          <Link href={`/signin?next=/product/${productSlug}`}>Sign In</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a star rating."); return; }
    if (comment.trim().length < 10) { toast.error("Review must be at least 10 characters."); return; }

    startTransition(async () => {
      const result = await submitReviewAction({ productId, productSlug, rating, title, comment });
      if (result.error) { toast.error(result.error); return; }
      toast.success(result.success);
      setSubmitted(true);
    });
  };

  const display = hovered || rating;

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="font-semibold text-base mb-5">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Star picker */}
        <div className="space-y-1.5">
          <Label>Your Rating <span className="text-destructive">*</span></Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-colors",
                    n <= display
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                  )}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="review-title">Title <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input
            id="review-title"
            placeholder="Summarize your experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            disabled={isPending}
          />
        </div>

        {/* Comment */}
        <div className="space-y-1.5">
          <Label htmlFor="review-comment">Review <span className="text-destructive">*</span></Label>
          <textarea
            id="review-comment"
            rows={4}
            required
            maxLength={1000}
            placeholder="Share your experience with this product… (min. 10 characters)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors disabled:opacity-60"
          />
          <p className="text-xs text-muted-foreground text-right">{comment.length}/1000</p>
        </div>

        <Button type="submit" disabled={isPending || rating === 0}>
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</>
          ) : (
            <><Send className="w-4 h-4" />Submit Review</>
          )}
        </Button>
      </form>
    </div>
  );
}
