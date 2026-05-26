const WhatsApp = require("./core")
const contacts = require("./contacts.json")

const [, , toArg, ...msgParts] = process.argv
if (!toArg || msgParts.length === 0) {
  console.log("uso: node send.js <alias|número> \"mensaje\"")
  process.exit(1)
}

// busca en contactos o usa directamente el número
const number = contacts[toArg] || toArg
const jid = number + "@s.whatsapp.net"
const msg = msgParts.join(" ")

;(async () => {
  const wa = await new WhatsApp().init()
  setTimeout(async () => {
    await wa.send(jid, msg)
    process.exit()
  }, 2000)
})()
