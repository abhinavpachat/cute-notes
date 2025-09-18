import { getCurrentWindow } from "@tauri-apps/api/window";

export default function TitleBar() {
  const appWindow = getCurrentWindow();

  const handleClose = async () => {
    await appWindow.close();
  };

  const handleMinimize = async () => {
    await appWindow.minimize();
  };

  const handleMaximize = async () => {
    const isMaximized = await appWindow.isMaximized();
    if (isMaximized) {
      await appWindow.unmaximize();
    } else {
      await appWindow.maximize();
    }
  };

  return (
    <div className="custom-title-bar">
      <div className="window-controls">
        <button
          className="window-control minimize"
          onClick={handleMinimize}
          title="Minimize"
        >
          -
        </button>
        <button
          className="window-control maximize"
          onClick={handleMaximize}
          title="Maximize"
        >
          □
        </button>
        <button
          className="window-control close"
          onClick={handleClose}
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
