/* eslint no-unused-expressions:0 */
/* globals describe, it */

'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var stubTransport = require('../src/stub-transport');
chai.Assertion.includeStack = true;
var PassThrough = require('stream').PassThrough;

function MockBuilder(envelope, message) {
    this.envelope = envelope;
    this.message = new PassThrough();
    this.message.end(message);
}

MockBuilder.prototype.getEnvelope = function () {
    return this.envelope;
};

MockBuilder.prototype.createReadStream = function () {
    return this.message;
};

MockBuilder.prototype.getHeader = function () {
    return 'teretere';
};

describe('Stub Transport Tests', function () {
    it('Should expose version number', function () {
        var client = stubTransport();
        expect(client.name).to.exist;
        expect(client.version).to.exist;
    });

    it('Should send mail', function (done) {
        var client = stubTransport();

        var message = new Array(1024).join('teretere, vana kere\n');

        client.send({
            data: {},
            message: new MockBuilder({
                from: 'test@valid.sender',
                to: 'test@valid.recipient'
            }, message)
        }, function (err, info) {
            expect(err).to.not.exist;
            expect(info.response.toString()).to.equal(message);
            done();
        });
    });

    it('Should verify settings', function (done) {
        var client = stubTransport();

        client.verify(function (err, status) {
            expect(err).to.not.exist;
            expect(status).to.be.true;
            done();
        });
    });

    it('Should not verify settings', function (done) {
        var client = stubTransport({
            error: new Error('test')
        });

        client.verify(function (err, status) {
            expect(err).to.exist;
            expect(status).to.not.be.true;
            done();
        });
    });

    it('Should fire the events', function (done) {
        var envelopeSpy = sinon.spy();
        var dataSpy = sinon.spy();
        var endSpy = sinon.spy();
        var client = stubTransport();
        client.on('envelope', envelopeSpy);
        client.on('data', dataSpy);
        client.on('end', endSpy);

        var message = new Array(1024).join('teretere, vana kere\n');
        var envelope = {
            from: 'test@valid.sender',
            to: 'test@valid.recipient'
        };

        client.send({
            data: {},
            message: new MockBuilder(envelope, message)
        }, function (err, info) {
            expect(err).to.not.exist;
            expect(info.response.toString()).to.equal(message);
            expect(envelopeSpy.calledWith(envelope)).to.be.true;
            expect(dataSpy.calledWith(message)).to.be.true;
            expect(endSpy.calledWith(info)).to.be.true;
            done();
        });
    });

    it('Should return an error', function (done) {
        var client = stubTransport({
            error: new Error('Invalid recipient')
        });

        var message = new Array(1024).join('teretere, vana kere\n');

        client.send({
            data: {},
            message: new MockBuilder({
                from: 'test@valid.sender',
                to: 'test@valid.recipient'
            }, message)
        }, function (err) {
            expect(err).to.exist;
            done();
        });
    });
});
