import { useRuntimeConfig } from '#imports'
import { createError, defineEventHandler, readBody } from 'h3'
import { gitlabFilePullSchema, type ApiSuccess, type GitLabFileResponse } from '#nuxt-gitlab/shared'

export default defineEventHandler(async (event): Promise<ApiSuccess<GitLabFileResponse[]>> => {
  const { gitlab: { baseUrl, token } } = useRuntimeConfig()
  const body = await readBody(event)
  const parsed = gitlabFilePullSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: parsed.error.flatten(),
    })
  }

  const {
    projectId,
    branch,
    paths,
  } = parsed.data

  const encodedBranch = encodeURIComponent(branch)

  /* -----------------------------
     * Fetch raw content for each file
     * ----------------------------- */
  const data: GitLabFileResponse[] = []
  for (const filePath of paths) {
    const encodedPath = encodeURIComponent(filePath)
    const rawRes = await fetch(
      `${baseUrl}/projects/${projectId}/repository/files/${encodedPath}/raw?ref=${encodedBranch}`,
      {
        headers: {
          'PRIVATE-TOKEN': token,
        },
      },
    )

    if (!rawRes.ok) {
      // skip broken file, do NOT crash whole sync
      continue
    }

    const content = await rawRes.text()
    data.push({ filePath, content })
  }

  return {
    success: true,
    total: data.length,
    data,
  }
})
