const fs = require('node:fs/promises');
const path = require('node:path');

class FileHandler {

    constructor () { }

    async leerArchivo(filepath) {
        try {
            const data = JSON.parse(await fs.readFile(filepath, 'utf-8'));
            return data;
        } catch(e) {
            console.log(`Error al leer el archivo: ${e}`);
            return [];
        }
    }

    async escribirArchivo(filepath, data) {     
        console.log('Escribiendo archivo en: ', filepath); 

        try {
            await fs.writeFile(filepath, JSON.stringify(data));
            console.log('Se escribió el archivo correctamente');
        } catch(e) {
            console.log(`Error al escribir el archivo: ${e}`);
        }

    }

    async actualizarArchivo(filepath, data) {
        const file = await this.leerArchivo(filepath);
        file.sucursalSeleccionada = data;
        
        await this.escribirArchivo(filepath, file);
        console.log('Se actualizó el archivo correctamente');
    }

    async borrarRegistro(filepath, data) {
        filepath = path.join(__dirname, '../files', filepath);
        
        const file = JSON.parse(await leerArchivo());
        const index = file.findIndex((item) => item.id === data.id);
        file.splice(index, 1);
        
        escribirArchivo(filepath, file);
        console.log('Se actualizó el archivo correctamente');
    }

    async archivoDirExiste(filepath) {
        try {
            await fs.access(filepath, fs.constants.F_OK);
            return true; 
        } catch (err) {
            return false;
        }
    }

    async crearDirectorio(filepath) {
        try {
            if (!await this.archivoDirExiste(filepath)) {
                await fs.mkdir(filepath, { recursive: true });
                console.log('Directorio creado correctamente');
            }
        } catch(e) {
            console.log(`Error al crear el directorio: ${e}`);
        }
    }
}

module.exports = FileHandler;

