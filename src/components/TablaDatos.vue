<script setup>
// Recibe los encabezados y los datos filtrados del padre
defineProps({
  headers: Array,
  data: Array
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-100 text-gray-600 text-xs uppercase">
          <th v-for="h in headers" :key="h" class="p-4 border-b font-semibold tracking-wider">{{ h }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in data" :key="idx" class="hover:bg-blue-50/50 transition-colors border-b last:border-b-0">
          <td v-for="h in headers" :key="h" class="p-2">
            <input 
              v-model="row[h]" 
              class="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-400 focus:bg-white rounded px-2 py-1.5 transition-all outline-none text-sm"
              spellcheck="false"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>