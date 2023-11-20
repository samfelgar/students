<script setup lang="ts">
interface Props {
  count: number;
  title: string;
}

defineProps<Props>();
</script>

<template>
  <Card class="bg-blue-500 hover:bg-blue-600 transition duration-300 text-white">
    <template #title>
      <h2>{{ title }}</h2>
    </template>
    <template #content>
      <p class="text-5xl text-right">{{ count }}</p>
    </template>
  </Card>
</template>

<style scoped>

</style>