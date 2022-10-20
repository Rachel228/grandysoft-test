export const X = (a1, b1, c1, a2, b2, c2) => {
    let d, dx, pointx;
    d = a1 * b2 - b1 * a2;
    dx = -c1 * b2 + b1 * c2;
    pointx = dx / d;
    return pointx;
};

export const Y = (a1, b1, c1, a2, b2, c2) => {
    let d, dy, pointy;
    d = a1 * b2 - b1 * a2;
    dy = -a1 * c2 + c1 * a2;
    pointy = dy / d;
    return pointy;
};

export const Line = (x1, y1, x2, y2) => {
    let A, B, C;
    A = y2 - y1;
    B = x1 - x2;
    C = -x1 * (y2 - y1) + y1 * (x2 - x1);
    return [A, B, C];
};
