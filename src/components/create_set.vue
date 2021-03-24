<template>
    <div class="create_set">
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
                    <h3>建立新題庫</h3>
                </div>
            </transition>
        </div>

        <div key="basic">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">題庫名稱</span>
                </div>
                <input
                    type="text"
                    class="form-control"
                    placeholder="題庫顯示名稱 (上限 64 字元)"
                    v-model="name"
                />
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">測驗限時(秒)</span>
                </div>
                <input
                    type="number"
                    class="form-control"
                    placeholder="測驗時間限制 (上限 180 秒)"
                    :value="settings.t"
                    @input="
                        settings.t =
                            $event.target.value <= 180
                                ? $event.target.value
                                : ($event.target.value = 180)
                    "
                />
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">測驗題數</span>
                </div>
                <input
                    type="number"
                    class="form-control"
                    placeholder="測驗隨機抽取題目數 (上限 20 題)"
                    :value="settings.q"
                    @input="
                        settings.q =
                            $event.target.value <= list.length
                                ? $event.target.value
                                : ($event.target.value = list.length)
                    "
                />
            </div>
        </div>
        <div key="list">
            <h3>
                歌曲列表<a
                    v-show="!list.length"
                    style="font-size: 16px; margin: 0 6px"
                    href="javascript:void(0)"
                    @click="import_from_playlist()"
                    >匯入播放列表</a
                >
            </h3>
            <div v-for="(item, index) in list" v-bind:key="index">
                <div class="list_item card mb-3">
                    <div class="card-body">
                        <button
                            type="button"
                            class="btn btn-outline-primary btn-sm mb-1"
                            @click="switch_show(index)"
                        >
                            切換顯示
                        </button>
                        <button
                            type="button"
                            class="btn btn-outline-danger btn-sm mb-1"
                            @click="remove_item(index)"
                        >
                            移除歌曲
                        </button>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text">名稱</span>
                            </div>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="作品顯示名稱 (上限 128 字元)"
                                v-model="list[index].name"
                            />
                        </div>
                        <div v-show="item.show">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"
                                        >Youtube ID</span
                                    >
                                </div>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="貼上 Youtube ID 或 Youtube 連結"
                                    :value="list[index].id"
                                    @change="parse_id(index, $event)"
                                />
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"
                                        >起始截切(秒)</span
                                    >
                                </div>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="音檔開始時間 (預設從頭開始)"
                                    :value="list[index].start"
                                    @change="
                                        list[index].start = parseInt(
                                            $event.target.value
                                        )
                                    "
                                />
                            </div>
                            <div v-show="sound_state[index]">
                                {{
                                    sound_state[index] == list[index].id
                                        ? ""
                                        : sound_state[index]
                                }}
                                <audio
                                    :ref="'sound_' + index"
                                    v-if="sound_state[index] == list[index].id"
                                    controls
                                ></audio>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button
                type="button"
                class="btn btn-primary btn-lg btn-block"
                @click="add_item()"
            >
                新增歌曲
            </button>
        </div>
        <br />
        <button
            ref="create"
            type="button"
            class="btn btn-outline-success btn-lg btn-block"
            @click="create()"
        >
            建立
        </button>
        <br />

        <div class="copyright">2021 © Pascal the Elf</div>
    </div>
</template>

<script>
export default {
    name: "create_set",
    data() {
        return {
            text_title: "Create New Set",
            list: [],
            sound_state: [],
            name: "",
            owner: "user",
            settings: {
                t: 60,
                q: 0,
            },
            result: null,
        };
    },
    methods: {
        add_item(id = "", name = "", start = 0) {
            this.list.push({
                id: id,
                name: name,
                start: start,
                show: true,
            });
            this.sound_state.push(id || 0);
            return this.list.length - 1;
        },
        remove_item(index) {
            this.list.splice(index, 1);
            this.sound_state.splice(index, 1);
        },
        switch_show(index) {
            this.list[index].show = !this.list[index].show;
            this.list.push();
        },
        parse_id(index, evt) {
            let id = evt.target.value;
            if (this.youtube_parser(id)) id = this.youtube_parser(id);
            this.list[index].id = id;
            if (id.length < 11) {
                this.sound_state[index] = 0;
                return;
            }
            this.auto_update_name(index);
            this.store_sound(index);
        },
        async auto_update_name(index) {
            let id = this.list[index].id;
            let vd = await fetch(`${api.server}/yt?id=${id}`).then((r) =>
                r.json()
            );
            if (!this.list[index].name) this.list[index].name = vd.title;
        },
        async store_sound(index) {
            let id = this.list[index].id;
            this.sound_state[index] = "查詢中...";
            let ok = await fetch(`${api.server}/store`, {
                method: "POST",
                body: JSON.stringify({ id: id }),
            }).then((r) => r.ok);
            if (!ok) {
                this.sound_state[index] = "發生錯誤";
                return;
            }
            this.sound_state[index] = id;
            this.sound_state.push();
            await this.sound_src(index);
        },
        async sound_src(index) {
            let id = this.list[index].id;
            let hash = Array.from(
                new Uint8Array(
                    await crypto.subtle.digest(
                        "SHA-256",
                        new TextEncoder().encode(id)
                    )
                )
            )
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            this.$refs[
                "sound_" + index
            ][0].src = `${api.server}/sound?src=${hash}`;
        },
        async create() {
            this.$refs.create.disabled = true;
            Array.from(document.querySelectorAll("audio")).forEach((elm) =>
                elm.pause()
            );
            let data = {};
            data.name = this.name;
            data.owner = this.owner;
            data.settings = this.settings;
            data.token = acm.token;
            data.list = this.list.map((obj) => {
                return { id: obj.id, name: obj.name, start: obj.start };
            });
            if (data.name.length < 3) {
                this.$swal.fire("發布失敗", "題庫名稱至少需要 3 個字", "error");
                this.$refs.create.disabled = false;
                return;
            }
            if (data.settings.t < 6) {
                this.$swal.fire("發布失敗", "時間最少需要 6 秒", "error");
                this.$refs.create.disabled = false;
                return;
            }
            if (data.list.length < 2) {
                this.$swal.fire("發布失敗", "列表最少需要兩首歌曲", "error");
                this.$refs.create.disabled = false;
                return;
            }
            this.result = await fetch(`${api.server}/set/create`, {
                method: "POST",
                body: JSON.stringify(data),
            }).then((r) => {
                return r.ok ? r.json() : null;
            });

            let v = this;
            if (this.result)
                this.$swal
                    .fire(
                        "發布成功",
                        location.origin + "/challenge/" + this.result.id,
                        "success"
                    )
                    .then(() => {
                        v.$router.replace("/challenge/" + v.result.id);
                    });
            else {
                this.$swal.fire("發布失敗", "不知道哪裡出錯了 QQ", "error");
                this.$refs.create.disabled = false;
            }
        },
        youtube_parser(url) {
            let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            let match = url.match(regExp);
            return match && match[7].length == 11 ? match[7] : false;
        },
        async import_from_playlist() {
            return await this.$swal
                .fire({
                    title: "匯入播放列表",
                    text: "使用連結從 Youtube 匯入播放列表",
                    input: "url",
                    inputPlaceholder: "https://www.youtube.com/playlist?list=...",
                    inputAttributes: {
                        autocapitalize: "off",
                    },
                    showCancelButton: true,
                    confirmButtonText: "匯入",
                    showLoaderOnConfirm: true,
                    preConfirm: (url) => {
                        return this.import_list(url).catch((error) => {
                            this.$swal.showValidationMessage(`匯入失敗`);
                        });
                    },
                    allowOutsideClick: () => !this.$swal.isLoading(),
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        this.$swal.fire("匯入成功", "", "success");
                    }
                });
        },
        async import_list(url) {
            let self = this;
            let x = await fetch(
                `${api.server}/yt_list?url=${encodeURIComponent(url)}`
            ).then((r) => r.json());

            if (x.success) {
                for (let i = 0; i < x.list.length; i++) {
                    let id = this.add_item(this.youtube_parser(x.list[i].id));
                    await this.auto_update_name(id);
                    await this.store_sound(id);
                }
            }
            return true;
        },
    },
    mounted: function () {
        document.title = this.title || this.text_title || document.title || "";
        if (!this.$store.state.user.login) this.$router.replace("auth");
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.create_set {
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
</style>
