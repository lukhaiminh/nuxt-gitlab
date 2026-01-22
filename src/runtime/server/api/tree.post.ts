// src/runtime/server/api/tree.post.ts

import { createError, defineEventHandler, readBody } from 'h3'
import type { GitLabTreeResponse } from '#nuxt-gitlab/shared/gitlab'
import { gitlabTreeSchema } from '#nuxt-gitlab/shared/gitlab'
import { useRuntimeConfig } from '#imports'
// import { gitlabTreeSchema } from '~/src/types/gitlab'

export default defineEventHandler(async (event) => {
  const { gitlab: { baseUrl, token } } = useRuntimeConfig()
  const body = await readBody(event)
  const parsed = gitlabTreeSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
    })
  }

  const {
    projectId,
    branch,
  } = parsed.data

  try {
    /* -----------------------------
   * Get repository tree
   * ----------------------------- */
    const treeRes = await fetch(
      `${baseUrl}/projects/${projectId}/repository/tree?ref=${branch}&recursive=true`,
      {
        headers: {
          'PRIVATE-TOKEN': token,
        },
      },
    )

    if (!treeRes.ok) {
      const text = await treeRes.text()
      throw createError({
        statusCode: treeRes.status,
        statusMessage: text,
      })
    }

    const data: GitLabTreeResponse[] = await treeRes.json()
    return { data }
  }
  catch (error) {
    // ❗ Network / unexpected error
    console.error('[GitLab Fetch Exception]', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Unexpected error while calling GitLab API',
    })
  }
})
