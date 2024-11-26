import Cookies from "js-cookie";
import { setGlobalState } from "./global";
import { JSChannelListener } from "./channel";

export const provideJSNativeBridge = () => {
    const init = (credentialsName, jsChannelName, onMessage, callback = null) => {
        try {

            const credentials64 = Cookies.get(credentialsName);
            if(!credentials64)
                throw new Error("native client credential cookie not found");
            const credentials = JSON.parse( atob(credentials64) );
            const { expireDays } = credentials;

            setGlobalState("credentialsName", credentialsName);
            setGlobalState("jsChannelName", jsChannelName);
            setGlobalState("onNativeMessage", onMessage);
            setGlobalState("expireDays", expireDays);

            if(!window.JSNativeBridge)
                window.JSNativeBridge = {};
            window.JSNativeBridge[jsChannelName] = new JSChannelListener();

            callback && callback();

        } catch(err) {
            callback && callback(err.stack);
        }
    };

    window.JSNativeBridge = { init };
};