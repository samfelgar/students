<script setup lang="ts">
import ValueCard from "~/components/stats/ValueCard.vue";

const supabase = useSupabaseClient();

const { count } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)
    .eq('freshman', true);

const freshmenCount = ref<number>(0);
freshmenCount.value = count ?? 0;

</script>

<template>
  <ValueCard title="Calouros" :count="freshmenCount" />
</template>

<style scoped>

</style>