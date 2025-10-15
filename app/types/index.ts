// types/index.ts
export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface PostItemProps {
  post: Post
}

export interface PageInfo {
  start: number
  end: number
  total: number
}

export interface PaginationProps {
  posts: readonly Post[]
  showPostsPerPage?: boolean
  showPageInfo?: boolean
  postsPerPageOptions?: number[]
}

export interface PostSkeletonProps {
  count?: number
  showHeader?: boolean
  showPagination?: boolean
}