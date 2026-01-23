# Nuxt GitLab

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

GitLab integration module for Nuxt.
Provides typed composables and secure server-side APIs to interact with GitLab repositories.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

---

## Features

- 🔐 &nbsp;Secure server-side GitLab token handling
- 🌿 &nbsp;Fetch Git references (branches & tags)
- 🧩 &nbsp;Typed composables (`useGitlab`)
- 🛡 &nbsp;Zod-based request validation (shared client & server)
- 🏗 &nbsp;Works with GitLab SaaS and self-hosted GitLab
- 🧪 &nbsp;Playground for local development

---

## Quick Setup

Install the module in your Nuxt application:

```bash
npx nuxt module add nuxt-gitlab
```

Or using your package manager:
```bash
npm install nuxt-gitlab
```

Add the module to your Nuxt config:
```ts
export default defineNuxtConfig({
  modules: ['nuxt-gitlab'],
})
```

Configuration
Environment Variables (Recommended)

⚠️ Never commit real GitLab tokens to your repository.
```
NUXT_GITLAB_API_URL=https://gitlab.com/api/v4
NUXT_GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxx
```

Nuxt Config
```ts
export default defineNuxtConfig({
  modules: ['nuxt-gitlab'],

  gitlab: {
    baseUrl: process.env.NUXT_GITLAB_API_URL,
    token: process.env.NUXT_GITLAB_TOKEN,
  },
})
```

## Usage

### Fetch Git references (branches or tags)

```ts
<script setup lang="ts">
const { getRefs } = useGitlab()

const branches = await getRefs({
  projectId: 5940,
  type: 'branches',
})
</script>
```
Options
```ts
interface GitlabRefsInput {
  projectId: string | number
  type?: 'branches' | 'tags'
}

```

### Fetch repository tree

```ts
<script setup lang="ts">
const { getTree } = useGitlab()

const { data: tree } = await useAsyncData(
  'gitlab-tree',
  () =>
    getTree({
      projectId: 5940,
      branch: 'develop',
    }),
)
</script>
```
Options
```ts
interface GitlabTreeInput {
  projectId: string | number
  branch: string
}
```

### Fetch multiple file contens

```ts
<script setup lang="ts">
const { getFiles } = useGitlab()

const { data: files } = await useAsyncData(
  'gitlab-files',
  () =>
    getFiles({
      projectId: 5940,
      branch: 'develop',
      paths: [
        'content/1.moon-index.md',
        'content/content/articles',
      ],
    }),
)
</script>
```
Options
```ts
interface GitlabFilePullInput {
  projectId: string | number
  branch: string
  paths: string[]
}
```

## License

MIT

## Nuxt Compatibility
Nuxt 4, Nuxt 3

## Roadmap

📂 Repository tree API

📄 File content API

🔄 Pagination support

🧪 Extended test coverage

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-gitlab/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-gitlab

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-gitlab.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-gitlab

[license-src]: https://img.shields.io/npm/l/nuxt-gitlab.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-gitlab

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
