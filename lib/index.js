"use strict";
var request = require('request');
var modular_log_1 = require('modular-log');
var HipChatNotifier = (function () {
    function HipChatNotifier(settings) {
        this.settings = settings;
        this.log = null;
        if (settings.baseUrl === undefined)
            settings.baseUrl = 'https://api.hipchat.com';
        if (settings.defaultFormat === undefined)
            settings.defaultFormat = 'html';
        if (!settings.disableLogger)
            this.log = modular_log_1.createLogger('HipChat');
        this.url = settings.baseUrl + "/v2/room/" + settings.room + "/notification?auth_token=" + settings.auth_token;
    }
    HipChatNotifier.prototype.message = function (message, settings) {
        var _this = this;
        settings = settings || {};
        if (settings.color === undefined && this.settings.defaultColor)
            settings.color = this.settings.defaultColor;
        if (settings.notify === undefined && this.settings.defaultNotify)
            settings.notify = this.settings.defaultNotify;
        if (settings.message_format === undefined && this.settings.defaultFormat)
            settings.message_format = this.settings.defaultFormat;
        var msg = {
            color: settings.color,
            notify: settings.notify,
            message_format: settings.message_format,
            message: message
        };
        this.log && this.log.trace('Sending message', msg);
        return request.post({
            url: this.url,
            json: true,
            body: msg
        }).on('error', function (err) {
            (_this.log ? _this.log.error : console.error)('Message failed', { msg: msg, err: err });
        }).on('complete', function (resp, body) {
            if (resp.statusCode >= 300)
                (_this.log ? _this.log.error : console.error)('Message failed', { ode: resp.statusCode, msg: resp.statusMessage, body: body });
        });
    };
    HipChatNotifier.prototype.error = function (message, settings) {
        settings = settings || {};
        if (settings.color === undefined)
            settings.color = 'red';
        if (settings.notify === undefined)
            settings.notify = true;
        return this.message(message, settings);
    };
    HipChatNotifier.prototype.warning = function (message, settings) {
        settings = settings || {};
        if (settings.color === undefined)
            settings.color = 'yellow';
        if (settings.notify === undefined)
            settings.notify = true;
        return this.message(message, settings);
    };
    HipChatNotifier.prototype.success = function (message, settings) {
        settings = settings || {};
        if (settings.color === undefined)
            settings.color = 'green';
        if (settings.notify === undefined)
            settings.notify = false;
        return this.message(message, settings);
    };
    HipChatNotifier.prototype.info = function (message, settings) {
        settings = settings || {};
        if (settings.color === undefined)
            settings.color = 'gray';
        if (settings.notify === undefined)
            settings.notify = false;
        return this.message(message, settings);
    };
    return HipChatNotifier;
}());
exports.HipChatNotifier = HipChatNotifier;
//# sourceMappingURL=index.js.map