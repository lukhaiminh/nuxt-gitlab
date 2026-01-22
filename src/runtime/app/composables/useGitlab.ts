// src/runtime/app/composables/useGitlab.ts

import type { GitlabFileInput, GitLabFileResponse, GitlabRefsInput, GitLabRefsResponse, GitlabTreeInput, GitLabTreeResponse } from '#nuxt-gitlab/shared/gitlab'

export interface GitlabRefsOptions {
  projectId: string | number
  type?: 'branches' | 'tags'
}

export interface GitlabRef {
  name: string
  commit: {
    id: string
    short_id: string
    title: string
    created_at: string
  }
}

export function useGitlab() {
  /**
   * Get branches or tags from GitLab
   */
  async function getRefs(options: GitlabRefsInput): Promise<GitLabRefsResponse[]> {
    return $fetch('/api/_nuxt-gitlab/refs', {
      method: 'POST',
      body: {
        projectId: options.projectId,
        type: options.type ?? 'branches',
      },
    })
  }

  async function getTree(options: GitlabTreeInput): Promise<GitLabTreeResponse[]> {
    return $fetch('/api/_nuxt-gitlab/tree', {
      method: 'POST',
      body: {
        projectId: options.projectId,
        branch: options.branch,
      },
    })
  }

  async function getFiles(options: GitlabFileInput): Promise<GitLabFileResponse[]> {
    return $fetch('/api/_nuxt-gitlab/files', {
      method: 'POST',
      body: {
        projectId: options.projectId,
        branch: options.branch,
        paths: options.paths,
      },
    })
  }

  return { getRefs, getTree, getFiles }
}
