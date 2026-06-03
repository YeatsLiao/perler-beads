import { demoWorks, type DemoWork } from '@/utils/demoWorks';
import { draftStorage, type DraftData } from '@/utils/draftStorage';

export interface SearchableItem {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  source: 'demo' | 'draft';
  originalData: DemoWork | DraftData;
}

class LocalSearchService {
  private index: SearchableItem[] = [];

  refreshIndex(): void {
    this.index = [];

    for (const work of demoWorks) {
      this.index.push({
        _id: work._id,
        title: work.title,
        description: work.description || '',
        tags: work.tags || [],
        category: work.category || 'other',
        source: 'demo',
        originalData: work
      });
    }

    try {
      const drafts = draftStorage.loadAllDrafts();
      for (const draft of drafts) {
        this.index.push({
          _id: draft._id,
          title: draft.title,
          description: '',
          tags: [],
          category: 'other',
          source: 'draft',
          originalData: draft
        });
      }
    } catch (_) {}
  }

  search(keyword: string): SearchableItem[] {
    if (!keyword.trim()) return [];
    const lower = keyword.toLowerCase();
    return this.index.filter(item =>
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower) ||
      item.tags.some(tag => tag.toLowerCase().includes(lower))
    );
  }

  searchByTag(tag: string): SearchableItem[] {
    if (!tag.trim()) return [];
    const lower = tag.toLowerCase();
    return this.index.filter(item =>
      item.tags.some(t => t.toLowerCase().includes(lower))
    );
  }

  searchByCategory(category: string): SearchableItem[] {
    if (!category.trim()) return [];
    return this.index.filter(item => item.category === category);
  }

  getAllItems(): SearchableItem[] {
    return this.index;
  }
}

export const localSearchService = new LocalSearchService();
