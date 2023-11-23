<script setup lang="ts">
import ValueCard from "~/components/stats/ValueCard.vue";

const supabase = useSupabaseClient();
const { count } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)
    .eq('freshman', false);

const veteransCount = ref<number>(0);
veteransCount.value = count ?? 0;
</script>

<template>
  <ValueCard title="Veteranos" :count="veteransCount" />
</template>

<style scoped>

</style>