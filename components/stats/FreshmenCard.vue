<script setup lang="ts">
import ValueCard from "~/components/stats/ValueCard.vue";

const supabase = useSupabaseClient();

const { count } = await supabase
    .from('students')
    .select('*, classes!students_class_id_fkey!inner(*)', { count: 'exact', head: true })
    .eq('active', true)
    .eq('classes.period', 1);

const freshmenCount = ref<number>(0);
freshmenCount.value = count ?? 0;

</script>

<template>
  <ValueCard title="Calouros" :count="freshmenCount" />
</template>

<style scoped>

</style>