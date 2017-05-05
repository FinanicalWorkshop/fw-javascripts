
let Components = require('fw-components')
let Capture = require('./core/capture')

const BrowserFactory = require('./core/browser')
const RequestFactory = require('./core/request-factory')

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

module.exports = { version: '0.9.0' };
exports['AppBridge'] = require('./core/app-bridge')
exports['Browser'] = new BrowserFactory()
exports['DOMReady'] = require('./core/dom-ready')
exports['Event'] = require('./core/event')
exports['Utils'] = require('./core/utils')
exports['getJSONP'] = require('./core/jsonp')
exports['Request'] = Request
