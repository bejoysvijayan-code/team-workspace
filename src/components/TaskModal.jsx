import { useState } from 'react'
import { getPercent } from '../utils'

const STATUSES = ['To do', 'In progress', 'In review', 'Done']
const PRIORITIES = ['Low', 'Medium', 'High']

export default function TaskModal({
  task, project, team, currentUser, isOwner, onClose,
  updateTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask, addComment,
}) {
  const [newSub, setNewSub] = useState('')
  const [newComment, setNewComment] = useState('')

  const hasSubtasks = task.subtasks.length > 0
  const pct = getPercent(task)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <input
            className="task-title-input"
            value={task.title}
            onChange={(e) => updateTask(task.id, { title: e.target.value })}
          />
          <button onClick={onClose} aria-label="Close">Close</button>
        </div>
        <p className="muted">{project ? project.name : ''}</p>

        <div className="modal-grid">
          <label>
            Status
            <select value={task.status} onChange={(e) => updateTask(task.id, { status: e.target.value })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>
            Assignee
            <select value={task.assigneeId} onChange={(e) => updateTask(task.id, { assigneeId: Number(e.target.value) })}>
              {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </label>
          <label>
            Priority
            <select value={task.priority} onChange={(e) => updateTask(task.id, { priority: e.target.value })}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>
          <label>
            Due date
            <input type="date" value={task.due} onChange={(e) => updateTask(task.id, { due: e.target.value })} />
          </label>
        </div>

        <label className="block">
          Percent complete {hasSubtasks && <span className="muted">(auto from subtasks)</span>}
          {hasSubtasks ? (
            <div className="progress-bar"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
          ) : (
            <input
              type="range" min="0" max="100" step="5"
              value={task.manualPct}
              onChange={(e) => updateTask(task.id, { manualPct: Number(e.target.value) })}
            />
          )}
          <span className="muted">{pct}%</span>
        </label>

        <label className="block">
          Things to remember
          <textarea rows={2} value={task.notes} onChange={(e) => updateTask(task.id, { notes: e.target.value })} />
        </label>

        <div className="block">
          <p className="section-label">Subtasks</p>
          {task.subtasks.map((s) => (
            <div key={s.id} className="subtask-row">
              <label>
                <input type="checkbox" checked={s.done} onChange={() => toggleSubtask(task.id, s.id)} />
                <span className={s.done ? 'done-text' : ''}>{s.text}</span>
              </label>
              <button className="danger-link" onClick={() => deleteSubtask(task.id, s.id)}>Remove</button>
            </div>
          ))}
          <div className="inline-form">
            <input placeholder="Add subtask" value={newSub} onChange={(e) => setNewSub(e.target.value)} />
            <button onClick={() => { if (newSub.trim()) { addSubtask(task.id, newSub.trim()); setNewSub('') } }}>Add</button>
          </div>
        </div>

        <div className="block">
          <p className="section-label">Updates and feedback</p>
          <p className="muted small">Only visible to you and this task's assignee.</p>
          {task.comments.map((c) => (
            <div key={c.id} className="comment-row">
              <p className="comment-author">{c.author}</p>
              <p>{c.text}</p>
            </div>
          ))}
          <div className="inline-form">
            <input placeholder="Post an update or comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <button onClick={() => { if (newComment.trim()) { addComment(task.id, newComment.trim()); setNewComment('') } }}>Post</button>
          </div>
        </div>

        {isOwner && (
          <button className="danger-link" onClick={() => { deleteTask(task.id); onClose() }}>Delete this task</button>
        )}
      </div>
    </div>
  )
}
