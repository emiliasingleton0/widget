const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopAPI", {
  minimize: () => ipcRenderer.send("window:minimize"),
  close: () => ipcRenderer.send("window:close"),
  setAlwaysOnTop: (value) =>
    ipcRenderer.send("window:set-always-on-top", value)
});
