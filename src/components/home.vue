<template>
    <div class="home">
        <div class="d-flex justify-content-center align-items-center flex-column banner">
            <div>
                <h1 style="text-align: center; text-shadow: 2px 2px 4px #00000033;">
                    <span style="font-size: 72px; font-weight: bold; letter-spacing: 4px; top: 5px;">Pascal</span>
                    <br />
                    <span style="font-size: 28px; font-weight: bold; letter-spacing: 0px; top: -5px;">the Music Master</span>
                </h1>
            </div>
        </div>
        <div class="d-flex justify-content-start align-items-center flex-column">
            <router-link to="me" class="d-block btn btn-outline-primary btn-lg mb-5 main-link"> 我的帳號 </router-link>
            <router-link to="list" class="d-block btn btn-outline-primary btn-lg mb-5 main-link"> 瀏覽題庫 </router-link>
            <router-link to="create" class="d-block btn btn-outline-primary btn-lg mb-5 main-link"> 建立題庫 </router-link>
        </div>
        <div class="copyright">2021 © Pascal the Elf</div>
    </div>
</template>

<script>
export default {
    name: "home",
    data() {
        return {
            text_title: "Pascal the Music Master",
        };
    },
    methods: {},
    mounted: function () {
        document.title = this.title || this.text_title || document.title || "";
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
    margin: 20px auto auto auto;
    min-height: 90vh;
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
.banner {
    height: 260px;
}
.main-link {
    box-shadow: 1px 1px 4px 2px #007bff33;
    transition: box-shadow .3s;
}
.main-link:hover {
    box-shadow: 1px 1px 6px 3px #007bff77;
}
</style>
