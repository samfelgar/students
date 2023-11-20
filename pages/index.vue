<script setup lang="ts">
import FreshmenCard from "~/components/stats/FreshmenCard.vue";
import VeteransCard from "~/components/stats/VeteransCard.vue";
import TotalStudentsCard from "~/components/stats/TotalStudentsCard.vue";
import ClassesStudentsCountCard from "~/components/stats/ClassesStudentsCountCard.vue";
import ProbemCard from "~/components/stats/ProbemCard.vue";

definePageMeta({
  title: 'Inicio'
})
</script>

<template>
  <Suspense>
    <div>
      <div class="grid md:grid-cols-3 gap-4">
        <FreshmenCard/>
        <VeteransCard/>
        <TotalStudentsCard/>
        <ProbemCard/>
      </div>
      <ClassesStudentsCountCard class="mt-4"/>
    </div>


    <template #fallback>
      <Skeleton height="10rem" width="30rem"></Skeleton>
    </template>
  </Suspense>
</template>
