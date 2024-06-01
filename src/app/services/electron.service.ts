import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  constructor() { }

    send(channel: string, message: any) {
        if (window.electron && window.electron.ipcRenderer) {
            window.electron.ipcRenderer.send(channel, message);
        }
        else {
            console.log('No se puede enviar el mensaje');
            console.log(window.electron);
            console.log(window.electron.ipcRenderer);
        }
    }

    on(channel: string, listener: (event: any, ...args: any[]) => void) {
        if (window.electron && window.electron.ipcRenderer) {
            window.electron.ipcRenderer.on(channel, listener);
        }
    }

    removeAllListeners(channel: string) {
        if (window.electron && window.electron.ipcRenderer) {
            window.electron.ipcRenderer.removeAllListeners(channel);
        }
    }
}
