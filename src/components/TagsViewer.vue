<template>
  <div id="alltags">
      <div v-if="$apollo.queries.tags.loading" class="lds-dual-ring"></div>
      <div v-else>
        <div class="container mx-auto">
          <accordion
            class="mb-1"
            v-for="tagEdge in tags.edges[0].node.tags.edges"
            :key="tagEdge.node.id"
            :title="tagEdge.node.tagName"
            :occurrencesCount="tagEdge.node.occurrencesCount"
            :fileCount="tagEdge.node.mentions.edges.length"
          >
            <accordion
              class="border-gray-400 border rounded-lg mb-1"
              v-for="mentionEdge in tagEdge.node.mentions.edges"
              :key="mentionEdge.node.id"
              :title="mentionEdge.node.fileName"
              :excerptsCount="mentionEdge.node.occurrencesInFileCount"
            >
              <div
                class="text-left mb-3 p-3 border border-gray-500 border-dashed"
                v-for="excerptEdge in mentionEdge.node.excerpts.edges"
                v-html="asciidoctor.convert(excerptEdge.node.text)"
                :key="excerptEdge.node.id"
              />
            </accordion>
          </accordion>
        </div>
      </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Accordion from '../components/Accordion'
export default {
  name: 'TagsViewer',
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
    }
  },
  data: function () {
    return {
      asciidoctor: require('asciidoctor')()
    }
  },
  components: {
    Accordion
  },
  props: ['version']
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
