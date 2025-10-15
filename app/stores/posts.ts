// stores/posts.ts
import type { Post } from '~/types'

const API = 'https://jsonplaceholder.typicode.com/posts'

export const usePostsStore = defineStore('posts', () => {
  // Core state
  const allPosts = ref<Post[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  // Individual post state
  const currentPost = ref<Post | null>(null)
  const fetchingPost = ref(false)

  // Business logic state (affects filtering/data)
  const postsPerPage = ref(10)
  const currentPage = ref(1)
  const searchQuery = ref('')

  // Computed filtered posts based on search query
  const filteredPosts = computed(() => {
    if (!searchQuery.value) return [...allPosts.value]

    const query = searchQuery.value.toLowerCase()
    return allPosts.value.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query)
    )
  })

  // Core actions
  const fetchPosts = async () => {
    try {
      pending.value = true
      error.value = null
      const data = await $fetch<Post[]>(API)
      allPosts.value = data || []
    } catch (err) {
      error.value = 'Failed to fetch posts'
      console.error('Error fetching posts:', err)
    } finally {
      pending.value = false
    }
  }

  const fetchPostById = async (id: string | number) => {
    const postId = Number(id)

    // First check if we already have it in allPosts
    const existingPost = allPosts.value.find((post) => post.id === postId)
    if (existingPost) {
      currentPost.value = existingPost
      return existingPost
    }

    // If not found, fetch it from API
    try {
      fetchingPost.value = true
      error.value = null
      const data = await $fetch<Post>(`${API}/${postId}`)
      currentPost.value = data

      // Optionally add to allPosts if it's not there
      if (!allPosts.value.find((post) => post.id === data.id)) {
        allPosts.value.push(data)
      }

      return data
    } catch (err) {
      error.value = 'Failed to fetch post'
      console.error('Error fetching post:', err)
      currentPost.value = null
      throw err
    } finally {
      fetchingPost.value = false
    }
  }

  const setPostsPerPage = (count: number) => {
    postsPerPage.value = count
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    // Reset to first page when search changes
    currentPage.value = 1
  }

  const clearSearchQuery = () => {
    searchQuery.value = ''
    currentPage.value = 1
  }

  const clearCurrentPost = () => {
    currentPost.value = null
    error.value = null
  }

  return {
    // Core state
    allPosts: readonly(allPosts),
    pending: readonly(pending),
    error: readonly(error),

    // Individual post state
    currentPost: readonly(currentPost),
    fetchingPost: readonly(fetchingPost),

    // Business state
    postsPerPage: readonly(postsPerPage),
    currentPage: readonly(currentPage),
    searchQuery: readonly(searchQuery),
    filteredPosts: readonly(filteredPosts),

    // Actions
    fetchPosts,
    fetchPostById,
    setPostsPerPage,
    setCurrentPage,
    setSearchQuery,
    clearSearchQuery,
    clearCurrentPost,
  }
})
