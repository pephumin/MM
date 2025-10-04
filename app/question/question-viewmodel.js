"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionViewModel = void 0;
const core_1 = require("@nativescript/core");
const question_77_json_1 = __importDefault(require("../common/question_77.json"));
class QuestionViewModel extends core_1.Observable {
    constructor() {
        super();
        this._items = new core_1.ObservableArray();
        this._filteredItems = new core_1.ObservableArray();
        this._pagedItems = new core_1.ObservableArray();
        this._searchQuery = '';
        this._statusFilter = null;
        this._itemsPerPage = 50;
        this._currentPage = 1;
        this._totalPages = 1;
        this._isLoading = false;
        this._error = null;
        this.loadItems();
        // bind pagination actions so UI can call them
        this.set('goPrev', this.goPrev.bind(this));
        this.set('goNext', this.goNext.bind(this));
        // this.set('goToPage', this.goToPage.bind(this));
    }
    // === Public bindings ===
    get items() {
        return this._pagedItems; // show current page only
    }
    get totalItems() { return this._items.length; }
    // get searchQuery(): string { return this._searchQuery; }
    // set searchQuery(value: string) { this.setSearchQuery(value); }
    get searchQuery() { return this._searchQuery; }
    set searchQuery(value) {
        if (this._searchQuery !== value) {
            this._searchQuery = value;
            this._currentPage = 1;
            this.applyFiltersAndSort();
            this.notifyPropertyChange('searchQuery', this._searchQuery);
        }
    }
    get statusFilter() { return this._statusFilter; }
    set statusFilter(value) { this.setStatusFilter(value); }
    get isLoading() { return this._isLoading; }
    get error() { return this._error; }
    get currentPage() { return this._currentPage; }
    set currentPage(value) {
        if (value >= 1 && value <= this._totalPages) {
            this._currentPage = value;
            this.applyFiltersAndSort();
            this.notifyPropertyChange('currentPage', this._currentPage);
            this.notifyPropertyChange('pageNumbers', this.pageNumbers);
        }
    }
    get totalPages() { return this._totalPages; }
    get pageNumbers() {
        return Array.from({ length: this._totalPages }, (_, i) => ({ num: i + 1 }));
    }
    // === Data loading ===
    async loadItems() {
        try {
            this._isLoading = true;
            const rawData = question_77_json_1.default;
            const processed = rawData.map((item) => this.processItem(item));
            this._items.splice(0);
            this._items.push(...processed);
            this._error = null;
            await this.applyFiltersAndSort();
        }
        catch (err) {
            this._error = err instanceof Error ? err.message : 'Unknown error';
            console.error('Error loading items:', err);
        }
        finally {
            this._isLoading = false;
        }
    }
    processItem(item) {
        return {
            ...item,
            id: Number(item.id),
            colCount: Number(item.colCount || 0),
        };
    }
    // === Filters & Pagination ===
    async applyFiltersAndSort() {
        let filtered = Array.from(this._items);
        // filter by status
        if (this._statusFilter !== null) {
            filtered = filtered.filter((it) => it.status === this._statusFilter);
        }
        // filter by search
        if (this._searchQuery) {
            const q = this._searchQuery.toLowerCase();
            filtered = filtered.filter((it) => it.title.toLowerCase().includes(q) ||
                (it.name?.toLowerCase().includes(q) ?? false));
        }
        // update filtered items
        this._filteredItems.splice(0);
        this._filteredItems.push(...filtered);
        // pagination
        this._totalPages = Math.max(1, Math.ceil(filtered.length / this._itemsPerPage));
        if (this._currentPage > this._totalPages) {
            this._currentPage = this._totalPages;
        }
        const start = (this._currentPage - 1) * this._itemsPerPage;
        const end = start + this._itemsPerPage;
        const pageItems = filtered.slice(start, end);
        this._pagedItems.splice(0);
        this._pagedItems.push(...pageItems);
        // notify UI
        this.notifyPropertyChange('items', this._pagedItems);
        this.notifyPropertyChange('currentPage', this._currentPage);
        this.notifyPropertyChange('totalPages', this._totalPages);
        this.notifyPropertyChange('pageNumbers', this.pageNumbers);
    }
    // === Public actions ===
    async setSearchQuery(query) {
        if (this._searchQuery !== query) {
            this._searchQuery = query;
            this._currentPage = 1;
            await this.applyFiltersAndSort();
        }
    }
    async setStatusFilter(status) {
        if (this._statusFilter !== status) {
            this._statusFilter = status;
            this._currentPage = 1;
            await this.applyFiltersAndSort();
        }
    }
    async clearFilters() {
        this._searchQuery = '';
        this._statusFilter = null;
        this._currentPage = 1;
        await this.applyFiltersAndSort();
    }
    async refresh() {
        this._items.splice(0);
        this._filteredItems.splice(0);
        await this.loadItems();
    }
    goPrev() {
        if (this._currentPage > 1) {
            this.currentPage = this._currentPage - 1;
        }
    }
    goNext() {
        if (this._currentPage < this._totalPages) {
            this.currentPage = this._currentPage + 1;
        }
    }
}
exports.QuestionViewModel = QuestionViewModel;
