import { useState, useEffect } from "react";
import { Note } from "../types";

type Props = {
  onSave: (note: Note) => void;
  editingNote?: Note;
  onCancel?: () => void;
};

export default function NoteEditor({ onSave, editingNote, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Pre-fill fields if editing
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    }
  }, [editingNote]);

  function handleSave() {
    const note: Note = {
      id: editingNote?.id ?? Date.now(),
      title,
      content,
      last_updated: Date.now(),
    };
    onSave(note);
    setTitle("");
    setContent("");
  }

  return (
    <div className="note-editor">
      <h2>{editingNote ? "Edit" : "Create New Note"}</h2>
      <input
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Write your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
      />
      <div>
        <button onClick={handleSave} disabled={!title.trim()}>
          {editingNote ? "Update" : "Save"}
        </button>
        {onCancel && (
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
