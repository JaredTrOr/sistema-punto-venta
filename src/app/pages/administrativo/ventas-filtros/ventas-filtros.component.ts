import { ChangeDetectorRef, Component } from '@angular/core';
import { Tiempo } from '../../../utils/tiempo';
import { ElectronService } from '../../../services/electron.service';
import { Venta } from '../../../models/Ventas';
import { VentasPorProducto } from '../../../models/VentasPorProducto';
import { VentasService } from '../../../services/ventas.service';
import Swal from 'sweetalert2';

interface Hora { value: string; viewValue: string; }

@Component({
  selector: 'app-ventas-filtros',
  templateUrl: './ventas-filtros.component.html',
  styleUrl: './ventas-filtros.component.css'
})
export class VentasFiltrosComponent {

  ventas: Venta[] = []; // --> Ventas generales
  ventasPorProducto: VentasPorProducto[] = [];
  horas: Hora[] = [];
  ventasProductos: string = 'ventasGeneral';

  //Filtros
  filtroPorDia = 'hoy';
  radioFiltroFecha = 'fecha-especifica';

  filtroFechaEspecifica = '';

  filtroFechaInicio = '';
  filtroFechaFin = '';

  filtroHoraInicio = 'x';
  filtroHoraFin = 'x';

  tiempo = new Tiempo();

  constructor(
    private ventasService: VentasService,
    private electronService: ElectronService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.horas = [
      { value: '00:00', viewValue: '00:00' },
      { value: '01:00', viewValue: '01:00' },
      { value: '02:00', viewValue: '02:00' },
      { value: '03:00', viewValue: '03:00' },
      { value: '04:00', viewValue: '04:00' },
      { value: '05:00', viewValue: '05:00' },
      { value: '06:00', viewValue: '06:00' },
      { value: '07:00', viewValue: '07:00' },
      { value: '08:00', viewValue: '08:00' },
      { value: '09:00', viewValue: '09:00' },
      { value: '10:00', viewValue: '10:00' },
      { value: '11:00', viewValue: '11:00' },
      { value: '12:00', viewValue: '12:00' },
      { value: '13:00', viewValue: '13:00' },
      { value: '14:00', viewValue: '14:00' },
      { value: '15:00', viewValue: '15:00' },
      { value: '16:00', viewValue: '16:00' },
      { value: '17:00', viewValue: '17:00' },
      { value: '18:00', viewValue: '18:00' },
      { value: '19:00', viewValue: '19:00' },
      { value: '20:00', viewValue: '20:00' },
      { value: '21:00', viewValue: '21:00' },
      { value: '22:00', viewValue: '22:00' },
      { value: '23:00', viewValue: '23:00' }
    ];

  }

  ngOnInit() {
    this.aplicarCambios();
  }

  getVentasGeneral() {
    this.electronService.send('get-ventas', null);
    this.electronService.on('get-ventas', (event, response) => {

      response = JSON.parse(response);

      if (response.success) {
        this.ventas = response.ventas;
        this.changeDetectorRef.detectChanges();

        this.ordenarVentasPorProducto();

        return;
      }

      //Error al obtener las ventas
      Swal.fire("Hubo un error al obtener las ventas", "", "error");


    });
  }

  ordenarVentasPorProducto() {
    let ventasPorProductoAux: any[] = [];
    this.ventasPorProducto = [];

    this.ventas.forEach(venta => {
      ventasPorProductoAux = ventasPorProductoAux.concat(venta.productos);
    })

    ventasPorProductoAux.forEach(producto => {
      const productoEnArreglo = this.ventasPorProducto.find(p => p.nombreProducto === producto.nombreProducto);

      if (productoEnArreglo) {
        productoEnArreglo.cantidad += producto.cantidad;
        productoEnArreglo.total = productoEnArreglo.cantidad * productoEnArreglo.importe;
      }
      else {
        this.ventasPorProducto.push({ ...producto });
      }
    })
  }

  exportarPDF() {
    const data = {
      tituloPDF: 'Exportación de ventas del día ' + this.tiempo.getDate() +' a las ' + this.tiempo.getHora(),
      fecha: this.tiempo.getDate(),
      hora: this.tiempo.getHora(),
      ventas: this.ventasPorProducto,
      filtros: {
        filtroPorDia: this.filtroPorDia, //--> Determina si se filtra por hoy, ayer, semana, mes, año, otro 

        radioFiltroFecha: this.radioFiltroFecha, // --> Determina si se filtra por fecha específica o en rango

        filtroFechaEspecifica: this.filtroFechaEspecifica,

        filtroFechaInicio: this.filtroFechaInicio,
        filtroFechaFin: this.filtroFechaFin,

        filtroHoraInicio: this.filtroHoraInicio, // --> Hora opcional
        filtroHoraFin: this.filtroHoraFin,
      }
    }
    this.electronService.send('exportar-pdf', data);
  }

  aplicarCambios() {

    const filtros = {
      filtroPorDia: this.filtroPorDia, //--> Determina si se filtra por hoy, ayer, semana, mes, año, otro 

      radioFiltroFecha: this.radioFiltroFecha, // --> Determina si se filtra por fecha específica o en rango

      filtroFechaEspecifica: this.filtroFechaEspecifica,

      filtroFechaInicio: this.filtroFechaInicio,
      filtroFechaFin: this.filtroFechaFin,

      filtroHoraInicio: this.filtroHoraInicio, // --> Hora opcional
      filtroHoraFin: this.filtroHoraFin,
    };

    this.electronService.send('get-ventas-filtradas', filtros);
    this.electronService.on('get-ventas-filtradas', (event, response) => {

      response = JSON.parse(response)

      if (response.success) {
        this.ventas = response.ventasFiltradas;
        this.changeDetectorRef.detectChanges();
        this.ordenarVentasPorProducto();

        return; 
      }

      Swal.fire('Hubo un error al obtener las ventas filtradas', '', 'error');
    })

  }
}
