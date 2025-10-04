"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptType = exports.PrivacyLevel = exports.ItemStatus = void 0;
var ItemStatus;
(function (ItemStatus) {
    ItemStatus[ItemStatus["Draft"] = 0] = "Draft";
    ItemStatus[ItemStatus["Published"] = 1] = "Published";
    ItemStatus[ItemStatus["Archived"] = 2] = "Archived";
})(ItemStatus || (exports.ItemStatus = ItemStatus = {}));
var PrivacyLevel;
(function (PrivacyLevel) {
    PrivacyLevel[PrivacyLevel["Public"] = 0] = "Public";
    PrivacyLevel[PrivacyLevel["Private"] = 1] = "Private";
})(PrivacyLevel || (exports.PrivacyLevel = PrivacyLevel = {}));
var AcceptType;
(function (AcceptType) {
    AcceptType["OE"] = "Open-ended";
    AcceptType["SA"] = "Single answer";
    AcceptType["MA"] = "Multiple answer";
})(AcceptType || (exports.AcceptType = AcceptType = {}));
