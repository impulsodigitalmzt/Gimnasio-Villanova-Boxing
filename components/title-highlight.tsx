import { Fragment } from 'react';

/**
 * Renders a title string where words wrapped in asterisks (*así*)
 * get the brand gold gradient treatment. Line breaks (\n) are preserved
 * by the `whitespace-pre-line` class on the parent heading.
 */
export function renderHighlightedTitle(title: string) {
  return title.split(/\*([^*]+)\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="text-gradient-brand">{part}</span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
