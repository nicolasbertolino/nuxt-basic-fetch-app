<!-- components/PostsList.vue -->
<script setup lang="ts">
const postsStore = usePostsStore()
const { pending, error, filteredPosts, postsPerPage } = storeToRefs(postsStore)

// Get reference to pagination component to access paginated posts
const paginationRef = ref()
const posts = computed(() => paginationRef.value?.paginatedPosts || [])

// Text content
const text = {
  title: 'Posts',
  emptyState: 'No posts found',
}

// Fetch posts when component mounts
onMounted(() => {
  postsStore.fetchPosts()
})
</script>

<template>
  <section class="posts">
    <PostsSearch />
    <h2 class="posts__title">{{ text.title }}</h2>
    <PostSkeleton v-if="pending" :count="postsPerPage" />
    <div v-else-if="error">
      {{ error }}
    </div>
    <ul v-else-if="posts.length" class="posts__list">
      <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </ul>
    <div v-else class="posts__message-empty">
      {{ text.emptyState }}
    </div>
    <PostsPagination ref="paginationRef" :posts="filteredPosts" />
  </section>
</template>

<style scoped>
.posts {
  display: grid;
  grid-template-columns: minmax(2.5vw, 1fr) repeat(2, minmax(auto, 600px)) minmax(2.5vw, 1fr);
  padding-block: clamp(40px, 5vw, 60px);

  > * {
    grid-column: 2 / -2;
  }
}

.posts__list {
  display: grid;
  row-gap: clamp(10px, 5vw, 20px);
  margin-block: clamp(20px, 5vw, 30px);
}

.posts__message-empty {
  margin-block-end: clamp(20px, 5vw, 30px);
  text-align: center;
  font-style: italic;
  color: #666;
}
</style>
