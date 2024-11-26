import { NativeService } from "js-native-bridge";

export const HelloNativeService = new NativeService({
    serviceName: "test:helloNative",
    nativeEventName: "helloNative"
});