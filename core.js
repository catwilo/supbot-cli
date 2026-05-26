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
  const chats = this.sock.chats
  if (!chats || chats.size === 0) return []

  const result = []

  for (const [id] of [...chats.entries()].slice(
   0,
   chatCount
  )) {
   try {
    const messages = await this.sock.loadMessages(
     id,
     msgsPerChat
    )
    if (!messages?.length) continue

    for (const msg of messages) {
     const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '-'
     const ts = msg.messageTimestamp?.toNumber?.() || 0

     result.push({ id, msg: text, timestamp: ts })
    }
   } catch {}
  }

  return result
   .sort((a, b) => b.timestamp - a.timestamp)
   .slice(0, chatCount)
 }
}

module.exports = WhatsApp
