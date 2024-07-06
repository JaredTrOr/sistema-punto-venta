export class Tiempo {
    constructor() {}

    private pad(n : number) {
        return n.toString().padStart(2, '0');
    }

    getHora(): string {
        const date = new Date();
        let hora = date.getHours();
        let minutos = date.getMinutes();
    
        let horaString: string;
        let minutosString: string;
    
        horaString = hora < 10 ? '0' + hora : hora.toString();
        minutosString = minutos < 10 ? '0' + minutos : minutos.toString();
    
        return `${horaString}:${minutosString}`;
    }
    
    getDate(): string {
        const date = new Date();
        let dia = date.getDate();
        let mes = date.getMonth() + 1;
        let anio = date.getFullYear();
    
        let diaString: string;
        let mesString: string;
    
        diaString = dia < 10 ? '0' + dia : dia.toString();
        mesString = mes < 10 ? '0' + mes : mes.toString();
    
        return `${diaString}/${mesString}/${anio}`;
    }

    getFormattedDate(date: Date): string {
        const dia = this.pad(date.getDate());
        const mes = this.pad(date.getMonth() + 1);
        const anio = date.getFullYear();

        return `${dia}/${mes}/${anio}`;
    }

    getFormattedHour(date: Date): string {

        const horas = this.pad(date.getHours());
        const minutos = this.pad(date.getMinutes());

        return `${horas}:${minutos}`;
    }
}

