class Utils {

    static get format() {
        return {
            price: function (n, precision) {
                let a = String(n).split('.'), int = a[0], per = a[1] && `${a[1]}00`;

                let start = int.length % 3;
                let s = int.substr(0, start)

                for (let m = start; m < int.length; m += 3) {
                    s = `${s}${s ? ',' : ''}${int.substr(m, 3)}`
                }

                if (per) {
                    s = `${s}.${per.substr(0, precision || 2)}`
                } else if (precision) {
                    s = `${s}.00`
                }

                return s
            }
        }
    }

    static get urlQuery() {
        let s = window.location.search;
        if (s.indexOf('?') == 0) s = s.substr(1);
        if (s.indexOf('#') >= 0) s = s.substr(0, s.indexOf('#'));

        let r = {};
        s.split('&').forEach(function (kv) {
            let t = kv.split('=');
            if (t[0]) {
                r[t[0]] =
                    t[1] === undefined ?
                        true :
                        decodeURIComponent(t[1])

            }
        });
        return r;
    }
}

module.exports = Utils
