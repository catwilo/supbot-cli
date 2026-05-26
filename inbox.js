const WhatsApp = require("./core")
const [, , chatsArg, msgsArg] = process.argv
const chats = parseInt(chatsArg) || 10
const perChat = parseInt(msgsArg) || 1

;(async () => {
  const wa = await new WhatsApp().init()
  const items = await wa.getLastMessages(chats, perChat)

  items.forEach((c, i) => {
    console.log(`\n#${i + 1} ${c.id}`)
    console.log("MSG:", c.msg)
  })

  process.exit()
})()
