<template>
  <nav class="flex items-center justify-between flex-wrap bg-black p-2">
    <div class="flex items-center flex-shrink-0 text-blue-100 mr-6">
      <svg
        class="fill-current h-8 w-8 mr-2"
        width="54"
        height="54"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.627,7.885C8.499,8.388,7.873,8.101,8.13,8.177L4.12,7.143c-0.218-0.057-0.351-0.28-0.293-0.498c0.057-0.218,0.279-0.351,0.497-0.294l4.011,1.037C8.552,7.444,8.685,7.667,8.627,7.885 M8.334,10.123L4.323,9.086C4.105,9.031,3.883,9.162,3.826,9.38C3.769,9.598,3.901,9.82,4.12,9.877l4.01,1.037c-0.262-0.062,0.373,0.192,0.497-0.294C8.685,10.401,8.552,10.18,8.334,10.123 M7.131,12.507L4.323,11.78c-0.218-0.057-0.44,0.076-0.497,0.295c-0.057,0.218,0.075,0.439,0.293,0.495l2.809,0.726c-0.265-0.062,0.37,0.193,0.495-0.293C7.48,12.784,7.35,12.562,7.131,12.507M18.159,3.677v10.701c0,0.186-0.126,0.348-0.306,0.393l-7.755,1.948c-0.07,0.016-0.134,0.016-0.204,0l-7.748-1.948c-0.179-0.045-0.306-0.207-0.306-0.393V3.677c0-0.267,0.249-0.461,0.509-0.396l7.646,1.921l7.654-1.921C17.91,3.216,18.159,3.41,18.159,3.677 M9.589,5.939L2.656,4.203v9.857l6.933,1.737V5.939z M17.344,4.203l-6.939,1.736v9.859l6.939-1.737V4.203z M16.168,6.645c-0.058-0.218-0.279-0.351-0.498-0.294l-4.011,1.037c-0.218,0.057-0.351,0.28-0.293,0.498c0.128,0.503,0.755,0.216,0.498,0.292l4.009-1.034C16.092,7.085,16.225,6.863,16.168,6.645 M16.168,9.38c-0.058-0.218-0.279-0.349-0.498-0.294l-4.011,1.036c-0.218,0.057-0.351,0.279-0.293,0.498c0.124,0.486,0.759,0.232,0.498,0.294l4.009-1.037C16.092,9.82,16.225,9.598,16.168,9.38 M14.963,12.385c-0.055-0.219-0.276-0.35-0.495-0.294l-2.809,0.726c-0.218,0.056-0.351,0.279-0.293,0.496c0.127,0.506,0.755,0.218,0.498,0.293l2.807-0.723C14.89,12.825,15.021,12.603,14.963,12.385"
        />
      </svg>
      <span class="font-semibold text-xl tracking-tight">TagCat</span>
    </div>
    <div class="block lg:hidden">
      <button
        @click="toggle"
        class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
      >
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
    <div
      :class="open ? 'block' : 'hidden'"
      class="w-full block flex-grow lg:flex lg:items-center lg:w-auto"
    >
      <div class="text-sm lg:flex-grow">
        <router-link
          to="/alltags"
          class="block mt-4 lg:inline-block cursor-pointer lg:mt-0 text-gray-400 hover:text-white lg:mr-4"
        >All tags</router-link>
        <router-link
          to="history"
          class="block mt-4 lg:inline-block cursor-pointer lg:mt-0 text-gray-400 hover:text-white lg:mr-4"
        >History</router-link>
        <router-link
          to="/compare"
          class="block mt-4 lg:inline-block cursor-pointer lg:mt-0 text-gray-400 hover:text-white"
        >Compare</router-link>
      </div>
      <div class="bg-white flex items-center rounded-full shadow-xl mt-4 lg:mt-0">
        <input
          v-model="searchText"
          class="rounded-l-full w-full py-2 lg:py-3 px-6 text-gray-900 leading-tight focus:outline-none"
          id="search"
          type="text"
          placeholder="Search"
        />

        <router-link :to="{ name: 'Search', params: { searchText: searchText } }" class="px-2 py-1 lg:py-0">
          <button
            class="bg-blue-500 text-white rounded-full hover:bg-blue-400 focus:outline-none w-8 h-8 flex items-center justify-center"
            @click="onClickSearchButton"
          >
            <svg
              class="text-white h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 56.966 56.966"
              style="enable-background:new 0 0 56.966 56.966;"
              xml:space="preserve"
              width="512px"
              height="512px"
            >
              <path
                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
              />
            </svg>
          </button>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data: function () {
    return {
      open: false,
      searchText: ''
    }
  },
  methods: {
    toggle () {
      this.open = !this.open
    },
    onClickSearchButton () {
      this.$emit('searched', this.searchText)
    }
  }
}
</script>

<style>
</style>
