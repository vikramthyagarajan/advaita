import { useRef } from "react";
import InfiniteCanvas from "./InfiniteCanvas";

const CanvasRoot = () => {
  const canvas = useRef<HTMLDivElement>(null);
  return (
    <div className="w-full h-full">
      <div ref={canvas}>
        <InfiniteCanvas></InfiniteCanvas>
      </div>
    </div>
  );
};

export default CanvasRoot;
