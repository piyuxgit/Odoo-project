import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StickyNote, Plus, Trash2, Edit3, Save, X, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import { getNotesAPI, createNoteAPI, updateNoteAPI, deleteNoteAPI } from '../services/api';

const TripNotes = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotes(); }, [id]);
  const fetchNotes = async () => { try { const r = await getNotesAPI(id); setNotes(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } };
  const handleCreate = async (e) => { e.preventDefault(); if (!content.trim()) return; await createNoteAPI({ trip_id: id, note_content: content }); setContent(''); fetchNotes(); };
  const handleUpdate = async (nid) => { if (!editContent.trim()) return; await updateNoteAPI(nid, { note_content: editContent }); setEditingId(null); fetchNotes(); };
  const handleDelete = async (nid) => { await deleteNoteAPI(nid); fetchNotes(); };
  const formatDate = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Trip Notes</h1>
        <p className="text-stone-500 mb-8 text-sm">Jot down reminders, hotel info, or day-specific details.</p>

        <form onSubmit={handleCreate} className="warm-card p-4 mb-8">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3}
            placeholder="Write a note, reminder, or journal entry..."
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none text-sm mb-3" />
          <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors cursor-pointer">
            <Plus size={15} /> Add note
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div></div>
        ) : notes.length === 0 ? (
          <div className="warm-card p-12 flex flex-col items-center text-center">
            <StickyNote size={36} className="text-stone-400 mb-3" />
            <p className="text-stone-500 text-sm">No notes yet. Write your first note above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note, i) => (
              <motion.div key={note.note_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="warm-card p-4">
                {editingId === note.note_id ? (
                  <div className="space-y-2">
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(note.note_id)} className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm cursor-pointer"><Save size={13} /> Save</button>
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-sm cursor-pointer"><X size={13} /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-stone-700 whitespace-pre-wrap mb-3 leading-relaxed">{note.note_content}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-stone-400"><Clock size={11} /> {formatDate(note.created_at)}</span>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingId(note.note_id); setEditContent(note.note_content); }} className="p-1.5 text-stone-400 hover:text-teal-600 transition-colors cursor-pointer"><Edit3 size={13} /></button>
                        <button onClick={() => handleDelete(note.note_id)} className="p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TripNotes;
