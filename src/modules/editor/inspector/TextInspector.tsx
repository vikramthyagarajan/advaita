import clsx from "clsx";
import AppStore from "modules/state/AppStore";
import {
  Align,
  Node,
  TextboxNode,
  TextNode,
  TextStyles,
  VerticalAlign,
} from "modules/state/project/ProjectTypes";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronsDown,
  ChevronsUp,
  Italic,
  Type,
  Underline,
} from "react-feather";

export interface TextInspectorProps {
  cacheKey: string;
  node: Node;
}

export const TextInspector = ({ node }: TextInspectorProps) => {
  const aligns = [
    {
      name: "left",
      icon: AlignLeft,
    },
    { name: "center", icon: AlignCenter },
    { name: "right", icon: AlignRight },
  ];
  const verticals = [
    { name: "top", icon: ChevronsUp },
    { name: "center", icon: ChevronsDown },
  ];
  const formatting = [
    { name: "bold", icon: Bold },
    { name: "italic", icon: Italic },
    { name: "underline", icon: Underline },
  ];
  const styles = [
    { name: "heading-1", icon: Type, size: 18 },
    { name: "heading-2", icon: Type, size: 16 },
    { name: "heading-3", icon: Type, size: 14 },
  ];
  return (
    <div>
      <div className="text-sm mb-2">Align</div>
      <div className="flex flex-row gap-3">
        {aligns.map((align) => (
          <div
            key={align.name}
            className={clsx("cursor-pointer text-sm p-2", {
              "bg-slate-300": (node as TextboxNode).align === align.name,
            })}
            onClick={() => {
              AppStore.project.setNode(node.id, { align: align.name as Align });
            }}
          >
            <align.icon size={15} />
          </div>
        ))}
      </div>
      <div className="text-sm my-2">Vertical</div>
      <div className="flex flex-row gap-3">
        {verticals.map((vertical) => (
          <div
            key={vertical.name}
            className={clsx("cursor-pointer p-2", {
              "bg-slate-300": (node as TextboxNode).vertical === vertical.name,
            })}
            onClick={() => {
              AppStore.project.setNode(node.id, {
                vertical: vertical.name as VerticalAlign,
              });
            }}
          >
            <vertical.icon size={15} />
          </div>
        ))}
      </div>
      <div className="text-sm my-2">Formatting</div>
      <div className="flex flex-row gap-3">
        {formatting.map((style) => (
          <div
            key={style.name}
            className={clsx("cursor-pointer p-2", {
              "bg-slate-300": (node as any)[style.name],
            })}
            onClick={() => {
              AppStore.project.setNode(node.id, {
                [style.name]: !(node as any)[style.name],
              });
            }}
          >
            <style.icon size={15} />
          </div>
        ))}
      </div>
      <div className="text-sm my-2">Styles</div>
      <div className="flex flex-row gap-3">
        {styles.map((style) => (
          <div
            key={style.name}
            className={clsx("cursor-pointer p-2", {
              "bg-slate-300": (node as TextNode).style === style.name,
            })}
            onClick={() => {
              AppStore.project.setNode(node.id, {
                style: style.name as TextStyles,
              });
            }}
          >
            <style.icon size={style.size} />
          </div>
        ))}
      </div>
    </div>
  );
};
