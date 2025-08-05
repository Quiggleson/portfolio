/**
 * Draws a horizontal line from the input to the median point
 * Draws a horizontal line from median point to the output
 * Draws a vertical line connecting those two lines 
 * @param ctx 
 * @param canvasRect 
 * @param input 
 * @param output 
 * @returns 
 */
export function DrawExpansion(
    ctx: CanvasRenderingContext2D,
    canvasRect: DOMRect,
    input: HTMLElement | null,
    output: HTMLElement | null
) {
    if (!input || !output) return

    const fromRect = input.getBoundingClientRect()
    const toRect = output.getBoundingClientRect()

    const medX = (fromRect.right + toRect.left) / 2 - canvasRect.left

    const fromX = fromRect.right - canvasRect.left
    const fromY = (fromRect.top + fromRect.bottom) / 2 - canvasRect.top

    const toX = toRect.left - canvasRect.left
    const toY = (toRect.top + toRect.bottom) / 2 - canvasRect.top


    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(medX, fromY)
    ctx.lineTo(medX, toY)
    ctx.lineTo(toX, toY)
    ctx.stroke()

}

export function DrawImplication(
    ctx: CanvasRenderingContext2D,
    canvasRect: DOMRect,
    inputA: HTMLElement | null,
    inputB: HTMLElement | null,
    output: HTMLElement | null
) {
    if (!inputA || !inputB || !output) return

    const aRect = inputA.getBoundingClientRect()
    const bRect = inputB.getBoundingClientRect()
    const toRect = output.getBoundingClientRect()

    const aX = aRect.right - canvasRect.left
    const aY = (aRect.top + aRect.bottom) / 2 - canvasRect.top

    const bX = bRect.right - canvasRect.left
    const bY = (bRect.top + bRect.bottom) / 2 - canvasRect.top

    const toX = toRect.left - canvasRect.left
    const toY = (toRect.top + toRect.bottom) / 2 - canvasRect.top

    let medX = (aRect.right + toRect.left) / 2 - canvasRect.left
    if (aRect.right < bRect.right) {
        medX = (bRect.right + toRect.left) / 2 - canvasRect.left
    }

    ctx.beginPath()
    ctx.moveTo(aX, aY)
    ctx.lineTo(medX, aY)

    ctx.moveTo(bX, bY)
    ctx.lineTo(medX, bY)

    ctx.moveTo(medX, toY)
    ctx.lineTo(toX, toY)

    ctx.moveTo(medX, Math.min(aY, bY, toY))
    ctx.lineTo(medX, Math.max(aY, bY, toY))
    ctx.stroke()
}