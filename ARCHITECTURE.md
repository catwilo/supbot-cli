# Architecture

## Purpose
Minimal WhatsApp CLI running 100% inside Termux on Android. Send
messages, read recent inbox, manage a local alias-to-number directory.
No server, no daemon: the WA-Web session lives on-device.

## Stack
Node.js (CommonJS) + @whiskeysockets/baileys + pino + qrcode-terminal.

## Modules
- core.js  -- WhatsApp class: session, event wiring, send, inbox
- cli.js   -- contacts.json CRUD (add/list/remove)
- send.js  -- one-shot: resolve alias-or-number, send
- inbox.js -- one-shot: print last N messages
- contacts.json -- alias to number directory
- auth/    -- Baileys credential store (gitignored)

## Session lifecycle (core.js)
1. useMultiFileAuthState loads/creates auth/
2. fetchLatestBaileysVersion pins protocol version
3. makeWASocket opens socket; QR emitted on first run
4. creds.update persists refreshed credentials
5. connection.update reconnects on transient close; not after loggedOut

In-memory caches: chats, messages. Both ephemeral.

## Data flow
Send: send.js -> contacts.json lookup -> jid "<num>@s.whatsapp.net" -> wa.send
Read: inbox.js -> getLastMessages -> sorted, printed
Manage: cli.js -> read/modify/write contacts.json

## Design constraints
- Ephemeral process model. No daemon. Low memory on Android.
- Single tenant: one account, one auth/ dir.
- No server dependency beyond WhatsApp itself.
- Filesystem as state: JSON contacts, auth/ credentials. No DB.

## Extension points
- New commands = new top-level files (send.js pattern), not dispatcher.
- Only core.js touches Baileys; user-facing logic stays outside.

## Out of scope
- Groups, media, presence, typing indicators, calls.
- Persistent message history.
- Multi-account / multi-device.
- Daemon/service mode.

## References
- REQUIREMENTS.md, CONTRIBUTING.md
