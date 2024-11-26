<script setup>
import { ref } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import { on } from "js-native-bridge";
import { HelloNativeService } from "../services/native";

const isLoaded = ref(false);
const msg = ref(null);

const fetchNativeClientValidation = async () => {
    try {

        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await axios.post("/api/v1/native-client/validate", {
            clientKey: import.meta.env.VITE_JSNATIVEBRIDGE_KOTLINANDROIDV1_KEY,
        });

        const { credentialsName, credentials, expireDays } = response.data;
        Cookies.set(credentialsName, credentials, { expires: expireDays, path: "" });
        console.info("credential is saved to cookie");
        isLoaded.value = true;

        return response.data;

    } catch(err) {
        console.error(err);
        return null;
    }
};

const setupNativeApi = (data) => {
    if(!data) return;

    window.AndroidInterface = {

        onMessage(message) {
            try {

                const { eventName, data } = JSON.parse(message);
                window.AndroidInterface[eventName](data);

            } catch(err) {
                console.error(err);
            }
        },

        postMessage(eventName, data = null) {
            const message = JSON.stringify({ eventName, data });
            window.JSNativeBridge.AndroidWebviewClient.message(message);
        },

        helloNative(data) {
            const message = data?.message || "UNKNOWN MESSAGE";
            console.log(message);
        },

        helloWeb() {
            window.AndroidInterface.postMessage("helloWeb", {
                message: "NATIVE says: Hello WEB"
            });
        },

    };

    const { credentialsName } = data;
    const bridgeName = "AndroidWebviewClient";
    const nativeListenerName = "AndroidInterface.onMessage";
    window.JSNativeBridge.init(credentialsName, bridgeName, nativeListenerName, (err) => {
        if(err)
            console.error(err);
    });

    on("helloWeb", ({ message }) => msg.value = message);
    HelloNativeService.call({
        message: "WEB says: Hello NATIVE"
    });
};

fetchNativeClientValidation().then(setupNativeApi);
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
            <h1 v-if="msg">{{ msg }}</h1>
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
</style>