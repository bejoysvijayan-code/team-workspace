import { useState } from 'react'
import { getPercent, isOverdue, clientName, teamName, formatDate, initials } from '../utils'

const STATUSES = ['To do', 'In progress', 'In review', 'Done']

export default function ProjectBoard({
  projects, tasks, clients, team, activeProjectId, setActiveProjectId,
  addProject, updateProject, deleteProject, addTask, onOpenTask,
}) {
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectClient, setNewProjectClient] = useState(clients[0]?.id || '')
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0]

  function handleAddProject() {
    if (!newProjectName.trim()) return
    const id = addProject(newProjectName.trim(), Number(newProjectClient))
    setActiveProjectId(id)
    setNewProjectName('')
  }

  function handleAddTask() {
    if (!newTaskTitle.trim() || !activeProject) return
    addTask(activeProject.id, newTaskTitle.trim())
    setNewTaskTitle('')
  }

  const projectTasks = activeProject ? tasks.filter((t) => t.projectId === activeProject.id) : []

  return (
    <div>
      <h2>Projects</h2>

      <div className="project-tabs">
        {projects.map((p) => (
          <button
            key={p.id}
            className={activeProject?.id === p.id ? 'chip active' : 'chip'}
            onClick={() => setActiveProjectId(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="inline-form">
        <input placeholder="New project name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
        <select value={newProjectClient} onChange={(e) => setNewProjectClient(e.target.value)}>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={handleAddProject}>Add project</button>
      </div>

      {activeProject && (
        <>
          <div className="project-brief">
            <p className="muted">{clientName(clients, activeProject.clientId)} · due {formatDate(activeProject.due) || 'no date set'}</p>
            <textarea
              rows={2}
              value={activeProject.brief}
              placeholder="Project brief: goal, references, deadline"
              onChange={(e) => updateProject(activeProject.id, { brief: e.target.value })}
            />
            <button className="danger-link" onClick={() => deleteProject(activeProject.id)}>Delete this project</button>
          </div>

          <div className="inline-form">
            <input placeholder="Add a task to this project" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
            <button onClick={handleAddTask}>Add task</button>
          </div>

          <div className="board">
            {STATUSES.map((status) => (
              <div key={status} className="board-column">
                <p className="column-header">{status}</p>
                {projectTasks.filter((t) => t.status === status).map((t) => (
                  <div key={t.id} className="task-card" onClick={() => onOpenTask(t.id)}>
                    <div className="task-card-top">
                      <span className="avatar">{initials(teamName(team, t.assigneeId))}</span>
                      <p className="task-title">{t.title}</p>
                    </div>
                    <div className="task-card-meta">
                      <span className={`badge badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                      <span className={isOverdue(t) ? 'due danger' : 'due'}>{isOverdue(t) ? 'Overdue' : formatDate(t.due)}</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: getPercent(t) + '%' }} /></div>
                  </div>
                ))}
                {projectTasks.filter((t) => t.status === status).length === 0 && (
                  <p className="muted small">No tasks</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
