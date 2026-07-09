// One-time setup script: creates the Owner + Vinumol Firebase Auth accounts and
// seeds Firestore with the demo data from src/data/sampleData.js. Run once locally:
//
//   OWNER_EMAIL=you@example.com OWNER_PASSWORD=... VINUMOL_EMAIL=vinumol@example.com VINUMOL_PASSWORD=... node scripts/seed.js
//
// Requires scripts/serviceAccountKey.json (Firebase console -> Project settings ->
// Service accounts -> Generate new private key). That file is gitignored and must
// never be committed.
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import {
  initialClients, initialTeam, initialProjects, initialTasks,
  initialInvoices, initialLearningItems,
} from '../src/data/sampleData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const serviceAccount = JSON.parse(readFileSync(path.join(__dirname, 'serviceAccountKey.json'), 'utf8'))

const app = initializeApp({ credential: cert(serviceAccount) })
const auth = getAuth(app)
const db = getFirestore(app)

function required(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

async function main() {
  const clientIdMap = {}
  for (const c of initialClients) {
    const ref = await db.collection('clients').add({ name: c.name, contact: c.contact, notes: c.notes })
    clientIdMap[c.id] = ref.id
  }

  const ownerEmail = required('OWNER_EMAIL')
  const ownerPassword = required('OWNER_PASSWORD')
  const ownerName = process.env.OWNER_NAME || 'Owner'
  const vinumolEmail = required('VINUMOL_EMAIL')
  const vinumolPassword = required('VINUMOL_PASSWORD')
  const vinumolName = process.env.VINUMOL_NAME || 'Vinumol'

  const ownerUser = await auth.createUser({ email: ownerEmail, password: ownerPassword, displayName: ownerName })
  await db.collection('team').doc(ownerUser.uid).set({ name: ownerName, role: 'Owner', contact: ownerEmail })

  const vinumolUser = await auth.createUser({ email: vinumolEmail, password: vinumolPassword, displayName: vinumolName })
  await db.collection('team').doc(vinumolUser.uid).set({ name: vinumolName, role: 'Designer', contact: vinumolEmail })

  const teamIdMap = {}
  const ownerSample = initialTeam.find((m) => m.role === 'Owner')
  if (ownerSample) teamIdMap[ownerSample.id] = ownerUser.uid
  const vinumolSample = initialTeam.find((m) => m.name === 'Vinumol')
  if (vinumolSample) teamIdMap[vinumolSample.id] = vinumolUser.uid

  const aravind = initialTeam.find((m) => m.name === 'Aravind')
  if (aravind) {
    const ref = await db.collection('team').add({ name: aravind.name, role: aravind.role, contact: aravind.contact })
    teamIdMap[aravind.id] = ref.id
  }

  const projectIdMap = {}
  for (const p of initialProjects) {
    const ref = await db.collection('projects').add({
      name: p.name, clientId: clientIdMap[p.clientId], brief: p.brief, status: p.status, due: p.due,
    })
    projectIdMap[p.id] = ref.id
  }

  for (const t of initialTasks) {
    await db.collection('tasks').add({
      projectId: projectIdMap[t.projectId],
      title: t.title,
      assigneeId: teamIdMap[t.assigneeId],
      status: t.status,
      priority: t.priority,
      due: t.due,
      manualPct: t.manualPct,
      notes: t.notes,
      subtasks: t.subtasks,
      comments: t.comments,
    })
  }

  for (const inv of initialInvoices) {
    await db.collection('invoices').add({
      clientId: clientIdMap[inv.clientId], description: inv.description, amount: inv.amount,
      currency: inv.currency, status: inv.status, issueDate: inv.issueDate, due: inv.due,
    })
  }

  for (const item of initialLearningItems) {
    await db.collection('learningItems').add({ title: item.title, body: item.body })
  }

  console.log('Seed complete.')
  console.log('Owner   ->', ownerEmail, ownerUser.uid)
  console.log('Vinumol ->', vinumolEmail, vinumolUser.uid)
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1) })
