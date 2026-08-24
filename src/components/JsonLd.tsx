type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];

/**
 * Structured data rendered without letting a less-than sign become markup.
 * All current values are authored here, but keeping the escape at the seam
 * makes the component safe if a ship or guide title is passed later.
 */
export function JsonLd({ data }: { data: JsonLdValue }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
