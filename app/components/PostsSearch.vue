<!-- components/PostsSearch.vue -->
<script setup lang="ts">
const postsStore = usePostsStore()
const { searchQuery } = storeToRefs(postsStore)

// Text content
const text = {
  search: 'Search for posts',
  clearAriaLabel: 'Clear search input',
}

// Handle search input
const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    postsStore.setSearchQuery(target.value)
  }
}

// Handle clear search
const handleClear = () => {
  postsStore.clearSearchQuery()
}

// Show clear button when there's a search query
const showClearButton = computed(() => searchQuery.value.length > 0)
</script>

<template>
  <div class="search" role="search" :aria-label="text.search">
    <div class="search__magnifier" tabindex="-1">
      <Icon
        class="search__icon"
        name="material-symbols-light:search-rounded"
        size="20"
      />
    </div>
    <label for="search" class="search__label">{{ text.search }}</label>
    <input
      id="search"
      class="search__input"
      type="search"
      :value="searchQuery"
      :placeholder="text.search"
      autocomplete="off"
      @input="handleSearch"
    >
    <button
      v-show="showClearButton"
      class="search__clear"
      :class="{ 'search__clear--hidden': !showClearButton }"
      :aria-label="text.clearAriaLabel"
      :title="text.clearAriaLabel"
      type="button"
      @click="handleClear"
    >
      <Icon
        class="search__icon"
        name="material-symbols:close-small-outline"
        size="20"
      />
    </button>
  </div>
</template>

<style scoped>
.search {
  --background-color: #f4f4f4;
  --background-hover-color: #e4e4e4;
  --border-color: #8d8d8d;
  --focus-color: #0f62fe;
  --search-height: 4rem;

  position: relative;
  display: flex;
  align-items: center;
  margin-block-end: clamp(20px, 5vw, 30px);
  border-block-end: 1px solid var(--border-color);
  background-color: var(--background-color);
}

.search__label {
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

.search__input {
  flex: 1;
  min-block-size: var(--search-height);
  padding-inline: 4rem;
  border: none;
  background-color: transparent;
  outline: 2px solid transparent;
  transition: outline 0.11s cubic-bezier(0.2, 0, 0.38, 0.9);

  &:focus {
    outline-color: var(--focus-color);
  }

  &::placeholder {
    color: #a8a8a8;
  }
}

.search__magnifier {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 1rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.search__clear {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-end: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: var(--search-height);
  inline-size: var(--search-height);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--background-hover-color);
  }
}

.search__clear--hidden {
  opacity: 0;
  visibility: hidden;
}
</style>
