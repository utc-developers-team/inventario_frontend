import { Component, OnInit } from '@angular/core';
// importo mi servicios sandoval
import {ApiService} from '../../servicios/api/api.service'
import {Router,ActivatedRoute, Params} from '@angular/router';
import {ListaproductosI} from '../../modelos/listaProductos.interface';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {ventaI} from '../../modelos/regventa.interface';
import {productoI} from '../../modelos/producto.interface';
import {detalleVentaI} from '../../modelos/detalleventa.interface';
//fin

@Component({
  selector: 'app-registrar-ventas',
  templateUrl: './registrar-ventas.component.html',
  styleUrls: ['./registrar-ventas.component.css'],

})

export class RegistrarVentasComponent implements OnInit {
  //id de la venta creada
  public ventaid:string;
  public unprodid:string;
  //para mostrar productos al buscarlos
  filterProducto = '';
  productos:ListaproductosI[];
  //mostrar filtro de busqueda
  public viewsearch: boolean = false;
  //obtener producto elegido para cagar
  datosProducto:productoI;
  //traer de regreso los productos agregados
  detalleprodventas:detalleVentaI[];

  constructor(private activerouter:ActivatedRoute,
              private router:Router,
              private api:ApiService,
              private formbuilder: FormBuilder) {  }
//this.registrarDetalleVenta();

  datosVenta:ventaI;
  editarForm = new FormGroup({
    id:new FormControl(''),
    fecha:new FormControl(''),
    subtotal:new FormControl(''),
    iva:new FormControl(''),
    total:new FormControl(''),
  });

  registrarForm = new FormGroup({
    venta:new FormControl(''),
    producto:new FormControl(''),
    precio:new FormControl(''),
    cantidad:new FormControl(''),
    subtotal:new FormControl(''),
  });

  ngOnInit(): void {
    this.verProd();
    this.crearVenta();
  }

  crearVenta(){
    this.api.iniciarVenta().subscribe(response => {
      this.getSingleVenta(response.id);
    });
  }
  //traer la venta que se crea inicialmente
  getSingleVenta(id){
    //obtener el id
    this.ventaid = id;
    console.log("este es id de la venta");
    console.log(this.ventaid);
    this.api.getSingleVenta(this.ventaid).subscribe(data =>{
      console.log(data);
      this.datosVenta=data;
      this.editarForm.setValue({
        'id':this.ventaid,
        'fecha':this.datosVenta.fecha,
        'subtotal':this.datosVenta.subtotal,
        'iva':this.datosVenta.iva,
        'total':this.datosVenta.total,
      });
      console.log("editar form");
      console.log(this.editarForm.value);
    })
  }

  //controlador para mostrar productos al buscar
  verProd(){
    this.api.getAllproductos().subscribe(data => {
      this.productos=data;
    })
  }

  onviewsearch(){
    this.viewsearch = true;
  }

  offviewsearch(){
    this.viewsearch = false;
  }
  //fin**********

  //***************crear la factura  ***
//  registrarDetalleVenta(){
//    this.registrarForm = this.formbuilder.group({
//      venta:'',
//      producto:'',
//      precio:'',
//      cantidad:'',
//      subtotal:'',
//    })
//  }

  pasarDatosProducto(id){
    //obtener el id
    this.unprodid = id;
    console.log("este es id del producto");
    console.log(this.unprodid);
    this.api.getSingleProductos(this.unprodid).subscribe(data =>{
      console.log(data);
      this.datosProducto=data;
      this.registrarForm.setValue({
        'venta':this.editarForm.value.id,
        'producto':this.datosProducto.nombre,
        'precio':this.datosProducto.precio,
        'cantidad':'',
        'subtotal':'',
      });
      console.log("editar form");
      console.log(this.registrarForm.value);

    })
    this.offviewsearch();
  }

 // guardarDetallVenta
 guardarDetallVenta(){
    this.registrarForm.value.subtotal=(this.registrarForm.value.cantidad*this.registrarForm.value.precio);
    this.registrarForm.value.producto = this.unprodid;
    console.log("listo form");
    console.log(this.registrarForm.value);
    this.api.addVenta(this.registrarForm.value)
           .subscribe(
             rt => console.log(rt),
             er => console.log(er),
             () => console.log('detalle venta Registrado')
           )
    this.verDetalleVenta(this.editarForm.value.id);
 }

 refresh(){
   this.verDetalleVenta(this.editarForm.value.id);
 }
 //traer de regreso los detalle de venta registrados
 verDetalleVenta(idventa){
   console.log("este es id de la ventaaa");
   console.log(idventa);
   this.api.getDetalleVentaParticular(idventa).subscribe(data => {
     console.log(data);
     this.detalleprodventas=data;
   });
   this.registrarForm.setValue({
     'venta':'',
     'producto':'',
     'precio':'',
     'cantidad':'',
     'subtotal':'',
   });

 }



}
