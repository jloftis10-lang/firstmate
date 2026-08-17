import { Fragment } from "react";

/**
 * Renders `**double asterisk**` spans as <strong>. Flag copy is authored
 * by us, but it still goes through React as text rather than HTML — there
 * is no dangerouslySetInnerHTML anywhere in this app.
 */
export function Emphasis({ text }: { text: string }) {
  const segments = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {segments.map((segment, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {segment}
          </strong>
        ) : (
          <Fragment key={i}>{segment}</Fragment>
        ),
      )}
    </>
  );
}
