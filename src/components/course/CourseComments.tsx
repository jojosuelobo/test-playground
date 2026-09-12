"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/LanguageProvider";

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string };
};

export default function CourseComments({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const { dict } = useI18n();
  const t = dict.course.comments;
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/courses/${courseId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setComments(data.comments);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/courses/${courseId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? t.errorFallback);
        return;
      }

      setComments((prev) => [data.comment, ...(prev ?? [])]);
      setBody("");
    } catch {
      setError(dict.common.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="course-comments">
      {user ? (
        <form onSubmit={handleSubmit} data-testid="course-comment-form" className="mb-6">
          <textarea
            data-testid="course-comment-input"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            placeholder={t.placeholder}
            required
            className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          {error && (
            <p
              data-testid="course-comment-error-message"
              className="mb-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            testId="course-comment-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </form>
      ) : (
        <p data-testid="course-comments-login-prompt" className="mb-6 text-sm text-gray-500">
          {t.loginPrompt}
        </p>
      )}

      {comments === null && (
        <p data-testid="course-comments-loading" className="text-gray-500">
          {t.loading}
        </p>
      )}

      {comments !== null && comments.length === 0 && (
        <p data-testid="course-comments-empty-state" className="text-gray-500">
          {t.emptyState}
        </p>
      )}

      {comments && comments.length > 0 && (
        <ul data-testid="course-comments-list" className="space-y-3">
          {comments.map((comment) => (
            <li
              key={comment.id}
              data-testid={`course-comment-item-${comment.id}`}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <p
                data-testid={`course-comment-author-${comment.id}`}
                className="mb-1 text-sm font-semibold text-gray-900"
              >
                {comment.user.name}
              </p>
              <p
                data-testid={`course-comment-body-${comment.id}`}
                className="text-sm text-gray-700"
              >
                {comment.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
