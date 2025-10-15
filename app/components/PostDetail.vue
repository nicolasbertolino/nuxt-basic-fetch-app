<!-- components/PostDetail.vue -->
<script setup lang="ts">
const route = useRoute()
const postsStore = usePostsStore()
const { currentPost, fetchingPost, error } = storeToRefs(postsStore)

const postId = route.params.id as string

// Text content
const text = {
  backButton: 'Back to Posts',
  notFound: 'Post not found',
  userIdLabel: 'User ID:',
  postIdLabel: 'Post ID:',
  separator: '|',
}

// Fetch post when component mounts
onMounted(() => {
  if (postId) {
    postsStore.fetchPostById(postId)
  }
})

// Clear current post when component unmounts
onUnmounted(() => {
  postsStore.clearCurrentPost()
})

// Handle navigation back
const handleGoBack = () => {
  navigateTo('/')
}
</script>

<template>
  <div class="detail">
    <button class="detail__back-button" @click="handleGoBack">
      {{ text.backButton }}
    </button>
    <PostSkeleton v-if="fetchingPost" :count="1" />
    <div v-else-if="error" class="detail__error">
      <p>{{ error }}</p>
    </div>
    <article v-else-if="currentPost" class="detail__article">
      <header class="detail__article-header">
        <h1 class="detail__title">{{ currentPost.title }}</h1>
        <small class="detail__meta">
          {{ text.userIdLabel }} {{ currentPost.userId }} {{ text.separator }} {{ text.postIdLabel }} {{ currentPost.id }}
        </small>
      </header>
      <div class="detail__body">
        <p>{{ currentPost.body }}</p>
      </div>
    </article>
    <div v-else class="detail__not-found">
      {{ text.notFound }}
    </div>
  </div>
</template>

<style scoped>
.detail {
  --border-color: #e0e0e0;
  --paragraph-color: #666666;

  display: grid;
  grid-template-columns: minmax(2.5vw, 1fr) repeat(2, minmax(auto, 600px)) minmax(2.5vw, 1fr);
  padding-block: clamp(40px, 5vw, 60px);

  > * {
    grid-column: 2 / -2;
  }
}

.detail__back-button {
  --button-background-color: #0f62fe;
  --button-background-color-hover: #0050e6;
  --button-text-color: #ffffff;

  display: flex;
  max-inline-size: fit-content;
  padding: 1.5rem 2rem;
  background-color: var(--button-background-color);
  color: var(--button-text-color);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--button-background-color-hover);
  }
}

.detail__error,
.detail__not-found {
  margin-block: clamp(20px, 5vw, 30px);
  text-align: center;
  font-style: italic;
  color: #666;
}

.detail__article {
  margin-block: clamp(20px, 5vw, 30px);
}

.detail__article-header {
  margin-block-end: clamp(1rem, 5vw, 2rem);
  padding-bottom: clamp(1rem, 5vw, 2rem);
  border-bottom: 1px solid var(--border-color);
}

.detail__meta {
  display: block;
  margin-block-start: clamp(0.5rem, 5vw, 1rem);
  color: var(--paragraph-color);
}

.detail__body {
  p {
    line-height: 1.6;
  }
}
</style>
