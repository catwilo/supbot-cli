const fs = require("fs")
const path = require("path")

const DB_PATH = path.join(__dirname, "contacts.json")

function loadContacts() {
  if (!fs.existsSync(DB_PATH)) return {}
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"))
}

function saveContacts(contacts) {
  fs.writeFileSync(DB_PATH, JSON.stringify(contacts, null, 2) + "\n")
}

const [, , cmd, ...args] = process.argv

function usage() {
  console.log("uso:")
  console.log("  node cli.js add <alias> <numero>")
  console.log("  node cli.js list")
  console.log("  node cli.js remove <alias>")
  process.exit(1)
}

const contacts = loadContacts()

if (cmd === "add") {
  const [alias, numero] = args
  if (!alias || !numero) usage()
  if (!/^\d+$/.test(numero)) {
    console.log(`error: numero invalido "${numero}" (solo digitos)`)
    process.exit(1)
  }
  contacts[alias] = numero
  saveContacts(contacts)
  console.log(`[OK] agregado "${alias}" -> ${numero}`)
} else if (cmd === "list") {
  const aliases = Object.keys(contacts)
  if (aliases.length === 0) {
    console.log("sin contactos registrados")
  } else {
    aliases.forEach(a => console.log(`${a}\t${contacts[a]}`))
  }
} else if (cmd === "remove") {
  const [alias] = args
  if (!alias) usage()
  if (!(alias in contacts)) {
    console.log(`error: alias "${alias}" no existe`)
    process.exit(1)
  }
  delete contacts[alias]
  saveContacts(contacts)
  console.log(`[OK] eliminado "${alias}"`)
} else {
  usage()
}
