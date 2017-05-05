const capture = require('../core/capture.js')
const assert = require('assert')


describe('Capture', function () {
    describe('', function () {
        before(function () {
        })
        it('should have a function called runInCatch', function () {
            assert(typeof(capture.runInCatch), 'function')
        })
        it('should have a function called captureError', function () {
            assert(typeof(capture.captureError), 'function')
        })
    })
})