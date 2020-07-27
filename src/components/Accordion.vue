<template>
  <div class>
    <div class="tab__header hover:bg-gray-100 border-blue-300 border rounded-lg">
      <a
        href="#"
        class="tab__link no-underline text-black border-b-2 border-white"
        @click.prevent="active = !active"
      >
        <!-- Title and change status (optional) -->
        <div class="flex block p-4 pt-2 pb-1 justify-between">
          <p
            class="font-medium"
            :class="changeStatus === 'changed' ? 'text-orange-500' : (changeStatus === 'added' ? 'text-green-500' : (changeStatus === 'removed' ? 'text-red-500' : 'text-gray-500'))"
          >{{title}}</p>
          <span class="down-Arrow" v-show="!active">&#9660;</span>
          <span class="up-Arrow" v-show="active">&#9650;</span>
        </div>

        <!-- counter for tags -->
        <div class="pb-2 pl-4 text-left" v-if="occurrencesCount && fileCount">
          <b class="text-blue-700">{{occurrencesCount}}</b> occurence<b v-if="occurrencesCount > 1" class="font-normal inline">s</b>
          /
          <b class="text-green-700">{{fileCount}}</b> files
        </div>

        <!-- counter for number of files -->
        <div class="pb-2 pl-4 text-left" v-if="excerptsCount">
          <b class="text-red-800">{{excerptsCount}}</b> excerpt<b v-if="excerptsCount > 1" class="font-normal inline">s</b>
        </div>
      </a>
    </div>
    <div class="tab__content p-2" v-show="active">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String },
    occurrencesCount: { type: Number },
    fileCount: { type: Number },
    excerptsCount: { type: Number },
    changeStatus: { type: String, default: null }
  },
  name: 'Accordion',
  data () {
    return {
      active: false
    }
  }
}
</script>

<style>
</style>
