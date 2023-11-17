<script setup lang="ts">
import type { DataTableFilterEvent, DataTableFilterMeta, DataTablePageEvent } from "primevue/datatable";
import { format, parse, startOfMonth } from 'date-fns';

definePageMeta({
  title: 'Turmas'
})

const supabase = useSupabaseClient();

const limit = 10;

type Filter = {
  key: string;
  value: string;
  matchMode: string;
}

const loadPage = async (page: number, filters: Filter[] = []) => {
  const start = (page * limit) - limit;
  const end = (start + limit) - 1;

  const query = supabase
      .from('classes')
      .select('*', { count: 'exact' });

  for (const filter of filters) {
    if (filter.matchMode !== 'dateIs') {
      query.ilike(filter.key, `%${filter.value}%`);
    } else {
      query.eq(filter.key, format(startOfMonth(filter.value), 'yyyy-MM-dd'));
    }
  }

  return query.range(start, end);
}

const { data: results, count } = await loadPage(1);

const classes = ref([]);
const total = ref(0);
const loading = ref(false);

classes.value = results ?? [];
total.value = count ?? 0;

const parseFilters = (filters: DataTableFilterMeta) => {
  const f: Filter[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (!value.value) {
      continue;
    }

    f.push({
      key,
      value: value.value,
      matchMode: value.matchMode
    });
  }

  return f;
};

const onPage = async (event: DataTablePageEvent) => {
  loading.value = true;

  const page = event.page + 1;

  const { data } = await loadPage(page, parseFilters(event.filters));
  classes.value = data ?? [];

  loading.value = false;
};

const filters = ref<DataTableFilterMeta>({
  'reference': { value: '', matchMode: 'dateIs' },
  'name': { value: null, matchMode: 'contains' },
});

const onFilter = async (event: DataTableFilterEvent) => {
  const filters: Filter[] = parseFilters(event.filters);
  const { data, count } = await loadPage(1, filters);
  classes.value = data ?? [];
  total.value = count ?? 0;
};

</script>

<template>
  <DataTable :value="classes"
             paginator
             lazy
             :first="0"
             :rows="limit"
             :total-records="total"
             :loading="loading"
             :filters="filters"
             filter-display="row"
             @page="onPage($event)"
             @filter="onFilter($event)">
    <Column field="id" header="ID"></Column>
    <Column field="name" header="Nome" filter-header-class="w-96 px-1 py-2" :show-filter-menu="false">
      <template #filter="{filterModel, filterCallback}">
        <InputText type="text"
                   v-model="filterModel.value"
                   @keydown.enter="filterCallback"
                   class="p-2"/>
      </template>
    </Column>
    <Column field="period" header="Período"></Column>
    <Column field="reference" header="Referência" filter-header-class="w-96 px-1 py-2" :show-filter-menu="false">
      <template #filter="{filterModel, filterCallback}">
        <Calendar v-model="filterModel.value"
                  date-format="mm/yy"
                  view="month"
                  @date-select="filterCallback"
                  class="p-2"/>
      </template>
      <template #body="{ data }">
        <span>{{ format(parse(data.reference, 'yyyy-MM-dd', startOfMonth(new Date())), 'MM/yyyy') }}</span>
      </template>
    </Column>

    <template #empty>Sem resultados.</template>
  </DataTable>
</template>

<style scoped>

</style>