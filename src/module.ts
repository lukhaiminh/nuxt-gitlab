import { defineNuxtModule, createResolver, addImports, addServerHandler, useLogger } from '@nuxt/kit'

const logger = useLogger('nuxt-gitlab')

export interface ModuleOptions {
  baseUrl: string
  token: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-gitlab',
    configKey: 'gitlab',
    compatibility: { nuxt: '>=3.0.0' },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    baseUrl: 'https://gitlab.com/api/v4',
  },
  setup(moduleOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if (!moduleOptions.token) {
      logger.error(`GitLab token is not configured.`)
    }

    nuxt.options.runtimeConfig.gitlab = {
      baseUrl: moduleOptions.baseUrl,
      token: moduleOptions.token,
    }

    nuxt.options.alias = {
      ...(nuxt.options.alias || {}),
      '#nuxt-gitlab': resolve('./'),
    }

    /* Server routes */
    addServerHandler({
      route: '/api/_nuxt-gitlab/refs',
      handler: resolve('./runtime/server/api/refs.post'),
    })

    addServerHandler({
      route: '/api/_nuxt-gitlab/tree',
      handler: resolve('./runtime/server/api/tree.post'),
    })

    addServerHandler({
      route: '/api/_nuxt-gitlab/files',
      handler: resolve('./runtime/server/api/files.post'),
    })

    addImports({
      name: 'useGitlab',
      from: resolve('./runtime/app/composables/useGitlab'),
    })
  },
})
