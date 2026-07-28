const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  const { width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 390,
    height: 610,
    x: Math.max(0, screenWidth - 430),
    y: Math.max(0, screenHeight - 650),
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: false,
    show: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile("index.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("window:minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("window:close", () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on("window:set-always-on-top", (_event, value) => {
  if (mainWindow) mainWindow.setAlwaysOnTop(Boolean(value));
});
