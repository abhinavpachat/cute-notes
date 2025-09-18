use crate::types::Note;
use std::fs;
use std::path::PathBuf;
use serde_json;

// Path to the local storage
fn notes_path() -> PathBuf {
    let mut path = dirs::data_dir().expect("Could not find data directory");
    path.push("notes-app");
    path.push("notes.json");
    path
}

// Load notes
#[tauri::command]
pub fn load_notes() -> Result<Vec<Note>, String> {
    let path = notes_path();
    if !path.exists() {
        return Ok(vec![]);
    }

    let data = fs::read_to_string(&path).map_err(|e| format!("Failed to read notes: {}", e))?;

    let notes: Vec<Note> = serde_json::from_str(&data).map_err(|e| format!("Failed to parse notes: {}", e))?;

    Ok(notes)
}

// Save notes
#[tauri::command]
pub fn save_notes(notes: Vec<Note>) -> Result<(), String> {
    let path = notes_path();

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    let data = serde_json::to_string_pretty(&notes).map_err(|e| format!("Failed to serialize notes: {}", e))?;

    fs::write(&path, data).map_err(|e| format!("Failed to write notes: {}", e))?;

    Ok(())
}

// Delete a note by ID
#[tauri::command]
pub fn delete_note(note_id: u64) -> Result<(), String> {
    let mut notes = load_notes()?;
    notes.retain(|note| note.id != note_id);
    save_notes(notes)?;
    Ok(())
}


// Edit a note
#[tauri::command]
pub fn edit_note(updated_note: Note) -> Result<(), String> {
    let mut notes = load_notes()?;
    if let Some(note) = notes.iter_mut().find(|note| note.id == updated_note.id) {
        note.title = updated_note.title;
        note.content = updated_note.content;
        note.last_updated = updated_note.last_updated;
    } else {
        return Err("Note not found".into());
    }
    save_notes(notes)?;
    Ok(())
}