"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getCourseVisual } from "@/lib/courseVisuals";
import { useI18n } from "@/i18n/LanguageProvider";

type Profile = {
  id: string;
  name: string;
  headline: string | null;
  bio: string | null;
  websiteUrl: string | null;
  facebookUsername: string | null;
  instagramUsername: string | null;
  linkedinUrl: string | null;
  tiktokUsername: string | null;
  xUsername: string | null;
  youtubeUsername: string | null;
};

type CompletedCourse = {
  id: string;
  title: string;
  language: string;
  completedAt: string;
};

type PublicProfileData = {
  profile: Profile;
  completedCourses: CompletedCourse[];
};

function withProtocol(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function buildLinks(profile: Profile) {
  const links: { label: string; href: string; testId: string }[] = [];

  if (profile.websiteUrl) {
    links.push({
      label: "Website",
      href: withProtocol(profile.websiteUrl),
      testId: "public-profile-link-website",
    });
  }
  if (profile.facebookUsername) {
    links.push({
      label: "Facebook",
      href: `https://facebook.com/${profile.facebookUsername.replace(/^@/, "")}`,
      testId: "public-profile-link-facebook",
    });
  }
  if (profile.instagramUsername) {
    links.push({
      label: "Instagram",
      href: `https://instagram.com/${profile.instagramUsername.replace(/^@/, "")}`,
      testId: "public-profile-link-instagram",
    });
  }
  if (profile.linkedinUrl) {
    links.push({
      label: "LinkedIn",
      href: withProtocol(profile.linkedinUrl),
      testId: "public-profile-link-linkedin",
    });
  }
  if (profile.tiktokUsername) {
    links.push({
      label: "TikTok",
      href: `https://tiktok.com/@${profile.tiktokUsername.replace(/^@/, "")}`,
      testId: "public-profile-link-tiktok",
    });
  }
  if (profile.xUsername) {
    links.push({
      label: "X",
      href: `https://x.com/${profile.xUsername.replace(/^@/, "")}`,
      testId: "public-profile-link-x",
    });
  }
  if (profile.youtubeUsername) {
    links.push({
      label: "YouTube",
      href: `https://youtube.com/@${profile.youtubeUsername.replace(/^@/, "")}`,
      testId: "public-profile-link-youtube",
    });
  }

  return links;
}

export default function PublicProfile({ userId }: { userId: string }) {
  const { dict } = useI18n();
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/users/${userId}/public`).then(async (res) => {
      if (cancelled) return;
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const json = await res.json();
      setData(json);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (notFound) {
    return (
      <p data-testid="public-profile-not-found" className="text-gray-500">
        {dict.profile.notFound}
      </p>
    );
  }

  if (!data) {
    return (
      <p data-testid="public-profile-loading" className="text-gray-500">
        {dict.common.loading}
      </p>
    );
  }

  const { profile, completedCourses } = data;
  const links = buildLinks(profile);

  return (
    <div data-testid="public-profile-page">
      <div className="mb-8 flex items-center gap-4">
        <span
          data-testid="public-profile-avatar"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-semibold text-white"
        >
          {profile.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 data-testid="public-profile-name" className="text-2xl font-bold text-gray-900">
            {profile.name}
          </h1>
          {profile.headline && (
            <p data-testid="public-profile-headline" className="text-gray-600">
              {profile.headline}
            </p>
          )}
        </div>
      </div>

      {profile.bio && (
        <p data-testid="public-profile-bio" className="mb-8 text-gray-700">
          {profile.bio}
        </p>
      )}

      {links.length > 0 && (
        <div data-testid="public-profile-links" className="mb-10 flex flex-wrap gap-3">
          {links.map((link) => (
            <a
              key={link.testId}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={link.testId}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-gray-900">{dict.profile.completedCoursesHeading}</h2>

      {completedCourses.length === 0 ? (
        <p
          data-testid="public-profile-no-completed-courses"
          className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500"
        >
          {dict.profile.noCompleted}
        </p>
      ) : (
        <div data-testid="public-profile-completed-courses" className="space-y-2">
          {completedCourses.map((course) => {
            const visual = getCourseVisual(course.language);
            return (
              <Link
                key={course.id}
                href={`/course/${course.id}`}
                data-testid={`public-profile-course-item-${course.id}`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 transition hover:border-indigo-300 hover:bg-gray-50"
              >
                <span
                  className={`flex h-8 w-8 flex-none items-center justify-center rounded-md ${visual.tileBg} text-base`}
                >
                  {visual.emoji}
                </span>
                <span className="font-medium text-gray-900">{course.title}</span>
                <Badge color="green" className="ml-auto">
                  {dict.profile.completedBadge}
                </Badge>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
