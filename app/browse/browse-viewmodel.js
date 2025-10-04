"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseViewModel = exports.SortOption = void 0;
const core_1 = require("@nativescript/core");
const items_1 = require("../common/items");
const project_E_json_1 = __importDefault(require("../common/project_E.json"));
/**
 * ViewModel for managing browse screen items
 */
/** Sort options for items */
var SortOption;
(function (SortOption) {
    SortOption["DateCreatedAsc"] = "created_asc";
    SortOption["DateCreatedDesc"] = "created_desc";
    SortOption["TitleAsc"] = "title_asc";
    SortOption["TitleDesc"] = "title_desc";
    SortOption["StatusAsc"] = "status_asc";
    SortOption["StatusDesc"] = "status_desc";
})(SortOption || (exports.SortOption = SortOption = {}));
class BrowseViewModel extends core_1.Observable {
    constructor() {
        super();
        this._isLoading = false;
        this._error = null;
        this._currentPage = 1;
        this._itemsPerPage = 20;
        this._totalPages = 1;
        this._currentSort = SortOption.DateCreatedDesc;
        this._searchQuery = '';
        this._statusFilter = null;
        this._items = new core_1.ObservableArray();
        this._filteredItems = new core_1.ObservableArray();
        this.loadItems();
    }
    /** Get all items in the view */
    get items() {
        return this._filteredItems;
    }
    /** Get the total number of items */
    get totalItems() {
        return this._items.length;
    }
    /** Get the current page number */
    get currentPage() {
        return this._currentPage;
    }
    /** Get the total number of pages */
    get totalPages() {
        return this._totalPages;
    }
    /** Get the number of items per page */
    get itemsPerPage() {
        return this._itemsPerPage;
    }
    /** Get the current sort option */
    get currentSort() {
        return this._currentSort;
    }
    /** Get the current search query */
    get searchQuery() {
        return this._searchQuery;
    }
    /** Get the current status filter */
    get statusFilter() {
        return this._statusFilter;
    }
    /** Check if data is currently being loaded */
    get isLoading() {
        return this._isLoading;
    }
    /** Get current error message if any */
    get error() {
        return this._error;
    }
    /** Load items from data source */
    async loadItems() {
        try {
            this._isLoading = true;
            this.notifyPropertyChange('isLoading', this._isLoading);
            const rawData = project_E_json_1.default;
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
    /**
     * Apply current filters, sort, and pagination
     */
    async applyFiltersAndSort() {
        let filtered = Array.from(this._items);
        // Apply status filter
        if (this._statusFilter !== null) {
            filtered = filtered.filter(item => item.status === this._statusFilter);
        }
        // Apply search query
        if (this._searchQuery) {
            const query = this._searchQuery.toLowerCase();
            filtered = filtered.filter(item => item.title.toLowerCase().includes(query) ||
                (item.description?.toLowerCase().includes(query) ?? false));
        }
        // Apply sorting
        filtered.sort((a, b) => {
            switch (this._currentSort) {
                case SortOption.DateCreatedAsc:
                    return a.created.getTime() - b.created.getTime();
                case SortOption.DateCreatedDesc:
                    return b.created.getTime() - a.created.getTime();
                case SortOption.TitleAsc:
                    return a.title.localeCompare(b.title);
                case SortOption.TitleDesc:
                    return b.title.localeCompare(a.title);
                case SortOption.StatusAsc:
                    return a.status - b.status;
                case SortOption.StatusDesc:
                    return b.status - a.status;
                default:
                    return 0;
            }
        });
        // Update pagination
        this._totalPages = Math.ceil(filtered.length / this._itemsPerPage);
        this._currentPage = Math.min(this._currentPage, this._totalPages);
        // Apply pagination
        const start = (this._currentPage - 1) * this._itemsPerPage;
        const end = start + this._itemsPerPage;
        const paginatedItems = filtered.slice(start, end);
        // Update filtered items
        this._filteredItems.splice(0);
        this._filteredItems.push(...paginatedItems);
        // Notify changes
        this.notifyPropertyChange('items', this._filteredItems);
        this.notifyPropertyChange('totalPages', this._totalPages);
        this.notifyPropertyChange('currentPage', this._currentPage);
    }
    /**
     * Process a raw item into a properly typed BrowseItem
     * @param item Raw item data
     * @returns Processed BrowseItem
     */
    processItem(item) {
        return {
            ...item,
            created: new Date(item.created),
            updated: new Date(item.updated),
            isRnD: Boolean(item.rD),
            status: Number(item.status),
            isPrivate: Number(item.private),
            userId: Number(item.userid),
            cookieId: Number(item.cookie),
            companyId: Number(item.companyid),
            accessLevel: Number(item.level)
        };
    }
    /**
     * Delete an item at the specified index
     * @param index Index of the item to delete
     * @returns true if deletion was successful, false otherwise
     */
    deleteItem(index) {
        if (index >= 0 && index < this._items.length) {
            this._items.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Filter items by status
     * @param status Status to filter by
     * @returns Array of items matching the status
     */
    getItemsByStatus(status) {
        return Array.from(this._items.filter(item => item.status === status));
    }
    /**
     * Search items by title or description
     * @param query Search query string
     * @returns Array of matching items
     */
    searchItems(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this._items.filter(item => item.title.toLowerCase().includes(lowerQuery) ||
            (item.description?.toLowerCase().includes(lowerQuery) ?? false)));
    }
    /**
     * Set the current sort option
     * @param option Sort option to apply
     */
    async setSort(option) {
        if (this._currentSort !== option) {
            this._currentSort = option;
            this.notifyPropertyChange('currentSort', option);
            await this.applyFiltersAndSort();
        }
    }
    /**
     * Set the items per page
     * @param count Number of items per page
     */
    async setItemsPerPage(count) {
        if (count > 0 && this._itemsPerPage !== count) {
            this._itemsPerPage = count;
            this.notifyPropertyChange('itemsPerPage', count);
            await this.applyFiltersAndSort();
        }
    }
    /**
     * Go to a specific page
     * @param page Page number to go to
     */
    async goToPage(page) {
        if (page > 0 && page <= this._totalPages && page !== this._currentPage) {
            this._currentPage = page;
            await this.applyFiltersAndSort();
        }
    }
    /**
     * Set the status filter
     * @param status Status to filter by, or null to clear filter
     */
    async setStatusFilter(status) {
        if (this._statusFilter !== status) {
            this._statusFilter = status;
            this._currentPage = 1;
            this.notifyPropertyChange('statusFilter', status);
            await this.applyFiltersAndSort();
        }
    }
    /**
     * Set the search query
     * @param query Search query string
     */
    async setSearchQuery(query) {
        if (this._searchQuery !== query) {
            this._searchQuery = query;
            this._currentPage = 1;
            this.notifyPropertyChange('searchQuery', query);
            await this.applyFiltersAndSort();
        }
    }
    /**
     * Clear all filters and reset to default state
     */
    async clearFilters() {
        this._searchQuery = '';
        this._statusFilter = null;
        this._currentSort = SortOption.DateCreatedDesc;
        this._currentPage = 1;
        this.notifyPropertyChange('searchQuery', '');
        this.notifyPropertyChange('statusFilter', null);
        this.notifyPropertyChange('currentSort', this._currentSort);
        await this.applyFiltersAndSort();
    }
    /**
     * Get statistics about the current items
     */
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
    /**
     * Refresh the items list
     */
    async refresh() {
        this._items.splice(0);
        this._filteredItems.splice(0);
        await this.loadItems();
    }
}
exports.BrowseViewModel = BrowseViewModel;
