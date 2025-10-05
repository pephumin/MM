import { Observable, ObservableArray } from '@nativescript/core'
import { BrowseItem, ItemStatus, PrivacyLevel } from '~/common/items'
import browsedata from '~/common/project_E.json'

export class BrowseViewModel extends Observable {
  private _items: ObservableArray<BrowseItem>;
  private _filteredItems: ObservableArray<BrowseItem>;
  private _isLoading: boolean = false;
  private _error: string | null = null;
  private _currentPage: number = 1;
  private _itemsPerPage: number = 20;
  private _totalPages: number = 1;
  private _searchQuery: string = '';
  private _statusFilter: ItemStatus | null = null;

  constructor() {
    super();
    this._items = new ObservableArray<BrowseItem>();
    this._filteredItems = new ObservableArray<BrowseItem>();
    this.loadItems();
  }

  get items(): ObservableArray<BrowseItem> { return this._filteredItems; }
  get totalItems(): number { return this._items.length; }
  get currentPage(): number { return this._currentPage; }
  get totalPages(): number { return this._totalPages; }
  get itemsPerPage(): number { return this._itemsPerPage; }
  get searchQuery(): string { return this._searchQuery; }
  get statusFilter(): ItemStatus | null { return this._statusFilter; }
  get isLoading(): boolean { return this._isLoading; }
  get error(): string | null { return this._error; }

  private async loadItems(): Promise<void> {
    this._isLoading = true;
    this.notifyPropertyChange('isLoading', this._isLoading);
    try {
      const rawData = browsedata;
      const processedItems = rawData.map(item => this.processItem(item));
      this._items.splice(0);
      this._items.push(...processedItems);
      this._error = null;
      await this.applyFiltersAndSort();
    } 
    catch (error) {
      this._error = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error loading items:', error);
    } 
    finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', this._isLoading);
      this.notifyPropertyChange('error', this._error);
    }
  }

  private async applyFiltersAndSort(): Promise<void> {
    let filtered = Array.from(this._items);
    if (this._statusFilter !== null) {
      filtered = filtered.filter(item => item.status === this._statusFilter);
    }
    if (this._searchQuery) {
      const query = this._searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        (item.description?.toLowerCase().includes(query) ?? false)
      );
    }

    this._totalPages = Math.ceil(filtered.length / this._itemsPerPage);
    this._currentPage = Math.min(this._currentPage, this._totalPages);
    const start = (this._currentPage - 1) * this._itemsPerPage;
    const end = start + this._itemsPerPage;
    const paginatedItems = filtered.slice(start, end);
    this._filteredItems.splice(0);
    this._filteredItems.push(...paginatedItems);
    this.notifyPropertyChange('items', this._filteredItems);
    this.notifyPropertyChange('totalPages', this._totalPages);
    this.notifyPropertyChange('currentPage', this._currentPage);
  }

  private processItem(item: any): BrowseItem {
    return {
      ...item,
      created: new Date(item.created),
      updated: new Date(item.updated),
      isRnD: Boolean(item.rD),
      status: Number(item.status) as ItemStatus,
      isPrivate: Number(item.private) as PrivacyLevel,
      userId: Number(item.userid),
      cookieId: Number(item.cookie),
      companyId: Number(item.companyid),
      accessLevel: Number(item.level)
    };
  }

  getItemsByStatus(status: ItemStatus): Array<BrowseItem> {
    return Array.from(this._items.filter(item => item.status === status));
  }

  searchItems(query: string): Array<BrowseItem> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this._items.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      (item.description?.toLowerCase().includes(lowerQuery) ?? false)
    ));
  }

  async setItemsPerPage(count: number): Promise<void> {
    if (count > 0 && this._itemsPerPage !== count) {
      this._itemsPerPage = count;
      this.notifyPropertyChange('itemsPerPage', count);
      await this.applyFiltersAndSort();
    }
  }

  async goToPage(page: number): Promise<void> {
    if (page > 0 && page <= this._totalPages && page !== this._currentPage) {
      this._currentPage = page;
      await this.applyFiltersAndSort();
    }
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
    this._currentPage = 1;
    this.notifyPropertyChange('searchQuery', '');
    this.notifyPropertyChange('statusFilter', null);
    
    await this.applyFiltersAndSort();
  }

  async refresh(): Promise<void> {
    this._items.splice(0);
    this._filteredItems.splice(0);
    await this.loadItems();
  }
}
