<script setup lang="ts">
defineProps<{
  message?: string
  type?: string
}>()
</script>

<template>
  <div v-if="message" :class="`alert alert--${type}`">
    {{ message }}
  </div>
</template>