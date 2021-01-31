<template>
    <div class="login">
        <h1>{{ text_title }}</h1>
        <hr>
        <br>
        <div class="container" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <b-row class="my-1 input-item">
                <label for="input-email">{{ text_email }}</label><br>
                <b-form-input id="input-email" v-model="form.email" type="email" :placeholder="text_email_placeholder" required></b-form-input>
            </b-row>
            <b-row class="my-1 input-item">
                <label for="input-password">{{ text_password }}</label><br>
                <b-form-input id="input-password" v-model="form.password" type="password" :placeholder="text_password_placeholder" required></b-form-input>
            </b-row>
            <div style="margin: 8px;">
                <router-link class="btn btn-outline-danger" to="./" style="margin: 4px;"> {{ text_back }} </router-link>
                <b-button variant="primary" style="margin: 4px;" @click="login()">{{ text_login }}</b-button>
            </div>
        </div>
        <div class="copyright">2021 © Pascal the Elf</div>
        <div class="background"></div>
    </div>
</template>

<script>
export default {
    name: 'login',
    data () {
        return {
            text_title: '登入你的帳號',
            text_back: '返回',
            text_login: '登入',
            text_email: '電子信箱',
            text_password: '密碼',
            text_email_placeholder: '輸入你的電子信箱',
            text_password_placeholder: '輸入你的密碼',
            text_login_success: '登入成功',
            text_login_failed: '登入失敗',
            form: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        async login () {
            let api = await fetch(`https://oatt-api.pascaltheelf.workers.dev/v1/account/login?email=${this.form.email}&password=${this.form.password}`).then(r => r.json());
            console.log(api.info.success, api.data);
            if(api.info.success) {
                this.account = api.data;
                this.$toast.fire({ title: this.text_login_success, icon: "success" });
                if(!this.account.verified) window.str.edit("verification_email", this.form.email);
                else window.str.remove("verification_email");
            }
            else {
                this.$toast.fire({ title: this.text_login_failed, icon: "error" });
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
.login {
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
