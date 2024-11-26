<script setup>
import { provideJSNativeBridge } from "js-native-bridge";
import TestMobileSetup from "./components/TestMobileSetup.vue";

provideJSNativeBridge();
</script>
<template>
	<TestMobileSetup />
</template>
<style>

body {
	font-family: sans-serif;
	margin: 0;
    line-height: inherit;
}

button, input, optgroup, select, textarea {
    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
}

button, select {
    text-transform: none;
}

</style>