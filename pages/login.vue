<script setup lang="ts">
import * as yup from 'yup';
import { useForm } from "vee-validate";
import { pt } from "yup-locale-pt";
import { useToast } from "primevue/usetoast";

yup.setLocale(pt);

definePageMeta({
  layout: 'guest'
});

const toast = useToast();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

if (user.value) {
  await navigateTo('/');
}

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required().label('senha'),
});

const { defineComponentBinds, handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const email = defineComponentBinds('email');
const password = defineComponentBinds('password');

const handleSubmission = handleSubmit(async (values) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro!',
      detail: 'Não foi possível fazer login',
      life: 3000,
    })

    return;
  }

  await navigateTo('/');
})

</script>

<template>
  <main class="flex justify-center items-center h-screen">
    <Toast/>
    <Card class="w-96">
      <template #title>Acessar</template>
      <template #content>
        <form @submit.prevent="handleSubmission">
          <div>
            <InputText type="text"
                       placeholder="E-mail"
                       v-bind="email"
                       class="w-full"
                       :class="{'p-invalid': errors.email}"/>
            <small class="p-error block" id="text-error">{{ errors.email || '&nbsp;' }}</small>
          </div>
          <div>
            <InputText type="password"
                       placeholder="Senha"
                       v-bind="password"
                       class="w-full"
                       :class="{'p-invalid': errors.password}"/>
            <small class="p-error block" id="text-error">{{ errors.password || '&nbsp;' }}</small>
          </div>
          <Button type="submit">Acessar</Button>
        </form>
      </template>
    </Card>
  </main>
</template>

<style scoped>

</style>