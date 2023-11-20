<script setup lang="ts">
const supabase = useSupabaseClient();

const { data } = await supabase
    .from('classes')
    .select('id, name, students!students_class_id_fkey(count)')
    .eq('students.active', true);

interface ClassSummary {
  id: number;
  name: string;
  count: number;
}

const results = ref<Map<string, ClassSummary>>(new Map());

for (const result of data ?? []) {
  if (results.value.has(result.name)) {
    results.value.get(result.name).count += result.students[0].count;
    continue;
  }

  results.value.set(result.name, {
    id: result.id,
    name: result.name,
    count: result.students[0].count,
  });
}

</script>

<template>
  <Card>
    <template #title>
      <h2>Alunos por curso</h2>
    </template>
    <template #content>
      <div v-for="[_, result] of results" :key="result.id">
        <span>{{ result.name }}</span>: <span>{{ result.count }}</span>
      </div>
    </template>
  </Card>
</template>

<style scoped>

</style>