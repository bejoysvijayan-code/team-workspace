import { getPercent, isOverdue, formatDate } from '../utils'

export default function MyTasks({ tasks, projects, currentUserId, onOpenTask }) {
  const mine = tasks
    .filter((t) => t.assigneeId === currentUserId)
    .sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'))

  return (
    <div>
      <h2>My tasks</h2>
      {mine.length === 0 && <p className="muted">Nothing assigned to you yet.</p>}
      <div className="task-rows">
        {mine.map((t) => {
          const project = projects.find((p) => p.id === t.projectId)
          return (
            <div key={t.id} className="task-row" onClick={() => onOpenTask(t.id)}>
              <div className="task-row-main">
                <p className="task-title">{t.title}</p>
                <p className="task-sub">{project ? project.name : ''}</p>
              </div>
              <span className={`badge badge-${t.status.replace(' ', '-').toLowerCase()}`}>{t.status}</span>
              <span className={isOverdue(t) ? 'due danger' : 'due'}>{isOverdue(t) ? 'Overdue' : formatDate(t.due)}</span>
              <span className="progress-mini">{getPercent(t)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
