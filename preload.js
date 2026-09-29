const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  onTabs: cb => ipcRenderer.on('tabs', (_, t) => cb(t)),
  onMax: cb => ipcRenderer.on('maxstate', (_, v) => cb(v)),
  newTab: () => ipcRenderer.send('new-tab'),
  switchTab: id => ipcRenderer.send('switch-tab', id),
  closeTab: id => ipcRenderer.send('close-tab', id),
  menu: (x, y) => ipcRenderer.send('menu', x, y),
  win: a => ipcRenderer.send('win', a),
});
