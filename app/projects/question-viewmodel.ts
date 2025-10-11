import { Observable, ObservableArray } from '@nativescript/core';
import { ItemStatus, Questions } from '~/common/items';
import { SentenceCase } from '~/common/util';
import Questions77 from '~/common/question_77.json';

export class QuestionViewModel extends Observable {
  private _items: ObservableArray<Questions> = new ObservableArray<Questions>([]);
  private _pagedItems: ObservableArray<Questions> = new ObservableArray<Questions>([]);
  private _searchQuery: string = "";
  private _statusFilter: ItemStatus | null = null;
  private _itemsPerPage: number = 50;
  private _currentPage: number = 1;
  private _totalPages: number = 1;
  private _totalItems: number = 1;
  private _startItem: number = 0;
  private _stopItem: number = 5;
  private _backgroundColor: string = '#e0e0e0';
  private _label1Visibility: string = 'collapse';
  private _error: string = "";
  private _questions: Questions[] = [];
  private _currentIndex = 0;
  public _isLoading: boolean = false;

  constructor(questions: any[] = [], startIndex = 0) {
    super();
    this._questions = Array.isArray(questions) ? questions : [];
    this._currentIndex = startIndex || 0;
    this.loadItems();
    this.notifyAll();
  }

  // Pagination helpers
  public goToPage(page: number) { if (page >= 1 && page <= this._totalPages) { this.currentPage = page; } }
  public goPrev() { if (this._currentPage > 1) { this.currentPage--; this.notifyPropertyChange('currentPage', this._currentPage); } }
  public goNext() { if (this._currentPage < this._totalPages) { this.currentPage++; this.notifyPropertyChange('currentPage', this._currentPage); } }

  // Observable properties
  get items(): ObservableArray<Questions> { return this._pagedItems; }
  get searchQuery(): string { return this._searchQuery; }
  set searchQuery(value: string) { if (this._searchQuery !== value) { this.setSearchQuery(value); } }
  get statusFilter(): ItemStatus | null { return this._statusFilter; }
  set statusFilter(value: ItemStatus | null) { if (this._statusFilter !== value) { this.setStatusFilter(value); } }
  get isLoading(): boolean { return this._isLoading; }
  set isLoading(value: boolean) { if (this._isLoading !== value) { this._isLoading = value; this.notifyPropertyChange("isLoading", value); } }
  get error(): string { return this._error ? SentenceCase(this._error) : ''; }
  set error(value: string) { if (this._error !== value) { this._error = value; this.notifyPropertyChange("error", value); } }

  // Current page info
  get currentPage(): number { return this._currentPage; }
  set currentPage(value: number) {
    if (value >= 1 && value <= this._totalPages) {
      this._currentPage = value;
      this.applyFiltersAndSort();
      this.notifyPropertyChange('currentIndex', this._currentIndex);
      this.notifyPropertyChange('currentPage', this._currentPage);
      this.notifyPropertyChange('pageNumbers', this.pageNumbers);
    }
  }
  get totalPages(): number { return this._totalPages; }
  get totalItems(): number { return this._totalItems; }
  get startItem(): number { return this._startItem; }
  get stopItem(): number { return this._stopItem; }
  get pageNumbers(): { num: number }[] { return Array.from({ length: this._totalPages }, (_, i) => ({ num: i + 1 })); }
  get backgroundColor(): string { return this._backgroundColor; }
  get label1Visibility(): string { return this._label1Visibility; }

  get currentQuestion() {
    if (!Array.isArray(this._questions) || this._questions.length === 0) { return Questions77; }
    return this._questions[this._currentIndex] || null;
  }

  get title(): string {
    const q = this.currentQuestion;
    if (!q) return 'No Question';
    return `${q.id}. ${q.title || q.name || ''}`;
  }

  public async next() { this._currentIndex++; this.notifyAll(); }
  public async previous() {  this._currentIndex--; this.notifyAll(); }

  private notifyAll() {
    this.notifyPropertyChange("currentQuestion", this.currentQuestion);
    this.notifyPropertyChange("title", this.title);
    // this.notifyPropertyChange("hasNext", this.hasNext);
    // this.notifyPropertyChange("hasPrevious", this.hasPrevious);
  }

  private async loadItems(): Promise<void> {
    this._isLoading = true;
    try {
      const processedItems = Questions77.map(item => this.processItem(item));
      this._items.splice(0);
      this._items.push(...processedItems);
      await this.applyFiltersAndSort();
    } catch (err) {
      this._error = "Error loading items: " + err;
    } finally {
      this._isLoading = false;
    }
  }

  private async applyFiltersAndSort(): Promise<void> {
    let filtered = Array.from(this._items);

    if (this._statusFilter !== null) {
      filtered = filtered.filter(item => item.status === this._statusFilter);
    }

    if (this._searchQuery) {
      const lowerQuery = this._searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.type.toLowerCase().includes(lowerQuery) ||
        (item.name?.toLowerCase().includes(lowerQuery) ?? false)
      );
    }

    this._totalItems = filtered.length;
    if (this._totalItems <= 50) this._itemsPerPage = 20;
    else if (this._totalItems > 50 && this._totalItems <= 100) this._itemsPerPage = 20;
    else this._itemsPerPage = 50;
    const hasHtml = filtered.some(item => item.type === 'html');
    if (!hasHtml) { this._backgroundColor = "#ff0000"; this._label1Visibility = "visible"; }
    else { this._backgroundColor = "#e0e0e0"; this._label1Visibility = "collapse"; }
    this._totalPages = Math.max(1, Math.ceil(this.totalItems / this._itemsPerPage));
    if (this._currentPage > this._totalPages) this._currentPage = this._totalPages;
    const start = (this._currentPage - 1) * this._itemsPerPage;
    const stop = Math.min(start + this._itemsPerPage, this.totalItems);
    this._startItem = start;
    this._stopItem = stop;
    const pageItems = filtered.slice(start, stop);
    this._pagedItems.splice(0);
    this._pagedItems.push(...pageItems);
    this.notifyPropertyChange('items', this._pagedItems);
    this.notifyPropertyChange('currentPage', this._currentPage);
    this.notifyPropertyChange('totalPages', this._totalPages);
    this.notifyPropertyChange('pageNumbers', this.pageNumbers);
    this.notifyPropertyChange('totalItems', this._totalItems);
    this.notifyPropertyChange('startItem', this._startItem);
    this.notifyPropertyChange('stopItem', this._stopItem);
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

  async setStatusFilter(status: ItemStatus | null): Promise<void> {
    if (this._statusFilter !== status) {
      this._statusFilter = status;
      this._currentPage = 1;
      this.notifyPropertyChange('statusFilter', status);
      await this.applyFiltersAndSort();
    }
  }

  async setSearchQuery(query: string): Promise<void> {
    if (this._searchQuery !== query) {
      this._searchQuery = query;
      this._currentPage = 1;
      this.notifyPropertyChange('searchQuery', query);
      await this.applyFiltersAndSort();
    }
  }

  async clearFilters(): Promise<void> {
    this._searchQuery = '';
    this._statusFilter = null;
    this.notifyPropertyChange('searchQuery', '');
    this.notifyPropertyChange('statusFilter', null);
    await this.applyFiltersAndSort();
  }

  async refresh(): Promise<void> {
    this._items.splice(0);
    this._pagedItems.splice(0);
    await this.loadItems();
  }

  public setCurrentQuestion(question: Questions) {
    const index = this._questions.findIndex(q => q.id === question.id);
    if (index !== -1) { this._currentIndex = index; this.notifyAll(); }
  }

}
