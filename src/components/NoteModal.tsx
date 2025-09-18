import { Note } from "../types";

type Props = {
  note: Note;
  onClose: () => void;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
};

export default function NoteModal({ note, onClose, onEdit, onDelete }: Props) {
  function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleEdit() {
    onEdit(note);
    onClose();
  }

  function handleDelete() {
    if (confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id);
      onClose();
    }
  }

  return (
    <div className="note-modal-overlay" onClick={handleOverlayClick}>
      <div className="note-modal">
        <div className="note-modal-header">
          <h2 className="note-modal-title">{note.title}</h2>
          <button className="note-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="note-modal-content">
          <p className="note-modal-text">{note.content}</p>
          <div className="note-modal-meta">
            Last updated: {formatDate(note.last_updated)}
          </div>
        </div>

        <div className="note-modal-actions">
          <button onClick={handleEdit} title="Edit note">
            ✎ Edit
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            title="Delete note"
          >
            ✕ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
