import { useState } from 'react'
import {
  initialClients, initialTeam, initialProjects, initialTasks,
  initialInvoices, initialLearningItems,
} from './data/sampleData'
import { nextId } from './utils'
import Dashboard from './components/Dashboard'
import ProjectBoard from './components/ProjectBoard'
import MyTasks from './components/MyTasks'
import Invoices from './components/Invoices'
import ClientsTeam from './components/ClientsTeam'
import LearningSpace from './components/LearningSpace'
import TaskModal from './components/TaskModal'
import LoginScreen from './components/LoginScreen'

const SESSION_KEY = 'twLoggedInUserId'

export default function App() {
  const [clients, setClients] = useState(initialClients)
  const [team, setTeam] = useState(initialTeam)
  const [projects, setProjects] = useState(initialProjects)
  const [tasks, setTasks] = useState(initialTasks)
  const [invoices, setInvoices] = useState(initialInvoices)
  const [learningItems, setLearningItems] = useState(initialLearningItems)

  const [loggedInUserId, setLoggedInUserId] = useState(() => {
    const stored = Number(localStorage.getItem(SESSION_KEY))
    return stored || null
  })
  const [view, setView] = useState('dashboard')
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [openTaskId, setOpenTaskId] = useState(null)

  const currentUserId = loggedInUserId
  const currentUser = team.find((t) => t.id === currentUserId)
  const isOwner = currentUser?.role === 'Owner'

  function handleLogin(id) {
    localStorage.setItem(SESSION_KEY, String(id))
    setLoggedInUserId(id)
  }
  function handleLogout() {
    localStorage.removeItem(SESSION_KEY)
    setLoggedInUserId(null)
    setView('dashboard')
  }

  // ---- Task helpers ----
  function updateTask(id, patch) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }
  function addTask(projectId, title) {
    const t = {
      id: nextId(tasks), projectId, title, assigneeId: currentUserId,
      status: 'To do', priority: 'Medium', due: '', manualPct: 0,
      notes: '', subtasks: [], comments: [],
    }
    setTasks((prev) => [...prev, t])
  }
  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (openTaskId === id) setOpenTaskId(null)
  }
  function addSubtask(taskId, text) {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t
      const sub = { id: nextId(t.subtasks), text, done: false }
      return { ...t, subtasks: [...t.subtasks, sub] }
    }))
  }
  function toggleSubtask(taskId, subId) {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t
      return { ...t, subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)) }
    }))
  }
  function deleteSubtask(taskId, subId) {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t
      return { ...t, subtasks: t.subtasks.filter((s) => s.id !== subId) }
    }))
  }
  function addComment(taskId, text) {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t
      const c = { id: nextId(t.comments), author: currentUser?.name || 'You', text, ts: new Date().toISOString() }
      return { ...t, comments: [...t.comments, c] }
    }))
  }

  // ---- Project helpers ----
  function addProject(name, clientId) {
    const p = { id: nextId(projects), name, clientId, brief: '', status: 'Active', due: '' }
    setProjects((prev) => [...prev, p])
    return p.id
  }
  function updateProject(id, patch) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }
  function deleteProject(id) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasks((prev) => prev.filter((t) => t.projectId !== id))
    if (activeProjectId === id) setActiveProjectId(null)
  }

  // ---- Invoice helpers ----
  function addInvoice(inv) {
    setInvoices((prev) => [...prev, { ...inv, id: nextId(prev) }])
  }
  function updateInvoice(id, patch) {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }
  function deleteInvoice(id) {
    setInvoices((prev) => prev.filter((i) => i.id !== id))
  }

  // ---- Client / team helpers ----
  function addClient(c) { setClients((prev) => [...prev, { ...c, id: nextId(prev) }]) }
  function updateClient(id, patch) { setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))) }
  function deleteClient(id) { setClients((prev) => prev.filter((c) => c.id !== id)) }

  function addTeamMember(m) { setTeam((prev) => [...prev, { ...m, id: nextId(prev) }]) }
  function updateTeamMember(id, patch) { setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m))) }
  function deleteTeamMember(id) { setTeam((prev) => prev.filter((m) => m.id !== id)) }

  // ---- Learning helpers ----
  function addLearningItem(item) { setLearningItems((prev) => [...prev, { ...item, id: nextId(prev) }]) }
  function updateLearningItem(id, patch) { setLearningItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i))) }
  function deleteLearningItem(id) { setLearningItems((prev) => prev.filter((i) => i.id !== id)) }

  const ownerNav = [
    ['dashboard', 'Dashboard'],
    ['board', 'Projects'],
    ['invoices', 'Invoices'],
    ['clients', 'Clients and team'],
    ['learning', 'Learning space'],
  ]
  const designerNav = [
    ['mytasks', 'My tasks'],
    ['learning', 'Learning space'],
  ]
  const nav = isOwner ? ownerNav : designerNav

  const effectiveView = nav.some(([v]) => v === view) ? view : nav[0][0]

  const openTask = tasks.find((t) => t.id === openTaskId) || null

  if (!currentUser) {
    return <LoginScreen team={team} onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Team workspace</h1>
        <div className="role-switch">
          <span>Hi, {currentUser.name}</span>
          <button className="logout-link" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <div className="layout">
        <nav className="sidenav">
          {nav.map(([v, label]) => (
            <button key={v} className={effectiveView === v ? 'active' : ''} onClick={() => setView(v)}>
              {label}
            </button>
          ))}
        </nav>

        <main className="content">
          {effectiveView === 'dashboard' && isOwner && (
            <Dashboard
              tasks={tasks} projects={projects} invoices={invoices} clients={clients} team={team}
              onOpenTask={(id) => setOpenTaskId(id)}
            />
          )}
          {effectiveView === 'board' && isOwner && (
            <ProjectBoard
              projects={projects} tasks={tasks} clients={clients} team={team}
              activeProjectId={activeProjectId} setActiveProjectId={setActiveProjectId}
              addProject={addProject} updateProject={updateProject} deleteProject={deleteProject}
              addTask={addTask} onOpenTask={(id) => setOpenTaskId(id)}
            />
          )}
          {effectiveView === 'mytasks' && (
            <MyTasks
              tasks={tasks} projects={projects} currentUserId={currentUserId}
              onOpenTask={(id) => setOpenTaskId(id)}
            />
          )}
          {effectiveView === 'invoices' && isOwner && (
            <Invoices
              invoices={invoices} clients={clients}
              addInvoice={addInvoice} updateInvoice={updateInvoice} deleteInvoice={deleteInvoice}
            />
          )}
          {effectiveView === 'clients' && isOwner && (
            <ClientsTeam
              clients={clients} team={team}
              addClient={addClient} updateClient={updateClient} deleteClient={deleteClient}
              addTeamMember={addTeamMember} updateTeamMember={updateTeamMember} deleteTeamMember={deleteTeamMember}
            />
          )}
          {effectiveView === 'learning' && (
            <LearningSpace
              items={learningItems} isOwner={isOwner}
              addLearningItem={addLearningItem} updateLearningItem={updateLearningItem} deleteLearningItem={deleteLearningItem}
            />
          )}
        </main>
      </div>

      {openTask && (
        <TaskModal
          task={openTask}
          project={projects.find((p) => p.id === openTask.projectId)}
          team={team}
          currentUser={currentUser}
          isOwner={isOwner}
          onClose={() => setOpenTaskId(null)}
          updateTask={updateTask}
          deleteTask={deleteTask}
          addSubtask={addSubtask}
          toggleSubtask={toggleSubtask}
          deleteSubtask={deleteSubtask}
          addComment={addComment}
        />
      )}
    </div>
  )
}
