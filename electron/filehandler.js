const fs = require('node:fs/promises');
const path = require('node:path');

class FileHandler {

    constructor () {}

    async leerArchivo(filepath) {
        try {
            const data = await fs.readFile(filepath, 'utf-8');
            console.log('Se leyó el archivo correctamente');
            return data;
        } catch(e) {
            console.log(`Error al leer el archivo: ${e}`);
            return [];
        }
    }

    async escribirArchivo(filepath, data) {     
        console.log('Escribiendo archivo en: ', filepath); 
        if (!await this.archivoExiste(filepath)) {
            try {
                await fs.writeFile(filepath, JSON.stringify([data]));
                console.log('Se escribió el archivo correctamente');
            } catch(e) {
                console.log(`Error al escribir el archivo: ${e}`);
            }
        }

        else {
            const dataFile = JSON.parse(await this.leerArchivo(filepath));
            dataFile.push(data);

            try {
                await fs.writeFile(filepath, JSON.stringify(dataFile));
                console.log('Se agregó el registro al archivo correctamente');
            } catch(e) {
                console.log(`Error al agregar registro al archivo: ${e}`);
            }
        }

    }

    async actualizarArchivo(filepath, data) {
        const file = JSON.parse(await this.leerArchivo(filepath));
        const index = file.findIndex((item) => item.id === data.id);
        file[index] = data;
        
        escribirArchivo(filepath, file);
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

    async archivoExiste(filepath) {
        try {
            await fs.access(filepath, fs.constants.F_OK);
            return true; 
        } catch (err) {
            return false;
        }
    }
}

module.exports = FileHandler;

