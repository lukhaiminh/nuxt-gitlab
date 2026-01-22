// src/types/gitlab.ts

import { z } from 'zod'

const projectIdSchema = z.union([
  z.number().int().positive(),
  z.string().min(1),
])

export const gitlabRefsSchema = z.object({
  projectId: projectIdSchema,
  type: z.enum(['branches', 'tags']).default('branches'),
})

export const gitlabTreeSchema = z.object({
  projectId: projectIdSchema,
  branch: z.string(),
})

export const gitlabFilePullSchema = gitlabTreeSchema.extend({
  paths: z
    .array(
      z.string().min(1, 'File path must not be empty'),
    )
    .min(1, 'At least one file path is required'),
})

export interface GitLabRefsResponse {
  name: string
  commit: {
    id: string
    short_id: string
    created_at: string
    title: string
  }
  protected: boolean
  default: boolean
}

export interface GitLabTreeResponse {
  id: string
  name: string
  type: 'tree' | 'blob'
  path: string
}

export interface GitLabFileResponse {
  filePath: string
  content: string
}

// For src/runtime/app/composables/useGitlab.ts
export type GitlabRefsInput = z.infer<typeof gitlabRefsSchema>
export type GitlabTreeInput = z.infer<typeof gitlabTreeSchema>
export type GitlabFileInput = z.infer<typeof gitlabFilePullSchema>
