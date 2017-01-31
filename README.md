# hipchat-msg

HipChat notifications (API v2)

## Usage

```js
const HipChatNotifier = require('hipchat-msg').HipChatNotifier;

const { AUTH_TOKEN, ROOM_ID } = process.env;

const client = new HipChatNotifier({
  room: ROOM_ID,
  auth_token: AUTH_TOKEN,
});

client.message('Hello room!', {
  color: 'green',
});
```
