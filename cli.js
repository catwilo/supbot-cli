const repl = require("repl")
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const { pino } = require("pino")

;(async () => {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({ version, auth: state, logger: pino({ level: "silent" }) })
  sock.ev.on("creds.update", saveCreds)

  repl.start("> ").context.sock = sock
})()
