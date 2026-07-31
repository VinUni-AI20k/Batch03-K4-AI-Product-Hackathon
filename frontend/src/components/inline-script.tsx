/**
 * Renders a synchronous inline script that runs while the browser parses the
 * HTML. `type="text/plain"` on the client keeps React from warning about
 * script tags in components — the script has already run by then.
 *
 * See next docs: app/guides/preventing-flash-before-hydration.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
