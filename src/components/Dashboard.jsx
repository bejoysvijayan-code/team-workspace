import { getPercent, isOverdue, clientName, teamName, formatDate, formatMoney } from '../utils'

export default function Dashboard({ tasks, projects, invoices, clients, team, onOpenTask }) {
  const open = tasks.filter((t) => t.status !== 'Done')
  const overdue = tasks.filter((t) => isOverdue(t))
  const weekFromNow = new Date('2026-07-16T00:00:00')
  const dueThisWeek = tasks.filter((t) => t.status !== 'Done' && t.due && new Date(t.due + 'T00:00:00') <= weekFromNow)
  const unpaidTotal = invoices
    .filter((i) => i.status !== 'Paid')
    .reduce((sum, i) => sum + Number(i.amount), 0)

  const todayAndOverdue = tasks
    .filter((t) => t.status !== 'Done' && t.due && t.due <= '2026-07-09')
    .sort((a, b) => (a.due < b.due ? -1 : 1))

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="metric-grid">
        <div className="metric-card">
          <p className="metric-label">Open tasks</p>
          <p className="metric-value">{open.length}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Overdue</p>
          <p className="metric-value danger">{overdue.length}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Due this week</p>
          <p className="metric-value">{dueThisWeek.length}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Unpaid invoices</p>
          <p className="metric-value">{formatMoney(unpaidTotal, 'INR')}</p>
        </div>
      </div>

      <h3>Today and overdue</h3>
      {todayAndOverdue.length === 0 && <p className="muted">Nothing due or overdue right now.</p>}
      <div className="task-rows">
        {todayAndOverdue.map((t) => {
          const project = projects.find((p) => p.id === t.projectId)
          return (
            <div key={t.id} className="task-row" onClick={() => onOpenTask(t.id)}>
              <div className="task-row-main">
                <p className="task-title">{t.title}</p>
                <p className="task-sub">{project ? project.name : ''} · {teamName(team, t.assigneeId)}</p>
              </div>
              <span className={`badge ${isOverdue(t) ? 'badge-danger' : 'badge-neutral'}`}>
                {isOverdue(t) ? 'Overdue' : 'Due'} {formatDate(t.due)}
              </span>
              <span className="progress-mini">{getPercent(t)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
