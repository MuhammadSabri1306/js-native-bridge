<script setup>
import { provideJSNativeBridge } from "js-native-bridge";
import TestMobileSetup from "./components/TestMobileSetup.vue";

provideJSNativeBridge();
</script>
<template>
	<TestMobileSetup />
</template>