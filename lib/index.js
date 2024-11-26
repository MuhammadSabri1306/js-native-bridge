// import * as provider from "./src/provider";
// import * as events from "./src/events";
// import * as service from "./src/service";
// import * as channel from "./src/channel";

// export const provideJSNativeBridge = provider.provideJSNativeBridge;

// export const on = events.on;
// export const once = events.once;
// export const off = events.off;

// export const NativeService = service.NativeService;
// export const NativeGetterService = service.NativeGetterService;
// export const NativeSubscriberService = service.NativeSubscriberService;

// export const ChannelMessage = channel.ChannelMessage;
// export const JSChannelListener = channel.JSChannelListener;

import { provideJSNativeBridge } from "./src/provider";
import { on, once, off } from "./src/events";
import { NativeService, NativeGetterService, NativeSubscriberService } from "./src/service";
import { ChannelMessage, JSChannelListener } from "./src/channel";

export {
    provideJSNativeBridge,
    on, once, off,
    NativeService, NativeGetterService, NativeSubscriberService,
    ChannelMessage, JSChannelListener
};