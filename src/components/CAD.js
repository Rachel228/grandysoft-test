import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Y, X, Line } from './PointFunc'
import { getDot, getPos } from './DotFunc'

function App() {
    const crossDots = useRef(null);
    const large = useRef(null);
    const relation = useRef(null);
    const lines = useRef(null);

    let dot = useRef(null);

    let [isDrawing, setIsDrawing] = useState(false);
    let dots = { x: 0, y: 0 };
    let tempDots = [];

    async function Lines() {
        for (let line of lines.current) {
            if (line.collapsed) return;
            let [x] = line.getCenter();
            let ax = Math.round(line.fromX);
            let bx = Math.round(line.toX);
            let [a1, b1, c1] = Line(line.fromX, line.fromY, line.toX, line.toY);
            line.collapsed = true;

            let timer = setInterval(() => {
                if (ax > x) {
                    clearInterval(timer);
                    clear();
                    Drawn();
                    return;
                }

                clear();
                Drawn();

                relation.current.moveTo(ax, getDot(ax, a1, b1, c1));
                relation.current.lineTo(bx, getDot(bx, a1, b1, c1));
                relation.current.stroke();

                ax += 1;
                bx -= 1;

            }, 10);
            await sleep(600);
        }
    }

    const clear = useCallback(() => {
        relation.current.beginPath();
        relation.current.clearRect(0, 0, 600, 500);
    }, []);

    const Drawn = () => {
        lines.current.forEach((line) => {
            if (line) {
                if (line.collapsed) {
                    let [x, y] = line.getCenter();
                    relation.current.beginPath();
                    relation.current.moveTo(x, y);
                    relation.current.lineTo(x, y);
                    relation.current.stroke();
                } else {
                    relation.current.beginPath();
                    relation.current.moveTo(line.fromX, line.fromY);
                    relation.current.lineTo(line.toX, line.toY);
                    relation.current.stroke();

                    crossDots.current.forEach((dot => {
                        if (dot) {
                            if (Array.isArray(dot)) {
                                dot.forEach((d) => {
                                    relation.current.fillRect(d.x - 4, d.y - 4, 8, 8)
                                })
                            } else {
                                relation.current.fillRect(dot.x - 4, dot.y - 4, 8, 8);
                            }
                        }
                    }))
                }
            }
        });
    };

    useEffect(() => {
        const canvas = large.current;
        canvas.width = 600;
        canvas.height = 500;
        const ctx = canvas.getContext("2d");

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = "value";
        ctx.fillStyle = "#fd0000";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = "value";
        relation.current = ctx;
        lines.current = [];
        crossDots.current = [];
        dot.current = { x: 0, y: 0 };
    }, []);

    const Draw = (e) => {
        setIsDrawing(isDrawing = !isDrawing);
        relation.current.beginPath();
        if (lines.current.length > 1) Drawn();
        if (isDrawing) {
            dot.current.x = e.clientX;
            dot.current.y = e.clientY;
        }
        else {
            lines.current.push({ ...getPos });
            if (lines.current.length > 1) {
                crossDots.current.push(...tempDots.slice(-lines.current.length));
            }
            CrossAll();
        }
    };

    let restoreDraw = (e) => {
        relation.current.beginPath();
        getPos.fromX = dot.current.x;
        getPos.fromY = dot.current.y;
        getPos.toX = e.clientX;
        getPos.toY = e.clientY;
        clear();
        relation.current.moveTo(getPos.fromX, getPos.fromY);
        relation.current.lineTo(e.clientX, e.clientY);
        relation.current.stroke();
        Drawn();
        CrossAll();
    };

    const Check = (ax, ay, bx, by) => {
        return ax * by - bx * ay;
    };

    const getCollision = (x1, y1, x2, y2, x3, y3, x4, y4) => {

        const v1 = Check(x4 - x3, y4 - y3, x1 - x3, y1 - y3);
        const v2 = Check(x4 - x3, y4 - y3, x2 - x3, y2 - y3);
        const v3 = Check(x2 - x1, y2 - y1, x3 - x1, y3 - y1);
        const v4 = Check(x2 - x1, y2 - y1, x4 - x1, y4 - y1);
        if
        (v1 * v2 < 0 && v3 * v4 < 0)
            return true;
        else return false;
    };

    const tempCheck = (x1, y1, x2, y2, x3, y3, x4, y4) => {
        if (getCollision(x1, y1, x2, y2, x3, y3, x4, y4)) {
            let [a1, b1, c1] = Line(x1, y1, x2, y2);
            let [a2, b2, c2] = Line(x3, y3, x4, y4);
            dots.x = X(a1, b1, c1, a2, b2, c2);
            dots.y = Y(a1, b1, c1, a2, b2, c2);
            relation.current.fillRect(dots.x - 4, dots.y - 4, 8, 8);
            tempDots.push({ ...dots });
        } else {
            return null;
        }
    };

    const CrossAll = () => {
        lines.current.forEach((line) => {
            tempCheck(line.fromX, line.fromY, line.toX, line.toY, getPos.fromX, getPos.fromY, getPos.toX, getPos.toY);
        })
    };

    const sleep = (ms) => {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    };

    const cancelDrawing = (e) => {
        e && e.preventDefault();
        clear();
        Drawn();
        setIsDrawing(false);
    };

    return (
        <div className="wrapper">
            <canvas
                style={{ border: "2px solid red" }}
                onClick={Draw}
                onContextMenu={cancelDrawing}
                onMouseMove={isDrawing ? restoreDraw : null}
                ref={large}
            />
            <button className='button' onClick={Lines}>collapse lines</button>
        </div>
    );
}

export default App;
