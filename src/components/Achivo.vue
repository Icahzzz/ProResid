<script setup>
import { UploadCloud } from 'lucide-vue-next'

// Definimos que este componente puede enviar un evento llamado 'file-uploaded'
const emit = defineEmits(['file-uploaded'])

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('file-uploaded', file)
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto mt-10">
    <div class="bg-white p-12 rounded-2xl shadow-md border-2 border-dashed border-gray-300 flex flex-col items-center text-center transition-all hover:border-blue-400">
      <div class="bg-blue-50 p-4 rounded-full mb-4">
        <UploadCloud :size="48" class="text-blue-500" />
      </div>
      <h2 class="text-2xl font-semibold mb-2 text-gray-800">Cargar Archivo Excel</h2>
      <p class="text-gray-500 mb-6">Selecciona tu archivo para empezar a editar los datos.</p>
      
      <input type="file" id="fileInput" class="hidden" accept=".xlsx, .xls" @change="onFileChange" />
      <label for="fileInput" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all cursor-pointer shadow-lg shadow-blue-200 active:scale-95">
        Seleccionar Archivo
      </label>
    </div>
  </div>
</template>