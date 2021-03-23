import Vue from "vue";
import Router from "vue-router";
const home = () => import("@/components/home");
const challenge = () => import("@/components/challenge");
const result = () => import("@/components/result");
const create_set = () => import("@/components/create_set");
const edit_set = () => import("@/components/edit_set");
const set_list = () => import("@/components/list");
const auth = () => import("@/components/auth");
const me = () => import("@/components/me");

Vue.use(Router);

let router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "home",
            component: home,
        },
        {
            path: "/list",
            name: "set_list",
            component: set_list,
        },
        {
            path: "/auth",
            name: "auth",
            component: auth,
        },
        {
            path: "/create",
            name: "create_set",
            component: create_set,
        },
        {
            path: "/edit/:id",
            name: "edit_set",
            component: edit_set,
        },
        {
            path: "/challenge/",
            redirect: "/challenge/TEST01",
        },
        {
            path: "/challenge/:set_id",
            name: "challenge",
            component: challenge,
        },
        {
            path: "/result/:id",
            name: "result",
            component: result,
        },
        {
            path: "/me",
            name: "me",
            component: me,
        },
        {
            path: "/*",
            redirect: "/",
        },
    ],
});

router.afterEach((to, from) => {
    console.log(`[Router] Location changed: from ${from.name} to ${to.name}`);
    window.params = {};
    try {
        for (let [k, v] of window.location.href
            .split("?")[1]
            .split("&")
            .map((kv) => kv.split("=").map(decodeURIComponent)))
            window.params[k] = v;
    } catch (e) {}
});

export default router;
