import clsx from "clsx";
import { Node } from "modules/state/project/ProjectRegistry";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronsDown,
  ChevronsUp,
} from "react-feather";

export interface TextInspectorProps {
  cacheKey: string;
  node: Node;
}

export const TextInspector = ({}: TextInspectorProps) => {
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
  return (
    <div>
      <div className="text-sm mb-2">Align</div>
      <div className="flex flex-row gap-3">
        {aligns.map((align) => (
          <div
            key={align.name}
            className={clsx("rounded-md cursor-pointer text-sm", {})}
            onClick={() => {}}
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
            className={clsx("cursor-pointer")}
            onClick={() => {}}
          >
            <vertical.icon size={15} />
          </div>
        ))}
      </div>
    </div>
  );
};
