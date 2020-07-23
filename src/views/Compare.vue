<template>
  <div id="compare">
    <!-- version choosers -->
    <div v-if="$apollo.queries.versions.loading" class="lds-dual-ring"></div>
    <div v-else>
      <!-- version one -->
      <div>
        <strong class="relative inline-flex mr-3 text-sm">Version one:</strong>
        <div class="relative inline-flex mt-6 mb-3">
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
            v-model="version1"
            name="version1"
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

      <p>vs</p>

      <!-- version two -->
      <div>
        <strong class="relative inline-flex mr-3 text-sm">Version two:</strong>
        <div class="relative inline-flex my-3">
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
            v-model="version2"
            name="version2"
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
    </div>
    <div v-if="version1 !== '' && version2 !== '' && isSameVersion">
      <p class="text-red-900 font-bold mt-10">Please choose two different versions</p>
    </div>
    <!-- data display -->
    <div v-if="diffList" class="container mx-auto">
      <Accordion
        class="border-blue-300 mb-1 border"
        v-for="(tagData, tagName, index) in diffList"
        :key="index"
        :title="tagName"
      >
        <Accordion
          class="border-blue-300 mb-1 border"
          v-for="(mentionData, mentionName, index) in tagData"
          :key="index"
          :title="mentionName"
        >
          <div
              class="text-left mb-3 p-3 border border-gray-500 border-dashed"
              v-for="(excerpt, index) in mentionData"
              :key="index"
          >
            <b v-for="(part, index) in excerpt" :key="index" class="font-normal" :class="{'text-green-600': part.added, 'text-red-600': part.removed}">{{part.value}}</b>
          </div>
              <!-- v-html="asciidoctor.convert(excerpt)"  -->
        </Accordion>
      </Accordion>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Accordion from '../components/Accordion'
export default {
  name: 'Compare',
  apollo: {
    tags: {
      query: gql`
        query($version1: String!, $version2: String!) {
          tags: allVersions(
            filters: { versionNameIn: [$version1, $version2] }
          ) {
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
          version1: this.version1,
          version2: this.version2
        }
      },
      result ({ tags, loading, networkStatus }) {
        if (this.tags.edges.length > 1) {
          this.isSameVersion = false
          this.tagData[0] = this.tags.edges[0].node.tags.edges
          this.tagData[1] = this.tags.edges[1].node.tags.edges
          this.diffList = {}
          this.getDiff()
        } else {
          this.isSameVersion = true
          this.tagData = []
          this.diffList = {}
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
  components: {
    Accordion
  },
  data: function () {
    return {
      version1: '',
      version2: '',
      tagData: [],
      isSameVersion: false,
      diffList: {},
      asciidoctor: require('asciidoctor')(),
      diff: require('diff')
    }
  },
  methods: {
    getDiff () {
      var tagDataParsed = this.parseTagData()
      var diff = {}

      for (const [tagKey, tagValue] of Object.entries(tagDataParsed[0])) {
        if (tagKey in tagDataParsed[1]) {
          const otherTagValue = tagDataParsed[1][tagKey]
          var diffInMentions = {}
          for (const [mentionKey, mentionValue] of Object.entries(tagValue)) {
            if (mentionKey in otherTagValue) {
              const otherMentionValue = otherTagValue[mentionKey]
              const maxExcerpts = Math.max(
                mentionValue.length,
                otherMentionValue.length
              )
              const diffInExcerpts = []
              for (var e = 0; e < maxExcerpts; e++) {
                var excerpt1 = e >= mentionValue.length ? '' : mentionValue[e]
                var excerpt2 =
                  e >= otherMentionValue.length ? '' : otherMentionValue[e]
                diffInExcerpts.push(this.diff.diffChars(excerpt1, excerpt2))
              }
              diffInMentions[mentionKey] = diffInExcerpts
            }
            // TODO: else
          }
          diff[tagKey] = diffInMentions
        }
        // TODO: else
      }
      this.diffList = diff
    },
    parseTagData () {
      var tagDataParsed = []
      for (var i = 0; i < 2; i++) {
        var tagData = {}
        this.tagData[i].forEach((tagEdge) => {
          var mentionData = {}
          tagEdge.node.mentions.edges.forEach((mentionEdge) => {
            var excerpts = []
            mentionEdge.node.excerpts.edges.forEach((excerptEdge) => {
              excerpts.push(excerptEdge.node.text)
            })
            mentionData[mentionEdge.node.fileName] = excerpts
          })
          tagData[tagEdge.node.tagName] = mentionData
        })
        tagDataParsed.push(tagData)
      }
      return tagDataParsed
    }
  }
}
</script>

<style>
</style>
