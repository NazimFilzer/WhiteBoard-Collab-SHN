import React from "react";
import io from "socket.io-client";

import "./style.scss";

class Board extends React.Component {
  timeout;

  ctx;
  isDrawing = false;

  constructor(props) {
    super(props);

    this.props.socket.on("receive_canvas_data", function (data) {
      var root = this;
      var interval = setInterval(function () {
        if (root.isDrawing) return;
        root.isDrawing = true;
        clearInterval(interval);
        var image = new Image();
        var canvas = document.querySelector("#board");
        var ctx = canvas.getContext("2d");
        image.onload = function () {
          ctx.drawImage(image, 0, 0);

          root.isDrawing = false;
        };
        image.src = data;
      }, 200);
    });
  }

  componentDidMount() {
    this.drawOnCanvas();
  }

  componentWillReceiveProps(newProps) {
    this.ctx.strokeStyle = newProps.color;
    this.ctx.lineWidth = newProps.size;
  }

  drawOnCanvas() {
    var canvas = document.querySelector("#board");
    this.ctx = canvas.getContext("2d");
    var ctx = this.ctx;
    const image = document.getElementById("source");

    image.addEventListener("load", (e) => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      var base64ImageData = canvas.toDataURL("image/png");
      const canvasData = {
        room: root.props.room,
        canvas: base64ImageData,
      };
      root.props.socket.emit("send_canvas_data", canvasData);
    });

    var sketch = document.querySelector("#sketch");
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));

    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */
    canvas.addEventListener(
      "mousemove",
      function (e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;
        let rect = this.getBoundingClientRect();

        mouse.x = e.pageX - rect.left;
        mouse.y = e.pageY - rect.top;
      },
      false
    );

    /* Drawing on Paint App */
    ctx.lineWidth = this.props.size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = this.props.color;

    canvas.addEventListener(
      "mousedown",
      function (e) {
        canvas.addEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      function () {
        canvas.removeEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvas.addEventListener(
      "touchstart",
      function (e) {
        canvas.addEventListener("touchmove", handleTouchDraw, "false");
      },
      false
    );

    canvas.addEventListener(
      "touchend",
      function (e) {
        canvas.removeEventListener("touchmove", handleTouchDraw, "false");
      },
      false
    );

    canvas.addEventListener(
      "touchmove",
      function (e) {
        handleTouchDraw(e);
      },
      false
    );
    const handleTouchDraw = async function (e) {
      e.stopPropagation();
      e.preventDefault();
      let touch = e.touches[0];
      let mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      await canvas.dispatchEvent(mouseEvent);
      onPaint();
    };
    var root = this;
    var onPaint = function () {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();

      if (root.timeout !== undefined) clearTimeout(root.timeout);
      root.timeout = setTimeout(function () {
        var base64ImageData = canvas.toDataURL("image/png");
        const canvasData = {
          room: root.props.room,
          canvas: base64ImageData,
        };
        root.props.socket.emit("send_canvas_data", canvasData);
      }, 1);
    };
  }

  render() {
    return (
      <div class="sketch" id="sketch">
        <canvas
          className="board"
          id="board"
          style={{ backgroundColor: "transparent" }}
        >
          <img src={this.props.img} alt="" id="source" />
        </canvas>
      </div>
    );
  }
}

export default Board;
