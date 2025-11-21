import React, { useEffect, useMemo, useState } from 'react'
import './index.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const themes = {
  blush: {
    bg: 'from-rose-50 via-rose-100 to-rose-50',
    panel: 'bg-white/70',
    accent: 'rose',
    text: 'text-rose-900',
  },
  matcha: {
    bg: 'from-emerald-50 via-green-100 to-emerald-50',
    panel: 'bg-white/70',
    accent: 'emerald',
    text: 'text-emerald-950',
  },
  sakura: {
    bg: 'from-pink-50 via-fuchsia-100 to-pink-50',
    panel: 'bg-white/70',
    accent: 'pink',
    text: 'text-fuchsia-900',
  },
  night: {
    bg: 'from-slate-900 via-indigo-950 to-slate-900',
    panel: 'bg-slate-900/60',
    accent: 'indigo',
    text: 'text-slate-100',
  },
}

const templates = {
  study: `📚 Study Notes\n\nTopic: ...\nKey Terms:\n- ...\n- ...\n\nSummary:\n...\n\nQuestions:\n- ...\n- ...`,
  journal: `🫶 Daily Journal\n\nMood: ...\nGratitude:\n- ...\n- ...\n\nToday I noticed:\n...\n\nTiny wins:\n- ...`,
  todo: `🗒️ To‑Do Planner\n\n▢ Task 1\n▢ Task 2\n▢ Task 3\n\nNotes:\n...`,
}

function Topbar({ theme, setTheme, onSearch, onIdeas, onExport, onTranscribe, handwriting, setHandwriting }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 sticky top-0 z-20 backdrop-blur-md ${theme.panel} border border-white/30 rounded-xl shadow-lg`}> 
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-${theme.accent}-400 to-${theme.accent}-600 shadow-inner`}></div>
        <span className="font-semibold">Dear Diary</span>
      </div>
      <div className="flex items-center gap-2">
        <input onChange={e=>onSearch(e.target.value)} placeholder="Search by meaning..." className="px-3 py-2 text-sm rounded-lg bg-white/60 focus:bg-white outline-none border border-black/5" />
        <button onClick={onIdeas} className="px-3 py-2 text-sm rounded-lg bg-black/5 hover:bg-black/10">Ideas</button>
        <button onClick={onExport} className="px-3 py-2 text-sm rounded-lg bg-black/5 hover:bg-black/10">Export</button>
        <button onClick={onTranscribe} className="px-3 py-2 text-sm rounded-lg bg-black/5 hover:bg-black/10">Transcribe</button>
        <select value={theme.key} onChange={e=>setTheme(e.target.value)} className="px-2 py-2 text-sm rounded-lg bg-black/5">
          <option value="blush">Blush</option>
          <option value="matcha">Matcha</option>
          <option value="sakura">Sakura</option>
          <option value="night">Night</option>
        </select>
        <label className="ml-2 text-sm flex items-center gap-1">
          <input type="checkbox" checked={handwriting} onChange={e=>setHandwriting(e.target.checked)} /> Handwriting
        </label>
      </div>
    </div>
  )
}

function Sidebar({ folders, onAddFolder, onSelectFolder, currentFolder }) {
  const [name, setName] = useState('')
  return (
    <div className="p-3 space-y-3">
      <div className="flex gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="New folder" className="flex-1 px-3 py-2 rounded-lg bg-white/70 border border-black/5" />
        <button onClick={()=>{ if(!name.trim()) return; onAddFolder(name); setName('') }} className="px-3 py-2 rounded-lg bg-black/5 hover:bg-black/10">＋</button>
      </div>
      <div className="space-y-1">
        {folders.map(f => (
          <button key={f.id} onClick={()=>onSelectFolder(f.id)} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 ${currentFolder===f.id?'bg-black/10':''}`}>{f.name}</button>
        ))}
      </div>
    </div>
  )
}

function NoteList({ notes, onAddNote, onSelect, selectedId }) {
  return (
    <div className="p-3 space-y-2">
      <button onClick={onAddNote} className="w-full py-2 rounded-lg bg-black/5 hover:bg-black/10">New note</button>
      {notes.map(n => (
        <button key={n.id} onClick={()=>onSelect(n.id)} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 ${selectedId===n.id?'bg-black/10':''}`}>
          <div className="font-medium truncate">{n.title || 'Untitled'}</div>
          <div className="text-xs opacity-70 truncate">{n.content?.slice(0,80)}</div>
        </button>
      ))}
    </div>
  )
}

function Editor({ note, setNote, onSave, onDelete, onTone, onExport }) {
  if (!note) return <div className="flex items-center justify-center h-full opacity-60">Select or create a note</div>
  const applyChecklistToggle = () => {
    const toggled = (note.content||'').split('\n').map(line => {
      if (line.startsWith('▢')) return '✅' + line.slice(1)
      if (line.startsWith('✅')) return '▢' + line.slice(1)
      return line
    }).join('\n')
    setNote({ ...note, content: toggled })
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-3">
        <input value={note.title} onChange={e=>setNote({...note, title: e.target.value})} placeholder="Title" className="flex-1 text-lg font-semibold bg-transparent outline-none border-b border-black/5" />
        <button onClick={()=>onTone('soft')} className="px-2 py-1 text-xs rounded bg-black/5">Soft</button>
        <button onClick={()=>onTone('cute')} className="px-2 py-1 text-xs rounded bg-black/5">Cute</button>
        <button onClick={()=>onTone('formal')} className="px-2 py-1 text-xs rounded bg-black/5">Formal</button>
        <button onClick={()=>onTone('casual')} className="px-2 py-1 text-xs rounded bg-black/5">Casual</button>
        <button onClick={()=>onTone('motivational')} className="px-2 py-1 text-xs rounded bg-black/5">Motivate</button>
        <button onClick={applyChecklistToggle} className="px-2 py-1 text-xs rounded bg-black/5">Toggle ☑</button>
        <button onClick={onSave} className="px-3 py-1 rounded bg-black/10 hover:bg-black/20">Save</button>
        <button onClick={onDelete} className="px-3 py-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200">Delete</button>
        <button onClick={onExport} className="px-3 py-1 rounded bg-black/5">Export</button>
      </div>
      <textarea value={note.content} onChange={e=>setNote({...note, content: e.target.value})} className="flex-1 p-4 bg-transparent outline-none" placeholder="Start writing..." />
    </div>
  )
}

export default function App(){
  const [themeKey, setThemeKey] = useState('blush')
  const theme = useMemo(()=>({ ...themes[themeKey], key: themeKey }), [themeKey])
  const [folders, setFolders] = useState([])
  const [currentFolder, setCurrentFolder] = useState(null)
  const [notes, setNotes] = useState([])
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState(null)
  const [handwriting, setHandwriting] = useState(false)

  const loadFolders = async () => {
    const r = await fetch(`${BACKEND}/folders`)
    setFolders(await r.json())
  }
  const loadNotes = async () => {
    const url = currentFolder? `${BACKEND}/notes?folder_id=${currentFolder}`: `${BACKEND}/notes`
    const r = await fetch(url)
    setNotes(await r.json())
  }
  useEffect(()=>{ loadFolders() },[])
  useEffect(()=>{ loadNotes() },[currentFolder])
  useEffect(()=>{
    if (!selected) { setNote(null); return }
    const run = async () => {
      const r = await fetch(`${BACKEND}/notes/${selected}`)
      const d = await r.json()
      setNote(d)
    }
    run()
  },[selected])

  const addFolder = async (name) => {
    await fetch(`${BACKEND}/folders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name }) })
    loadFolders()
  }
  const addNote = async () => {
    const r = await fetch(`${BACKEND}/notes`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title:'Untitled', content:'', folder_id: currentFolder }) })
    const d = await r.json()
    setSelected(d.id)
    loadNotes()
  }
  const saveNote = async () => {
    if (!note) return
    await fetch(`${BACKEND}/notes/${note.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: note.title, content: note.content }) })
    loadNotes()
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
    audio.volume = 0.25
    audio.play().catch(()=>{})
  }
  const deleteNote = async () => {
    if (!note) return
    await fetch(`${BACKEND}/notes/${note.id}`, { method:'DELETE' })
    setSelected(null)
    setNote(null)
    loadNotes()
  }
  const rewriteTone = async (tone) => {
    if (!note) return
    const r = await fetch(`${BACKEND}/ai/rewrite`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: note.content, tone }) })
    const d = await r.json()
    setNote({ ...note, content: d.text })
  }
  const doIdeas = async () => {
    const topic = prompt('Ideas about?') || ''
    const r = await fetch(`${BACKEND}/ai/ideas`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ topic }) })
    const d = await r.json()
    const insert = '\n\n' + d.ideas.map(i=>`• ${i}`).join('\n')
    if (note) setNote({ ...note, content: (note.content||'') + insert })
  }
  const doSearch = async (q) => {
    if (!q) { loadNotes(); return }
    const r = await fetch(`${BACKEND}/ai/search`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query: q }) })
    const d = await r.json()
    const mapped = d.results.map(x=>({ id: x.id, title: x.title, content: x.snippet }))
    setNotes(mapped)
  }
  const doExport = async () => {
    if (!note) return
    const r = await fetch(`${BACKEND}/export/pdf`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ note_id: note.id, title: note.title }) })
    const blob = await r.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${note.title||'note'}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }
  const doTranscribe = async () => {
    const audioUrl = prompt('Audio URL to transcribe (stub)?')
    if (!audioUrl) return
    const r = await fetch(`${BACKEND}/transcribe`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ audio_url: audioUrl }) })
    const d = await r.json()
    if (note) setNote({ ...note, content: (note.content||'') + `\n\n${d.text}` })
  }

  const applyTemplate = async (key) => {
    if (!currentFolder) {
      alert('Create/select a folder first')
      return
    }
    const r = await fetch(`${BACKEND}/notes`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: key==='journal'?'Daily Journal':'Untitled', content: templates[key], folder_id: currentFolder }) })
    const d = await r.json()
    setSelected(d.id)
    loadNotes()
  }

  return (
    <div className={`min-h-screen relative bg-gradient-to-br ${theme.bg} ${handwriting? 'font-["Caveat","Patrick Hand",cursive]':''}`}>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,.6),transparent_60%)]"></div>

      <div className="relative p-4 grid grid-cols-12 gap-4">
        <div className={`col-span-3 ${theme.panel} backdrop-blur-xl border border-black/5 rounded-2xl shadow-xl`}> 
          <Sidebar folders={folders} onAddFolder={addFolder} onSelectFolder={setCurrentFolder} currentFolder={currentFolder} />
        </div>
        <div className={`col-span-3 ${theme.panel} backdrop-blur-xl border border-black/5 rounded-2xl shadow-xl`}> 
          <NoteList notes={notes} onAddNote={addNote} onSelect={setSelected} selectedId={selected} />
        </div>
        <div className={`col-span-6 ${theme.panel} backdrop-blur-xl border border-black/5 rounded-2xl shadow-xl`}> 
          <div className="p-3">
            <Topbar theme={theme} setTheme={setThemeKey} onSearch={doSearch} onIdeas={doIdeas} onExport={doExport} onTranscribe={doTranscribe} handwriting={handwriting} setHandwriting={setHandwriting} />
          </div>
          <div className="h-[70vh]">
            <Editor note={note} setNote={setNote} onSave={saveNote} onDelete={deleteNote} onTone={rewriteTone} onExport={doExport} />
          </div>
          <div className="p-3 border-t border-black/5">
            <div className="flex flex-wrap gap-2 text-sm">
              <button onClick={()=>applyTemplate('study')} className="px-3 py-2 rounded-lg bg-black/5 hover:bg-black/10">Study Template</button>
              <button onClick={()=>applyTemplate('journal')} className="px-3 py-2 rounded-lg bg-black/5 hover:bg-black/10">Journal Template</button>
              <button onClick={()=>applyTemplate('todo')} className="px-3 py-2 rounded-lg bg-black/5 hover:bg-black/10">To‑Do Template</button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating plus button */}
      <button onClick={addNote} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur border border-white/30 shadow-2xl flex items-center justify-center text-2xl">
        +
      </button>
    </div>
  )
}
