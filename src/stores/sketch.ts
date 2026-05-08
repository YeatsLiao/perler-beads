import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Sketch } from '@/types';

export const useSketchStore = defineStore('sketch', () => {
  const sketches = ref<Sketch[]>([]);
  const currentSketch = ref<Sketch | null>(null);
  const isSaving = ref(false);

  const drafts = computed(() => sketches.value.filter(s => s.isDraft));
  const publishedWorks = computed(() => sketches.value.filter(s => !s.isDraft && s.isPublic));

  function addSketch(sketch: Sketch) {
    sketches.value.unshift(sketch);
    currentSketch.value = sketch;
  }

  function updateSketch(id: string, updates: Partial<Sketch>) {
    const index = sketches.value.findIndex(s => s._id === id);
    if (index !== -1) {
      sketches.value[index] = { ...sketches.value[index], ...updates };
      if (currentSketch.value?._id === id) {
        currentSketch.value = sketches.value[index];
      }
    }
  }

  function deleteSketch(id: string) {
    sketches.value = sketches.value.filter(s => s._id !== id);
    if (currentSketch.value?._id === id) {
      currentSketch.value = null;
    }
  }

  function setCurrentSketch(sketch: Sketch | null) {
    currentSketch.value = sketch;
  }

  return {
    sketches,
    currentSketch,
    isSaving,
    drafts,
    publishedWorks,
    addSketch,
    updateSketch,
    deleteSketch,
    setCurrentSketch
  };
});
