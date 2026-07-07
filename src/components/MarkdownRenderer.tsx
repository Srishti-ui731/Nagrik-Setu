import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

/**
 * Reusable component to render lightweight Markdown syntax (bold, lists, headings) safely
 * without external HTML parsing libraries. Standardizes representation across components.
 *
 * @param {MarkdownRendererProps} props Component props containing raw text
 * @returns {JSX.Element | null} The rendered layout
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="markdown-content">
      {lines.map((line, i) => {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const matches = [...line.matchAll(boldRegex)];

        if (matches.length > 0) {
          return (
            <p key={i} className="mb-2 leading-relaxed text-xs sm:text-sm text-slate-700">
              {line.split(/\*\*.*?\*\*/g).map((part, index) => {
                const boldText = matches[index]?.[1];
                return (
                  <span key={index}>
                    {part}
                    {boldText && <strong className="font-bold text-slate-900">{boldText}</strong>}
                  </span>
                );
              })}
            </p>
          );
        }

        // Bullet lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <li
              key={i}
              className="ml-4 list-disc mb-1 leading-relaxed text-xs sm:text-sm text-slate-700"
            >
              {line.trim().substring(2)}
            </li>
          );
        }

        // Numbered lists
        if (/^\d+\.\s/.test(line.trim())) {
          const content = line.trim().replace(/^\d+\.\s/, '');
          return (
            <li
              key={i}
              className="ml-5 list-decimal mb-1 leading-relaxed text-xs sm:text-sm text-slate-700"
            >
              {content}
            </li>
          );
        }

        // Headings
        if (line.trim().startsWith('### ')) {
          return (
            <h4 key={i} className="text-xs sm:text-sm font-bold text-slate-800 mt-3 mb-1">
              {line.replace('### ', '')}
            </h4>
          );
        }
        if (line.trim().startsWith('## ')) {
          return (
            <h3 key={i} className="text-sm sm:text-base font-bold text-slate-900 mt-4 mb-2">
              {line.replace('## ', '')}
            </h3>
          );
        }
        if (line.trim().startsWith('# ')) {
          return (
            <h2 key={i} className="text-base sm:text-lg font-bold text-orange-600 mt-4 mb-2">
              {line.replace('# ', '')}
            </h2>
          );
        }

        // Standard text line
        return line.trim() ? (
          <p key={i} className="mb-2 leading-relaxed text-xs sm:text-sm text-slate-700">
            {line}
          </p>
        ) : (
          <div key={i} className="h-1.5" />
        );
      })}
    </div>
  );
};
