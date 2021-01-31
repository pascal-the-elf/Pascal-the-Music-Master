<template>
    <div class="game">
        <h2>Music Master</h2>
        <p> 可用時間： {{ timer / 1000 }} 秒 </p>
        <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center;">
            <div v-for="(item, index) in list"  :key="index">
                <div style="text-align: initial; margin: 18px 0;">
                    <h3> 第 {{ index + 1}} 題</h3>
                    <div style="display: flex; flex-direction: row; ">
                        <button @click="pp(index)" class="btn btn-outline-primary rounded-circle"> {{ button_text[index] }} </button>
                        <select class="form-control" @input="evt => selected[index] = evt.target.value" style="display: inline-block; width: calc(100% - 80px); margin: 0 8px;">
                            <option v-for="option in options" :value="option.id"> {{ option.name }} </option>
                        </select>
                    </div>
                    <br>
                </div>
            </div>
        </div>
        <b-button variant="primary" style="margin: 4px;" @click=""> 送出 </b-button>
        <br>

        <div class="copyright">2021 © Pascal the Elf</div>
        <div class="background"></div>
    </div>
</template>

<script>
export default {
    name: 'game',
    data () {
        return {
            text_title: 'Game',
            list: [],
            button_text: [],
            timer: 50 * 1000,
            selected: [],
            id: ""
        }
    },
    computed: {
        options () {
            let option = [{
                name: "選擇答案",
                id: ""
            }];
            let sorted = this.list.sort((a, b) => (a.name > b.name) ? 1 : -1).forEach(e => {option.push(e)});

            return option;
        }
    },
    methods: {
        async game_prepare () {
            this.id = "TEST01";
            console.log("[Preparation] Set ID", this.id);
            let set = await fetch(`https://music-master.pascaltheelf.workers.dev/set/global?id=${this.id}`).then(r => r.json());
            console.log("[Preparation] Set", set);
            this.list = set.list;
            this.shuffle(this.list);
            console.log("[Preparation] Suffled List", this.list);
            let sounds = [];
            this.list.forEach(item => { sounds.push(fetch(`https://yt_audio.pascaltheelf.workers.dev/${item.id}`).then(r=>r.blob())); });
            window.sounds = this.sounds = await Promise.all(sounds);
            console.log("[Preparation] Sounds", this.sounds);
            this.audio = [];
            this.sounds.forEach((item, i) => {
                let elm = document.createElement("audio");
                elm.src = URL.createObjectURL(item);
                elm.id = "sound_"+this.list[i].id;
                elm.addEventListener("play", this.if_playing);
                this.audio.push(elm);
            });
            console.log("[Preparation] Audio", this.audio);
            this.button_text = new Array(this.list.length);
            this.button_text.fill("播放");
            this.selected = new Array(this.list.length);
            this.selected.fill(0);
            this.timer = set.settings.t * 1000;
            this.loaded = true;
            this.$swal.fire("All Source Loaded");
        },
        pp (index) {
            if(this.timer <= 0) {
                this.$toast.fire("時間已用盡", "", "error");
                this.button_text[index] = "播放";
                this.button_text.push();
                return;
            }
            if(this.audio[index].paused) {
                this.audio[index].play();
                this.button_text[index] = "暫停";
            }
            else {
                this.audio[index].pause();
                this.button_text[index] = "播放";
            }
            this.button_text.push();
        },
        shuffle (array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        },
        async if_playing (e) {
            await wait(100);
            if(e.path[0].paused) return;
            this.timer -= 100;
            this.if_playing(e);
            if(this.timer <= 0) {
                e.path[0].pause();
                this.button_text[index] = "播放";
                this.button_text.push();
            }
        }
    },
    mounted: function() {
        document.title = this.title || this.text_title || document.title || "";
        this.game_prepare();
        window.wait = function(t=1000) { return new Promise(r => {setTimeout(()=>{r()},t)}) };
        window.V = this;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.game {
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
