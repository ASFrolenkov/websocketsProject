import Tool from "./Tool";

export default class Brush extends Tool {
    // eslint-disable-next-line no-useless-constructor
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.send(this.finish())
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    strokeColor: this.ctx.strokeStyle,
                    line: this.ctx.lineWidth
                }
            }))
        }
    }

    static staticDraw(ctx, {x, y, strokeColor, line}) {
        ctx.lineWidth = line
        ctx.strokeStyle = strokeColor;
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}