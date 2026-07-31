import { visit } from "unist-util-visit";
import { h } from "hastscript";
import type { Element } from "hast";
import type { Root } from "mdast";

/** Directive elements are namespaced so they can never collide with a real tag. */
export const DIRECTIVE_PREFIX = "d-";

type DirectiveNode = {
  type: string;
  name?: string;
  attributes?: Record<string, string | null | undefined> | null;
  data?: { hName?: string; hProperties?: Element["properties"] };
};

const DIRECTIVE_TYPES = new Set([
  "containerDirective",
  "leafDirective",
  "textDirective",
]);

/**
 * remark-directive parses `:::name{attr="v"}` into directive nodes but leaves them
 * without an element name, so nothing renders. This turns each one into a tag the
 * renderer maps to a component via react-markdown's `components` prop.
 *
 * The `d-` prefix matters: `:::input` would otherwise become `<input>` and
 * override the checkboxes GFM emits for `- [ ]` task lists. Prefixing also means
 * an unimplemented directive renders as an unknown custom element, so its text
 * still shows rather than vanishing.
 */
export function directiveToHast() {
  return (tree: Root) => {
    visit(tree, (node) => {
      const n = node as unknown as DirectiveNode;
      if (!DIRECTIVE_TYPES.has(n.type) || !n.name) return;

      const el = h(n.name, n.attributes ?? {}) as Element;
      n.data ??= {};
      n.data.hName = `${DIRECTIVE_PREFIX}${el.tagName}`;
      n.data.hProperties = el.properties;
    });
  };
}
