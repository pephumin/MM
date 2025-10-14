import { Observable, ObservableArray } from '@nativescript/core';
import { HomeItem, ItemStatus, PrivacyLevel } from '~/common/items';
import { LowerCase, SentenceCase, validateEmail } from "~/common/util";
import homedata from '~/common/project_D.json';

export class HomeViewModel extends Observable {
  private _items: ObservableArray<HomeItem> = new ObservableArray<HomeItem>([]);
  private _pagedItems: ObservableArray<HomeItem> = new ObservableArray<HomeItem>([]);
  private _searchQuery: string = "";
  private _statusFilter: ItemStatus | null = null;
  private _itemsPerPage: number | 10 | 20 | 50 = 10;
  private _currentPage: number = 1;
  private _totalPages: number = 1;
  private _totalItems: number = 1;
  private _startItem: number = 0;
  private _stopItem: number = 5;
  private _isLoading: boolean = false;
  private _error: string = "";

  constructor() {
    super();
    this.set('goPrev', this.goPrev);
    this.set('goNext', this.goNext);
    this.set('goToPage', this.goToPage);
    this.set('refresh', this.refresh);
    this.loadItems();
  }

  public goToPage(page: number) { if (page >= 1 && page <= this._totalPages) { this.currentPage = page; } }
  public goPrev() { if (this._currentPage > 1) { this.currentPage = this._currentPage - 1; } }
  public goNext() { if (this._currentPage < this._totalPages) { this.currentPage = this._currentPage + 1; } }

  get items(): ObservableArray<HomeItem> { return this._pagedItems; }
  get searchQuery(): string { return this._searchQuery; }
  set searchQuery(value: string) { if (this._searchQuery !== value) { this.setSearchQuery(value); this._currentPage = 1; this.notifyPropertyChange("searchQuery", value); } }
  get statusFilter(): ItemStatus { return this._statusFilter; }
  set statusFilter(value: ItemStatus) { if (this._statusFilter !== value) { this.setStatusFilter(value); this.notifyPropertyChange("statusFilter", value); } }
  get isLoading(): boolean { return this._isLoading; }
  set isLoading(value: boolean) { if (this._isLoading !== value) { this._isLoading = value; this.notifyPropertyChange("isLoading", value); } }
  get error(): string { if (this._error) { return SentenceCase(this._error); } }
  set error(value: string) { if (this._error !== value) { this._error = value; this.notifyPropertyChange("error", value); } }
  get currentPage(): number { return this._currentPage; }
  set currentPage(value: number) {
    if (value >= 1 && value <= this._totalPages) {
      this._currentPage = value;
      this.applyFiltersAndSort();
      this.notifyPropertyChange('currentPage', this._currentPage);
      this.notifyPropertyChange('pageNumbers', this.pageNumbers);
    }
  }
  get totalPages(): number { return this._totalPages; }
  set totalPages(value: number) { if (this._totalPages !== value) { this._totalPages = value; this.notifyPropertyChange("totalPages", value); } }
  get totalItems(): number { return this._totalItems; }
  set totalItems(value: number) { if (this._totalItems !== value) { this._totalItems = value; this.notifyPropertyChange("totalItems", value); } }
  get startItem(): number { return this._startItem; }
  set startItem(value: number) { if (this._startItem !== value) { this._startItem = value; this.notifyPropertyChange("startItem", value); } }
  get stopItem(): number { return this._stopItem; }
  set stopItem(value: number) { if (this._stopItem !== value) { this._stopItem = value; this.notifyPropertyChange("stopItem", value); } }
  get pageNumbers(): { num: number }[] { return Array.from({ length: this._totalPages }, (_, i) => ({ num: i + 1 })); }
  // get backgroundColor(): string { return this._backgroundColor; }
  // set backgroundColor(value: string) { if (this._backgroundColor !== value) { this._backgroundColor = value; this.notifyPropertyChange("backgroundColor", value); } }
  // get label1Visibility(): string { return this._label1Visibility; }
  // set label1Visibility(value: string) { if (this._label1Visibility !== value) { this._label1Visibility = value; this.notifyPropertyChange("label1Visibility", value); } }

  private async loadItems(): Promise<void> {
    this._isLoading = true;
    try {
      const rawData = homedata;
      const processedItems = rawData.map(item => this.processItem(item));
      this._items.splice(0);
      this._items.push(...processedItems);
      await this.applyFiltersAndSort();
    } 
    catch (err) { this._error = "Error loading items: " + err; }
    finally { this._isLoading = false; }
  }

  private async applyFiltersAndSort(): Promise<void> {
    let filtered = Array.from(this._items);
    if (this._statusFilter !== null) { filtered = filtered.filter(item => item.status === this._statusFilter); }    
    if (this._searchQuery) {
      this._itemsPerPage = 20;
      this.totalItems = this._items.length;
      const lowerQuery = this._searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.description?.toLowerCase().includes(lowerQuery) ?? false)
      );
    }
    if (this.totalItems !== filtered.length) { this.totalItems = filtered.length; }
    // console.log(this.totalItems);
    if (this.totalItems <= 30) { this._itemsPerPage = 10; }
    else if (this.totalItems > 30 && this.totalItems <= 50) { this._itemsPerPage = 20; }
    else { this._itemsPerPage = 50; }
    
    this._totalPages = Math.max(1, Math.ceil(this._totalItems / this._itemsPerPage));
    if (this._currentPage > this._totalPages) { this._currentPage = this._totalPages; }
    var start = (this._currentPage - 1) * this._itemsPerPage;
    var stop = start + this._itemsPerPage;
    // console.log(this.totalItems, start, stop)
    if ((this._currentPage === this._totalPages) && (stop > this.totalItems)) { stop = this.totalItems; }
    const pageItems = filtered.slice(start, stop);
    this._pagedItems.splice(0);
    this._pagedItems.push(...pageItems);
    if (this.startItem !== start) { this.startItem = start; }
    if (this.stopItem !== stop) { this.stopItem = stop; }
    this.notifyPropertyChange('items', this._pagedItems);
    this.notifyPropertyChange('currentPage', this._currentPage);
    this.notifyPropertyChange('totalPages', this._totalPages);
    this.notifyPropertyChange('pageNumbers', this.pageNumbers);
  }

  private processItem(item: any): HomeItem {
    return {
      ...item,
      created: new Date(item.created),
      updated: new Date(item.updated),
      rD: Boolean(item.rD),
      status: Number(item.status) as ItemStatus,
      isPrivate: Number(item.private) as PrivacyLevel,
      userId: Number(item.userid),
      cookieId: Number(item.cookie),
      companyId: Number(item.companyid),
      accessLevel: Number(item.level)
    };
  }

  getItemsByStatus(status: ItemStatus): Array<HomeItem> {
    return Array.from(this._items.filter(item => item.status === status));
  }

  searchItems(query: string): Array<HomeItem> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this._items.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      (item.description?.toLowerCase().includes(lowerQuery) ?? false)
    ));
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
}

export class HomeItemDetailViewModel extends Observable {
  private _item: HomeItem;

  constructor(item: HomeItem) {
    super();
    this._item = item;
  }

  get title(): string { return this._item.title; }
  get description(): string { return this._item.description || 'No description available'; }
  get created(): string { return this.formatDate(this._item.created); }
  get updated(): string { return this.formatDate(this._item.updated); }
  get userInfo(): string { return `${this._item.userFullName} (${this._item.userEmail})`; }
  get companyInfo(): string { return this._item.companyName; }
  get status(): string {
    switch (this._item.status) {
      case ItemStatus.Draft: return 'Draft';
      case ItemStatus.Published: return 'Published';
      case ItemStatus.Archived: return 'Archived';
      default: return 'Unknown';
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

