<template>
    <div id="app" class="container">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: "App",
    mounted () {
        console.log(`[App] App Start`);
    }
}

if(!localStorage.game) localStorage.game = JSON.stringify({});
window.str = {
    list () {
        return JSON.parse(localStorage.game);
    },
    get (key) {
        let storage = JSON.parse(localStorage.game);
        return storage[key];
    },
    remove(key) {
        let storage = JSON.parse(localStorage.game);
        delete storage[key];
        localStorage.game = JSON.stringify(storage);
    },
    edit(key, value) {
        let storage = JSON.parse(localStorage.game);
        storage[key] = value;
        localStorage.game = JSON.stringify(storage);
    }
};
</script>

<style>
* {
    position: relative;
}

html, body {
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
    overflow: auto;
}

body {
    z-index: -100;
    background-color: #ffffff;
}
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
