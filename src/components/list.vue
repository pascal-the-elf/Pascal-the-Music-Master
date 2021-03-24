<template>
    <div class="set_list">
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
                    v-if="true"
                    style="
                        position: absolute;
                        right: 0;
                        top: 0;
                        text-align: right;
                    "
                >
                    <h3>題庫列表</h3>
                </div>
            </transition>
        </div>

        <transition name="fade" mode="out-in">
            <div v-if="!result" key="loading">
                <h4>載入中...</h4>
            </div>
            <div v-if="result" key="result">
                <router-link
                    class="btn btn-outline-primary btn-lg btn-block mb-3"
                    to="create"
                >
                    建立新題庫
                </router-link>
                <h3>系統題庫</h3>
                <div v-for="(s, i) in result.g" :key="'g_' + i">
                    <router-link :to="'challenge/' + s.id" class="set_link">
                        <div
                            class="list_item card mb-3"
                            style="background-color: #ffffffdd"
                        >
                            <div class="card-body">
                                <h4>{{ s.name }}</h4>
                                <span>
                                    題庫共 {{ s.a }} 題 | 每測驗 {{ s.q }} 題
                                    作答時間 {{ s.t }} 秒 <br />
                                    於
                                    {{
                                        new Date(
                                            s.created_time
                                        ).toLocaleDateString()
                                    }}
                                    建立</span
                                >
                            </div>
                        </div>
                    </router-link>
                </div>
                <h3>使用者題庫</h3>
                <div v-for="(s, i) in result.u" :key="'u_' + i">
                    <router-link :to="'challenge/' + s.id" class="set_link">
                        <div
                            class="list_item card mb-3"
                            style="background-color: #ffffffdd"
                        >
                            <div class="card-body">
                                <h4>{{ s.name }}</h4>
                                <span>
                                    題庫共 {{ s.a }} 題 | 每測驗 {{ s.q }} 題
                                    作答時間 {{ s.t }} 秒 <br />
                                    於
                                    {{
                                        new Date(
                                            s.created_time
                                        ).toLocaleDateString()
                                    }}
                                    建立</span
                                >
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </transition>

        <br />

        <div class="copyright">2021 © Pascal the Elf</div>
    </div>
</template>

<script>
export default {
    name: "set_list",
    data() {
        return {
            text_title: "題庫列表",
            result: null,
        };
    },
    methods: {
        async load_sets() {
            let g_sets = fetch(
                `${api.server}/set/list?type=global`
            ).then((r) => r.json());
            let u_sets = fetch(
                `${api.server}/set/list?type=user`
            ).then((r) => r.json());
            let r = { g: [], u: [] };
            g_sets = await g_sets;
            u_sets = await u_sets;
            for (let key of Object.keys(g_sets)) {
                r.g.push(Object.assign({}, { id: key }, g_sets[key]));
            }
            for (let key of Object.keys(u_sets)) {
                r.u.push(Object.assign({}, { id: key }, u_sets[key]));
            }
            r.g.sort((a, b) => (a.created_time > b.created_time ? -1 : 1));
            r.u.sort((a, b) => (a.created_time > b.created_time ? -1 : 1));
            console.log(r);
            this.result = r;
        },
    },
    mounted: function () {
        document.title = this.title || this.text_title || document.title || "";
        this.load_sets();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.set_list {
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
.set_link {
    text-decoration: none;
    color: inherit;
}
</style>
