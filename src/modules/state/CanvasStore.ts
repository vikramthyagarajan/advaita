import { cameraToScreenCoordinates } from "../core/camera-utils";
import { CAMERA_ANGLE, RECT_H, RECT_W } from "../core/constants";
import { radians } from "../core/math-utils";

export interface CanvasState {
  pixelRatio: number; // our resolution for dip calculations
  container: {
    //holds information related to our screen container
    width: number;
    height: number;
  };
  pointer: {
    x: number;
    y: number;
  };
  camera: {
    //holds camera state
    x: number;
    y: number;
    z: number;
  };
}
const getInitialCanvasState = (): CanvasState => {
  return {
    pixelRatio: window.devicePixelRatio || 1,
    container: {
      width: 0,
      height: 0,
    },
    pointer: {
      x: 0,
      y: 0,
    },
    camera: {
      x: 0,
      y: 0,
      z: 0,
    },
  };
};

let canvasData = getInitialCanvasState();

export default class CanvasStore {
  private static get data() {
    if (!canvasData)
      canvasData = {
        pixelRatio: window.devicePixelRatio || 1,
        container: {
          width: 0,
          height: 0,
        },
        pointer: {
          x: 0,
          y: 0,
        },
        camera: {
          x: 0,
          y: 0,
          z: 0,
        },
      };
    return canvasData;
  }

  static initialize(width: number, height: number) {
    const containerWidth = width;
    const containerHeight = height;
    canvasData = getInitialCanvasState();
    canvasData.pixelRatio = window.devicePixelRatio || 1;
    canvasData.container.width = containerWidth;
    canvasData.container.height = containerHeight;
    canvasData.camera.x = 1.5 * RECT_W;
    canvasData.camera.y = 1.5 * RECT_H;
    canvasData.camera.z = containerWidth / (2 * Math.tan(CAMERA_ANGLE));
  }
  public static get screen() {
    const { x, y, z } = this.camera;
    const aspect = this.aspect;
    const angle = radians(30);
    return cameraToScreenCoordinates(x, y, z, angle, aspect);
  }
  public static get camera() {
    return this.data.camera;
  }
  public static get scale() {
    const { width: w, height: h } = CanvasStore.screen;
    const { width: cw, height: ch } = CanvasStore.container;
    return { x: cw / w, y: ch / h };
  }

  private static get container() {
    return canvasData.container;
  }

  private static get aspect() {
    return canvasData.container.width / canvasData.container.height;
  }
}
