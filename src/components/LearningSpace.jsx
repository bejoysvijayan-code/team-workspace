import { useState } from 'react'

export default function LearningSpace({ items, isOwner, addLearningItem, updateLearningItem, deleteLearningItem }) {
  const [openId, setOpenId] = useState(items[0]?.id || null)
  const [title, setTitle] = useState('')

  const open = items.find((i) => i.id === openId)

  return (
    <div>
      <h2>Learning space</h2>
      <p className="muted">Visible to everyone. This is a placeholder — content and structure to be filled in later.</p>

      <div className="learning-layout">
        <div className="learning-list">
          {items.map((i) => (
            <button key={i.id} className={openId === i.id ? 'chip active' : 'chip'} onClick={() => setOpenId(i.id)}>
              {i.title}
            </button>
          ))}
          {isOwner && (
            <div className="inline-form" style={{ marginTop: '1rem' }}>
              <input placeholder="New topic title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <button onClick={() => {
                if (!title.trim()) return
                addLearningItem({ title: title.trim(), body: '' })
                setTitle('')
              }}>Add topic</button>
            </div>
          )}
        </div>

        <div className="learning-body">
          {open ? (
            <>
              <h3>{open.title}</h3>
              {isOwner ? (
                <textarea
                  rows={8}
                  value={open.body}
                  onChange={(e) => updateLearningItem(open.id, { body: e.target.value })}
                />
              ) : (
                <p>{open.body}</p>
              )}
              {isOwner && (
                <button className="danger-link" onClick={() => { deleteLearningItem(open.id); setOpenId(items[0]?.id || null) }}>
                  Delete this topic
                </button>
              )}
            </>
          ) : (
            <p className="muted">No topics yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
