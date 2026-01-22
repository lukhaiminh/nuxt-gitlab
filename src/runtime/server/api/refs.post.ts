// server/api/gitlab/refs.post.ts

/**
 * refs is short for references.
In Git, refs are pointers to commits, such as branches and tags.
So an API named /refs means it works with Git references (branches, tags), not just one specific type.
 */

import { useRuntimeConfig } from '#imports'
import { createError, defineEventHandler, readBody } from 'h3'
import { gitlabRefsSchema, type ApiSuccess, type GitLabRefsResponse } from '#nuxt-gitlab/shared'

export default defineEventHandler(async (event): Promise<ApiSuccess<GitLabRefsResponse[]>> => {
  const { gitlab: { baseUrl, token } } = useRuntimeConfig()
  const body = await readBody(event)
  const parsed = gitlabRefsSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid request body ${JSON.stringify(parsed.error)}`,
    })
  }

  const {
    projectId,
    type = 'branches',
  } = body

  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'projectId is required',
    })
  }

  const path = type === 'branches'
    ? 'repository/branches'
    : 'repository/tags'

  try {
    const res = await fetch(
      `${baseUrl}/projects/${projectId}/${path}`,
      {
        headers: {
          'PRIVATE-TOKEN': token,
        },
      },
    )

    if (!res.ok) {
      const text = await res.text()
      throw createError({
        statusCode: res.status,
        statusMessage: text,
      })
    }

    const data: GitLabRefsResponse[] = await res.json()

    return {
      success: true,
      total: data.length,
      data,
    }
  }
  catch (error) {
    console.error('[GitLab refs error]', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch GitLab refs',
    })
  }
})
