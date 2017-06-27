class Ajax {
    constructor(options) {
        let default_options = {
            url: '',
            method: 'GET',
            data: {},
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            headers: {
                'Accept': 'application/json'
            },
            xhrFields: {
                // example  { withCredentials: true }
            },
            timeout: 10,
            onStart: n => null,
            onTimeout: n => null,
            onComplete: n => null
        }

        this.options = Object.assign(default_options, options)
        this.options.method = this.options.method.toUpperCase()

        this.xhr = new XMLHttpRequest()
        this.prepare()
    }
    get request_url() {
        let { url, method, data } = this.options

        if (method == 'GET') {
            let flat_data = []

            for (let k in data) {
                let v = data[k]
                if (v !== undefined && v !== null) flat_data.push(`${k}=${v}`)
            }
            let chr = url.indexOf('?') > 0 ? '&' : '?', str_data = flat_data.join('&')
            if (str_data) url += `${chr}${str_data}`
        }

        return url
    }
    get form_data() {
        let { method, data } = this.options
        let fd = new FormData()
        if (method === 'GET') return fd

        if (method === 'PUT') fd.append('_method', 'PUT')
        if (method === 'DELETE') fd.append('_method', 'DELETE')
        for (let k in data) {
            let v = data[k]
            if (v !== undefined && v !== null)
                fd.append(k, v)
        }
        return fd
    }

    prepare() {
        let { method, contentType, headers, xhrFields } = this.options;
        this.xhr.open(method, this.request_url, true);
        contentType && this.xhr.setRequestHeader('Content-Type', contentType);
        for (let k in headers) this.xhr.setRequestHeader(k, headers[k]);
        for (let k in xhrFields) this.xhr[k] = xhrFields[k];
    }

    counting_down = () => {
        // cancel callback if timeout
        setTimeout(() => {
            this.options.onComplete = n => null;
            this.options.onTimeout()
        }, this.options.timeout * 1000)
    }

    emit = () => {
        this.options.onStart()
        let promise = new Promise((resolve, reject) => {
            this.xhr.onreadystatechange = state => {
                if (this.xhr.readyState == 4) {
                    this.options.onComplete(
                        this.xhr.status, this.xhr.responseText, resolve, reject)
                }
            }
        })
        this.counting_down();
        this.xhr.send(this.form_data);
        return promise
    }
}

class RequestFactory {

    constructor(handler) {
        this.default_options = {
            url: '',
            data: {},
            loading: 'mini',
            silence: false,
            timeout: 10, // seconds before timeout, 0 means do nothing
            contentType: '',
            headers: {}, // ajax Headers fields
            xhrFields: {}
        }

        let noop = n => null;

        this.handler = Object.assign({
            error_handler: noop,
            timeout_handler: noop,
            alert: noop,
            capture: noop,
            show_loading: noop,
            hide_loading: noop
        }, handler)
    }

    ajax = options => {
        // 快捷写法, 如果传入参数只有一个字符串,
        // 那么就默认使用 GET 请求这个字符串表示的地址
        if (typeof (options) == 'string')
            options = { url: options };

        options = Object.assign({}, this.default_options, options)
        options['onStart'] = () => {
            if (options.loading)
                this.handler.show_loading(options['loading'])
        }
        options['onTimeout'] = () => {
            if (options.timeout)
                this.handler.timeout_handler(options['timeout'])
        }
        options['onComplete'] = (status, responseText, resolve, reject) => {
            if (options.loading) this.handler.hide_loading()

            if (status == 200 || status == 201) {
                var r = JSON.parse(responseText);
                if (r.code == 10000) {
                    resolve(r.data);
                } else {
                    if (!options.silence)
                        this.handler.error_handler(r.code, r.message, responseText);
                    reject(r)
                }
            } else if (status == 404) {
                this.handler.alert('API不存在，请确认接口地址正确')
            } else if (status >= 500) {
                //if (status == 0) FW.Component.Alert('cross domain deny, check server config: Access-Control-Allow-Origin');
                this.handler.alert(`服务器开小差了~ 请稍后再试${status}`);
            } else {
                if (status !== 0)
                    this.handler.alert(`ERROR, HTTP status code: ${status} ${options.url}`);
            }

            if (status > 201) {
                // Ajax返回状态码不是200或201即认定为异常, 需要上报
                let e = `Ajax Error status: ${status}` +
                    `\n url: ${options.url}` +
                    `\n method: ${options.method}` +
                    `\n data: ${JSON.stringify(options.data)}`;
                this.handler.capture(e);
            }
        }

        return (new Ajax(options)).emit()
    }
}


export {
    RequestFactory as default
}
