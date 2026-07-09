import { useState } from 'react'
import { clientName, formatDate, formatMoney } from '../utils'

export default function Invoices({ invoices, clients, addInvoice, updateInvoice, deleteInvoice }) {
  const [clientId, setClientId] = useState(clients[0]?.id || '')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  const pendingTotal = invoices.filter((i) => i.status !== 'Paid').reduce((s, i) => s + Number(i.amount), 0)

  function handleAdd() {
    if (!description.trim() || !amount) return
    addInvoice({
      clientId: Number(clientId), description: description.trim(), amount: Number(amount),
      currency: 'INR', status: 'Pending', issueDate: '2026-07-09', due: '',
    })
    setDescription('')
    setAmount('')
  }

  function cycleStatus(inv) {
    const order = ['Pending', 'Paid', 'Overdue']
    const next = order[(order.indexOf(inv.status) + 1) % order.length]
    updateInvoice(inv.id, { status: next })
  }

  return (
    <div>
      <h2>Invoices</h2>
      <p className="muted">Pending and overdue total: {formatMoney(pendingTotal, 'INR')}</p>

      <div className="inline-form">
        <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={handleAdd}>Add invoice</button>
      </div>

      <div className="task-rows">
        {invoices.map((inv) => (
          <div key={inv.id} className="task-row">
            <div className="task-row-main">
              <p className="task-title">{inv.description}</p>
              <p className="task-sub">{clientName(clients, inv.clientId)} · issued {formatDate(inv.issueDate)}</p>
            </div>
            <span className="task-title">{formatMoney(inv.amount, inv.currency)}</span>
            <button className={`badge badge-${inv.status.toLowerCase()}`} onClick={() => cycleStatus(inv)}>{inv.status}</button>
            <button className="danger-link" onClick={() => deleteInvoice(inv.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
