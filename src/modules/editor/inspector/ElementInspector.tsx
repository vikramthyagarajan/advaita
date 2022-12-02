import AppStore from "modules/state/AppStore";
import { TextboxNode, TextNode } from "modules/state/project/ProjectTypes";
import { TextInspector } from "./TextInspector";

export interface ElementInspectorProps {
  selectedNode: string | null;
  selectedChild: string | null;
  cacheKey: string | null;
}

export const ElementInspector = ({
  selectedNode,
  selectedChild,
  cacheKey,
}: ElementInspectorProps) => {
  if (!selectedNode || !cacheKey) return null;

  const node = AppStore.project.getNode(selectedNode);
  const child = selectedChild ? AppStore.project.getNode(selectedChild) : null;
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 border-2 border-slate-100 px-2 py-2 rounded-l-lg">
      {node.type === "textbox" ? (
        <TextInspector
          node={node as TextboxNode}
          cacheKey={node.cacheKey}
          child={child as TextNode}
        />
      ) : null}
    </div>
  );
};
