export const getDot = (x, A, B, C) => {
    let y;
    y = -(A / B) * x - C / B;
    return y;
};

export let getPos = {
    collapsed: false,
    fromX: 0, fromY: 0, toX: 0, toY: 0,
    getCenter() {
        return [Math.round((this.fromX + this.toX) / 2), Math.round((this.fromY + this.toY) / 2)]
    }
};
