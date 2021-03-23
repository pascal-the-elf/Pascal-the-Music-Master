<template>
    <div class="challenge">
        <div class="top-bar" style="height: 80px">
            <div style="position: absolute; left: 0; top: 0">
                <router-link
                    to="/"
                    style="text-decoration: none; color: inherit"
                    ><h2>Music Master</h2></router-link
                >
            </div>
            <transition name="fade" mode="out-in">
                <div
                    v-if="state == 'play'"
                    style="
                        position: absolute;
                        right: 0;
                        top: 0;
                        text-align: right;
                    "
                    :key="state"
                >
                    <p>
                        {{ $store.state.challenge.name }} <br />
                        可用時間： {{ timer / 1000 }} 秒
                    </p>
                </div>
                <div
                    v-if="state == 'result'"
                    style="
                        position: absolute;
                        right: 0;
                        top: 0;
                        text-align: right;
                    "
                    :key="state"
                >
                    <p>
                        <a @click="share()" href="javascript:void(0)"> 分享 </a>
                    </p>
                </div>
            </transition>
        </div>

        <transition name="fade" mode="out-in">
            <div v-if="state == 'load'" key="load">
                <h3>{{ info.name || "..." }}</h3>
                <ul>
                    <li>
                        題數： {{ info.settings ? info.settings.q : "..." }} 題
                    </li>
                    <li>
                        時限： {{ info.settings ? info.settings.t : "..." }} 秒
                    </li>
                    <li>
                        題庫大小： {{ info.list ? info.list.length : "..." }} 題
                    </li>
                </ul>
                <b-button
                    variant="primary"
                    style="margin: 4px"
                    @click="preparation()"
                >
                    載入測驗
                </b-button>
                <ul class="list-group mt-2 mb-2">
                    <li
                        v-for="itm in info.list"
                        class="list-group-item p-2"
                        style="background-color: rgba(255, 255, 255, 0.3)"
                        :key="itm"
                    >
                        {{ itm }}
                    </li>
                </ul>
            </div>

            <div v-if="state == 'loading'" key="loading">
                <h3>請稍後，正在載入資源</h3>
                <transition name="fade" :duration="250" mode="out-in">
                    <h4 v-if="ld_state == '正在建立新測驗'" key="cnc">
                        {{ ld_state }}
                    </h4>
                    <h4 v-if="ld_state == '正在建立音源資料'" key="bss">
                        {{ ld_state }}
                        <small> {{ all_source_progress }} %</small>
                    </h4>
                    <h4 v-if="ld_state == '載入完成'" key="dn">
                        {{ ld_state }}
                    </h4>
                </transition>
            </div>

            <div v-if="state == 'preparing'" key="preparing">
                <h3>{{ $store.state.challenge.name }}</h3>
                <ul>
                    <li>
                        題數： {{ $store.state.challenge.questions.length }} 題
                    </li>
                    <li>時限： {{ $store.state.challenge.time }} 秒</li>
                    <li>
                        題庫大小：
                        {{ $store.state.challenge.options.length }} 題
                    </li>
                </ul>
                <b-button
                    variant="primary"
                    style="margin: 4px"
                    @click="start()"
                >
                    開始！
                </b-button>
            </div>

            <div
                v-if="state == 'play'"
                key="play"
                style="
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                "
            >
                <div
                    v-for="(item, index) in $store.state.challenge.questions"
                    :key="index"
                >
                    <div style="text-align: initial; margin: 18px 0">
                        <h3>第 {{ index + 1 }} 題</h3>
                        <div style="display: flex; flex-direction: row">
                            <button
                                @click="play_pause(index)"
                                class="btn btn-outline-primary rounded-circle"
                            >
                                {{ button_text[index] }}
                            </button>
                            <select
                                :ref="'select_' + index"
                                class="form-control q_select"
                                @input="
                                    (evt) =>
                                        (selected[index] = evt.target.value)
                                "
                                style="
                                    display: inline-block;
                                    width: calc(100% - 80px);
                                    margin: 0 8px;
                                "
                            >
                                <option
                                    v-for="option in options"
                                    :value="option"
                                    :key="option"
                                >
                                    {{ option }}
                                </option>
                            </select>
                        </div>
                        <br />
                    </div>
                </div>
                <b-button
                    ref="submit"
                    variant="primary"
                    style="margin: 4px"
                    @click="submit()"
                >
                    送出
                </b-button>
            </div>

            <div
                v-if="state == 'result'"
                key="result"
                style="
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                "
            >
                <h3 id="result" style="margin: -10px">結果</h3>
                <div id="score" style="font-size: 76px; font-weight: bolder">
                    {{ result.score }}
                </div>
                <div v-for="(item, index) in result.answers" :key="index">
                    <div
                        style="
                            width: 100%;
                            margin: 16px 0;
                            padding: 8px;
                            border-radius: 8px;
                        "
                        v-bind:class="{
                            correct: result.passed[index],
                            wrong: !result.passed[index],
                        }"
                    >
                        <h5>{{ item.name }}</h5>
                        <iframe
                            :src="'https://www.youtube.com/embed/' + item.id"
                            style="
                                border: 0;
                                border-radius: 5px;
                                width: 80vmin;
                                height: 45vmin;
                            "
                        >
                            youtube embed
                        </iframe>
                    </div>
                </div>
            </div>
        </transition>
        <br />

        <div class="copyright">2021 © Pascal the Elf</div>
    </div>
</template>

<script>
export default {
    name: "challenge",
    data() {
        return {
            text_title: "Challenge",
            button_text: [],
            selected: [],
            ld: false,
            state: "load",
            timer: 0,
            ld_state: "Loading",
            result: {},
            info: {},
            source_progress: null,
            all_source_progress: 0,
        };
    },
    computed: {
        options() {
            let option = ["選擇答案"];
            this.$store.state.challenge.options
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .forEach((e) => {
                    option.push(e);
                });
            return option;
        },
    },
    methods: {
        async load_info() {
            try {
                let id = this.$route.params.set_id || "TEST01";
                let info = await fetch(
                    `https://music-master.pascaltheelf.workers.dev/set/info?id=${id}`
                ).then((r) => r.json());
                this.info = info;
                console.log(info);
            } catch (e) {
                this.$swal
                    .fire("找不到題庫", "這個題庫不存在或消失了", "error")
                    .then(() => {
                        this.$router.replace("/");
                    });
            }
        },
        async preparation() {
            let self = this;
            this.state = "loading";
            this.$store.state.challenge = {};
            this.$store.state.challenge.set =
                this.$route.params.set_id || "TEST01";
            console.log(
                "[Preparation] Set ID",
                this.$store.state.challenge.set
            );
            this.ld_state = "正在建立新測驗";
            let source = await fetch(
                `https://music-master.pascaltheelf.workers.dev/create`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        player: this.$store.state.player,
                        set: this.$store.state.challenge.set,
                        token: acm.token || null,
                    }),
                }
            ).then((r) => r.json());
            console.log("[Preparation] Source", source);
            [
                "id",
                "name",
                "options",
                "questions",
                "time",
                "created",
                "splits",
            ].forEach((item) => {
                this.$store.state.challenge[item] = source[item];
            });

            let sounds = [];

            this.source_progress = new Array(
                this.$store.state.challenge.questions.length
            ).fill(0);

            this.$store.state.challenge.questions.forEach((item, index) => {
                sounds.push(
                    new Promise(async (resolve, reject) => {
                        let response = await fetch(
                            `https://music-master.pascaltheelf.workers.dev/sound.mp3?src=${item}`
                        );

                        let reader = response.body.getReader();

                        let content = +response.headers.get("Content-Length");

                        let received = 0;
                        let chunks = [];
                        while (true) {
                            const { done, value } = await reader.read();

                            if (done) break;

                            chunks.push(value);
                            received += value.length;

                            self.source_progress[index] = parseInt(
                                (received / content) * 100
                            );
                            self.all_source_progress = parseInt(
                                self.source_progress.reduce((a, b) => a + b) /
                                    self.source_progress.length
                            );
                        }
                        resolve(
                            new Blob(chunks, {
                                type: "audio/mpeg",
                            })
                        );
                    })
                );
            });

            this.ld_state = "正在建立音源資料";
            this.$store.state.challenge.sounds = (
                await Promise.all(sounds)
            ).map((item, i) => {
                let elm = document.createElement("audio");
                elm.src = URL.createObjectURL(item);
                elm.id = "sound_" + i;
                elm.currentTime = this.$store.state.challenge.splits[i];
                return elm;
            });
            console.log(
                "[Preparation] Sounds",
                this.$store.state.challenge.sounds
            );

            this.button_text = new Array(
                this.$store.state.challenge.questions.length
            );
            this.button_text.fill("播放");
            this.selected = new Array(
                this.$store.state.challenge.questions.length
            );
            this.selected.fill(0);
            this.timer = this.$store.state.challenge.time * 1000;
            this.ld_state = "載入完成";
            await wait(500);
            this.state = "preparing";
        },
        play_pause(index) {
            if (this.timer <= 0) {
                this.$toast.fire("時間已用盡", "", "error");
                this.button_text[index] = "播放";
                this.button_text.push();
                return;
            }
            if (this.$store.state.challenge.sounds[index].paused) {
                this.$store.state.challenge.sounds.forEach((item, i) => {
                    if (i == index) {
                        item.play();
                        this.button_text[index] = "暫停";
                    } else {
                        item.pause();
                        this.button_text[i] = "播放";
                    }
                });
            } else {
                this.$store.state.challenge.sounds[index].pause();
                this.button_text[index] = "播放";
            }
            this.button_text.push();
        },
        async go_timer() {
            await wait(100);
            this.timer -= 100;
            if (this.timer <= 0) {
                this.$store.state.challenge.sounds.forEach((e) => e.pause());
                Array.from(document.querySelectorAll(".q_select")).forEach(
                    (e) => (e.disabled = true)
                );
            } else this.go_timer();
        },
        start() {
            this.state = "play";
            this.go_timer();
        },
        async submit() {
            this.$refs.submit.disabled = true;
            this.$store.state.challenge.sounds.forEach((e) => e.pause());
            let data = {};
            data.player = this.$store.state.player;
            data.id = this.$store.state.challenge.id;
            data.answers = this.selected;
            data.finish = new Date().toJSON();
            this.result = await fetch(
                `https://music-master.pascaltheelf.workers.dev/check`,
                {
                    method: "POST",
                    body: JSON.stringify(data),
                }
            ).then((r) => r.json());

            this.state = "result";
            document
                .querySelector("#app")
                .scrollIntoView({ behavior: "smooth" });
        },
        async share() {
            try {
                let data = {
                    title: "Result | Pascal the Music Master",
                    text:
                        this.result.player +
                        "的測驗結果 @ " +
                        this.result.name +
                        " 題庫 | Pascal the Music Master",
                    url: location.origin + "/result/" + this.result.id,
                };

                await navigator.share(data);
            } catch (e) {
                this.$swal.fire({
                    title: "分享測驗結果",
                    input: "text",
                    inputValue: location.origin + "/result/" + this.result.id,
                });
            }
        },
    },
    mounted: function () {
        document.title = this.title || this.text_title || document.title || "";
        this.load_info();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.challenge {
    margin: 20px auto auto auto;
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
.correct {
    background-color: palegreen;
}
.wrong {
    background-color: palevioletred;
}
h1,
h2,
h3,
h4 {
    font-weight: normal;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
