import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Sketch } from '@/types';
import { draftStorage, type DraftData } from '@/utils/draftStorage';
import { demoWorks } from '@/utils/demoWorks';
import type { PixelPattern } from '@/utils/demoWorks';

export const useSketchStore = defineStore('sketch', () => {
  const sketches = ref<Sketch[]>([]);
  const currentSketch = ref<Sketch | null>(null);
  const isSaving = ref(false);

  function refreshDrafts() {
    try {
      const drafts = draftStorage.loadAllDrafts();
      const draftSketches: Sketch[] = drafts.map(d => draftToSketch(d));
      const demoSketches: Sketch[] = demoWorks.map(w => ({
        _id: w._id,
        userId: w.userId,
        title: w.title,
        description: w.description,
        canvas: { width: w.sketch.width, height: w.sketch.height, pixelSize: w.sketch.pixelSize },
        paletteId: w.sketch.paletteId,
        pixels: '',
        isPublic: true,
        isDraft: false,
        tags: w.tags,
        category: w.category,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt),
        publishedAt: w.publishedAt ? new Date(w.publishedAt) : undefined
      }));
      sketches.value = [...draftSketches, ...demoSketches];
    } catch (_) {}
  }

  const drafts = computed(() => {
    const draftItems = draftStorage.loadAllDrafts();
    return draftItems.map(d => draftToSketch(d));
  });

  const publishedWorks = computed(() => {
    return demoWorks.map(w => ({
      _id: w._id,
      userId: w.userId,
      title: w.title,
      description: w.description,
      canvas: { width: w.sketch.width, height: w.sketch.height, pixelSize: w.sketch.pixelSize },
      paletteId: w.sketch.paletteId,
      pixels: '',
      isPublic: true,
      isDraft: false,
      tags: w.tags,
      category: w.category,
      createdAt: new Date(w.createdAt),
      updatedAt: new Date(w.updatedAt),
      publishedAt: w.publishedAt ? new Date(w.publishedAt) : undefined
    }));
  });

  function draftToSketch(d: DraftData): Sketch {
    return {
      _id: d._id,
      userId: 'local',
      title: d.title,
      canvas: { width: d.width, height: d.height, pixelSize: 10 },
      paletteId: d.paletteId,
      pixels: '',
      isPublic: false,
      isDraft: true,
      tags: [],
      createdAt: new Date(d.createdAt),
      updatedAt: new Date(d.updatedAt)
    };
  }

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
    draftStorage.deleteDraft(id);
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
    setCurrentSketch,
    refreshDrafts
  };
});
