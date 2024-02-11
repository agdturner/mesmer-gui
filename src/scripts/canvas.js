/**
 * Draw a horizontal line and add labels.
 * @param ctx The context to use.
 * @param strokeStyle The name of a style to use for the line.
 * @param strokewidth The width of the line.
 * @param x0 The start x-coordinate of the line.
 * @param y0 The start y-coordinate of the line. Also used for an energy label.
 * @param x1 The end x-coordinate of the line.
 * @param y1 The end y-coordinate of the line.
 * @param th The height of the text in pixels.
 * @param reactantLabel The label for the reactant.
 */
export function drawLevel(ctx, strokeStyle, strokewidth, x0, y0, x1, y1, th, reactantLabel) {
    let x_centre = x0 + ((x1 - x0) / 2);
    let text = y1.toString();
    writeText(ctx, text, strokeStyle, getTextStartX(ctx, text, x_centre), y1 + th);
    text = reactantLabel;
    writeText(ctx, text, strokeStyle, getTextStartX(ctx, text, x_centre), y1 + 3 * th);
    drawLine(ctx, strokeStyle, strokewidth, x0, y0, x1, y1);
}
/**
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to get the start x-coordinate of.
 * @param {number} x_centre The x-coordinate of the centre of the text.
 * @returns The x-coordinate of the start of the text.
 */
function getTextStartX(ctx, text, x_centre) {
    let tw = getTextWidth(ctx, text);
    return x_centre - (tw / 2);
}
/**
 * Draw a line (segment) on the canvas.
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} strokeStyle The name of a style to use for the line.
 * @param {Integer} x1 The start x-coordinate of the line.
 * @param {Integer} y1 The start y-coordinate of the line.
 * @param {Integer} x2 The end x-coordinate of the line.
 * @param {Integer} y2 The end y-coordinate of the line.
 */
export function drawLine(ctx, strokeStyle, strokewidth, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokewidth;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
/**
 * Writes text to the canvas. (It is probably better to write all the labels in one go.)
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to write.
 * @param {string} colour The colour of the text.
 * @param {number} x The horizontal position of the text.
 * @param {number} y The vertical position of the text.
 */
export function writeText(ctx, text, colour, x, y) {
    // Save the context (to restore after).
    ctx.save();
    // Translate to the point where text is to be added.
    ctx.translate(x, y);
    // Invert Y-axis.
    ctx.scale(1, -1);
    // Set the text colour.
    ctx.fillStyle = colour;
    // Write the text.
    ctx.fillText(text, 0, 0);
    // Restore the context.
    ctx.restore();
}
/**
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to get the height of.
 * @returns {number} The height of the text in pixels.
 */
export function getTextHeight(ctx, text) {
    var fontMetric = ctx.measureText(text);
    return fontMetric.actualBoundingBoxAscent + fontMetric.actualBoundingBoxDescent;
}
/**
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to get the width of.
 * @returns {number} The width of the text in pixels.
 */
export function getTextWidth(ctx, text) {
    return ctx.measureText(text).width;
}
//# sourceMappingURL=canvas.js.map