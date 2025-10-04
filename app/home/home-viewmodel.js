"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeItemDetailViewModel = exports.HomeViewModel = void 0;
const core_1 = require("@nativescript/core");
const items_1 = require("../common/items");
const project_D_json_1 = __importDefault(require("../common/project_D.json"));
class HomeViewModel extends core_1.Observable {
    // private _searchQuery: string = '';
    // private _statusFilter: ItemStatus | null = null;
    constructor() {
        super();
        this._items = new core_1.ObservableArray([]);
        this._filteredItems = new core_1.ObservableArray([]);
        this._pagedItems = new core_1.ObservableArray([]);
        this._searchQuery = '';
        this._statusFilter = null;
        this._itemsPerPage = 10;
        this._currentPage = 1;
        this._totalPages = 1;
        // private _filteredItems: ObservableArray<HomeItem>;
        this._isLoading = false;
        this._error = null;
        this._items = new core_1.ObservableArray();
        this._filteredItems = new core_1.ObservableArray();
        this.set('goPrev', this.goPrev);
        this.set('goNext', this.goNext);
        this.set('goToPage', this.goToPage);
        this.set('refresh', this.refresh);
        this.loadItems();
    }
    get items() { return this._filteredItems; }
    get totalItems() { return this._items.length; }
    get searchQuery() { return this._searchQuery; }
    set searchQuery(value) { if (this._searchQuery !== value) {
        this.setSearchQuery(value);
    } }
    get statusFilter() { return this._statusFilter; }
    set statusFilter(value) { if (this._statusFilter !== value) {
        this.setStatusFilter(value);
    } }
    get isLoading() { return this._isLoading; }
    get error() { return this._error; }
    async loadItems() {
        try {
            this._isLoading = true;
            const rawData = project_D_json_1.default;
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
        }
    }
    async applyFiltersAndSort() {
        let filtered = Array.from(this._items);
        // let filtered = this._items.filter(item => {
        //   const matchesQuery = !this._searchQuery ||
        //     item.title.toLowerCase().includes(this._searchQuery.toLowerCase());
        //   const matchesStatus = this._statusFilter === null || item.status === this._statusFilter;
        //   return matchesQuery && matchesStatus;
        // });
        // this.notifyPropertyChange('totalPages', this._totalPages);
        // this.notifyPropertyChange('items', this._pagedItems);
        if (this._statusFilter !== null) {
            filtered = filtered.filter(item => item.status === this._statusFilter);
        }
        if (this._searchQuery) {
            const query = this._searchQuery.toLowerCase();
            filtered = filtered.filter(item => item.title.toLowerCase().includes(query) ||
                (item.description?.toLowerCase().includes(query) ?? false));
        }
        this._filteredItems.splice(0);
        this._filteredItems.push(...filtered);
        // this.notifyPropertyChange('items', this._filteredItems);
        this._totalPages = Math.max(1, Math.ceil(filtered.length / this._itemsPerPage));
        if (this._currentPage > this._totalPages) {
            this._currentPage = this._totalPages;
        }
        const start = (this._currentPage - 1) * this._itemsPerPage;
        const end = start + this._itemsPerPage;
        const pageItems = filtered.slice(start, end);
        this._pagedItems.splice(0);
        this._pagedItems.push(...pageItems);
    }
    processItem(item) {
        return {
            ...item,
            created: new Date(item.created),
            updated: new Date(item.updated),
            rD: Boolean(item.rD),
            status: Number(item.status),
            isPrivate: Number(item.private),
            userId: Number(item.userid),
            cookieId: Number(item.cookie),
            companyId: Number(item.companyid),
            accessLevel: Number(item.level)
        };
    }
    deleteItem(index) {
        if (index >= 0 && index < this._items.length) {
            this._items.splice(index, 1);
            return true;
        }
        return false;
    }
    getItemsByStatus(status) {
        return Array.from(this._items.filter(item => item.status === status));
    }
    searchItems(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this._items.filter(item => item.title.toLowerCase().includes(lowerQuery) ||
            (item.description?.toLowerCase().includes(lowerQuery) ?? false)));
    }
    async setStatusFilter(status) {
        if (this._statusFilter !== status) {
            this._statusFilter = status;
            this._currentPage = 1;
            // this.notifyPropertyChange('statusFilter', status);
            await this.applyFiltersAndSort();
        }
    }
    async setSearchQuery(query) {
        if (this._searchQuery !== query) {
            this._searchQuery = query;
            this._currentPage = 1;
            // this.notifyPropertyChange('searchQuery', query);
            await this.applyFiltersAndSort();
        }
    }
    async clearFilters() {
        this._searchQuery = '';
        this._statusFilter = null;
        // this.notifyPropertyChange('searchQuery', '');
        // this.notifyPropertyChange('statusFilter', null);
        await this.applyFiltersAndSort();
    }
    getStats() {
        const stats = {
            total: this._items.length,
            byStatus: {
                [items_1.ItemStatus.Draft]: 0,
                [items_1.ItemStatus.Published]: 0,
                [items_1.ItemStatus.Archived]: 0
            },
            private: 0,
            public: 0
        };
        this._items.forEach(item => {
            stats.byStatus[item.status]++;
            if (item.isPrivate === items_1.PrivacyLevel.Private) {
                stats.private++;
            }
            else {
                stats.public++;
            }
        });
        return stats;
    }
    async refresh() {
        this._items.splice(0);
        this._filteredItems.splice(0);
        await this.loadItems();
    }
    get itemsPerPage() { return this._itemsPerPage; }
    set itemsPerPage(value) {
        if (this._itemsPerPage !== value) {
            this._itemsPerPage = value;
            this._currentPage = 1;
            // this.notifyPropertyChange('itemsPerPage', value);
            this.applyFiltersAndSort();
        }
    }
    get currentPage() { return this._currentPage; }
    set currentPage(value) {
        if (value >= 1 && value <= this._totalPages && this._currentPage !== value) {
            this._currentPage = value;
            // this.notifyPropertyChange('currentPage', value);
            this.applyFiltersAndSort();
        }
    }
    get totalPages() { return this._totalPages; }
    goToPage(page) { if (page >= 1 && page <= this._totalPages) {
        this.currentPage = page;
    } }
    goPrev() { if (this._currentPage > 1) {
        this.currentPage = this._currentPage - 1;
    } }
    goNext() { if (this._currentPage < this._totalPages) {
        this.currentPage = this._currentPage + 1;
    } }
}
exports.HomeViewModel = HomeViewModel;
class HomeItemDetailViewModel extends core_1.Observable {
    constructor(item) {
        super();
        this._item = item;
    }
    get title() { return this._item.title; }
    get description() { return this._item.description || 'No description available'; }
    get status() {
        switch (this._item.status) {
            case items_1.ItemStatus.Draft: return 'Draft';
            case items_1.ItemStatus.Published: return 'Published';
            case items_1.ItemStatus.Archived: return 'Archived';
            default: return 'Unknown';
        }
    }
    get created() { return this.formatDate(this._item.created); }
    get updated() { return this.formatDate(this._item.updated); }
    get userInfo() { return `${this._item.userFullName} (${this._item.userEmail})`; }
    get companyInfo() { return this._item.companyName; }
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
exports.HomeItemDetailViewModel = HomeItemDetailViewModel;
