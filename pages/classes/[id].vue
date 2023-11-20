<script setup lang="ts">
import { format, parse } from 'date-fns';
import Form from '../../components/students/Form.vue';
import { useToast } from "primevue/usetoast";

definePageMeta({
  title: 'Turmas'
})

const route = useRoute();
const toast = useToast();
const supabase = useSupabaseClient();

type Student = {
  id: number;
  name: string;
  observation?: string;
  active: boolean;
  probem: boolean;
};

type ClassRecord = {
  id: number;
  name: string;
  period: number;
  reference: string;
  students: Student[];
}

const classRecord = ref<ClassRecord | null>(null);

const { data } = await supabase
    .from('classes')
    .select('*, students!students_class_id_fkey!inner(*)')
    .eq('id', route.params.id)
    .maybeSingle();

classRecord.value = data;

const addStudent = async (values: any) => {
  const { data: student } = await supabase
      .from('students')
      .insert({
        ...values,
        active: true,
        class_id: classRecord.value?.id,
      })
      .select();

  if (student === null) {
    return;
  }

  classRecord.value?.students.push(student[0]);
}

const toggleStudentBooleanProperty = async (studentId: number, currentStatus: boolean, property: 'active' | 'probem'): Promise<void> => {
  const newStatus = !currentStatus;

  const payload: {[key: string]: boolean} = {};
  payload[property] = newStatus;

  const { error } = await supabase
      .from('students')
      .update(payload)
      .eq('id', studentId);

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Ops',
      detail: 'Não foi possível atualizar o estudante',
      life: 3000,
    })
    return;
  }

  const student = classRecord.value?.students.find((student: Student) => student.id === studentId);

  if (!student) {
    toast.add({
      severity: 'error',
      summary: 'Ops',
      detail: 'Não foi possível atualizar o estudante',
      life: 3000,
    })
    return;
  }

  student[property] = newStatus;
}

const toggleActive = async (studentId: number, current: boolean) => {
  await toggleStudentBooleanProperty(studentId, current, 'active');
}

const toggleProbem = async (studentId: number, current: boolean) => {
  await toggleStudentBooleanProperty(studentId, current, 'probem');
}

</script>

<template>
  <div>
    <div v-if="!classRecord">Não foi possível localizar o registro.</div>
    <div v-else>
      <div>
        <div>
          <span class="font-bold mr-2">ID:</span>
          <span>{{ classRecord?.id }}</span>
        </div>
        <div>
          <span class="font-bold mr-2">Turma:</span>
          <span>{{ classRecord?.name }}</span>
        </div>
        <div>
          <span class="font-bold mr-2">Período:</span>
          <span>{{ classRecord?.period }}</span>
        </div>
        <div>
          <span class="font-bold mr-2">Referência:</span>
          <span v-if="classRecord?.reference">{{
              format(parse(classRecord?.reference, 'yyyy-MM-dd', new Date()), 'MM/yyyy')
            }}</span>
        </div>
      </div>

      <Form class="my-4" @submit="addStudent"/>

      <DataTable :value="classRecord?.students">
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Nome"></Column>
        <Column field="observation" header="Observação"></Column>
        <Column field="active" header="Ativo">
          <template #body="{data}: {data: Student}">
            <Button @click="toggleActive(data.id, data.active)"
                    link
                    :icon="`pi ${data.active ? 'pi-check-circle' : 'pi-times-circle'}`"
                    :class="{'text-green-600': data.active, 'text-red-600': !data.active}"/>
          </template>
        </Column>
        <Column field="probem" header="Probem">
          <template #body="{data}: {data: Student}">
            <Button @click="toggleProbem(data.id, data.probem)"
                    link
                    :icon="`pi ${data.probem ? 'pi-check-circle' : 'pi-times-circle'}`"
                    :class="{'text-green-600': data.probem, 'text-red-600': !data.probem}"/>
          </template>
        </Column>

        <template #empty>
          <p>Ainda não foram cadastrados estudantes.</p>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>

</style>