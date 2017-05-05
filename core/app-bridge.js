class AppBridge {
    get bridge() {
        if (typeof (NativeBridge) === 'undefined')
            throw new Error('NativeBridge is not define');
        return NativeBridge;
    }
    send(keyword, value) {
        console.log(this.bridge)
    }
}

module.exports = new AppBridge()
