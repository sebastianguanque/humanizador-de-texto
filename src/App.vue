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

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
  padding: 3rem 1rem;
}

.main-wrapper {
  max-width: 1152px;
  margin: 0 auto;
}

.main-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .main-title {
    font-size: 3rem;
  }
}

.description {
  font-size: 1.125rem;
  color: #4b5563;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 512px;
  margin-left: auto;
  margin-right: auto;
}

.content-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
}

.tone-selector-section {
  margin-bottom: 2rem;
}

.section-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.tone-buttons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .tone-buttons-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.tone-button {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 2px solid;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.tone-button-active {
  border-color: #3b82f6;
  background-color: #eff6ff;
  color: #1d4ed8;
}

.tone-button-inactive {
  border-color: #e5e7eb;
  background-color: white;
  color: #4b5563;
}

.tone-button-inactive:hover {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.text-areas-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .text-areas-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.text-area-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.textarea {
  width: 100%;
  height: 16rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  resize: none;
  transition: all 0.2s ease;
  color: #374151;
  font-family: inherit;
}

.textarea::placeholder {
  color: #9ca3af;
}

.textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.textarea-original.textarea-filled {
  border-color: #93c5fd;
  background-color: #eff6ff;
}

.textarea-humanized:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.textarea-humanized.textarea-filled-green {
  border-color: #6ee7b7;
  background-color: #ecfdf5;
}

.character-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.button-container {
  text-align: center;
}

.humanize-button {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  font-weight: bold;
  padding: 1rem 3rem;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  transition: all 0.2s ease;
  transform: scale(1);
  cursor: pointer;
  border: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.humanize-button:hover:not(.humanize-button-disabled) {
  background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
  transform: scale(1.05);
}

.humanize-button-disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  cursor: not-allowed;
  transform: scale(1);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

.spinner-circle {
  opacity: 0.25;
}

.spinner-path {
  opacity: 0.75;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.tips-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #eff6ff;
  border-radius: 0.75rem;
}

.tips-title {
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.75rem;
}

.tips-list {
  font-size: 0.875rem;
  color: #1d4ed8;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  margin-bottom: 0.25rem;
}

/* Scrollbar personalizado para textareas */
.textarea::-webkit-scrollbar {
  width: 8px;
}

.textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
