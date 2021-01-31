import Vue from 'vue'
import vSelect from 'vue-select'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'sweetalert2/dist/sweetalert2.css'
import 'vue-select/dist/vue-select.css'

Vue.component('v-select', vSelect)

Vue.use(BootstrapVue)

const swalPlugin = {}
swalPlugin.install = function(Vue) {
    Vue.prototype.$swal = swal;
    Vue.prototype.$toast = swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', swal.stopTimer)
            toast.addEventListener('mouseleave', swal.resumeTimer)
        }
    })
}
Vue.use(swalPlugin)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    watch: {}
})
