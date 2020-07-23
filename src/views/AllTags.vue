<template>
  <div id="alltags">
    <div v-if="$apollo.queries.versions.loading" class="lds-dual-ring"></div>
    <div v-else>
      <TagsViewer class="mt-5" :version="versions.edges[0].node.versionName"/>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import TagsViewer from '../components/TagsViewer'
export default {
  name: 'AllTags',
  apollo: {
    versions: {
      query: gql`
        query {
          versions: allVersions(first: 1, sort: CREATE_DATE_DESC) {
            edges {
              node {
                id
                versionName
              }
            }
          }
        }
      `
    }
  },
  components: {
    TagsViewer
  }
}
</script>

<style scoped>
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #cef;
  border-color: #cef transparent #cef transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
