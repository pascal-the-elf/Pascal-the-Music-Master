/* css libraries */
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "sweetalert2/dist/sweetalert2.css";

/* js libraries */
import Vue from "vue";
import Vuex from "vuex";
import App from "./App";
import router from "./router";
import swal from "sweetalert2";
import BootstrapVue from "bootstrap-vue";
import ClipboardJS from "clipboard";
import { gen_set_preview } from "./js/gen_preview";

/* setup Vue plugins */
Vue.use(Vuex);
Vue.use(BootstrapVue);
const swalPlugin = {
    install: function(Vue) {
        Vue.prototype.$swal = swal;
        Vue.prototype.$toast = swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", swal.stopTimer);
                toast.addEventListener("mouseleave", swal.resumeTimer);
            },
        });
    },
};
Vue.use(swalPlugin);

/* set Vue config */
Vue.config.productionTip = false;

/* setup Vuex store */
const store = new Vuex.Store({
    state: {
        playing: false,
        challenge: null,
        account: null,
        player: "player",
        user: {
            login: false,
            data: null,
        },
    },
    getters: {
        user(state) {
            return state.user;
        },
    },
    mutations: {
        play_start(state) {
            state.playing = true;
        },
        play_stop(state) {
            state.playing = false;
        },
        SET_LOGIN(state, value) {
            state.user.login = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
        },
    },
    actions: {
        change_playing(s) {
            if (this.$store.state.playing === s) return false;
            this.$store.commit(s ? "play_start" : "play_stop");
            return true;
        },
        user_state_changed({ commit }, user) {
            commit("SET_LOGIN", user !== null);
            if (user) {
                commit("SET_USER", user);
            } else {
                commit("SET_USER", null);
            }
        },
    },
});

/* setup Vue app */
let app = new Vue({
    el: "#app",
    store: store,
    router: router,
    components: { App },
    template: "<App/>",
    watch: {},
    metaInfo: {
        title: "Pascal the Music Master",
    },
});

window.acm = new (function() {
    const self = this;
    check_ls();
    sync_to_store();

    self.set = function(obj) {
        self.account = obj.account || null;
        self.token = obj.token || null;
        self.expired = obj.expired || null;
        save({
            version: 20210401,
            account: self.account,
            token: self.token,
            expired: self.expired,
        });
        sync_to_store();
    };

    function check_ls() {
        if (!localStorage.acm) {
            save({
                version: 20210401,
                account: null,
                token: null,
                expired: 0,
            });
        }
        self.version = read().version;
        self.account = read().account;
        self.token = read().token;
        self.expired = read().expired || 0;
        if (self.expired < Date.now()) {
            localStorage.acm = "";
            self.version = 20210401;
            self.account = null;
            self.token = null;
            self.expired = 0;
        }
    }

    function save(obj) {
        localStorage.acm = btoa(JSON.stringify(obj));
    }

    function read() {
        return JSON.parse(atob(localStorage.acm));
    }
    function sync_to_store() {
        app.$store.dispatch("user_state_changed", self.account);
    }
})();

window.ClipboardJS = ClipboardJS;

Vue.prototype.api = window.api = {
    server: `https://music-master.pascaltheelf.workers.dev`,
};

window.gen_set_preview = gen_set_preview;
