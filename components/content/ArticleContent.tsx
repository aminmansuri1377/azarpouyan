"use client";

import { useEffect, useState } from "react";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleContentProps {
  html: string;
}

export function ArticleContent({ html }: ArticleContentProps) {
  const [contentHtml, setContentHtml] = useState("");
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    if (!html) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContentHtml("");
      setHeadings([]);
      return;
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");

    const headingElements = Array.from(document.querySelectorAll("h2, h3, h4"));

    const generatedHeadings: HeadingItem[] = headingElements.map(
      (heading, index) => {
        const id = `article-heading-${index + 1}`;

        heading.id = id;

        return {
          id,
          text: heading.textContent?.trim() || `بخش ${index + 1}`,
          level: Number(heading.tagName.substring(1)),
        };
      },
    );

    setHeadings(generatedHeadings);
    setContentHtml(document.body.innerHTML);
  }, [html]);

  return (
    <div>
      {headings.length > 0 && (
        <nav className="mb-8 rounded-xl border bg-gray-50 p-5">
          <h2 className="mb-4 text-lg font-bold">فهرست مطالب</h2>

          <ul className="space-y-2">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={heading.level === 3 ? "pr-5" : ""}
              >
                <a
                  href={`#${heading.id}`}
                  className="text-gray-700 hover:text-primary hover:underline"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <article
        className="article-content"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
