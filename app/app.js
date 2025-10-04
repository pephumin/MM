"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appViewModel = void 0;
const core_1 = require("@nativescript/core");
const app_viewmodel_1 = require("./app-viewmodel");
const auth_service_1 = require("./common/auth-service");
(0, auth_service_1.configureOAuthProviders)();
exports.appViewModel = new app_viewmodel_1.AppViewModel();
core_1.Application.run({ moduleName: 'app-root' });
