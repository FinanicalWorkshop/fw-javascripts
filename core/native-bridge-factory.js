
function inAndroid() {
    return navigator.userAgent.match(/Android/i)
}

function initListener(init_callback) {
    inAndroid() ?
        initAndroid(init_callback) :
        initIOS(init_callback)
}

function initAndroid(init_callback) {
    // Android初始化方法
    if (window.WebViewJavascriptBridge) {
        init_callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', () => {
            init_callback(WebViewJavascriptBridge)
        }, false);
    }
}

function initIOS(init_callback) {
    // iOS初始化方法
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(init_callback);
    } else {
        window.WVJBCallbacks = [init_callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe)
        }, 0)
    }
}

class NativeBridgeFactory {

    constructor(activeUserAgent) {
        this.bridge = null;
        this.isReady = false;
        // 接收来自App消息的回调函数, 同时只能设置一个回调方法
        this._receive_callback = null
        this._depot = [];

        // 先判断 UA 是否符合条件, 不符合条件就不初始化 NativeBridge
        if (activeUserAgent &&
            !navigator.userAgent.match(activeUserAgent))
            return;

        initListener(bridge => {
            if (inAndroid()) {
                // Android need this init function, or could not send message to webview
                // BUT!!!, iOS could not use this, or could not send message to webview
                bridge.init((message, responseCallback) => {
                    responseCallback && responseCallback({ 'msg': 'init success' })
                })
            }

            bridge.registerHandler('jsHandler', (data, responseCallback) => {
                let resp = this._receive_callback && this._receive_callback(data)
                if (resp) responseCallback(resp);
            })

            this.setup(bridge)
        })
    }

    setup(bridge) {
        this.bridge = bridge
        for (let i = 0; i < this._depot.length; i++) {
            this._see_off(this._depot[i])
        }
        this._depot = []
    }

    _pack_up(action, value, need_login) {
        let encode = !!navigator.userAgent.match(/Android/i);
        value = encode ? encodeURI(value) : value;
        return {
            action: action,
            need_login: need_login,
            value: value,
            encode: encode
        }
    }


    _see_off(pack) {
        this.bridge.callHandler('nativeCallback', pack)
    }

    send(pack) {
        this.isReady ?
            this._see_off(pack) :
            this._depot.push(pack)
    }

    onReceive(fn) {
        this._receive_callback = fn
    }

    trigger(name, value) {
        // 发送消息
        this.send(this._pack_up(name, value))
    }

    toNative(kw) {
        // 到某个app的原生页面
        this.send(this._pack_up('toNative', kw))
    }

    get help() {
        console && console.log && console.log(`
            Only has 2 methods:
            1. trigger
            2. toNative
        `)
    }
}

export default NativeBridgeFactory