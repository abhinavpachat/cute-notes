// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod types;


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::load_notes,
            commands::save_notes,
            commands::delete_note,
            commands::edit_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running application");
}
