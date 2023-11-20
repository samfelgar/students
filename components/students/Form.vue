<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from 'yup';
import { pt } from "yup-locale-pt";

yup.setLocale(pt);

const schema = yup.object({
  name: yup.string().required().label('nome'),
  observation: yup.string().notRequired().label('observação'),
  probem: yup.boolean().required().default(false),
  freshman: yup.boolean().required().default(false),
});

const { handleSubmit, defineComponentBinds, errors, resetForm } = useForm({ validationSchema: schema });

const name = defineComponentBinds('name');
const observation = defineComponentBinds('observation');
const probem = defineComponentBinds('probem');
const freshman = defineComponentBinds('freshman');

const emit = defineEmits(['submit']);

const handleSubmission = handleSubmit((values) => {
  emit('submit', values);
  resetForm();
});

</script>

<template>
  <div>
    <h2 class="font-bold text-xl">Adicionar estudante</h2>
    <form @submit.prevent="handleSubmission" class="grid grid-flow-row md:grid-flow-col gap-2 mt-4">
      <div>
        <label for="name" class="block">Nome</label>
        <InputText v-bind="name" id="name" class="w-full" />
        <small v-if="errors.name" class="p-error block" id="text-error">{{ errors.name }}</small>
      </div>

      <div>
        <label for="observation" class="block">Observação</label>
        <Textarea v-bind="observation" id="observation" class="w-full"></Textarea>
        <small v-if="errors.observation" class="p-error block" id="text-error">{{ errors.observation }}</small>
      </div>

      <div class="my-3 md:my-0">
        <Checkbox input-id="probem" v-bind="probem" :binary="true" class="mr-2"></Checkbox>
        <label for="probem">Probem</label>
        <small v-if="errors.probem" class="p-error block" id="text-error">{{ errors.probem }}</small>
      </div>

      <div class="my-3 md:my-0">
        <Checkbox input-id="freshman" v-bind="freshman" :binary="true" class="mr-2"></Checkbox>
        <label for="freshman">Calouro</label>
        <small v-if="errors.freshman" class="p-error block" id="text-error">{{ errors.freshman }}</small>
      </div>

      <div class="md:justify-self-center md:self-center">
        <Button type="submit" class="w-full md:w-auto">Salvar</Button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>