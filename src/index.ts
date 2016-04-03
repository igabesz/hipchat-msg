import * as request from 'request';
import { Logger, createLogger } from 'modular-log';


/// https://www.hipchat.com/docs/api/method/rooms/message
export type MessageColors = 'yellow' | 'red' | 'green' | 'purple' | 'gray';

export interface HipChatSettings {
	baseUrl: string;
	room: string|number;
	auth_token: string;
	disableLogger?: boolean;
	defaultNotify?: boolean;
	defaultColor?: MessageColors;
	defaultFormat?: 'text' | 'html';
}

export interface MessageSettings {
	color?: MessageColors;
	notify?: boolean;
	message_format?: 'text' | 'html';
}

interface HipChatMessage extends MessageSettings {
	color?: MessageColors;
	notify?: boolean;
	message_format?: 'text' | 'html';
	message: string;
}

export class HipChatNotifier {
	log: Logger = null;
	url: string;

	constructor(private settings: HipChatSettings) {
		if (!settings.disableLogger)
			this.log = createLogger('HipChat');
		this.url = `${settings.baseUrl}/v2/room/${settings.room}/notification?auth_token=${settings.auth_token}`;
	}

	message(message: string, settings?: MessageSettings): request.Request {
		settings = settings || {};
		if (settings.color === undefined && this.settings.defaultColor) settings.color = this.settings.defaultColor;
		if (settings.notify === undefined && this.settings.defaultNotify) settings.notify = this.settings.defaultNotify;
		if (settings.message_format === undefined && this.settings.defaultFormat) settings.message_format = this.settings.defaultFormat;
		let msg: HipChatMessage = {
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
		}).on('error', (err) => {
			(this.log ? this.log.error : console.error)('Message failed', { msg, err });
		}).on('complete', (resp, body) => {
			if (resp.statusCode >= 300)
				(this.log ? this.log.error : console.error)('Message failed', { ode: resp.statusCode, msg: resp.statusMessage, body });
		});
	}

	error(message: string, settings?: MessageSettings): request.Request {
		settings = settings || {};
		if (settings.color === undefined) settings.color = 'red';
		if (settings.notify === undefined) settings.notify = true;
		return this.message(message, settings);
	}

	warning(message: string, settings?: MessageSettings): request.Request {
		settings = settings || {};
		if (settings.color === undefined) settings.color = 'yellow';
		if (settings.notify === undefined) settings.notify = true;
		return this.message(message, settings);
	}

	success(message: string, settings?: MessageSettings): request.Request {
		settings = settings || {};
		if (settings.color === undefined) settings.color = 'green';
		if (settings.notify === undefined) settings.notify = false;
		return this.message(message, settings);
	}

	info(message: string, settings?: MessageSettings): request.Request {
		settings = settings || {};
		if (settings.color === undefined) settings.color = 'gray';
		if (settings.notify === undefined) settings.notify = false;
		return this.message(message, settings);
	}
}
