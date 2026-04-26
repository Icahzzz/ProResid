<script setup>
import { ref, computed } from 'vue'
import { FileSpreadsheet, Search, RotateCcw, Save, Eye, FileCheck } from 'lucide-vue-next'
// ... (mantenemos la lógica de XLSX y los componentes anteriores)
import * as XLSX from 'xlsx'
import FilePicker from '../components/Achivo.vue'
import DataTable from '../components/TablaDatos.vue'

const hasData = ref(false)
const excelData = ref([])
const headers = ref([])
const searchQuery = ref('')

const processFile = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const json = XLSX.utils.sheet_to_json(worksheet)

    if (json.length > 0) {
      const allHeaders = Object.keys(json[0])
      headers.value = allHeaders.filter(h => !h.startsWith('__EMPTY'))
      excelData.value = json
      hasData.value = true
    }
  }
  reader.readAsArrayBuffer(file)
}

const resetDashboard = () => {
  hasData.value = false
  excelData.value = []
  searchQuery.value = ''
}

// Funciones para los nuevos botones (de momento solo logs)
const handleSaveData = () => {
  console.log("Guardando en base de datos...", excelData.value)
  alert("Datos preparados para envío a base de datos")
}

const handlePreview = () => {
  console.log("Abriendo previsualización...")
  alert("Abriendo vista previa del diseño...")
}

const filteredData = computed(() => {
  if (!searchQuery.value) return excelData.value
  return excelData.value.filter(row => {
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col text-slate-800 font-sans">
    <header class="bg-white border-b border-gray-200 py-4 px-8 shadow-sm flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600 flex items-center gap-2">
        <FileSpreadsheet :size="24" />
        Generador u.u
      </h1>

      <div v-if="hasData" class="flex gap-3">
        <button 
          @click="handlePreview"
          class="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors font-medium border border-amber-200"
        >
          <Eye :size="18" /> Previsualizar PDF
        </button>
        <button 
          @click="handleSaveData"
          class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md shadow-green-100"
        >
          <Save :size="18" /> Guardar y Generar
        </button>
      </div>
    </header>

    <main class="p-8 flex-1">
      <FilePicker v-if="!hasData" @file-uploaded="processFile" />

      <div v-else class="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b bg-gray-50 flex justify-between items-center gap-4">
          <div class="relative flex-1 max-w-md">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Filtrar registros..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search class="absolute left-3 top-2.5 text-gray-400" :size="18" />
          </div>
          
          <button @click="resetDashboard" class="text-sm flex items-center gap-1 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium">
            <RotateCcw :size="16" /> Elegir otro archivo
          </button>
        </div>
        
        <DataTable :headers="headers" :data="filteredData" />
      </div>
    </main>
  </div>
</template>