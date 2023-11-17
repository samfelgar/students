<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";

type MenuRouteItem = {
  label: string;
  icon?: string;
  route: string;
}

type Action = () => void | Promise<void>;

type MenuActionItem = {
  label: string;
  icon?: string;
  action: Action;
  requireConfirmation: boolean;
}

const items = ref<MenuRouteItem[]>([
  { label: 'Home', icon: 'pi pi-home', route: '/' },
  { label: 'Turmas', route: '/classes', icon: 'pi pi-users' },
]);

const supabase = useSupabaseClient();

const logout = async () => {
  await supabase.auth.signOut();
  await navigateTo('/login');
};

const confirm = useConfirm();

const handleConfirmation = (event: Event, action: Action) => {
  confirm.require({
    target: event.currentTarget,
    header: 'Confirmação',
    message: 'Deseja continuar?',
    icon: 'pi pi-info-circle',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    accept: () => {
      action();
    },
    reject: () => {
    },
  });
}

const actions = ref<MenuActionItem[]>([
  { label: 'Sair', icon: 'pi pi-sign-out', action: logout, requireConfirmation: true }
]);

</script>

<template>
  <aside>
    <ConfirmDialog></ConfirmDialog>
    <div>
      <h1 class="font-bold text-center text-3xl text-blue-600 my-7">Filos</h1>
    </div>
    <ul class="flex flex-col w-64">
      <NuxtLink v-for="item of items" :key="item.label" :to="item.route" class="hover:bg-blue-300 rounded-md">
        <li class="w-full p-2">
          <i v-if="item.icon" :class="item.icon"></i>
          <span class="ml-2">{{ item.label }}</span>
        </li>
      </NuxtLink>
      <button type="button"
              @click="action.requireConfirmation ? handleConfirmation($event, action.action) : action.action"
              v-for="action of actions"
              :key="action.label"
              class="text-left">
        <li class="w-full p-2 hover:bg-blue-300 rounded-md">
          <i v-if="action.icon" :class="action.icon"></i>
          <span class="ml-2">{{ action.label }}</span>
        </li>
      </button>
    </ul>
  </aside>
</template>

<style scoped>
.router-link-active {
  @apply bg-blue-500 text-white;
}
</style>