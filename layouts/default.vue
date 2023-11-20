<script setup lang="ts">
const route = useRoute();

useHead({
  title: 'Filos',
});
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 p-2">
    <Toast />
    <NuxtLoadingIndicator color="blue"/>
    <AppSidebar class="hidden md:block"/>
    <Card class="w-full">
      <template #title>{{ route.meta.title ?? 'Filos' }}</template>
      <template #content>
        <slot/>
      </template>
    </Card>
  </div>
</template>
