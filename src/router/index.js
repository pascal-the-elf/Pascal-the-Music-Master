import Vue from "vue";
import Router from "vue-router";
// import start from '@/components/start'
// import login from '@/components/login'
// import register from '@/components/register'
const challenge = () => import("@/components/challenge");
const create_set = () => import("@/components/create_set");
const set_list = () => import("@/components/list");
const auth = () => import("@/components/auth");
// import test from '@/components/test'

Vue.use(Router);

let router = new Router({
    mode: "history",
    routes: [
        /*
        {
            path: '/',
            name: 'start',
            component: start
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/register',
            name: 'register',
            component: register
        },
        {
            path: '/test',
            name: 'test',
            component: test
        }, */
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
            path: "/challenge/",
            redirect: "/challenge/TEST01",
        },
        {
            path: "/challenge/:set_id",
            name: "challenge",
            component: challenge,
        },
        {
            path: "/*",
            redirect: "/list",
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
