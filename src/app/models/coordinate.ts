export type Coordinate = {
    x: number
    y: number
}

export function getRelativeCoordinate(ev: MouseEvent, elem: Element): Coordinate {
    const rect = elem.getBoundingClientRect();
    return {
      x: parseInt((ev.clientX - rect.left).toString()),
      y: parseInt((ev.clientY - rect.top).toString())
    }
}