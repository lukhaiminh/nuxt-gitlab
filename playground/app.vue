<!-- playground/app.vue -->

<script setup lang="ts">
const { getRefs, getTree, getFiles } = useGitlab()

const { data: branches, error, pending } = await useAsyncData(
  'gitlab-branches',
  () =>
    getRefs({
      projectId: 5940,
      type: 'tags', // | `branches`
    }),
)
// branches?.value?.data

const { data: tree } = await useAsyncData(
  'gitlab-tree',
  () =>
    getTree({
      projectId: 5940,
      branch: 'develop',
    }),
)

const { data: files } = await useAsyncData(
  'gitlab-files',
  () =>
    getFiles({
      projectId: 5940,
      branch: 'develop',
      paths: ['content/1.moon-index.md', 'content/content/articles'],
    }),
)
</script>

<template>
  <div>
    <h3>Nuxt module playground</h3>

    {{ branches?.data }}

    <h4>Files data</h4>
    <pre v-if="tree">{{ files }}</pre>

    <h4>Tree data</h4>
    <pre v-if="tree">{{ tree }}</pre>

    <div v-if="pending">
      Loading…
    </div>
    <div v-else-if="error">
      Error: {{ error.message }}
    </div>
    <pre v-else>{{ branches }}</pre>
  </div>
</template>
