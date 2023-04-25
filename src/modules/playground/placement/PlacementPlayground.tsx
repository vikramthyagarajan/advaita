import useSize from "@react-hook/size";
import clsx from "clsx";
import useRenderLoop from "modules/core/RenderLoop";
import InfiniteCanvas from "modules/editor/InfiniteCanvas";
import AppStore from "modules/state/AppStore";
import CanvasStore from "modules/state/canvas/CanvasStore";
import { useUiStore } from "modules/state/ui/UiStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { placeBoxNearbyQuadtree } from "./placement-utils";
import { generateId } from "modules/core/project-utils";

const loadTestProject = () => {
  const position = { left: 1500, top: 1500, width: 100, height: 200 };
  AppStore.project.addTextbox("123", {
    position,
  });
  AppStore.project.setNode("123", { text: "Hello" });
  // CanvasStore.zoomCamera(0, 12);
};

interface Score {
  time: number;
  nodes: number;
  success: boolean;
}

const usePlacementTester = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const position = { left: 1500, top: 1500, width: 100, height: 200 };
  const addScore = useCallback(
    (score: Score) => {
      setScores([...scores, score]);
    },
    [scores]
  );
  useEffect(() => {
    const interval = setInterval(() => {
      const start = performance.now();
      const rootNodes = AppStore.project.rootNodes;
      try {
        const id = generateId();
        const box = placeBoxNearbyQuadtree(position, rootNodes, {
          left: 0,
          top: 0,
          width: 2000,
          height: 2000,
        });
        console.log("placed", box);
        if (box) {
          AppStore.project.addTextbox(id, { position: box });
          AppStore.project.setNode(id, { text: "Next Node" });
          addScore({
            nodes: rootNodes.length,
            time: performance.now() - start,
            success: true,
          });
        } else {
          addScore({
            nodes: rootNodes.length,
            time: performance.now() - start,
            success: false,
          });
          alert("Error found");
        }
      } catch (e) {
        addScore({
          nodes: rootNodes.length,
          time: performance.now() - start,
          success: false,
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [addScore]);
  return scores;
};

const PlacementPlayground = () => {
  const { widget, selectedNode: selected, selectedChild } = useUiStore();
  const frame = useRenderLoop(60);
  const canvas = useRef<HTMLDivElement>(null);
  const [width, height] = useSize(canvas);
  useEffect(() => {
    if (width === 0 || height === 0) return;
    CanvasStore.initialize(width, height);
    loadTestProject();
  }, [width, height]);
  const scores = usePlacementTester();

  return (
    <div className="w-full h-full relative flex">
      <div
        className={clsx(
          "w-3/4 h-full relative overflow-hidden overscroll-none"
        )}
        ref={canvas}
      >
        <InfiniteCanvas frame={frame}></InfiniteCanvas>;
      </div>
      <div className={clsx("w-1/4 h-full")}>
        Scores
        <table>
          <tr>
            <th>Run</th>
            <th>Nodes</th>
            <th>Time</th>
            <th>Success</th>
          </tr>
          {scores.map((score, index) => {
            return (
              <tr>
                <td>{index}</td>
                <td>{score.nodes}</td>
                <td>{score.time}</td>
                <td>{score.success.toString()}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default PlacementPlayground;
