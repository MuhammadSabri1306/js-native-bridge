<script setup>
import { ref } from "vue";
import {
    createTestKotlinJavascriptInterface,
    useToastNativeService,
    useGeoLocationNativeService,
} from "../services/native";

const isLoaded = ref(false);
createTestKotlinJavascriptInterface().then(() => isLoaded.value = true);

const { showToast } = useToastNativeService();
const { getCurrentLoc } = useGeoLocationNativeService();

const onBtnToastClick = () => showToast("WEB says: Hello NATIVE");
const onBtnLocClick = async () => {
    const loc = await getCurrentLoc();
    console.log(loc);
};
</script>
<template>
    <div id="wrapper">
        <div class="container">
            <header>
                <h1>JS NATIVE BRIDGE</h1>
                <h2>Testing the setup.</h2>
            </header>
            <div v-if="!isLoaded" class="animation">
                <div class="cube">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <template v-else>
                <div class="btn-test-wrapper">
                    <button type="button" @click="onBtnToastClick">Test Native Toast</button>
                </div>
                <div class="btn-test-wrapper">
                    <button type="button" @click="onBtnLocClick">Test Native Geo Location</button>
                </div>
            </template>
        </div>
    </div>
</template>
<style scoped>
#wrapper {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	-ms-flex-align: center;
	align-items: center;
	background-color: #639;
	color: #fff;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-pack: center;
	justify-content: center;
	margin: 0;
	padding: 0;
	min-height: 100vh;
}

#wrapper .container {
    display: grid;
    grid-gap: 1rem;
    justify-items: center;
}

header {
    margin: 0;
    padding: 0 1rem;
}

header > * {
    text-align: center;
}

.animation {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 175px;
    overflow: hidden;
    width: 100%;
    position: relative;
}

@-webkit-keyframes cube {
    0% {
        -webkit-transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
        transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
    }
    50% {
        -webkit-transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
        transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
    }
    100% {
        -webkit-transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
        transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
    }
}

@keyframes cube {
    0% {
        -webkit-transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
        transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
    }
    50% {
        -webkit-transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
        transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
    }
    100% {
        -webkit-transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
        transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
    }
}

.cube {
    -webkit-animation: cube 2s infinite ease;
    animation: cube 2s infinite ease;
    height: 40px;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    width: 40px;
}

.cube div {
    background-color: rgba(255, 255, 255, 0.25);
    height: 100%;
    position: absolute;
    width: 100%;
    border: 2px solid white;
}

.cube div:nth-of-type(1) {
    -webkit-transform: translateZ(-20px) rotateY(180deg);
    transform: translateZ(-20px) rotateY(180deg);
}

.cube div:nth-of-type(2) {
    -webkit-transform: rotateY(-270deg) translateX(50%);
    transform: rotateY(-270deg) translateX(50%);
    -webkit-transform-origin: top right;
    transform-origin: top right;
}

.cube div:nth-of-type(3) {
    -webkit-transform: rotateY(270deg) translateX(-50%);
    transform: rotateY(270deg) translateX(-50%);
    -webkit-transform-origin: center left;
    transform-origin: center left;
}

.cube div:nth-of-type(4) {
    -webkit-transform: rotateX(90deg) translateY(-50%);
    transform: rotateX(90deg) translateY(-50%);
    -webkit-transform-origin: top center;
    transform-origin: top center;
}

.cube div:nth-of-type(5) {
    -webkit-transform: rotateX(-90deg) translateY(50%);
    transform: rotateX(-90deg) translateY(50%);
    -webkit-transform-origin: bottom center;
    transform-origin: bottom center;
}

.cube div:nth-of-type(6) {
    -webkit-transform: translateZ(20px);
    transform: translateZ(20px);
}

.btn-test-wrapper {
    text-align: center;
}

.btn-test-wrapper > button {
    -webkit-appearance: button;
    appearance: button;
    color: rgb(255 255 255 / 1);
    font-weight: 600;
    font-size: .875rem;
    line-height: 1.25rem;
    text-align: center;
    padding-top: .75rem;
    padding-bottom: .75rem;
    padding-left: 1rem;
    padding-right: 1rem;
    background-color: rgb(79 70 229 / 1);
    cursor: pointer;
    border: 1px solid #54297f;
}
</style>