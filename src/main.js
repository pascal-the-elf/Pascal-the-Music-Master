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
import firebase from "firebase/app";
import "firebase/auth";

/* setup firebase */
let firebase_config = {
    apiKey: "AIzaSyBCMrWo56YL5E6L-lIimQfxcVrf6SjkVw0",
    authDomain: "ptmm-auth.firebaseapp.com",
    projectId: "ptmm-auth",
    storageBucket: "ptmm-auth.appspot.com",
    messagingSenderId: "41744321150",
    appId: "1:41744321150:web:1837c5cbacf9089535e62f",
};
// Initialize Firebase
firebase.initializeApp(firebase_config);

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
const firebase_plugin = {
    install: function(Vue) {
        Vue.prototype.$firebase = firebase;
    },
};
Vue.use(firebase_plugin);

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
                commit("SET_USER", {
                    displayName: user.displayName,
                    email: user.email
                });
            } else {
                commit("SET_USER", null);
            }
        },
    },
});

/* setup Vue app */
new Vue({
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

firebase.auth().onAuthStateChanged((user) => {
    store.dispatch("user_state_changed", user);
});
