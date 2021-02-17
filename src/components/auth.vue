<template>
    <div class="auth">
        <div class="top-bar" style="height: 80px;">
            <div style="position: absolute; left: 0; top: 0;">
                <router-link to="/" style="text-decoration: none; color: inherit;"><h2>Music Master</h2></router-link>
            </div>
            <transition name="fade" mode="out-in">
                <div v-if="true" style="position: absolute; right: 0; top: 0; text-align: right;">
                    <h3>Auth</h3>
                </div>
            </transition>
        </div>

        <div>

        </div>

        <br>

        <div class="copyright">2021 © Pascal the Elf</div>
    </div>
</template>

<script>
export default {
    name: 'auth',
    data () {
        return {
            text_title: '帳號'
        }
    },
    methods: {
        async register () {
            let api = await fetch(`https://oatt-api.pascaltheelf.workers.dev/v1/account/register?name=${this.form.name}&email=${this.form.email}&password=${this.form.password}&password_cfm=${this.form.password_cfm}`).then(r => r.json());
            console.log(api.info.success, api.data);
            if(api.info.success) {
                this.created = api.data;
                this.$toast.fire({ title: this.text_register_success, icon: "success" });
                window.str.edit("verification_email", this.form.email);
            }
            else {
                this.$toast.fire({ title: this.text_register_failed, icon: "error" });
            }
        }
    },
    mounted: function() {
        document.title = this.title || this.text_title || document.title || "";
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auth {
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
.input-item {
    width: min(100%, 400px);
}
h1, h2, h3, h4 {
    font-weight: normal;
}
</style>
