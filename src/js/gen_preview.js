function gen_set_preview(set, debug = false) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    document.body.appendChild(canvas);
    canvas.style.display = "none";
    canvas.style.position = "fixed";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.zIndex = "-99999";

    if (debug) {
        canvas.style.display = "block";
        canvas.style.width = "80%";
        canvas.style.zIndex = "99999";
    }

    canvas.width = 1200;
    canvas.height = 630;

    ctx.fillStyle = "rgb(220,229,255)";
    ctx.fillRect(0, 0, 1200, 630);

    ctx.font = "82px Arial";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#2c3e50";
    ctx.fillText(set.name, 80, 240, 1100);

    ctx.font = "46px Arial";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#2c3e50";
    ctx.fillText(`題庫共 ${set.size} 題 | 每測驗 ${set.q} 題 | 作答時間 ${set.t} 秒 `, 80, 320, 1100);

    ctx.font = "46px Arial";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#2c3e50";
    ctx.fillText(`由 ${set.owner} 於 ${set.created_time} 建立`, 80, 400, 1100);

    return canvas;
}

export { gen_set_preview };
