<template>
  <div id="alltags">
    <div v-if="$apollo.queries.versions.loading" class="lds-dual-ring"></div>
    <div v-else>
      <p class="lg:text-xl mt-4">Choose a tag from the list below:</p>
      <strong class="relative inline-flex mr-3 text-sm">Version:</strong>
      <div class="relative inline-flex my-6">
        <svg
          class="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 412 232"
        >
          <path
            d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
            fill="#648299"
            fill-rule="nonzero"
          />
        </svg>
        <select
          v-model="version"
          name="version"
          class="border border-gray-600 rounded-full text-gray-900 h-10 pl-5 pr-10 bg-white hover:border-gray-800 focus:outline-none appearance-none"
        >
          <option value>Select version of data</option>
          <optgroup>
            <option
              v-for="versionEdge in versions.edges"
              :key="versionEdge.node.id"
              :value="versionEdge.node.versionName"
            >{{ versionEdge.node.versionName }}</option>
          </optgroup>
        </select>
      </div>
    </div>
    <div v-if="version !== ''">
      <TagsViewer :version="version"/>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import TagsViewer from '../components/TagsViewer'
export default {
  name: 'AllTags',
  apollo: {
    tags: {
      query: gql`
        query($version: String!) {
          tags: allVersions(filters: { versionName: $version }) {
            edges {
              node {
                id
                tags {
                  edges {
                    node {
                      id
                      tagName
                      occurrencesCount
                      mentions {
                        edges {
                          node {
                            id
                            fileName
                            occurrencesInFileCount
                            excerpts {
                              edges {
                                node {
                                  id
                                  text
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables () {
        return {
          version: this.version
        }
      }
    },
    versions: {
      query: gql`
        query {
          versions: allVersions(sort: CREATE_DATE_DESC) {
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
  data: function () {
    return {
      version: '',
      asciidoctor: require('asciidoctor')()
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
