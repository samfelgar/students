<script setup lang="ts">
import ValueCard from "~/components/stats/ValueCard.vue";

const supabase = useSupabaseClient();
const { count } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

const studentsCount = ref<number>(0);
studentsCount.value = count ?? 0;
</script>

<template>
  <ValueCard title="Total" :count="studentsCount" />
</template>

<style scoped>

</style>