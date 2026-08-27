const {
 default: makeWASocket,
 useMultiFileAuthState,
 fetchLatestBaileysVersion,
 DisconnectReason
} = require('@whiskeysockets/baileys')
const { pino } = require('pino')

class WhatsApp {
 constructor(authPath = './auth') {
  this.authPath = authPath
  this.sock = null
  this.chats = new Map()
  this.messages = new Map()
 }

 async init() {
  const { state, saveCreds } = await useMultiFileAuthState(
   this.authPath
  )
  const { version } = await fetchLatestBaileysVersion()

  this.sock = makeWASocket({
   version,
   auth: state,
   logger: pino({ level: 'silent' })
  })

  this.sock.ev.on('creds.update', saveCreds)

  this.sock.ev.on('chats.upsert', (chats) => {
   for (const chat of chats) this.chats.set(chat.id, chat)
  })

  this.sock.ev.on('messages.upsert', ({ messages }) => {
   for (const msg of messages) {
    const jid = msg.key?.remoteJid
    if (!jid) continue
    if (!this.messages.has(jid)) this.messages.set(jid, [])
    this.messages.get(jid).push(msg)
   }
  })

  this.sock.ev.on(
   'connection.update',
   ({ connection, lastDisconnect }) => {
    if (
     connection === 'close' &&
     lastDisconnect?.error?.output?.statusCode !==
      DisconnectReason.loggedOut
    )
     this.init()
   }
  )

  return this
 }

 async send(to, text) {
  await this.sock.sendMessage(to, { text })
 }

 async getLastMessages(chatCount = 10, msgsPerChat = 1) {
  if (this.messages.size === 0) return []

  const result = []

  for (const [id, msgs] of [...this.messages.entries()].slice(
   0,
   chatCount
  )) {
   for (const msg of msgs.slice(-msgsPerChat)) {
    const text =
     msg.message?.conversation ||
     msg.message?.extendedTextMessage?.text ||
     '-'
    const ts = msg.messageTimestamp?.toNumber?.() || 0

    result.push({ id, msg: text, timestamp: ts })
   }
  }

  return result
   .sort((a, b) => b.timestamp - a.timestamp)
   .slice(0, chatCount)
 }
}

module.exports = WhatsApp
