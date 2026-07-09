import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc,
  query, where, writeBatch, getDocs,
} from 'firebase/firestore'
import { auth, db } from './firebase'
import { nextId } from './utils'
import Dashboard from './components/Dashboard'
import ProjectBoard from './components/ProjectBoard'
import MyTasks from './components/MyTasks'
import Invoices from './components/Invoices'
import ClientsTeam from './components/ClientsTeam'
import LearningSpace from './components/LearningSpace'
import TaskModal from './components/TaskModal'
import LoginScreen from './components/LoginScreen'

export default function App() {
  const [authUser, setAuthUser] = useState(undefined) // undefined = checking, null = logged out
  const [clients, setClients] = useState([])
  const [team, setTeam] = useState([])
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [invoices, setInvoices] = useState([])
  const [learningItems, setLearningItems] = useState([])

  const [view, setView] = useState('dashboard')
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [openTaskId, setOpenTaskId] = useState(null)

  useEffect(() => onAuthStateChanged(auth, setAuthUser), [])

  useEffect(() => {
    if (!authUser) return
    const collections = [
      ['clients', setClients],
      ['team', setTeam],
      ['projects', setProjects],
      ['tasks', setTasks],
      ['invoices', setInvoices],
      ['learningItems', setLearningItems],
    ]
    const unsubs = collections.map(([name, setter]) =>
      onSnapshot(collection(db, name), (snap) => setter(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
    )
    return () => unsubs.forEach((u) => u())
  }, [authUser])

  const currentUser = team.find((t) => t.id === authUser?.uid) || null
  const isOwner = currentUser?.role === 'Owner'

  function handleLogout() {
    signOut(auth)
    setView('dashboard')
  }

  // ---- Task helpers ----
  function updateTask(id, patch) {
    updateDoc(doc(db, 'tasks', id), patch)
  }
  function addTask(projectId, title) {
    addDoc(collection(db, 'tasks'), {
      projectId, title, assigneeId: currentUser.id,
      status: 'To do', priority: 'Medium', due: '', manualPct: 0,
      notes: '', subtasks: [], comments: [],
    })
  }
  function deleteTask(id) {
    deleteDoc(doc(db, 'tasks', id))
    if (openTaskId === id) setOpenTaskId(null)
  }
  function addSubtask(taskId, text) {
    const t = tasks.find((t) => t.id === taskId)
    if (!t) return
    const sub = { id: nextId(t.subtasks), text, done: false }
    updateDoc(doc(db, 'tasks', taskId), { subtasks: [...t.subtasks, sub] })
  }
  function toggleSubtask(taskId, subId) {
    const t = tasks.find((t) => t.id === taskId)
    if (!t) return
    updateDoc(doc(db, 'tasks', taskId), {
      subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)),
    })
  }
  function deleteSubtask(taskId, subId) {
    const t = tasks.find((t) => t.id === taskId)
    if (!t) return
    updateDoc(doc(db, 'tasks', taskId), { subtasks: t.subtasks.filter((s) => s.id !== subId) })
  }
  function addComment(taskId, text) {
    const t = tasks.find((t) => t.id === taskId)
    if (!t) return
    const c = { id: nextId(t.comments), author: currentUser?.name || 'You', text, ts: new Date().toISOString() }
    updateDoc(doc(db, 'tasks', taskId), { comments: [...t.comments, c] })
  }

  // ---- Project helpers ----
  async function addProject(name, clientId) {
    const ref = await addDoc(collection(db, 'projects'), { name, clientId, brief: '', status: 'Active', due: '' })
    return ref.id
  }
  function updateProject(id, patch) {
    updateDoc(doc(db, 'projects', id), patch)
  }
  async function deleteProject(id) {
    const batch = writeBatch(db)
    const q = query(collection(db, 'tasks'), where('projectId', '==', id))
    const snap = await getDocs(q)
    snap.forEach((d) => batch.delete(d.ref))
    batch.delete(doc(db, 'projects', id))
    await batch.commit()
    if (activeProjectId === id) setActiveProjectId(null)
  }

  // ---- Invoice helpers ----
  function addInvoice(inv) {
    addDoc(collection(db, 'invoices'), inv)
  }
  function updateInvoice(id, patch) {
    updateDoc(doc(db, 'invoices', id), patch)
  }
  function deleteInvoice(id) {
    deleteDoc(doc(db, 'invoices', id))
  }

  // ---- Client / team helpers ----
  function addClient(c) { addDoc(collection(db, 'clients'), c) }
  function updateClient(id, patch) { updateDoc(doc(db, 'clients', id), patch) }
  function deleteClient(id) { deleteDoc(doc(db, 'clients', id)) }

  function addTeamMember(m) { addDoc(collection(db, 'team'), m) }
  function updateTeamMember(id, patch) { updateDoc(doc(db, 'team', id), patch) }
  function deleteTeamMember(id) { deleteDoc(doc(db, 'team', id)) }

  // ---- Learning helpers ----
  function addLearningItem(item) { addDoc(collection(db, 'learningItems'), item) }
  function updateLearningItem(id, patch) { updateDoc(doc(db, 'learningItems', id), patch) }
  function deleteLearningItem(id) { deleteDoc(doc(db, 'learningItems', id)) }

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

  if (authUser === undefined) {
    return null
  }
  if (!authUser) {
    return <LoginScreen />
  }
  if (!currentUser) {
    return (
      <div className="login-screen">
        <p className="muted">Loading your profile…</p>
      </div>
    )
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
              tasks={tasks} projects={projects} currentUserId={currentUser.id}
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
