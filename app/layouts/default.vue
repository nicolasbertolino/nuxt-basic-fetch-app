<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout-container">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
</style>