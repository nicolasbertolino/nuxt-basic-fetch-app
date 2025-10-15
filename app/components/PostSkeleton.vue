<!-- components/PostSkeleton.vue -->
<script setup lang="ts">
import type { PostSkeletonProps } from '~/types'

defineProps<PostSkeletonProps>()
</script>

<template>
  <ul class="skeleton__list">
    <li v-for="i in count" :key="`skeleton-${i}`" class="skeleton__item">
      <div class="skeleton__box skeleton__box--title" />
      <div class="skeleton__body">
        <div class="skeleton__box skeleton__box--body" />
        <div class="skeleton__box skeleton__box--body" />
        <div class="skeleton__box skeleton__box--body" />
      </div>
      <div class="skeleton__box skeleton__box--meta" />
    </li>
  </ul>
</template>

<style scoped>
.skeleton__list {
  display: grid;
  row-gap: clamp(10px, 5vw, 20px);
  margin-block: clamp(20px, 5vw, 30px);
}

.skeleton__item {
  --background-color: #f4f4f4;
  --border-color: #e0e0e0;
  --skeleton-base: #e0e0e0;
  --skeleton-highlight: #f0f0f0;

  position: relative;
  padding: 2rem;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
}

.skeleton__box {
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton__box--title {
  max-block-size: 2rem;
  max-inline-size: 70%;
}

.skeleton__body {
  display: grid;
  row-gap: 0.5rem;
  margin-block: 2rem;
}

.skeleton__box--body {
  max-block-size: 1.2rem;
  max-inline-size: 100%;
}

.skeleton__box--meta {
  max-block-size: 1.2rem;
  max-inline-size: 30%;
}
</style>
