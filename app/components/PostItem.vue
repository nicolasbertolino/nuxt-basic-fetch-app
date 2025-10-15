<!-- components/PostItem.vue -->
<script setup lang="ts">
import type { PostItemProps } from '~/types'

defineProps<PostItemProps>()

// Text content
const text = {
  userIdLabel: 'User ID:',
  postIdLabel: 'Post ID:',
  separator: '|',
}
</script>

<template>
  <li class="post">
    <h3 class="post__title">
      <NuxtLink :to="`/posts/${post.id}`" class="post__link">
        {{ post.title }}
      </NuxtLink>
    </h3>
    <p class="post__body">
      {{ post.body }}
    </p>
    <small class="post__meta">
      {{ text.userIdLabel }} {{ post.userId }} {{ text.separator }} {{ text.postIdLabel }} {{ post.id }}
    </small>
  </li>
</template>

<style scoped>
.post {
  --background-color: #f4f4f4;
  --border-color: #e0e0e0;
  --border-color-highlight: #8d8d8d;
  --paragraph-color: #666666;

  position: relative;
  padding: 2rem;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);

  &:hover {
    border-color: var(--border-color-highlight);
  }
}

.post__link {
  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    z-index: 1;
  }
}

.post__title {
  margin-block-end: 1rem;

  a {
    &:not(:hover) {
      text-decoration: none;
    }
  }
}

.post__body {
  line-height: 1.6;
  color: var(--paragraph-color);
}

.post__meta {
  display: block;
  margin-block-start: 1rem;
}
</style>
