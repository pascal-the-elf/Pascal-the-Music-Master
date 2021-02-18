<template>
  <div id="app" class="container">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <div class="background"></div>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    console.log(`[App] App Start`);
    window.V = this;
  },
};

if (!localStorage.challenge) localStorage.challenge = JSON.stringify({});
window.str = {
  list() {
    return JSON.parse(localStorage.challenge);
  },
  get(key) {
    let storage = JSON.parse(localStorage.challenge);
    return storage[key];
  },
  remove(key) {
    let storage = JSON.parse(localStorage.challenge);
    delete storage[key];
    localStorage.challenge = JSON.stringify(storage);
  },
  edit(key, value) {
    let storage = JSON.parse(localStorage.challenge);
    storage[key] = value;
    localStorage.challenge = JSON.stringify(storage);
  },
};
window.wait = function (t = 1000) {
  return new Promise((r) => {
    setTimeout(() => {
      r();
    }, t);
  });
};
</script>

<style>
* {
  position: relative;
}

html,
body {
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
  color: #2c3e50;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
