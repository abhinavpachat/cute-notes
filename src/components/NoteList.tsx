import { Note } from "../types";

type Props = {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onView: (note: Note) => void;
  onAdd: () => void;
};

export default function NoteList({
  notes,
  onEdit,
  onDelete,
  onView,
  onAdd,
}: Props) {
  function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString("en-EU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <div key={note.id} className="note-item">
          <div className="note-content" onClick={() => onView(note)}>
            <div className="note-title">{note.title}</div>
            <div className="note-preview">{note.content}</div>
            <div className="note-meta">
              Last updated: {formatDate(note.last_updated)}
            </div>
          </div>
          <div className="note-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              title="Edit note"
            >
              ✎
            </button>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              title="Delete note"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <div className="add-note-card" onClick={onAdd}>
        <div className="add-note-icon">+</div>
      </div>
    </div>
  );
}
