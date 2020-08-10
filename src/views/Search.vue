<template>
  <div id="search">
    <div v-if="$apollo.queries.loading" class="lds-dual-ring"></div>
    <div v-else class="container mx-auto mt-4">
      <!-- versions -->
      <div v-if="versions && versions.edges.length > 0" class="mt-4">
        <Accordion
          class="border-blue-300 mb-1 border rounded-lg"
          :title="'Found ' + versions.edges.length + ' version(s)'"
        >
        <Accordion
          v-for="versionEdge in versions.edges"
          :key="versionEdge.node.id"
          :title="versionEdge.node.versionName"
          class="border-blue-300 mb-1 border rounded-lg mb-2">
          <TagsViewer class="mt-2 mb-8" :version="versionEdge.node.versionName"/>
        </Accordion>
        </Accordion>
      </div>
      <!-- tags -->
      <div v-if="tags && tags.edges[0].node.tags.edges.length > 0" class="mt-4">
        <Accordion
          class="border-blue-300 mb-1 border rounded-lg"
          :title="'Found ' + tags.edges[0].node.tags.edges.length + ' matching tag name(s)'"
        >
        <!-- <h1 v-for="tagEdge in tags.edges[0].node.tags.edges" :key="tagEdge.node.id" class="">
          {{ tagEdge.node.tagName }}
        </h1> -->
          <Accordion
            class="border-blue-300 mb-1 border"
            v-for="tagEdge in tags.edges[0].node.tags.edges"
            :key="tagEdge.node.id"
            :title="tagEdge.node.tagName"
            :occurrencesCount="tagEdge.node.occurrencesCount"
            :fileCount="tagEdge.node.mentions.edges.length"
          >
            <Accordion
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
            </Accordion>
          </Accordion>
        </Accordion>
      </div>
      <!-- filenames -->
      <div v-if="mentions && mentions.edges[0].node.mentions.edges.length > 0" class="mt-4">
        <Accordion
          class="border-blue-300 mb-1 border rounded-lg"
          :title="'Found ' + Object.keys(filesDataToDisplay).length + ' matching file(s)'"
        >
          <Accordion
            v-for="(fileData, fileName, index) in filesDataToDisplay"
            :key="index"
            class="border-blue-300 mb-1 border rounded-lg"
            :title="fileName"
          >
            <Accordion
              v-for="(tagData, tagName, index) in fileData"
              :key="index"
              class="border-blue-300 mb-1 border rounded-lg"
              :title="'Tag: ' + tagName"
            >
              <div
                class="text-left mb-3 p-3 border border-gray-500 border-dashed"
                v-for="(excerpt, index) in tagData"
                v-html="asciidoctor.convert(excerpt)"
                :key="index"
              />
            </Accordion>
          </Accordion>
        </Accordion>
      </div>
      <!-- excerpts -->
      <div v-if="excerpts && excerpts.edges[0].node.excerpts.edges.length > 0" class="mt-4">
        <Accordion
          class="border-blue-300 mb-1 border rounded-lg"
          :title="'Found ' + excerpts.edges[0].node.excerpts.edges.length + ' matching excerpt(s)'"
        >
        <div v-for="excerptEdge in excerpts.edges[0].node.excerpts.edges" :key="excerptEdge.node.id">
          <h1><strong>Tag:</strong> {{excerptEdge.node.mention.tag.tagName}} <strong>| File:</strong> {{excerptEdge.node.mention.fileName}}</h1>
          <p
            v-html="asciidoctor.convert(excerptEdge.node.text)"
            class="text-left mb-3 p-3 border border-gray-500 border-dashed">
          </p>
        </div>
        </Accordion>
      </div>
      <div v-if="!(versions && versions.edges.length > 0)
        && !(tags && tags.edges[0].node.tags.edges.length > 0)
        && !(mentions && mentions.edges[0].node.mentions.edges.length > 0)
        && !(excerpts && excerpts.edges[0].node.excerpts.edges.length > 0)">
        <p class="text-red-900 font-bold mt-10">Nothing found</p>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import TagsViewer from '../components/TagsViewer'
import Accordion from '../components/Accordion'
export default {
  name: 'Search',
  props: ['searchText'],
  components: {
    Accordion,
    TagsViewer
  },
  data: function () {
    return {
      asciidoctor: require('asciidoctor')(),
      filesDataToDisplay: {}
    }
  },
  apollo: {
    versions: {
      query: gql`
        query($versionPattern: String!) {
            versions: allVersions(filters: {versionNameIlike: $versionPattern}, sort: CREATE_DATE_DESC) {
                edges {
                  node {
                    id
                    versionName
                  }
                }
            }
        }
      `,
      variables () {
        return {
          versionPattern: '%' + this.searchText + '%'
        }
      }
    },
    tags: {
      query: gql`
      query($tagPattern: String!){
        tags: allVersions (first:1, sort: CREATE_DATE_DESC) {
          edges {
            node {
              id
              tags(filters: {tagNameIlike: $tagPattern}) {
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
          tagPattern: '%' + this.searchText + '%'
        }
      }
    },
    mentions: {
      query: gql`
      query($fileNamePattern: String!){
        mentions: allVersions (first:1, sort: CREATE_DATE_DESC) {
          edges {
            node {
              id
              mentions(filters: {fileNameIlike: $fileNamePattern}) {
                edges {
                  node {
                    id
                    fileName
                    tag {
                      id
                      tagName
                    }
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
      `,
      variables () {
        return {
          fileNamePattern: '%' + this.searchText + '%'
        }
      },
      result ({ mentions, loading, networkStatus }) {
        if (this.mentions.edges.length > 0) {
          this.parseFileData(this.mentions)
        }
      }
    },
    excerpts: {
      query: gql`
      query($textPattern: String!){
        excerpts: allVersions (first:1, sort: CREATE_DATE_DESC) {
          edges {
            node {
              id
              excerpts(filters: {textIlike: $textPattern}) {
                edges {
                  node {
                    id
                    text
                    mention {
                      id
                      fileName
                      tag {
                        id
                        tagName
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
          textPattern: '%' + this.searchText + '%'
        }
      }
    }
  },
  methods: {
    parseFileData (mentions) {
      var finalFileData = {}
      mentions.edges[0].node.mentions.edges.forEach((mentionEdge) => {
        const fileName = mentionEdge.node.fileName
        const tagName = mentionEdge.node.tag.tagName
        var excerpts = []

        mentionEdge.node.excerpts.edges.forEach((excerptEdge) => excerpts.push(excerptEdge.node.text))

        if (!(fileName in finalFileData)) {
          finalFileData[fileName] = {}
        }
        finalFileData[fileName][tagName] = excerpts
      })
      this.filesDataToDisplay = finalFileData
    }
  }
}
</script>

<style>

</style>
