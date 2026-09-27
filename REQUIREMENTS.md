# Requirements

## Functional

### F1 - Send a message
Command: node send.js <alias|number> "<message>"
- If first arg matches alias in contacts.json, resolve to number; else use raw.
- JID derived as <number>@s.whatsapp.net.
- Open session, send text, exit 0.
- Missing args exit 1 with usage.

### F2 - Read recent inbox
Command: node inbox.js [chats] [msgsPerChat]
- Defaults: 10 chats, 1 message per chat.
- Print "#N <jid>" then "MSG: <text>".
- Sort by timestamp descending.
- Media-only messages render "-".

### F3 - Contacts management
- cli.js add <alias> <number>  -- reject non-digit number
- cli.js list                  -- <alias>\t<number> per line
- cli.js remove <alias>        -- reject unknown alias
- Persist to contacts.json (pretty JSON, trailing newline).

## Non-functional

### N1 - Platform
- Runs on Termux/Android, no root.
- Runs on any Node.js >= 18.

### N2 - Resource budget
- Peak RSS under 200 MB per command.
- No background processes left after exit.

### N3 - Credentials
- auth/ gitignored.
- contacts.json gitignored when real numbers.
- No secrets in repo history.

### N4 - Failure modes
- No auth/: print QR, wait for scan.
- Transient close: reconnect in-process.
- loggedOut: exit; re-pair manually.

### N5 - Quality standard
Follows client-web-standard.md sections 1, 4, 5 (tracked in miko).

## Out of scope
- Media, groups, presence, receipts, calls.
- Long-running process / scheduler / webhook.
- Cloud dependency beyond WhatsApp.

## Acceptance
- send.js delivers on a paired device.
- inbox.js returns most recent messages in correct order.
- cli.js add/list/remove round-trip preserves contacts.json shape.
