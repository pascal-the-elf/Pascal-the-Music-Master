<template>
    <div class="auth">
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
                    <h3>帳號</h3>
                </div>
            </transition>
        </div>
        <div>
            <b-tabs
                content-class="mt-2"
                align="center"
                nav-class="border-bottom-0"
                active-nav-item-class="bg-transparent text-primary border-top-0 border-left-0 border-right-0 border-primary"
            >
                <b-tab title="登入" style="border-bottom-width: 2px" active>
                    <div
                        class="container"
                        style="
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <b-row class="my-1 input-item">
                            <label for="login_input_email">電子信箱</label
                            ><br />
                            <b-form-input
                                id="login_input_email"
                                v-model="login_form.email"
                                type="email"
                                placeholder="請輸入電子信箱"
                                required
                            ></b-form-input>
                        </b-row>
                        <b-row class="my-1 input-item">
                            <label for="login_input_password">密碼</label><br />
                            <b-form-input
                                id="login_input_password"
                                v-model="login_form.password"
                                type="password"
                                placeholder="請輸入密碼"
                                required
                            ></b-form-input>
                        </b-row>
                        <div style="margin: 8px">
                            <b-button
                                id="login_btn"
                                variant="primary"
                                style="margin: 4px"
                                @click="login()"
                                >登入</b-button
                            >
                        </div>
                    </div>
                </b-tab>
                <b-tab title="註冊" style="border-bottom-width: 2px">
                    <div
                        class="container"
                        style="
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <b-row class="my-1 input-item">
                            <label for="register_input_name">用戶名稱</label
                            ><br />
                            <b-form-input
                                id="register_input_name"
                                v-model="register_form.name"
                                type="text"
                                placeholder="請輸入用戶名稱"
                                required
                            ></b-form-input>
                        </b-row>
                        <b-row class="my-1 input-item">
                            <label for="register_input_email">電子信箱</label
                            ><br />
                            <b-form-input
                                id="register_input_email"
                                v-model="register_form.email"
                                type="email"
                                placeholder="請輸入電子信箱"
                                required
                            ></b-form-input>
                        </b-row>
                        <b-row class="my-1 input-item">
                            <label for="register_input_password">密碼</label
                            ><br />
                            <b-form-input
                                id="register_input_password"
                                v-model="register_form.password"
                                type="password"
                                placeholder="請輸入密碼"
                                required
                            ></b-form-input>
                        </b-row>
                        <b-row class="my-1 input-item">
                            <label for="register_input_password_cfm"
                                >再次確認密碼</label
                            ><br />
                            <b-form-input
                                id="register_input_password_cfm"
                                v-model="register_form.password_cfm"
                                type="password"
                                placeholder="請再次輸入密碼"
                                required
                            ></b-form-input>
                        </b-row>
                        <div style="margin: 8px">
                            <b-button
                                id="register_btn"
                                variant="primary"
                                style="margin: 4px"
                                @click="register()"
                                >註冊</b-button
                            >
                        </div>
                    </div>
                </b-tab>
            </b-tabs>
        </div>

        <br />

        <div class="copyright">2021 © Pascal the Elf</div>
    </div>
</template>

<script>
export default {
    name: "auth",
    data() {
        return {
            text_title: "帳號",
            login_form: {
                email: "",
                password: "",
            },
            register_form: {
                name: "",
                email: "",
                password: "",
                password_cfm: "",
            },
        };
    },
    methods: {
        async login() {
            document.querySelector("#login_btn").disabled = true;
            this.$firebase
                .auth()
                .signInWithEmailAndPassword(
                    this.login_form.email,
                    this.login_form.password
                )
                .then((data) => {
                    this.$router.replace("dash");
                })
                .catch((err) => {
                    this.$toast.fire({ title: err.message, icon: "error" });
                    document.querySelector("#login_btn").disabled = false;
                });
        },
        async register() {
            document.querySelector("#register_btn").disabled = true;
            if (this.register_form.name.length < 2) {
                this.$toast.fire({
                    title: "Username not accepted",
                    icon: "error",
                });
                document.querySelector("#register_btn").disabled = false;
                return;
            }

            if (
                this.register_form.password != this.register_form.password_cfm
            ) {
                this.$toast.fire({
                    title: "Passwords do not match",
                    icon: "error",
                });
                document.querySelector("#register_btn").disabled = false;
                return;
            }
            this.$firebase
                .auth()
                .createUserWithEmailAndPassword(
                    this.register_form.email,
                    this.register_form.password
                )
                .then((data) => {
                    fetch(
                        `https://music-master.pascaltheelf.workers.dev/account/edit`,
                        {
                            method: "POST",
                            body: JSON.stringify({
                                auth: {
                                    email: this.register_form.email,
                                    password: this.register_form.password,
                                },
                                data: {
                                    private: {
                                        email: this.register_form.email,
                                    },
                                    public: {
                                        name: this.register_form.name,
                                    },
                                },
                            }),
                        }
                    )
                        .then((r) => r.json())
                        .then((o) => {
                            if (o.success) {
                                this.$toast.fire({
                                    title: "帳號已建立",
                                    icon: "success",
                                });
                            } else
                                this.$toast.fire({
                                    title: "ERROR",
                                    icon: "error",
                                });
                                document.querySelector("#register_btn").disabled = false;
                        })
                        .catch((err) => {
                            this.$toast.fire({
                                title: err.message,
                                icon: "error",
                            });
                            document.querySelector("#register_btn").disabled = false;
                        });
                })
                .catch((err) => {
                    this.$toast.fire({ title: err.message, icon: "error" });
                    document.querySelector("#register_btn").disabled = false;
                });
        },
    },
    mounted: function () {
        document.title = this.title || this.text_title || document.title || "";
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auth {
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
.input-item {
    width: min(100%, 400px);
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
