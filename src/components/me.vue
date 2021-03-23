<template>
    <div class="me">
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
                    v-if="$store.state.user.login"
                    style="
                        position: absolute;
                        right: 0;
                        top: 0;
                        text-align: right;
                    "
                >
                    <h3>Me</h3>
                </div>
            </transition>
        </div>
        <div style="width: 100%">
            <transition name="fade" mode="out-in">
                <div v-if="$store.state.user.login">
                    <h1>{{ $store.state.user.data.name }}</h1>

                    <a class="btn btn-outline-primary" @click="logout()"
                        >登出</a
                    >
                </div>
            </transition>
        </div>
        <div class="copyright">2021 © Pascal the Elf</div>
    </div>
</template>

<script>
export default {
    name: "me",
    data() {
        return {
            text_title: "",
        };
    },
    methods: {
        logout() {
            acm.set({});
            if (!this.$store.state.user.login) this.$router.replace("auth");
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
.me {
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
</style>
