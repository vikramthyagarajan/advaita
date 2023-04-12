import { Node } from "slate";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import stringify from "remark-stringify";
import {
  remarkToSlate,
  remarkToSlateLegacy,
  slateToRemarkLegacy,
} from "remark-slate-transformer";

const toSlateProcessor = unified()
  .use(markdown)
  .use(gfm)
  .use(frontmatter)
  .use(remarkToSlate);

const toRemarkProcessor = unified()
  .use(slateToRemarkLegacy)
  .use(gfm)
  .use(frontmatter)
  .use(stringify);

export const toSlate = <T>(s: string) =>
  toSlateProcessor.processSync(s).result as T[];
export const toMd = <T>(value: T[]) => {
  const mdast = toRemarkProcessor.runSync({
    type: "root",
    //@ts-ignore
    children: value,
  });
  return toRemarkProcessor.stringify(mdast);
};
