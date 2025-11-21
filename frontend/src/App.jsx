import { useEffect, useMemo, useState } from 'react'

const themes = {
  blush: { name: 'Blush Beige', from: '#F9EDE7', to: '#FFFBF7', accent: '#E7C6B8' },
  matcha: { name: 'Matcha Green', from: '#E6F5E7', to: '#C2DABD', accent: '#9BB69E' },
  sakura: { name: 'Sakura Pink', from: '#FFD9E8', to: '#FFF3F9', accent: '#F4AEC7' },
  night: { name: 'Night Mode', from: '#1E1E1E', to: '#2A2A2A', accent: '#B39DDB' },
}

const headerStyles = {
  soft: { label: 'Soft Girl', preview: '✨ 𝐓𝐡𝐨𝐮𝐠𝐡𝐭𝐬 ✨' },
  minimal: { label: 'Minimal', preview: 'Notes' },
  kawaii: { label: 'Kawaii', preview: '(✿ ◕‿◕) 𝐍𝐨𝐭𝐞𝐬' },
  serif: { label: 'Elegant Serif', preview: '❝ Journal ❞' },
}

const templates = {
  study: `🧠 Study Notes Template\n\n📚 Topic: ______\n🗓 Date: ______\n📝 Summary:\n-\n🔍 Key Concepts:\n1.\n2.\n📌 Important Examples:\n-\n🎯 Quick Revision:\n-`,
  journal: `🌿 Daily Journal Template\n\n✨ Date: ______\n💭 What I’m feeling today:\n😞😕🙂😊🤍\n🪷 Thoughts worth recording:\n-\n🎀 Gratitude List:\n1.\n2.\n3.\n🌸 What I want to remember:\n-`,
  todo: `🎯 To-Do Planner Template\n\n📅 Date: ______\n🔥 Priorities:\n▢\n▢\n▢\n🌼 Secondary Tasks:\n▢\n▢\n⭐ Habit Tracker\n▢ Water\n▢ Study\n▢ Journal\n▢ Workout`,
}

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Button({ children, onClick, variant='soft', className='' }){
  const base = 'px-3 py-2 rounded-xl transition-all duration-300 text-sm backdrop-blur-md shadow-sm'
  const styles = {
    soft: 'bg-white/60 hover:bg-white/80 text-rose-900 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.6),_0_8px_24px_rgba(0,0,0,0.06)]',
    accent: 'bg-rose-200/70 hover:bg-rose-200 text-rose-900',
    dark: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
  }
  return <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>{children}</button>
}

function Topbar({ theme, setTheme }) {
  return (
    <div className="flex items-center justify-between py-4 px-5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-2xl bg-white/60 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),_6px_6px_20px_rgba(0,0,0,0.08)]">📔</div>
        <div className="font-semibold tracking-wide text-rose-900">Dear Diary</div>
      </div>
      <div className="flex items-center gap-2">
        {Object.entries(themes).map(([k, t]) => (
          <button key={k} onClick={() => setTheme(k)} title={t.name} className={`h-6 w-6 rounded-full ring-1 ring-black/5`} style={{background: `linear-gradient(135deg, ${t.from}, ${t.to})`}} />
        ))}
      </div>
    </div>
  )
}

function Sidebar({ folders, onCreateFolder, onSelectFolder, selectedFolder }){
  const defaults = [
    {name: '🧠 School'},
    {name: '💼 Work'},
    {name: '🪷 Journal'},
    {name: '✨ Ideas'},
    {name: '🎀 Self-care'},
    {name: '🛒 Shopping List'},
    {name: '📖 Books / Quotes'},
  ]
  return (
    <div className="w-64 p-4 space-y-3">
      <Button variant="accent" onClick={onCreateFolder} className="w-full">➕ New Folder</Button>
      <div className="text-xs uppercase tracking-wide text-rose-900/70">Folders</div>
      <div className="space-y-1">
        {defaults.map((f, idx) => (
          <div key={idx} onClick={() => onSelectFolder(f)} className={`cursor-pointer px-3 py-2 rounded-xl bg-white/50 hover:bg-white/80 text-rose-900 ${selectedFolder?.name===f.name?'ring-1 ring-rose-300':''}`}>{f.name}</div>
        ))}
        {folders.map((f) => (
          <div key={f._id} onClick={() => onSelectFolder(f)} className={`cursor-pointer px-3 py-2 rounded-xl bg-white/50 hover:bg-white/80 text-rose-900 ${selectedFolder?._id===f._id?'ring-1 ring-rose-300':''}`}>{f.icon||'📁'} {f.name}</div>
        ))}
      </div>
    </div>
  )
}

function NoteList({ notes, onSelect, onNew }){
  return (
    <div className="w-80 p-4 border-l border-white/40">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-rose-900/80">Notes</div>
        <Button onClick={onNew}>➕</Button>
      </div>
      <div className="space-y-2">
        {notes.map(n => (
          <div key={n._id} onClick={() => onSelect(n)} className="cursor-pointer p-3 rounded-2xl bg-white/60 hover:bg-white/80 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.6),_8px_12px_30px_rgba(0,0,0,0.06)]">
            <div className="font-semibold text-rose-900 line-clamp-1">{n.title||'Untitled'}</div>
            <div className="text-xs text-rose-900/70 line-clamp-2">{n.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ToneButtons({ onTone }){
  const tones = [
    {k:'study',label:'✍️ Study'},
    {k:'cute',label:'🎀 Cute aesthetic'},
    {k:'academic',label:'📚 Academic'},
    {k:'casual',label:'💬 Casual'},
    {k:'motivational',label:'🔥 Motivational'},
    {k:'soft',label:'🧸 Soft & emotional'},
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {tones.map(t => <Button key={t.k} onClick={() => onTone(t.k)} className="text-xs">{t.label}</Button>)}
    </div>
  )
}

function Editor({ note, setNote, headerChoice }){
  const [aiLoading, setAiLoading] = useState(false)
  const headerPreview = headerStyles[headerChoice].preview

  const rewrite = async (style) => {
    if (!note) return
    setAiLoading(true)
    const res = await fetch(`${apiBase}/ai/rewrite`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({text: note.content, style})})
    const data = await res.json()
    setNote({...note, content: data.result})
    setAiLoading(false)
  }

  return (
    <div className="flex-1 p-6">
      <div className="bg-white/60 rounded-3xl p-6 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.8),_10px_12px_40px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-4 text-rose-900 select-none">
          <div className="text-2xl font-semibold">{headerPreview}</div>
        </div>
        <input className="w-full bg-transparent text-2xl font-semibold text-rose-900 placeholder:text-rose-900/50 outline-none mb-3" placeholder="Untitled" value={note?.title||''} onChange={e=>setNote({...note, title: e.target.value})} />
        <textarea className="w-full h-[48vh] bg-transparent text-rose-900/90 outline-none resize-none leading-7" placeholder="Start writing..." value={note?.content||''} onChange={e=>setNote({...note, content: e.target.value})} />
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-rose-900/60 mb-2">AI Tone Styles</div>
          <ToneButtons onTone={rewrite} />
          {aiLoading && <div className="text-xs text-rose-900/60 mt-2">Crafting your vibe…</div>}
        </div>
      </div>
    </div>
  )
}

export default function App(){
  const [themeKey, setThemeKey] = useState('blush')
  const theme = themes[themeKey]
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [headerChoice, setHeaderChoice] = useState('soft')

  const gradientStyle = useMemo(() => ({ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`}), [theme])

  const fetchFolders = async () => {
    const res = await fetch(`${apiBase}/folders`)
    const data = await res.json()
    setFolders(data)
  }
  const fetchNotes = async (folderId) => {
    const url = new URL(`${apiBase}/notes`)
    if (folderId) url.searchParams.set('folder_id', folderId)
    const res = await fetch(url)
    const data = await res.json()
    setNotes(data)
  }

  useEffect(() => { fetchFolders(); fetchNotes(); }, [])

  const createFolder = async () => {
    const name = prompt('Folder name?')
    if (!name) return
    await fetch(`${apiBase}/folders`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name, icon:'📁'})})
    fetchFolders()
  }

  const selectFolder = (f) => { setSelectedFolder(f); fetchNotes(f._id) }

  const newNote = async (templateKey) => {
    const content = templateKey ? templates[templateKey] : ''
    const res = await fetch(`${apiBase}/notes`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title: 'Untitled', content, folder_id: selectedFolder?._id||null})})
    const data = await res.json()
    await fetchNotes(selectedFolder?._id)
    const created = await (await fetch(`${apiBase}/notes/${data.id}`)).json()
    setSelectedNote(created)
  }

  const saveNote = async () => {
    if (!selectedNote) return
    await fetch(`${apiBase}/notes/${selectedNote._id}`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title:selectedNote.title, content:selectedNote.content})})
    fetchNotes(selectedFolder?._id)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3')
    audio.volume = 0.2
    audio.play()
  }

  const deleteNote = async () => {
    if (!selectedNote) return
    if (!confirm('Delete this note?')) return
    await fetch(`${apiBase}/notes/${selectedNote._id}`, {method:'DELETE'})
    setSelectedNote(null)
    fetchNotes(selectedFolder?._id)
  }

  const applyTemplate = (key) => {
    if (!selectedNote) return newNote(key)
    setSelectedNote({...selectedNote, content: templates[key]})
  }

  const search = async (q) => {
    if (!q){ fetchNotes(selectedFolder?._id); return }
    const res = await fetch(`${apiBase}/ai/search`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({query:q, limit: 20})})
    const data = await res.json()
    setNotes(data.results.map(r => r.note))
  }

  return (
    <div className="min-h-screen" style={gradientStyle}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="rounded-[32px] overflow-hidden backdrop-blur-md shadow-[inset_2px_2px_6px_rgba(255,255,255,0.8),_16px_24px_60px_rgba(0,0,0,0.12)]" style={{background: themeKey==='night'?'rgba(30,30,30,0.6)':'rgba(255,255,255,0.35)'}}>
          <Topbar theme={theme} setTheme={setThemeKey} />
          <div className="flex border-t border-white/40">
            <Sidebar folders={folders} onCreateFolder={createFolder} onSelectFolder={selectFolder} selectedFolder={selectedFolder} />
            <div className="flex-1 flex">
              <NoteList notes={notes} onSelect={setSelectedNote} onNew={()=>newNote()} />
              <div className="flex-1">
                {selectedNote ? (
                  <div className="flex flex-col h-full">
                    <Editor note={selectedNote} setNote={setSelectedNote} headerChoice={headerChoice} />
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button onClick={saveNote} variant="accent">Save</Button>
                        <Button onClick={deleteNote}>Delete</Button>
                        <Button onClick={()=>applyTemplate('study')}>🧠 Study</Button>
                        <Button onClick={()=>applyTemplate('journal')}>🌿 Journal</Button>
                        <Button onClick={()=>applyTemplate('todo')}>🎯 To-Do</Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <select value={headerChoice} onChange={e=>setHeaderChoice(e.target.value)} className="px-3 py-2 rounded-xl bg-white/70 text-rose-900">
                          {Object.entries(headerStyles).map(([k,s])=> <option key={k} value={k}>{s.label}</option>)}
                        </select>
                        <input onChange={e=>search(e.target.value)} placeholder="AI Search…" className="px-3 py-2 rounded-xl bg-white/70 text-rose-900 placeholder:text-rose-900/60" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-rose-900/60 p-10">
                    <div className="text-center">
                      <div className="text-3xl mb-2">Welcome to Dear Diary</div>
                      <div>Select a folder or create a note. Try templates to get started.</div>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Button onClick={()=>newNote('study')}>🧠 Study Template</Button>
                        <Button onClick={()=>newNote('journal')}>🌿 Journal Template</Button>
                        <Button onClick={()=>newNote('todo')}>🎯 To-Do Template</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
