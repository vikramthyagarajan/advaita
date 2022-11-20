import { CanvasPosition, Position } from "modules/core/foundation";

interface TextBlockProps extends CanvasPosition {
  text: string;
  color: string;
  width: number;
  height: number;
}

const TextBlock = ({
  text,
  color,
  left,
  top,
  width,
  height,
}: TextBlockProps) => {
  return (
    <Position left={left} top={top}>
      <div
        className="flex items-center justify-center"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: color,
        }}
      >
        {text}
      </div>
    </Position>
  );
};

const InfiniteCanvas = () => {
  const texts = [
    "Infinite",
    "Canvases",
    "Are",
    "Easy",
    "When",
    "You",
    "Know",
    "The",
    "Fundamentals",
  ];

  const colors = [
    "#f1f7ed",
    "#61c9a8",
    "#7ca982",
    "#e0eec6",
    "#c2a83e",
    "#ff99c8",
    "#fcf6bd",
    "#9c92a3",
    "#c6b9cd",
  ];
  const rectW = 1000;
  const rectH = 1000;

  return (
    <div>
      {texts.map((text, index) => (
        <TextBlock
          text={text}
          color={colors[index]}
          left={(index % 3) * rectW}
          top={Math.floor(index / 3) * rectH}
          width={rectW}
          height={rectH}
        />
      ))}
    </div>
  );
};

export default InfiniteCanvas;
