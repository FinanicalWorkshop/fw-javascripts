class BrowserFactory {
    constructor(ua, app_stamp) {
        this.ua = ua || navigator.userAgent
        this.app_stamp = app_stamp || 'not in any apps'
    }
    get inApp() {
        return !!this.ua.match(this.app_stamp)
    }
    
    get inFXHApp(){
        return !!this.ua.match('EasyLoan888')
    }

    get inJRGCApp(){
        return !!this.ua.match('FinancialWorkshop')
    }

    get appVersion() {
        let r = this.ua.match(RegExp(this.app_stamp + '/(\\d+.\\d+.\\d+)'))
        return r ? r[1] : '0'
    }

    get inAndroid() {
        return /Android/i.test(this.ua)
    }

    get inIOS() {
        return /iPhone|iPad|iPod/i.test(this.ua)
    }

    get inMobile() {
        return this.inAndroid || this.inIOS
    }

    get inIOSApp() {
        return this.inApp && this.inIOS
    }

    get inAndroidApp() {
        return this.inApp && this.inAndroid
    }

    get inWeixin() {
        return /MicroMessenger/.test(this.ua)
    }
}

export default BrowserFactory
