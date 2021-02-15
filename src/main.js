/* import js libraries */
// import "core-js/modules/es.promise"
// import "core-js/modules/es.array.iterator"
import Vue from "vue"
import Vuex from "vuex"
// import vSelect from "vue-select"
import App from "./App"
import router from "./router"

/* import css libraries */
import BootstrapVue from "bootstrap-vue"
import swal from "sweetalert2"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "sweetalert2/dist/sweetalert2.css"
// import "vue-select/dist/vue-select.css"
// import "animate.css"

/* setup Vue plugins */
// Vue.component("v-select", vSelect)

Vue.use(Vuex)
Vue.use(BootstrapVue)
const swalPlugin = {}
swalPlugin.install = function(Vue) {
    Vue.prototype.$swal = swal;
    Vue.prototype.$toast = swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", swal.stopTimer)
            toast.addEventListener("mouseleave", swal.resumeTimer)
        }
    })
}
Vue.use(swalPlugin)

/* set Vue config */
Vue.config.productionTip = false

/* setup Vuex store */
const store = new Vuex.Store({
    state: {
        playing: false,
        challenge: null,
        account: null,
        player: "player"
    },
    mutations: {
        play_start (state) {
            state.playing = true
        },
        play_stop (state) {
            state.playing = false
        }
    },
    actions: {
        change_playing(s) {
            if(this.$store.state.playing === s) return false
            this.$store.commit(s ? "play_start" : "play_stop")
            return true
        }
    }
})

/* setup Vue app */
new Vue({
    el: "#app",
    store: store,
    router: router,
    components: { App },
    template: "<App/>",
    watch: {},
    metaInfo: {
      title: "Pascal the Music Master"
    }
})
