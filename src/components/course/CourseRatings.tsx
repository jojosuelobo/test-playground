"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useI18n } from "@/i18n/LanguageProvider";

type Rating = {
  id: string;
  score: number;
  user: { id: string; name: string };
};

type RatingsData = {
  ratings: Rating[];
  average: number;
  count: number;
  myRating: number | null;
  isEnrolled: boolean;
};

function Star({ filled }: { filled: boolean }) {
  return (
    <span className={filled ? "text-amber-500" : "text-gray-300"} aria-hidden="true">
      ★
    </span>
  );
}

export default function CourseRatings({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const { dict } = useI18n();
  const t = dict.course.ratings;
  const [data, setData] = useState<RatingsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/courses/${courseId}/ratings`)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setData(json);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const loadRatings = () => {
    fetch(`/api/courses/${courseId}/ratings`)
      .then((res) => res.json())
      .then((json) => setData(json));
  };

  const handleRate = async (score: number) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message ?? t.errorFallback);
        return;
      }
      loadRatings();
    } catch {
      setError(dict.common.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) {
    return (
      <p data-testid="course-ratings-loading" className="text-gray-500">
        {t.loading}
      </p>
    );
  }

  return (
    <div data-testid="course-ratings">
      <div data-testid="course-ratings-summary" className="mb-6 flex items-center gap-2">
        <span data-testid="course-ratings-average" className="text-2xl font-bold text-gray-900">
          {data.average.toFixed(1)}
        </span>
        <div className="flex text-lg">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} filled={star <= Math.round(data.average)} />
          ))}
        </div>
        <span data-testid="course-ratings-count" className="text-sm text-gray-500">
          ({data.count} {data.count === 1 ? t.ratingSingular : t.ratingPlural})
        </span>
      </div>

      {!user && (
        <p data-testid="course-ratings-login-prompt" className="mb-6 text-sm text-gray-500">
          {t.loginPrompt}
        </p>
      )}

      {user && !data.isEnrolled && (
        <p data-testid="course-ratings-enroll-prompt" className="mb-6 text-sm text-gray-500">
          {t.enrollPrompt}
        </p>
      )}

      {user && data.isEnrolled && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-gray-700">{t.yourRating}</p>
          <div data-testid="course-rating-widget" className="flex gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                data-testid={`course-rating-star-${star}`}
                aria-label={t.rateAria(star)}
                disabled={isSubmitting}
                onClick={() => handleRate(star)}
                className="disabled:opacity-60"
              >
                <Star filled={star <= (data.myRating ?? 0)} />
              </button>
            ))}
          </div>
          {error && (
            <p
              data-testid="course-rating-error-message"
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}
        </div>
      )}

      {data.ratings.length === 0 ? (
        <p data-testid="course-ratings-empty-state" className="text-gray-500">
          {t.emptyState}
        </p>
      ) : (
        <ul data-testid="course-ratings-list" className="space-y-2">
          {data.ratings.map((rating) => (
            <li
              key={rating.id}
              data-testid={`course-rating-item-${rating.id}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <span className="text-sm font-medium text-gray-900">
                {rating.user.name}
              </span>
              <div className="flex text-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} filled={star <= rating.score} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
