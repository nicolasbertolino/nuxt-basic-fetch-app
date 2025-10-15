<!-- components/PostsPagination.vue -->
<script setup lang="ts">
import type { PaginationProps, PageInfo } from '~/types'

const props = withDefaults(defineProps<PaginationProps>(), {
  showPostsPerPage: true,
  showPageInfo: true,
  postsPerPageOptions: () => [5, 10, 20, 50],
})

const postsStore = usePostsStore()
const { postsPerPage, currentPage } = storeToRefs(postsStore)

// Text content with template functions
const text = {
  itemsPerPageLabel: 'Items per page:',
  itemsCount: (start: number, end: number, total: number) => 
    `${start}–${end} of ${total} items`,
  pageLabel: (current: number, total: number) => 
    `Page ${current} of ${total} pages`,
  pageTitle: (current: number) => `Page ${current}`,
  pagesText: (total: number) => `of ${total} pages`,
  prevPageEnabled: 'Go to previous page',
  prevPageDisabled: 'Previous page (disabled)',
  nextPageEnabled: 'Go to next page',
  nextPageDisabled: 'Next page (disabled)',
  prevPageTitle: 'Previous Page',
  nextPageTitle: 'Next Page',
}

// Computed pagination properties
const totalPages = computed(() =>
  Math.ceil(props.posts.length / postsPerPage.value)
)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage.value
  const end = start + postsPerPage.value
  return props.posts.slice(start, end)
})

const hasNextPage = computed(() => currentPage.value < totalPages.value)
const hasPrevPage = computed(() => currentPage.value > 1)

const pageInfo = computed((): PageInfo => {
  const start = (currentPage.value - 1) * postsPerPage.value + 1
  const end = Math.min(
    currentPage.value * postsPerPage.value,
    props.posts.length
  )
  return {
    start,
    end,
    total: props.posts.length,
  }
})

// Computed aria labels
const prevAriaLabel = computed(() =>
  hasPrevPage.value ? text.prevPageEnabled : text.prevPageDisabled
)

const nextAriaLabel = computed(() =>
  hasNextPage.value ? text.nextPageEnabled : text.nextPageDisabled
)

// Pagination actions
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    postsStore.setCurrentPage(page)
  }
}

const nextPage = () => {
  if (hasNextPage.value) {
    postsStore.setCurrentPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (hasPrevPage.value) {
    postsStore.setCurrentPage(currentPage.value - 1)
  }
}

// Reset to first page when props.posts or postsPerPage changes
// AND when the page number exceeds total pages
watch([() => props.posts, postsPerPage], () => {
  // Only reset if current page is now invalid
  if (currentPage.value > totalPages.value) {
    postsStore.setCurrentPage(1)
  }
})

// Handle page select change
const handlePageSelect = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const page = Number(target.value)
  goToPage(page)
}

// Handle posts per page change
const handlePostsPerPage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  postsStore.setPostsPerPage(Number(target.value))
}

defineExpose({
  paginatedPosts,
})
</script>

<template>
  <div
    v-if="totalPages > 1 || showPostsPerPage || showPageInfo"
    class="pagination"
  >
    <div v-if="showPageInfo || showPostsPerPage" class="pagination__left">
      <label
        v-if="showPostsPerPage"
        for="posts-per-page"
        class="pagination__label"
      >
        {{ text.itemsPerPageLabel }}
      </label>
      <select
        v-if="showPostsPerPage"
        id="posts-per-page"
        class="pagination__select pagination__select--posts-per-page"
        :value="postsPerPage"
        :title="postsPerPage.toString()"
        @change="handlePostsPerPage"
      >
        <option
          v-for="option in postsPerPageOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <span
        v-if="showPageInfo && pageInfo.total > 0"
        class="pagination__items-count"
      >
        {{ text.itemsCount(pageInfo.start, pageInfo.end, pageInfo.total) }}
      </span>
    </div>

    <div v-if="totalPages > 1" class="pagination__right">
      <label
        for="page-select"
        class="pagination__label pagination__label--hidden"
      >
        {{ text.pageLabel(currentPage, totalPages) }}
      </label>
      <select
        id="page-select"
        class="pagination__select pagination__select--page"
        :value="currentPage"
        :title="text.pageTitle(currentPage)"
        @change="handlePageSelect"
      >
        <option v-for="page in totalPages" :key="page" :value="page">
          {{ page }}
        </option>
      </select>
      <span class="pagination__pages">{{ text.pagesText(totalPages) }}</span>

      <div class="pagination__control-buttons">
        <button
          class="pagination__button pagination__button--prev"
          :disabled="!hasPrevPage"
          :aria-label="prevAriaLabel"
          type="button"
          :title="text.prevPageTitle"
          @click="prevPage()"
        >
          <Icon name="material-symbols:arrow-left" size="24" />
        </button>
        <button
          class="pagination__button pagination__button--next"
          :disabled="!hasNextPage"
          :aria-label="nextAriaLabel"
          type="button"
          :title="text.nextPageTitle"
          @click="nextPage()"
        >
          <Icon name="material-symbols:arrow-right" size="24" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  --background-color: #f4f4f4;
  --background-hover-color: #e4e4e4;
  --border-color: #e0e0e0;
  --focus-color: #0f62fe;
  --pagination-height: 4rem;

  min-block-size: var(--pagination-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-color);
  border-block-start: 1px solid var(--border-color);
}

.pagination__left,
.pagination__right {
  display: flex;
  align-items: center;
  height: 100%;
}

.pagination__left {
  padding-inline: 1.6rem;
}

.pagination__items-count {
  margin-inline-start: 1.6rem;
  color: #525252;
}

.pagination__label,
.pagination__select,
.pagination__pages {
  display: none;

  @media (768px <= width) {
    display: initial;
  }
}

.pagination__label--hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.pagination__select {
  min-block-size: var(--pagination-height);
  padding-inline: 1.6rem;
  background-color: var(--background-color);
  border: none;
  outline: 2px solid transparent;
  outline-offset: -1px;
  cursor: pointer;
  transition: outline 0.2s, background-color 0.2s;

  &:hover {
    background-color: var(--background-hover-color);
  }

  &:focus {
    outline-color: var(--focus-color);
  }
}

.pagination__select--posts-per-page {
  border-inline-end: 1px solid var(--border-color);
}

.pagination__select--page {
  border-inline-start: 1px solid var(--border-color);
}

.pagination__pages {
  margin-inline-end: 1.6rem;
}

.pagination__control-buttons {
  display: flex;
}

.pagination__button {
  display: flex;
  align-items: center;
  min-block-size: var(--pagination-height);
  padding-inline: 1.1rem;
  border-inline-start: 1px solid var(--border-color);
  background-color: var(--background-color);
  outline: 2px solid transparent;
  outline-offset: -1px;
  transition: outline 0.2s, background-color 0.2s;

  &:disabled {
    cursor: not-allowed;
    > * {
      opacity: 0.25;
    }
  }

  &:hover:not(:disabled) {
    background-color: var(--background-hover-color);
  }

  &:focus {
    outline-color: var(--focus-color);
  }
}
</style>
