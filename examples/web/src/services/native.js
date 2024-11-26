import { NativeService, NativeGetterService } from "js-native-bridge";
import axios from "axios";
import Cookies from "js-cookie";

export const createTestKotlinJavascriptInterface = async () => {
    const fetchNativeClientValidation = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await axios.post("/api/v1/native-client/validate", {
            clientKey: import.meta.env.VITE_JSNATIVEBRIDGE_KOTLINANDROIDV1_KEY,
        });

        const { credentialsName, credentials, expireDays } = response.data;
        Cookies.set(credentialsName, credentials, { expires: expireDays, path: "" });
        return response.data;
    };

    const initJSNativeBridge = (credentialsName) => {
        const bridgeName = "AndroidWebviewClient";
        const nativeListenerName = "AndroidInterface.onMessage";
        const callback = (err) => {
            if(err)
                return;
            const msg = JSON.parse({ service: "toast:show", text: err.message });
            window.AndroidInterface.message(msg);
        };

        window.JSNativeBridge.init(credentialsName, bridgeName, nativeListenerName, callback);
    };

    const postMessage = (eventName, data = null) => {
        const message = JSON.stringify({ eventName, data });
        window.JSNativeBridge.AndroidWebviewClient.message(message);
    };

    window.AndroidInterface = {
        services: {
            toast: {
                show(data) {
                    const text = data.text;
                    alert(text);
                },
            },
            geolocation: {
                get(_) {
                    if(!navigator.geolocation)
                        throw new Error("navigator.geolocation is not supported");
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;
                            postMessage("geolocation:get", { latitude, longitude });
                        },
                        (err) => {
                            throw err;
                        }
                    );
                }
            }
        },
        onMessage(message) {
            try {

                const { service, data } = JSON.parse(message);
                const [ serviceName, method ] = service.split(":");
                window.AndroidInterface.services[serviceName][method](data);

            } catch(err) {
                console.error(err);
            }
        }
    };

    const { credentialsName } = await fetchNativeClientValidation();
    initJSNativeBridge(credentialsName);

    window.KotlinTest = {
        helloWeb() {
            postMessage("helloWeb", { message: "NATIVE says: Hello WEB" });
        },
    };
};

export const useToastNativeService = () => {
    const showToastService = new NativeService("toast:show");
    return {
        showToast: (text) => showToastService.call({ text }),
    };
};

export const useGeoLocationNativeService = () => {
    const getLocService = new NativeGetterService("geolocation:get");
    getLocService.setTimeoutMs(false);

    return {
        getCurrentLoc: () => getLocService.get(),
    };
};