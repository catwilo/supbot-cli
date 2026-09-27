# Contributing

## Setup
    git clone git@github.com:catwilo/supbot-cli.git
    cd supbot-cli
    npm install

First run emits a QR. Scan once from the phone (WhatsApp > Linked
devices). Credentials persist under auth/.

## Workflow
1. Branch via the toolkit helper:
       ut branch supbot-cli <type>/<slug>
   Types: feat, fix, chore, docs, refactor, test.
2. Edit. One intent per branch.
3. Verify locally (see Testing).
4. Ship:
       ut ship supbot-cli
   Rebases on origin/main, merges, pushes, deletes the branch.
   Direct pushes to main are rejected by the repo hook.

## Commit messages
Conventional Commits, imperative, subject <= 72 chars:
    <type>(<scope>): <subject>
    <body wrapped at 72>
    <footer: BREAKING CHANGE, refs>
Scopes: cli, core, send, inbox, deps, docs.

## Testing
No automated suite yet (tracked as a separate task). Until then, manual
verification required for every change:
- Contacts: add/list/remove plus rejection paths (bad number, unknown
  alias) against a throwaway contacts.json.
- Send: real message to your own number.
- Inbox: real inbox; check ordering and media-only fallback.
- core.js changes: confirm reconnect after transient close (toggle
  airplane mode while a send is in flight).

## Code style
- CommonJS, no transpilation.
- 2-space indent; match existing files.
- const by default; let only when rebinding.
- New deps require a commit-body note explaining why the existing stack
  is insufficient.

## Never commit
- auth/ (credentials)
- contacts.json with real numbers
- node_modules/
.gitignore covers all three. Check git status before every commit.

## Task tracking
Work items live in miko under repo "supbot-cli".
    miko history supbot-cli
    miko done supbot-cli <id>

## Governance
- ARCHITECTURE.md -- module map, design constraints.
- REQUIREMENTS.md -- functional and non-functional contract.
- README.md       -- quick start.
