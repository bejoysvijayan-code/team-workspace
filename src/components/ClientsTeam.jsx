import { useState } from 'react'

export default function ClientsTeam({
  clients, team, addClient, updateClient, deleteClient,
  addTeamMember, updateTeamMember, deleteTeamMember,
}) {
  const [clientName, setClientName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [memberRole, setMemberRole] = useState('Designer')

  return (
    <div>
      <h2>Clients and team</h2>

      <h3>Clients</h3>
      <div className="inline-form">
        <input placeholder="Client name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        <button onClick={() => { if (clientName.trim()) { addClient({ name: clientName.trim(), contact: '', notes: '' }); setClientName('') } }}>
          Add client
        </button>
      </div>
      <div className="task-rows">
        {clients.map((c) => (
          <div key={c.id} className="task-row">
            <div className="task-row-main">
              <p className="task-title">{c.name}</p>
              <input
                className="notes-inline"
                placeholder="Notes"
                value={c.notes}
                onChange={(e) => updateClient(c.id, { notes: e.target.value })}
              />
            </div>
            <button className="danger-link" onClick={() => deleteClient(c.id)}>Remove</button>
          </div>
        ))}
      </div>

      <h3>Team</h3>
      <div className="inline-form">
        <input placeholder="Team member name" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
        <select value={memberRole} onChange={(e) => setMemberRole(e.target.value)}>
          <option>Owner</option>
          <option>Designer</option>
        </select>
        <button onClick={() => { if (memberName.trim()) { addTeamMember({ name: memberName.trim(), role: memberRole, contact: '' }); setMemberName('') } }}>
          Add team member
        </button>
      </div>
      <div className="task-rows">
        {team.map((m) => (
          <div key={m.id} className="task-row">
            <div className="task-row-main">
              <p className="task-title">{m.name}</p>
              <p className="task-sub">{m.role}</p>
            </div>
            <button className="danger-link" onClick={() => deleteTeamMember(m.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
