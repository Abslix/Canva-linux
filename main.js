const { app, BrowserWindow, WebContentsView, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const UA = 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0';
const HOME = 'https://www.canva.com';
const BAR = 55;
let win, tabs = [], active = null, nextId = 1;

const wc = () => { const t = tabs.find(t => t.id === active); return t && t.view.webContents; };

function layout() {
  const [w, h] = win.getContentSize();
  tabs.forEach(t => t.view.setBounds({ x: 0, y: BAR, width: w, height: h - BAR }));
}
function push() {
  win.webContents.send('tabs', tabs.map(t => ({ id: t.id, title: t.title, active: t.id === active, pinned: t.pinned, favicon: t.favicon })));
}
function createTab(url, pinned = false) {
  const view = new WebContentsView();
  const tab = { id: nextId++, view, title: 'Nueva pestaña', pinned };
  view.webContents.setUserAgent(UA);
  view.webContents.setWindowOpenHandler(({ url, disposition }) => {
    let host = '';
    try { host = new URL(url).hostname; } catch (e) {}
    if (disposition === 'new-window' || host.endsWith('google.com')) return { action: 'allow', overrideBrowserWindowOptions: { width: 500, height: 700, autoHideMenuBar: true, parent: win } };
    createTab(url);
    return { action: 'deny' };
  });
  view.webContents.on('did-create-window', child => child.webContents.setUserAgent(UA));
  view.webContents.on('page-title-updated', (e, t) => { tab.title = t; push(); });
  view.webContents.on('page-favicon-updated', (e, f) => { tab.favicon = f[0]; push(); });
  tabs.push(tab);
  win.contentView.addChildView(view);
  view.webContents.loadURL(url);
  switchTab(tab.id);
}
function switchTab(id) {
  active = id;
  tabs.forEach(t => t.view.setVisible(t.id === id));
  layout(); push();
}
function closeTab(id) {
  const i = tabs.findIndex(t => t.id === id);
  if (i < 0 || tabs[i].pinned) return;
  const [t] = tabs.splice(i, 1);
  win.contentView.removeChildView(t.view);
  t.view.webContents.close();
  if (active === id) switchTab(tabs[Math.max(0, i - 1)].id); else push();
}
function cycle(d) {
  const i = tabs.findIndex(t => t.id === active);
  switchTab(tabs[(i + d + tabs.length) % tabs.length].id);
}
function zoom(d) {
  const c = wc();
  if (c) c.setZoomLevel(d === 0 ? 0 : c.getZoomLevel() + d);
}
function toggleMax() { win.isMaximized() ? win.unmaximize() : win.maximize(); }

function buildMenu() {
  return Menu.buildFromTemplate([
    { label: 'Archivo', submenu: [
      { label: 'Nueva pestaña', click: () => createTab(HOME) },
      { label: 'Cerrar pestaña', click: () => closeTab(active) },
      { type: 'separator' },
      { label: 'Salir', click: () => app.quit() },
    ] },
    { label: 'Editar', submenu: [
      { label: 'Deshacer', click: () => wc().undo() },
      { label: 'Rehacer', click: () => wc().redo() },
      { type: 'separator' },
      { label: 'Cortar', click: () => wc().cut() },
      { label: 'Copiar', click: () => wc().copy() },
      { label: 'Pegar', click: () => wc().paste() },
      { label: 'Seleccionar todo', click: () => wc().selectAll() },
    ] },
    { label: 'Ver', submenu: [
      { label: 'Recargar', click: () => wc().reload() },
      { type: 'separator' },
      { label: 'Acercar', click: () => zoom(0.5) },
      { label: 'Alejar', click: () => zoom(-0.5) },
      { label: 'Tamaño normal', click: () => zoom(0) },
      { type: 'separator' },
      { label: 'Pantalla completa', click: () => win.setFullScreen(!win.isFullScreen()) },
      { label: 'Herramientas de desarrollo', click: () => wc().toggleDevTools() },
    ] },
    { label: 'Pestaña', submenu: [
      { label: 'Nueva pestaña', click: () => createTab(HOME) },
      { label: 'Cerrar pestaña', click: () => closeTab(active) },
      { type: 'separator' },
      { label: 'Pestaña siguiente', click: () => cycle(1) },
      { label: 'Pestaña anterior', click: () => cycle(-1) },
    ] },
    { label: 'Ventana', submenu: [
      { label: 'Minimizar', click: () => win.minimize() },
      { label: 'Maximizar / Restaurar', click: () => toggleMax() },
      { label: 'Cerrar', click: () => win.close() },
    ] },
    { label: 'Ayuda', submenu: [
      { label: 'Centro de ayuda de Canva', click: () => shell.openExternal('https://www.canva.com/help/') },
    ] },
  ]);
}

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1280, height: 800, frame: false, icon: path.join(__dirname, 'icon.png'), icon: path.join(__dirname, 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  win.loadFile('tabbar.html');
  win.on('resize', layout);
  win.on('maximize', () => win.webContents.send('maxstate', true));
  win.on('unmaximize', () => win.webContents.send('maxstate', false));
  win.webContents.once('did-finish-load', () => createTab(HOME, true));
  ipcMain.on('new-tab', () => createTab(HOME));
  ipcMain.on('switch-tab', (e, id) => switchTab(id));
  ipcMain.on('close-tab', (e, id) => closeTab(id));
  ipcMain.on('menu', (e, x, y) => buildMenu().popup({ window: win, x, y }));
  ipcMain.on('win', (e, a) => {
    if (a === 'min') win.minimize();
    if (a === 'max') toggleMax();
    if (a === 'close') win.close();
  });
});
app.on('window-all-closed', () => app.quit());
