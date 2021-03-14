<template>
    <div class="result">
        <div class="top-bar" style="height: 80px">
            <div style="position: absolute; left: 0; top: 0">
                <router-link
                    to="/"
                    style="text-decoration: none; color: inherit"
                    ><h2>Music Master</h2></router-link
                >
            </div>
        </div>

        <transition name="fade" mode="out-in">
            <div
                v-if="result"
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
                <div style="text-align: left; width: 90%; max-width: 600px">
                    <router-link :to="'/challenge/' + result.set">
                        {{ result.name }}
                    </router-link>
                    <br />
                    {{ result.player }} @
                    {{ new Date(result.created).toLocaleDateString() }}
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
    name: "result",
    data() {
        return {
            text_title: "Result",
            result: null,
        };
    },
    methods: {
        async load_result() {
            try {
                let id = this.$route.params.id;
                this.result = await fetch(
                    `https://music-master.pascaltheelf.workers.dev/result?id=${id}`
                ).then((r) => r.json());
                document
                    .querySelector("#app")
                    .scrollIntoView({ behavior: "smooth" });
            } catch (e) {
                this.$swal
                    .fire("找不到測驗", "這個測驗不存在或消失了", "error")
                    .then(() => {
                        this.$router.replace("/");
                    });
            }
        },
    },
    mounted: function () {
        document.title = this.title || this.text_title || document.title || "";
        this.load_result();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.result {
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
