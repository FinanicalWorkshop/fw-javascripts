import AppBridge from './core/app-bridge.js'
import DOMReady from './core/dom-ready.js'
import Event from './core/event.js'
import Utils from './core/utils.js'
import getJSONP from './core/jsonp.js'
import * as Components from 'fw-components'
import * as Capture from './core/capture.js'


import BrowserFactory from './core/browser-factory.js'
import RequestFactory from './core/request-factory.js'

let Browser = new BrowserFactory()

let Request = new RequestFactory({
    error_handler: (code, message, responseText) => {
        // Components.showAlert(message)
        Components.showLoading('default', false)
    },
    alert: Components.showAlert,
    capture: Capture.captureError,
    show_loading: Components.showLoading,
    hide_loading: Components.hideLoading
}).ajax

let Version = { version: '0.9.0' }

export {
    Version as default
    , AppBridge
    , Browser
    , DOMReady
    , Event
    , Utils
    , getJSONP
    , Request
    , Components
}
