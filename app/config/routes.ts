// config/routes.ts
export const ROUTES = {
  POSTS_BASE: '/posts',
  postDetail: (id: number) => `${ROUTES.POSTS_BASE}/${id}`,
  postsList: () => ROUTES.POSTS_BASE,
} as const