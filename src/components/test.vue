<template>
    <div class="test">


        <div class="copyright">2021 © Pascal the Elf</div>
        <div class="background"></div>
        <div class="transition" @click="change()">
            <canvas></canvas>
        </div>
    </div>
</template>

<script>
export default {
    name: 'test',
    data () {
        return {
            text_title: '歡迎來到 海與旅行者',
            transition_state: 0,
            loading: {
                canvas: {
                    elm: '',
                    context: ''
                }
            }
        }
    },
    mounted: function() {
        document.title = this.title || this.text_title || document.title || "";
    },
    methods: {
        change () {
            if(this.transition_state) this.draw_transition_in();
            else this.draw_transition_out();
        },
        async draw_transition_out () {
            console.log("[Transition] Start");
            this.loading.canvas.elm ? 1 : this.loading.canvas.elm = document.querySelector(".transition > canvas");
            this.loading.canvas.context ? 1 : this.loading.canvas.context = document.querySelector(".transition > canvas").getContext("2d");
            let width = parseInt(getComputedStyle(this.loading.canvas.elm).width), height = parseInt(getComputedStyle(this.loading.canvas.elm).height);
            this.loading.canvas.elm.width = width, this.loading.canvas.elm.height = height;
            let l = Math.min(width, height) / 20;
            let rects = [], sorted = [];
            for(let i = 0; i < Math.floor( width / l + 2); i++) {
                for (let j = 0; j < Math.floor( height / l + 2); j++) {
                    rects.push({
                        y: l * (j + 0.5),
                        x: l * (i + 0.5)
                    });
                }
            }
            rects.sort((a,b) => { return (a.x + a.y) - (b.x + b.y); }).forEach(p => {
                if(!sorted.length || sorted[sorted.length-1][sorted[sorted.length-1].length-1].x + sorted[sorted.length-1][sorted[sorted.length-1].length-1].y < p.x + p.y) {
                    sorted.push([p]);
                }
                else sorted[sorted.length-1].push(p);
            });
            for(let i = 0; i < sorted.length; i++) {
                for(let j = 0; j < sorted[i].length; j++) {
                    this.draw_rect(this.loading.canvas.context, sorted[i][j].x, sorted[i][j].y, l);
                }
                await this.wait(25);
            }
            console.log("[Transition] Done");
            this.transition_state = 1;
        },
        async draw_transition_in () {
            console.log("[Transition] Start");
            this.loading.canvas.elm ? 1 : this.loading.canvas.elm = document.querySelector(".transition > canvas");
            this.loading.canvas.context ? 1 : this.loading.canvas.context = document.querySelector(".transition > canvas").getContext("2d");
            let width = parseInt(getComputedStyle(this.loading.canvas.elm).width), height = parseInt(getComputedStyle(this.loading.canvas.elm).height);
            this.loading.canvas.elm.width = width, this.loading.canvas.elm.height = height;
            let l = Math.min(width, height) / 20;
            let rects = [], sorted = [];
            for(let i = 0; i < Math.floor( width / l + 2); i++) {
                for (let j = 0; j < Math.floor( height / l + 2); j++) {
                    rects.push({
                        y: l * (j + 0.5),
                        x: l * (i + 0.5)
                    });
                }
            }
            rects.sort((a,b) => { return (a.x + a.y) - (b.x + b.y); }).forEach(p => {
                if(!sorted.length || sorted[sorted.length-1][sorted[sorted.length-1].length-1].x + sorted[sorted.length-1][sorted[sorted.length-1].length-1].y < p.x + p.y) {
                    sorted.push([p]);
                }
                else sorted[sorted.length-1].push(p);
            });
            for(let i = 0; i < sorted.length; i++) {
                for(let j = 0; j < sorted[i].length; j++) {
                    this.erase_rect(this.loading.canvas.context, sorted[i][j].x, sorted[i][j].y, l);
                }
                await this.wait(25);
            }
            console.log("[Transition] Done");
            this.transition_state = 0;
        },
        async draw_rect (ctx, x, y, l) {
            for(let i = 0; i <= 8; i++) {
                ctx.fillStyle = `rgba(${55 + Math.random()*20}, ${95 + Math.random()*20}, ${215 + Math.random()*20}, ${0.5 + i/4})`;
                // ctx.rotate(Math.PI / 180 * (i * 360 / 8));
                ctx.fillRect(x - l * 0.0625 * i, y - l * 0.0625 * i, 0.125 * i * l + 1, 0.125 * i * l + 1);
                await this.wait(30);
            }
        },
        async erase_rect (ctx, x, y, l) {
            for(let i = 8; i >= 0; i--) {
                ctx.clearRect(x - l * 0.5, y - l * 0.5 * i, l + 1, l + 1);
                // ctx.rotate(Math.PI / 180 * (i * 360 / 8));
                ctx.fillStyle = `rgba(${55 + Math.random()*20}, ${95 + Math.random()*20}, ${215 + Math.random()*20}, ${0.5 + i/4})`;
                ctx.fillRect(x - l * 0.0625 * i, y - l * 0.0625 * i, 0.125 * i * l, 0.125 * i * l);
                await this.wait(30);
            }
            ctx.clearRect(x - l * 0.5, y - l * 0.5, l + 1, l + 1);
        },
        wait (t=1000) {
            return new Promise((resolve, reject) => {setTimeout(()=>{resolve(t)}, t)});
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.test {
    min-height: 90vh;
}
.background {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(65, 105, 225, 0.15);
}
.transition {
    z-index: 99999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0);
}
.transition > canvas {
    width: 100%;
    height: 100%;
}
.copyright {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 10px;
}
h1, h2, h3, h4 {
    font-weight: normal;
}
</style>
