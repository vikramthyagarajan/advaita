import clsx from "clsx";
import AppStore from "modules/state/AppStore";
import {
  Align,
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
  node: TextboxNode;
  child: TextNode | null;
}

export const TextInspector = ({ node, child }: TextInspectorProps) => {
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
              "bg-slate-300": node.align === align.name,
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
              "bg-slate-300": node.vertical === vertical.name,
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
      {child ? (
        <>
          <div className="text-sm my-2">Formatting</div>
          <div className="flex flex-row gap-3">
            {formatting.map((style) => (
              <div
                key={style.name}
                className={clsx("cursor-pointer p-2", {
                  "bg-slate-300": (child as any)[style.name],
                })}
                onClick={() => {
                  AppStore.project.setNode(child.id, {
                    [style.name]: !(child as any)[style.name],
                    style: "none",
                  });
                }}
              >
                <style.icon size={15} />
              </div>
            ))}
          </div>
          <div className="text-sm my-2">Styles</div>
          <div className="flex flex-row gap-3 items-end">
            {styles.map((style) => (
              <div
                key={style.name}
                className={clsx("cursor-pointer p-2", {
                  "bg-slate-300": child.style === style.name,
                })}
                onClick={() => {
                  const unset = child.style === style.name;
                  if (unset)
                    AppStore.project.setNode(child.id, {
                      style: "none",
                      bold: false,
                      italic: false,
                      underline: false,
                    });
                  else
                    AppStore.project.setNode(child.id, {
                      style: style.name as TextStyles,
                      bold: false,
                      italic: false,
                      underline: false,
                    });
                }}
              >
                <style.icon size={style.size} />
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};
