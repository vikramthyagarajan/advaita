import { useRef } from "react";

const CanvasRoot = () => {
  const canvas = useRef<HTMLDivElement>(null);
  return (
    <div className="w-full h-full">
      <div ref={canvas}></div>
      Welcome to the canvas
    </div>
  );
};

export default CanvasRoot;
