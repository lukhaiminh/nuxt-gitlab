// Generic success response wrapper
export interface ApiSuccess<T> {
  code?: number // e.g., 200
  data: T
  success: boolean
  status?: 'success'
  message?: string // e.g., "OK"
  total?: number
  limit?: number
  page?: number
}

// Generic error response wrapper
export interface ApiError {
  success: boolean
  status?: 'error'
  code: number // e.g., 400, 404, 500
  message: string // e.g., "Invalid ID provided."
}

// Discriminated union of both
export type ApiResponse<T> = ApiSuccess<T> | ApiError
