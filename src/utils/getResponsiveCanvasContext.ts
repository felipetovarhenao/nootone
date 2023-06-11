/**
 * Set the pixel density of the <canvas> and return its context.
 *
 * @param {HTMLCanvasElement} canvas Our target <canvas> element.
 * @returns {CanvasRenderingContext2D} The modified canvas context.
 */
export default function getResponsiveCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  // Get the device pixel ratio.
  const pixelRatio = window.devicePixelRatio;

  // Get the actual screen (or CSS) size of the canvas.
  const sizeOnScreen = canvas.getBoundingClientRect();

  // Set our canvas size equal to that of the screen size x the pixel ratio.
  canvas.width = sizeOnScreen.width * pixelRatio;
  canvas.height = sizeOnScreen.height * pixelRatio;

  // Shrink back down the canvas CSS size by the pixel ratio, thereby 'compressing' the pixels.
  canvas.style.width = `${canvas.width / pixelRatio}px`;
  canvas.style.height = `${canvas.height / pixelRatio}px`;

  // Fetch the context.
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Scale all canvas operations by the pixelRatio, so you don't have to calculate these manually.
  context.scale(pixelRatio, pixelRatio);

  // Return the modified context.
  return context;
}
