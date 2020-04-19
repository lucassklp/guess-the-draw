export type Coordinate = {
    x: number
    y: number
}

export function getRelativeCoordinate(ev: MouseEvent, elem: Element): Coordinate {
    const rect = elem.getBoundingClientRect();
    return {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top
    }
}