import NativeBridgeFactory from './core/native-bridge-factory.js'
import DOMReady from './core/dom-ready.js'
import Event from './core/event.js'
import Utils from './core/utils.js'
import getJSONP from './core/jsonp.js'
import * as Components from 'fw-components'
import { captureError } from './core/capture.js'

import BrowserFactory from './core/browser-factory.js'
import RequestFactory from './core/request-factory.js'

/*
Request 的用法

简单用法:
简单用法最多只要传入3个参数
@parameter url 请求地址
@parameter method http动词, 默认是GET
@parameter data 请求参数, 不管GET还是POST, 请求参数都是可序列化的JSON对象

复杂用法, 需要自己创建 RequestFactory 实例, 构建参数
Ajax的完整参数参考
request-factory.js 文件中 Ajax 类的构造方法
*/
let Request = new RequestFactory({
    error_handler: (code, message, responseText) => {
        Components.showAlert(`[${code}]${message}`)
    },
    alert: Components.showAlert,
    capture: captureError,
    show_loading: Components.showLoading,
    hide_loading: Components.hideLoading
}).ajax

let Version = { version: '0.1.0' }

export {
    Version as default
    , NativeBridgeFactory
    , BrowserFactory
    , DOMReady
    , Event
    , Utils
    , getJSONP
    , RequestFactory
    , Request
    , Components
}
