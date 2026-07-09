import { TODAY } from './data/sampleData'

export function getPercent(task) {
  if (task.subtasks && task.subtasks.length > 0) {
    const done = task.subtasks.filter((s) => s.done).length
    return Math.round((done / task.subtasks.length) * 100)
  }
  return task.manualPct || 0
}

export function isOverdue(task) {
  return task.status !== 'Done' && task.due < TODAY
}

export function clientName(clients, clientId) {
  const c = clients.find((c) => c.id === clientId)
  return c ? c.name : 'Unknown client'
}

export function teamName(team, teamId) {
  const t = team.find((t) => t.id === teamId)
  return t ? t.name : 'Unassigned'
}

export function initials(name) {
  if (!name) return '?'
  return name.split(' ')[0].slice(0, 2).toUpperCase()
}

export function nextId(list) {
  return list.length ? Math.max(...list.map((i) => i.id)) + 1 : 1
}

export function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export function formatMoney(amount, currency) {
  const symbol = currency === 'INR' ? '₹' : currency + ' '
  return symbol + Number(amount).toLocaleString()
}
