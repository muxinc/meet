type LayoutDescription = {
  area: number;
  cols: number;
  rows: number;
  width: number;
  height: number;
};

/**
 * Calculate optimal layout (most area used) of a number of boxes within a larger frame.
 * Given number of boxes, aspectRatio of those boxes, and spacing between them.
 *
 * Thanks to Anton Dosov for algorithm shown in this article:
 * https://dev.to/antondosov/building-a-video-gallery-just-like-in-zoom-4mam
 *
 * @param frameWidth width of the space holding the boxes
 * @param frameHeight height of the space holding the boxes
 * @param boxCount number of boxes to place (all same aspect ratio)
 * @param aspectRatio ratio of width to height of the boxes (usually 16/9)
 * @param spacing amount of space (margin) between boxes to spread them out
 * @returns A description of the optimal layout
 */
export function calcOptimalBoxes(
  frameWidth: number,
  frameHeight: number,
  boxCount: number,
  aspectRatio: number,
  spacing: number
): LayoutDescription {
  let bestLayout: LayoutDescription = {
    area: 0,
    cols: 0,
    rows: 0,
    width: 0,
    height: 0,
  };

  // try each possible number of columns to find the one with the highest area (optimum use of space)
  for (let cols = 1; cols <= boxCount; cols++) {
    const rows = Math.ceil(boxCount / cols);
    // pack the frames together by removing the spacing between them
    const packedWidth = frameWidth - spacing * (cols - 1);
    const packedHeight = frameHeight - spacing * (rows - 1);
    const hScale = packedWidth / (cols * aspectRatio);
    const vScale = packedHeight / rows;
    let width;
    let height;
    if (hScale <= vScale) {
      width = Math.floor(packedWidth / cols);
      height = Math.floor(width / aspectRatio);
    } else {
      height = Math.floor(packedHeight / rows);
      width = Math.floor(height * aspectRatio);
    }
    const area = width * height;
    if (area > bestLayout.area) {
      bestLayout = { area, width, height, rows, cols };
    }
  }

  return bestLayout;
}
