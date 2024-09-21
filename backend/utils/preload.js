// electron/preload.js
const { contextBridge, ipcRenderer, webFrame } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
        removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
    }
});

ipcRenderer.on('set-zoom', (event, data) => {

    const { width, height } = data;

    if (
        (width === 1920 && height === 1080) ||
        (width === 1760 && height === 990) 
    ) {
        webFrame.setZoomFactor(1.00)
    }
    else if (width === 1680 && height === 1050) {
        webFrame.setZoomFactor(0.95)
    }
    else if (
        (width === 1600 && height === 900)
    ) {
        webFrame.setZoomFactor(0.85)
    }
    else if (width === 1366 && height === 768) {
        webFrame.setZoomFactor(0.72)
    }
    else if (width === 1280 && height === 1024) {
        webFrame.setZoomFactor(0.82)
    }
    else {
        webFrame.setZoomFactor(0.64)
    }
});