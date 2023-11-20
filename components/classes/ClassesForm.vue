<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from 'yup';
import { pt } from "yup-locale-pt";
import { format, setMonth, startOfMonth, subYears } from "date-fns";
import type { AutoCompleteCompleteEvent } from "primevue/autocomplete";
import type { ComputedRef } from "vue";

yup.setLocale(pt);

const schema = yup.object({
  name: yup.string().required().label('nome'),
  period: yup.number().min(1).max(10).required().label('período'),
  reference: yup.string().matches(/0[17]\/\d{4}/).label('referência').required(),
});

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:visible', 'submit']);

const _visible = useVModel(props, 'visible', emit);

const { handleSubmit, defineComponentBinds, errors, resetForm } = useForm({ validationSchema: schema });

const name = defineComponentBinds('name');
const period = defineComponentBinds('period');
const reference = defineComponentBinds('reference');

const handleSubmission = handleSubmit((values) => {
  emit('submit', values);
  resetForm();
});

const referenceOptions = ref<string[]>([]);

for (let i = -2; i < 5; i++) {
  const january = setMonth(startOfMonth(new Date()), 0);
  const july = setMonth(startOfMonth(new Date()), 6);

  referenceOptions.value.push(format(subYears(january, i + 1), 'MM/yyyy'));
  referenceOptions.value.push(format(subYears(july, i + 1), 'MM/yyyy'));
}

const supabase = useSupabaseClient();
const { data: classesNames } = await supabase
    .from('classes')
    .select('name');

const classNamesList: ComputedRef<string[]> = computed(() => classesNames?.map(className => className.name) ?? [])

const filteredNames = ref<Set<string>>(new Set());
const suggestions = computed<string[]>(() => Array.from(filteredNames.value.values()))

const search = (event: AutoCompleteCompleteEvent) => {
  if (!event.query.trim().length) {
    classNamesList.value.forEach((name) => filteredNames.value.add(name));
    return;
  }

  const _filtered = classNamesList.value.filter(className => className.toLowerCase().startsWith(event.query.toLowerCase()));
  filteredNames.value = new Set(_filtered);
}

</script>

<template>
  <Dialog v-model:visible="_visible" modal>
    <template #header>
      <h2 class="font-bold text-xl">Adicionar turma</h2>
    </template>

    <form @submit.prevent="handleSubmission"
          class="flex flex-col gap-2 mt-4">
      <div class="flex gap-2">
        <div>
          <label for="name" class="block">Nome</label>
          <AutoComplete v-bind="name"
                        :suggestions="suggestions"
                        @complete="search"
                        id="name"
                        class="w-full"/>
          <small v-if="errors.name" class="p-error block" id="text-error">{{ errors.name }}</small>
        </div>
        <div>
          <label for="period" class="block">Período</label>
          <InputNumber v-bind="period" id="period" :min="1" :max="10" class="w-full"/>
          <small v-if="errors.period" class="p-error block" id="text-error">{{ errors.period }}</small>
        </div>
        <div class="w-48">
          <label for="reference" class="block">Referência</label>
          <Dropdown v-bind="reference" :options="referenceOptions" id="reference" class="w-full"/>
          <small v-if="errors.reference" class="p-error block" id="text-error">{{ errors.reference }}</small>
        </div>
      </div>

      <div class="md:justify-self-end md:self-end">
        <Button type="submit" class="w-full md:w-auto">Salvar</Button>
      </div>
    </form>
  </Dialog>
</template>
