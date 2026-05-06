<script setup>
import { ref, computed } from 'vue'
import { FileSpreadsheet, Search, RotateCcw, Save, Eye, FileCheck } from 'lucide-vue-next'
import * as XLSX from 'xlsx'
import FilePicker from '../components/Achivo.vue'
import DataTable from '../components/TablaDatos.vue'
import { generarPDF, generarAceptacionPDF } from '../logica/generar.js';

const hasData = ref(false)
const excelData = ref([])
const headers = ref([])
const searchQuery = ref('');
const tipoDocumento = ref('asignacion');


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

const handleDescargar = () => {
  if (excelData.value.length === 0) {
    alert("Primero debes cargar un archivo Excel con datos.");
    return;
  }

  // Recorremos cada fila de tu tabla
  excelData.value.forEach(fila => {
    if (tipoDocumento.value === 'asignacion') {
      // Llama a la función del Oficio de Asignación
      generarPDF(fila);
    } else if (tipoDocumento.value === 'aceptacion') {
      // Llama a la función de Aceptación de Reporte
      generarAceptacionPDF(fila);
    }
  });
};

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
    <!-- Encabezado simple -->
    <header class="bg-white border-b border-gray-200 py-4 px-8 shadow-sm flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600 flex items-center gap-2">
        <FileSpreadsheet :size="24" />
        Generador u.u
      </h1>
      
      <!-- Si hay datos, mostramos un botón discreto para cambiar archivo aquí arriba -->
      <button v-if="hasData" @click="resetDashboard" class="text-sm flex items-center gap-1 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium">
        <RotateCcw :size="16" /> Elegir otro archivo
      </button>
    </header>

    <main class="p-8 flex-1">
      <!-- 1. Pantalla de carga (si no hay datos) -->
      <FilePicker v-if="!hasData" @file-uploaded="processFile" />

      <!-- 2. Dashboard con datos -->
      <div v-else class="max-w-6xl mx-auto">
        
        <!-- BARRA DE ACCIONES PRINCIPAL (Acomodada) -->
        <div class="flex flex-wrap items-end gap-4 mb-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          
          <!-- Selector de Documento -->
          <div class="flex flex-col min-w-[240px]">
            <label class="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 tracking-wider">
              Documento a Generar
            </label>
            <select 
              v-model="tipoDocumento"
              class="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-all cursor-pointer"
            >
              <option value="asignacion">Anexo 1: Asignación de Asesor interno de Residencia Profesional</option>
              <option value="aceptacion">Anexo 2: Aceptación del Reporte Preliminar de Residencia Profesional</option>
            </select>
          </div>

          <!-- Botón de Generar -->
          <button 
            @click="handleDescargar"
            class="flex items-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-md shadow-indigo-100"
          >
            <FileCheck :size="18" /> 
            Generar PDFs ({{ filteredData.length }})
          </button>
        </div>

        <!-- TABLA DE DATOS -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="p-4 border-b bg-gray-50">
            <div class="relative max-w-md">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Filtrar por nombre, carrera o proyecto..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <Search class="absolute left-3 top-2.5 text-gray-400" :size="18" />
            </div>
          </div>
          
          <DataTable :headers="headers" :data="filteredData" />
        </div>
      </div>
    </main>
  </div>
</template>