"use client";

import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { directiveToHast } from "@/lib/directive-to-hast";
import { AnswerStore } from "./answer-store";
import { Caution, Checkpoint, ExportFiles, FillIn, Goal, OsTabs, Quiz, SmartLink } from "./blocks";
import { Pre } from "./code-block";

/**
 * Owns the remark/rehype pipeline. Plugins are functions, which cannot cross the
 * server/client boundary as props, so the page passes only the Markdown string
 * and this component does the parsing.
 *
 * `rehypeRaw` is what lets authors use plain `<details>` for hidden hints — the
 * one interactive affordance that also works when the file is read on GitHub.
 */
export function CodelabRenderer({ slug, body }: { slug: string; body: string }) {
  return (
    <AnswerStore slug={slug}>
      <div className="codelab-prose">
        <Markdown
          remarkPlugins={[remarkGfm, remarkDirective, directiveToHast]}
          rehypePlugins={[rehypeRaw, rehypeSlug]}
          components={{
            // Directive vocabulary, namespaced by directiveToHast so `:::input`
            // cannot shadow the <input> that GFM task lists produce.
            "d-goal": Goal,
            "d-checkpoint": Checkpoint,
            "d-caution": Caution,
            "d-input": FillIn,
            "d-export": ExportFiles,
            "d-os": OsTabs,
            "d-quiz": Quiz,

            a: SmartLink,
            pre: Pre,
            // Cast: react-markdown types the map to known HTML tags only, but
            // custom element names are exactly how directives get rendered.
          } as Components}
        >
          {body}
        </Markdown>
      </div>
    </AnswerStore>
  );
}
