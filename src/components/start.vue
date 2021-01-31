<template>
    <div class="start">
        <h1>{{ text_title }}</h1>
        <h4>{{ text_subtitle }}</h4>
        <hr>
        <br>
        <h2>{{ text_start_game }}</h2>
        <br>
        <router-link class="btn btn-outline-primary" to="login"> {{ text_login }} </router-link>
        <div style="width: 100%; text-align: center; margin: 16px 0;">
            <span style="padding: 8px; z-index: 2;"> {{ text_or }} </span>
            <hr style="width: 16%; display: inline; position: absolute; top: -4px; left: 30%;">
            <hr style="width: 16%; display: inline; position: absolute; top: -4px; right: 30%;">
        </div>
        <router-link class="btn btn-outline-primary" to="register"> {{ text_register }} </router-link>
        <div class="copyright">2021 © Pascal the Elf</div>
        <div class="background"></div>
    </div>
</template>

<script>
export default {
    name: 'start',
    data () {
        return {
            text_title: '歡迎來到 海與旅行者',
            text_subtitle: '體驗新遊戲',
            text_start_game: '開始你的旅程',
            text_login: '登入',
            text_register: '註冊',
            text_or: '或'
        }
    },
    mounted: function() {
        document.title = this.title || this.text_title || document.title || "";
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.start {
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
h1, h2, h3, h4 {
    font-weight: normal;
}
</style>
