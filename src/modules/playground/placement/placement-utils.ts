import { CanvasPosition } from "modules/core/foundation";
import { generateRandomNumberBetween } from "modules/core/math-utils";
import { Node, RootNode } from "modules/state/project/ProjectTypes";

class Box {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }
}

class Quadtree extends Box {
  depth: number;
  children: Quadtree[];
  boxes: Box[];
  maxDepth: number;
  maxChildren: number;

  constructor(x, y, width, height, maxDepth, maxChildren) {
    super(x, y, width, height);
    this.maxDepth = maxDepth || 4;
    this.maxChildren = maxChildren || 4;
    this.boxes = [];
    this.children = [];
    this.depth = 0;
  }

  // Subdivide the quadtree into four quadrants
  subdivide() {
    const w = this.width / 2;
    const h = this.height / 2;
    const x = this.x;
    const y = this.y;
    this.children.push(
      new Quadtree(x, y, w, h, this.maxDepth, this.maxChildren)
    );
    this.children.push(
      new Quadtree(x + w, y, w, h, this.maxDepth, this.maxChildren)
    );
    this.children.push(
      new Quadtree(x, y + h, w, h, this.maxDepth, this.maxChildren)
    );
    this.children.push(
      new Quadtree(x + w, y + h, w, h, this.maxDepth, this.maxChildren)
    );
    // boxes which are in multiple quadrants get saved in this node itself
    let remainingBoxes: Box[] = [];
    for (const box of this.boxes) {
      const quad = this.getQuadrant(box);
      if (quad) quad.insert(box);
      else remainingBoxes = [...remainingBoxes, box];
    }
    this.boxes = remainingBoxes;
  }

  // Insert a box into the quadtree
  insert(box: Box) {
    if (this.children.length === 0) {
      if (this.boxes.length < this.maxChildren) {
        this.boxes.push(box);
      } else {
        this.subdivide();
        this.insert(box);
      }
    } else {
      const quadrant = this.getQuadrant(box);
      if (quadrant) quadrant.insert(box);
      else this.boxes.push(box);
    }
  }

  // Get the quadrant that contains the given box
  getQuadrant(box) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const left = box.right < cx;
    const top = box.bottom < cy;
    // box is in left side of center
    if (left) {
      // posibility of being in multiple quadrants if in bottom
      if (top) {
        return this.children[0];
      } else if (box.top >= cy) {
        return this.children[2];
      } else return null;
    } else {
      // posibility of being in multiple quadrants if in bottom
      if (top) {
        return this.children[1];
      } else if (box.top >= cy) {
        return this.children[3];
      } else return null;
    }
  }

  // Check if two boxes intersect
  intersects(box1: Box, box2: Box) {
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    );
  }

  // Find a non-overlapping location for the given box
  findNonOverlappingLocation(box, minDistance) {
    const overlappingBoxes = this.query(box);
    let minDistanceSquared = Infinity;
    let nonOverlappingLocation: Box | null = null;
    const x = box.x;
    const y = box.y;
    const w = box.width;
    const h = box.height;
    while (nonOverlappingLocation === null) {
      const randomX = x + (Math.random() - 0.5) * minDistance;
      const randomY = y + (Math.random() - 0.5) * minDistance;
      const testBox = new Box(randomX, randomY, w, h);
      let overlaps = false;
      for (const overlappingBox of overlappingBoxes) {
        if (this.intersects(testBox, overlappingBox)) {
          overlaps = true;
          const dx = testBox.x - overlappingBox.x;
          const dy = testBox.y - overlappingBox.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < minDistanceSquared) {
            minDistanceSquared = distanceSquared;
          }
        }
      }
      if (!overlaps) {
        nonOverlappingLocation = testBox;
      }
    }
    return nonOverlappingLocation;
  }

  // Query the quadtree for boxes that intersect the given box
  query(box: Box, result: Box[] = []) {
    for (const value of this.boxes) {
      if (this.intersects(value, box)) {
        result.push(value);
      }
    }
    if (this.children.length > 0) {
      for (const quadrant of this.children) {
        if (this.intersects(quadrant, box)) {
          quadrant.query(box, result);
        }
      }
    }
    return result;
  }
}

export const placeBoxNearbyQuadtree = (
  position: CanvasPosition,
  nodes: RootNode[],
  boundingBox: CanvasPosition,
  padding: number = 0
): { left: number; top: number; width: number; height: number } | null => {
  const original = new Box(
    position.left,
    position.top,
    position.width,
    position.height
  );
  const boxes = nodes.map(
    (n) =>
      new Box(
        n.position.left - padding,
        n.position.top - padding,
        n.position.width + padding,
        n.position.height + padding
      )
  );

  const quadTree = new Quadtree(
    boundingBox.left,
    boundingBox.top,
    boundingBox.width,
    boundingBox.height,
    20,
    4
  );
  for (const existingBox of boxes) {
    quadTree.insert(existingBox);
  }

  let scores: {
    score: number;
    box: { left: number; top: number; height: number; width: number };
  }[] = [];
  for (let i = 0; i < 10; i++) {
    const randomX = generateRandomNumberBetween(
      boundingBox.left,
      boundingBox.left + boundingBox.width
    );
    const randomY = generateRandomNumberBetween(
      boundingBox.top,
      boundingBox.top + boundingBox.height
    );

    const option = new Box(randomX, randomY, position.width, position.height);
    const overlaps = quadTree.query(option, []);
    if (overlaps.length === 0) {
      const dx = position.left - option.x;
      const dy = position.top - option.y;
      const distanceSquared = dx * dx + dy * dy;
      scores.push({
        score: distanceSquared,
        box: {
          left: option.x,
          top: option.y,
          height: option.height,
          width: option.width,
        },
      });
    }
  }
  const closestBox = scores.sort((a, b) => {
    return b.score - a.score;
  })[scores.length - 1];
  return closestBox?.box || null;
};

const findNonOverlappingLocation = (
  box: Box,
  minDistance: number,
  allBoxes: Box[]
) => {};
