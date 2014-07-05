'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var chai = require('chai');
var expect = chai.expect;
var stubTransport = require('../lib/stub-transport');
chai.Assertion.includeStack = true;
var PassThrough = require('stream').PassThrough;

function MockBuilder(envelope, message) {
    this.envelope = envelope;
    this.message = new PassThrough();
    this.message.end(message);
}

MockBuilder.prototype.getEnvelope = function() {
    return this.envelope;
};

MockBuilder.prototype.createReadStream = function() {
    return this.message;
};

describe('Stub Transport Tests', function() {
    it('Should expose version number', function() {
        var client = stubTransport();
        expect(client.name).to.exist;
        expect(client.version).to.exist;
    });

    it('Should send mail', function(done) {
        var client = stubTransport();

        var message = new Array(1024).join('teretere, vana kere\n');

        client.send({
            data: {},
            message: new MockBuilder({
                from: 'test@valid.sender',
                to: 'test@valid.recipient'
            }, message)
        }, function(err, sentMessage) {
            expect(err).to.not.exist;
            expect(sentMessage.toString()).to.equal(message);
            done();
        });
    });
});