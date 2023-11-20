<script setup lang="ts">
import ValueCard from "~/components/stats/ValueCard.vue";

const supabase = useSupabaseClient();
const { count } = await supabase
    .from('students')
    .select('*, classes!students_class_id_fkey!inner(*)', { count: 'exact', head: true })
    .eq('active', true)
    .neq('classes.period', 1);

const veteransCount = ref<number>(0);
veteransCount.value = count ?? 0;
</script>

<template>
  <ValueCard title="Veteranos" :count="veteransCount" />
</template>

<style scoped>

</style>