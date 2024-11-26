import { getNativeListener } from "./native-listener";

export class ChannelMessage {
    constructor({ eventName, data } = {}) {
        if(typeof eventName != "string")
            throw new Error("eventName is not string");
        this.eventName = eventName;
        this.data = data || null;
    }
    
    static fromJson(msgJson) {
        if(typeof msgJson != "string")
            throw new Error("msgJson is not string");
        const { eventName, ...msg } = JSON.parse(msgJson);
        const data = msg.data || null;
        return new ChannelMessage({ eventName, data });
    }

    toJson() {
        const eventName = this.eventName;
        const data = this.data;
        return JSON.stringify({ eventName, data });
    }
}

export class JSChannelListener {
    message(message, onError = null) {
        try {

            const channelMsg = ChannelMessage.fromJson(message)
            getNativeListener(channelMsg.eventName, true).emit(channelMsg.data);

        } catch(err) {
            console.error(err);
            if(onError && typeof onError == "function")
                onError(`${ err.stack }`);
        }
    }
}