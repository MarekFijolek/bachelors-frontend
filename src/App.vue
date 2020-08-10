<template>
  <div id="app">
    <Nav @searched="onClickSearch" />
    <router-view :key="componentKey" />
  </div>
</template>

<script>
import Nav from './components/Nav'
export default {
  components: {
    Nav
  },
  data () {
    return {
      searchText: '',
      componentKey: 0
    }
  },
  methods: {
    onClickSearch (searchText) {
      this.$forceUpdate()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
