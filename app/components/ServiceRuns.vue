<script setup lang="ts">
import type { SRun } from '~/utils/service-blocks'
defineProps<{ runs?: SRun[] }>()
</script>

<template>
  <template v-for="(r, j) in runs ?? []" :key="j">
    <a
      v-if="r.href"
      :href="r.href"
      target="_blank"
      rel="noopener"
      class="text-plum underline underline-offset-2"
    >{{ r.text }}</a>
    <code
      v-else-if="r.code"
      class="rounded bg-plum/10 px-1.5 py-0.5 text-[0.9em] text-plum"
    >{{ r.text }}</code>
    <span
      v-else
      :class="[r.bold && 'font-semibold text-navy', r.italic && 'italic']"
    >{{ r.text }}</span>
  </template>
</template>