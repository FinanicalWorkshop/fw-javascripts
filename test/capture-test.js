import { runInCatch, captureError } from '../core/capture.js'
import assert from 'assert'


describe('Capture', function () {
    describe('', function () {
        before(function () {
        })
        it('should have a function called runInCatch', function () {
            assert(typeof (runInCatch), 'function')
        })
        it('should have a function called captureError', function () {
            assert(typeof (captureError), 'function')
        })
    })
})