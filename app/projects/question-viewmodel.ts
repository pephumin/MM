import { Observable, ObservableArray } from '@nativescript/core';
import { ItemStatus, Questions } from '~/common/items';
import { SentenceCase } from '~/common/util';
import Questions77 from '~/common/question_77.json';

export class QuestionViewModel extends Observable {
  public _items: ObservableArray<Questions> = new ObservableArray<Questions>([]);
  public _pagedItems: ObservableArray<Questions> = new ObservableArray<Questions>([]);
  public _searchQuery = "";
  public _statusFilter: ItemStatus | null = null;
  public _itemsPerPage = 50;
  public _currentPage = 1;
  public _totalPages = 1;
  public _totalItems = 1;
  public _startItem = 0;
  public _stopItem = 5;
  public _backgroundColor = '#e0e0e0';
  public _label1Visibility = 'collapse';
  public _error = "";
  public _questions: Questions[] = [];
  public isLoading = false;
  public _filteredQuestions: Questions[] = [];
  public _currentId: number | null = null;
  public _currentIndex: number = 0;
  public isLoaded = false;

  constructor(questions: any[] = [], startIndex = 0) {
    super();
    this._questions = questions || [];
    this._currentId = startIndex || 0;
    this.loadItems();

    // Bind pagination for XML tap
    this.set("goPrev", this.goPrev.bind(this));
    this.set("goNext", this.goNext.bind(this));
  }

  // --- Pagination ---
  public goPrev() {
    if (this._currentPage <= 1) return;
    this._currentPage--;
    this.applyFiltersAndSort();
    this.updateBindings();
  }

  public goNext() {
    if (this._currentPage >= this._totalPages) return;
    this._currentPage++;
    this.applyFiltersAndSort();
    this.updateBindings();
  }

  private updateBindings() {
  // 🔁 Force reactivity for pagination and list updates
    this.set("items", this._pagedItems);
    this.set("activeQuestions", this.activeQuestions);
    this.set("currentPage", this._currentPage);
    this.set("totalPages", this._totalPages);
    this.set("totalItems", this._totalItems);
    this.set("startItem", this._startItem);
    this.set("stopItem", this._stopItem);

    // These calls ensure reactivity in both iOS and Android
    this.notifyPropertyChange("items", this._pagedItems);
    this.notifyPropertyChange("currentPage", this._currentPage);
    this.notifyPropertyChange("totalPages", this._totalPages);
    this.notifyPropertyChange("totalItems", this._totalItems);
    this.notifyPropertyChange("startItem", this._startItem);
    this.notifyPropertyChange("stopItem", this._stopItem);
  }

  get items() { return this._pagedItems; }

  // --- Search ---

  public setSearchQuery(query: string) {
    const trimmed = query.trim();
    if (this._searchQuery === trimmed) return; // avoid redundant refreshes

    this._searchQuery = trimmed;
    this.filterQuestions(this._searchQuery);
    this._currentPage = 1;

    this.applyFiltersAndSort();
    this.updateBindings();

    // 🔁 Force NativeScript to refresh the bound SearchBar and ListView
    this.set("searchQuery", this._searchQuery);
    this.notifyPropertyChange("searchQuery", this._searchQuery);
    this.notifyPropertyChange("items", this._pagedItems);
  }

  // public setSearchQuery(query: string) {
  //   this._searchQuery = query.trim();
  //   this.filterQuestions(this._searchQuery);
  //   this._currentPage = 1;
  //   this.applyFiltersAndSort();
  //   this.updateBindings();
  // }

  public filterQuestions(query: string) {
    if (!query) { this.clearFilter(); return; }
    const normalized = query.toLowerCase();
    this._filteredQuestions = this._questions.filter(q =>
      (q.title && q.title.toLowerCase().includes(normalized)) ||
      (q.name && q.name.toLowerCase().includes(normalized))
    );
    this._currentId = 0;
  }

  public clearFilter() {
    this._filteredQuestions = [];
    this._currentId = 0;
  }

  get activeQuestions() {
    return this._searchQuery && this._filteredQuestions.length > 0
      ? this._filteredQuestions
      : this._questions;
  }

  // --- Current Question ---
  get currentQuestion() {
    const list = this.activeQuestions.length ? this.activeQuestions : this._items;
    return list[this._currentIndex] || null;
  }

  get currentQuestionId(): number | null { return this._currentId; }

  public setCurrentQuestion(id: number | string) {
    const list = this.activeQuestions.length ? this.activeQuestions : this._items;
    if (!Array.isArray(list) || list.length === 0) {
      console.warn("setCurrentQuestion called but list is empty");
      return;
    }

    const numericId = Number(id);
    const index = list.findIndex(q => Number(q.id) === numericId);
    if (index === -1) {
      console.error("setCurrentQuestion: No match found for id:", numericId);
      return;
    }

    this._currentIndex = index;
    this._currentId = Number(list[index].id);
    this.notifyPropertyChange("currentQuestion", this.currentQuestion);
    this.notifyPropertyChange("canGoPrev", this.canGoPrev);
    this.notifyPropertyChange("canGoNext", this.canGoNext);
  }

  get canGoPrev() { return this._currentIndex > 0; }
  get canGoNext() {
    const list = this.activeQuestions.length ? this.activeQuestions : this._items;
    return this._currentIndex < list.length - 1;
  }

  // --- Loading ---
  public loadItems(): void {
    if (this.isLoaded) return;

    try {
      this.isLoading = true;
      const processed = Questions77.map(item => this.processItem(item));
      this._items.splice(0);
      this._items.push(...processed);
      this._questions = [...this._items];
      this.applyFiltersAndSort();
      this.isLoaded = true;
      console.log("✅ Items loaded:", this._items.length);
    } catch (err) {
      this._error = "Error loading items: " + err;
    } finally {
      this.isLoading = false;
    }
  }

  private applyFiltersAndSort(): void {
    let filtered = Array.from(this._items);
    if (this._searchQuery) {
      const q = this._searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        (item.name?.toLowerCase().includes(q) ?? false)
      );
    }

    this._totalItems = filtered.length;
    this._itemsPerPage = this._totalItems <= 50 ? 20 : 50;
    this._totalPages = Math.max(1, Math.ceil(this._totalItems / this._itemsPerPage));

    const start = (this._currentPage - 1) * this._itemsPerPage;
    const stop = Math.min(start + this._itemsPerPage, this._totalItems);

    this._startItem = this._totalItems ? start + 1 : 0;
    this._stopItem = stop;

    const pageItems = filtered.slice(start, stop);
    this._pagedItems.splice(0);
    if (pageItems.length > 0) this._pagedItems.push(...pageItems);

    // this.updateBindings();
    this.updateBindings();
    // console.log(`📊 Page ${this._currentPage}/${this._totalPages} | Showing ${this._startItem}-${this._stopItem} of ${this._totalItems}`);
    console.log(`📊 Page ${this._currentPage}/${this._totalPages} | Showing ${this._startItem}-${this._stopItem} of ${this._totalItems}`);
  }

  private processItem(item: any): Questions {
    return {
      ...item,
      id: Number(item.id),
      title: String(item.title || '').trim(),
      name: SentenceCase(String(item.name || '')),
      type: String(item.type || '').trim(),
      colCount: Number(item.colCount || 0)
    };
  }

  // --- Question navigation inside detail ---
  public goNextQuestion() {
    const list = this.activeQuestions.length ? this.activeQuestions : this._items;
    if (this._currentIndex < list.length - 1) {
      this._currentIndex++;
      this._currentId = Number(list[this._currentIndex].id);
      this.notifyPropertyChange("currentQuestion", this.currentQuestion);
    } else {
      console.warn("🚫 Already at last question");
    }
  }

  public goPreviousQuestion() {
    const list = this.activeQuestions.length ? this.activeQuestions : this._items;
    if (this._currentIndex > 0) {
      this._currentIndex--;
      this._currentId = Number(list[this._currentIndex].id);
      this.notifyPropertyChange("currentQuestion", this.currentQuestion);
    } else {
      console.warn("🚫 Already at first question");
    }
  }

  public pauseReactivity() {
    try {
      this.isLoading = false
      this._searchQuery = ''
      this._pagedItems.splice(0)
      console.log('⏸️ ViewModel reactivity paused for safe teardown.')
    } catch (err) {
      console.warn('⚠️ pauseReactivity failed:', err)
    }
  }

}