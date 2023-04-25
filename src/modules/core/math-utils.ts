export const radians = (angle: number) => {
  return angle * (Math.PI / 180);
};

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const inBounds = (rect1: Rect, rect2: Rect) => {
  if (
    rect1.left < rect2.left + rect2.width &&
    rect1.left + rect1.width > rect2.left &&
    rect1.top < rect2.top + rect2.height &&
    rect1.top + rect1.height > rect2.top
  )
    return true;
  else return false;
};

export const isCloseEnough = (
  num1: number,
  num2: number,
  precision: number
) => {
  return num2 > num1 - precision && num2 < num1 + precision;
};

export const generateRandomNumberBetween = (min: number, max: number) => {
  return min + Math.round(Math.random() * (max - min));
};
