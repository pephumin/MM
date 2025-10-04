"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unit_test_runner_1 = require("@nativescript/unit-test-runner");
(0, unit_test_runner_1.runTestApp)({
    runTests: () => {
        const tests = require.context("./", true, /\.spec\.ts$/);
        tests.keys().map(tests);
    },
});
