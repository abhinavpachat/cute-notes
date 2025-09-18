import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Note } from "./types";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";
import NoteModal from "./components/NoteModal";
import TitleBar from "./components/TitleBar";
import "./App.css";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [showEditor, setShowEditor] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | undefined>(undefined);

  // Load notes on startup
  useEffect(() => {
    invoke<Note[]>("load_notes")
      .then((loadedNotes) => {
        console.log("Loaded notes:", loadedNotes);
        setNotes(loadedNotes);
      })
      .catch((error) => {
        console.error("Failed to load notes:", error);
      });
  }, []);

  // Save or update note
  async function saveNote(note: Note) {
    try {
      if (editingNote) {
        console.log("Updating note:", note);
        await invoke("edit_note", { updatedNote: note });
        setNotes(notes.map((n) => (n.id === note.id ? note : n)));
      } else {
        console.log("Adding new note:", note);
        const updated = [...notes, note];
        await invoke("save_notes", { notes: updated });
        setNotes(updated);
      }
      setEditingNote(undefined);
      setShowEditor(false);
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Failed to save note: " + error);
    }
  }

  // Delete note
  async function deleteNote(id: number) {
    try {
      console.log("Deleting note with ID:", id);
      await invoke("delete_note", { noteId: id });
      setNotes(notes.filter((n) => n.id !== id));
      console.log("Note deleted successfully");
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note: " + error);
    }
  }

  // Start editing a note
  function startEditing(note: Note) {
    setEditingNote(note);
    setShowEditor(true);
  }

  // Start creating a new note
  function startCreating() {
    setEditingNote(undefined);
    setShowEditor(true);
  }

  // Cancel editing
  function cancelEditing() {
    setEditingNote(undefined);
    setShowEditor(false);
  }

  // View note in modal
  function viewNote(note: Note) {
    setViewingNote(note);
  }

  // Close modal
  function closeModal() {
    setViewingNote(undefined);
  }

  return (
    <>
      <TitleBar />
      <div className="app-container">
        {!showEditor && (
          <>
            {notes.length === 0 ? (
              <div className="empty-state">
                <h3>No notes yet</h3>
                <p>Create your first note to get started!</p>
                <div className="add-note-card" onClick={startCreating}>
                  <div className="add-note-icon">+</div>
                </div>
              </div>
            ) : (
              <NoteList
                notes={notes}
                onEdit={startEditing}
                onDelete={deleteNote}
                onView={viewNote}
                onAdd={startCreating}
              />
            )}
          </>
        )}

        {showEditor && (
          <NoteEditor
            onSave={saveNote}
            editingNote={editingNote}
            onCancel={cancelEditing}
          />
        )}

        {viewingNote && (
          <NoteModal
            note={viewingNote}
            onClose={closeModal}
            onEdit={startEditing}
            onDelete={deleteNote}
          />
        )}
      </div>
    </>
  );
}
