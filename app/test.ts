import { runTestApp } from "@nativescript/unit-test-runner";

declare let require: any;

runTestApp({
	runTests: () => {
		const tests = require.context("./", true, /\.spec\.ts$/);
		tests.keys().map(tests);
	},
});
