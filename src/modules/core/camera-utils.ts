export const cameraToScreenCoordinates = (
  x: number,
  y: number,
  z: number,
  cameraAngle: number,
  screenAspect: number
) => {
  const width = 2 * z * Math.tan(cameraAngle);
  const height = width / screenAspect;
  const screenX = x - width / 2;
  const screenY = y - height / 2;
  return { x: screenX, y: screenY, width, height };
};
