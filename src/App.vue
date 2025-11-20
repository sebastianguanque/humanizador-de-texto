<template>
  <div class="app-container">
    <div class="main-wrapper">
      <!-- Título principal -->
      <h1 class="main-title">Humanizador de Texto</h1>

      <!-- Descripción -->
      <p class="description">
        Transforma texto generado por IA en contenido más natural, empático y
        humano
      </p>

      <!-- Contenedor principal -->
      <div class="content-card">
        <!-- Selector de tono -->
        <div class="tone-selector-section">
          <label class="section-label"> Tono del texto humanizado </label>
          <div class="tone-buttons-grid">
            <button
              v-for="tone in tones"
              :key="tone.value"
              @click="selectedTone = tone.value"
              :class="[
                'tone-button',
                selectedTone === tone.value
                  ? 'tone-button-active'
                  : 'tone-button-inactive',
              ]"
            >
              {{ tone.label }}
            </button>
          </div>
        </div>

        <!-- Áreas de texto -->
        <div class="text-areas-grid">
          <!-- Texto original -->
          <div class="text-area-section">
            <label class="section-label"> Texto Original </label>
            <textarea
              v-model="originalText"
              placeholder="Pega aquí el texto que quieres humanizar. Puede ser contenido generado por IA, texto técnico, o cualquier texto que suene muy formal o robótico..."
              :class="[
                'textarea',
                'textarea-original',
                originalText.length > 0 ? 'textarea-filled' : '',
              ]"
            ></textarea>
            <div class="character-count">
              {{ originalText.length }} caracteres
            </div>
          </div>

          <!-- Texto humanizado -->
          <div class="text-area-section">
            <label class="section-label"> Texto Humanizado </label>
            <textarea
              v-model="humanizedText"
              placeholder="Aquí aparecerá tu texto humanizado. Será más natural, empático y con un tono más conversacional..."
              :class="[
                'textarea',
                'textarea-humanized',
                humanizedText.length > 0 ? 'textarea-filled-green' : '',
              ]"
              readonly
            ></textarea>
            <div class="character-count">
              {{ humanizedText.length }} caracteres
            </div>
          </div>
        </div>

        <!-- Botón de acción -->
        <div class="button-container">
          <button
            @click="humanizeText"
            :disabled="!originalText.trim() || isProcessing"
            class="humanize-button"
            :class="{
              'humanize-button-disabled': !originalText.trim() || isProcessing,
            }"
          >
            <span v-if="!isProcessing" class="button-content">
              <svg
                class="button-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              Humanizar Texto
            </span>
            <span v-else class="button-content">
              <svg class="button-icon spinner" fill="none" viewBox="0 0 24 24">
                <circle
                  class="spinner-circle"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="spinner-path"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Humanizando...
            </span>
          </button>
        </div>

        <!-- Consejos -->
        <div class="tips-section">
          <h3 class="tips-title">💡 Consejos para mejores resultados:</h3>
          <ul class="tips-list">
            <li>• Selecciona el tono apropiado para tu audiencia</li>
            <li>• Incluye contexto sobre el propósito del texto</li>
            <li>• Textos más largos permiten mejor humanización</li>
            <li>• Revisa siempre el resultado para ajustes finales</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const originalText = ref("");
const humanizedText = ref("");
const isProcessing = ref(false);
const selectedTone = ref("conversacional");

const tones = [
  { value: "formal", label: "Formal" },
  { value: "conversacional", label: "Conversacional" },
  { value: "amigable", label: "Amigable" },
  { value: "tecnico", label: "Técnico" },
];

const humanizeText = async () => {
  if (!originalText.value.trim()) return;

  isProcessing.value = true;
  humanizedText.value = "";

  try {
    // Llama a la función serverless de Vercel
    const response = await fetch("/api/humanize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: originalText.value,
        tone: selectedTone.value,
      }),
    });

    if (!response.ok) {
      throw new Error("La llamada a la API falló");
    }

    const data = await response.json();
    humanizedText.value = data.humanizedText;
  } catch (error) {
    console.error("Error al humanizar texto:", error);
    humanizedText.value =
      "Error al procesar el texto. Por favor, inténtalo de nuevo.";
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style>
@import "./assets/styles/App.css";
</style>
