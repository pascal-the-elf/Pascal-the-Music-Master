import Vue from 'vue'
import Router from 'vue-router'
import start from '@/components/start'
import login from '@/components/login'
import register from '@/components/register'
import game from '@/components/game'
import test from '@/components/test'

Vue.use(Router)

let router = new Router({
    routes: [/*
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
            path: '/game',
            name: 'game',
            component: game
        },
        {
            path: '/*',
            redirect: '/game'
        }
    ]
});

router.afterEach((to, from) => {
    console.log(`[Router] Location changed: from ${from.name} to ${to.name}`);
    window.params = {};
    try { for (let [k, v] of window.location.href.split("?")[1].split("&").map(kv => kv.split("=").map(decodeURIComponent))) window.params[k] = v; } catch(e) {}
})

export default router
