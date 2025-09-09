import QRCode from "qrcode";

// Función para convertir números a letras (cientos, miles, decimales)
function numeroALetras(num) {
  const unidades = ['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];
  const especiales = ['diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve'];
  const decenas = ['','','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
  const centenas = ['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];

  function convertir(num) {
    let letras = '';
    if (num === 0) return 'cero';
    if (num === 100) return 'cien';
    if (num >= 1000) {
      const miles = Math.floor(num / 1000);
      letras += miles === 1 ? 'mil ' : convertir(miles) + ' mil ';
      num = num % 1000;
    }
    if (num >= 100) {
      const c = Math.floor(num / 100);
      letras += centenas[c] + ' ';
      num = num % 100;
    }
    if (num >= 20) {
      const d = Math.floor(num / 10);
      letras += decenas[d];
      const u = num % 10;
      if (u > 0) letras += ' y ' + unidades[u];
    } else if (num >= 10) {
      letras += especiales[num - 10];
    } else if (num > 0) {
      letras += unidades[num];
    }
    return letras.trim();
  }

  let entero = Math.floor(num);
  let decimal = Math.round((num - entero) * 100);
  let letras = convertir(entero);
  if (decimal > 0) {
    letras += ` con ${decimal}/100`;
  }
  return letras;
}

// Carrito simulado
let carrito = [];

// Elementos DOM
const productosLista = document.getElementById("productos-lista");
const qrContainer = document.getElementById("qr-container");
const facturaDiv = document.getElementById("factura");
const historialLista = document.getElementById("historial-lista");
const nitHistorial = document.getElementById("nit-historial");
const metodoPagoSelect = document.getElementById("metodo-pago");
const confirmarPagoBtn = document.getElementById("confirmar-pago");

// ===== Cargar productos del backend =====
async function cargarProductos() {
  const res = await fetch("http://localhost:3000/productos");
  const productos = await res.json();
  productosLista.innerHTML = "";
  productos.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `${p.nombre} - ${p.precio} Bs. 
      <input type="number" min="1" value="1" id="cant-${p.id}"/>
      <button onclick="agregarCarrito(${p.id}, '${p.nombre}', ${p.precio})">Agregar</button>`;
    productosLista.appendChild(li);
  });
}
window.agregarCarrito = (id,nombre,precio)=>{
  const cantidad = Number(document.getElementById(`cant-${id}`).value);
  const existente = carrito.find(p=>p.id===id);
  if(existente){
    existente.cantidad += cantidad;
    existente.subtotal = existente.cantidad * existente.precio;
  } else {
    carrito.push({id,nombre,precio,cantidad,subtotal:cantidad*precio});
  }
  alert(`Agregado al carrito: ${nombre} x${cantidad}`);
};
cargarProductos();

// ===== Mostrar/ocultar formulario tarjeta y QR =====
metodoPagoSelect.addEventListener("change",(e)=>{
  const metodo = e.target.value;
  const tarjetaDiv = document.querySelector(".tarjeta");
  qrContainer.innerHTML="";
  if(metodo==="qr"){
    tarjetaDiv.style.display="none";
    const canvas = document.createElement("canvas");
    QRCode.toCanvas(canvas,"Simulación de pago QR").then(c=>qrContainer.appendChild(c));
  } else if(metodo==="tarjeta"){
    tarjetaDiv.style.display="block";
  } else tarjetaDiv.style.display="none";
});

// ===== Confirmar pago y generar factura =====
confirmarPagoBtn.addEventListener("click", async ()=>{
  const nombreCliente = document.getElementById("cliente-nombre").value.trim();
  const ciCliente = document.getElementById("cliente-ci").value.trim();
  if(!nombreCliente || !ciCliente) return alert("Ingrese nombre y CI");
  if(carrito.length===0) return alert("Agrega productos al carrito");

  const metodo = metodoPagoSelect.value;
  let pago;

  if(metodo==="cash") pago={tipo:"PagoCash",detalle:"Pagado en efectivo"};
  else if(metodo==="qr") pago={tipo:"PagoQR",detalle:"Pago confirmado vía QR"};
  else if(metodo==="tarjeta"){
    const numeroTarjeta=document.getElementById("numero-tarjeta").value;
    if(numeroTarjeta.length!==16) return alert("Número de tarjeta inválido (16 dígitos)");
    const oculto=numeroTarjeta.slice(0,4)+" **** **** ****";
    pago={tipo:"PagoTarjeta",detalle:`Tarjeta ${oculto}`};
  }

  const venta={items:carrito, calcularTotal:()=>carrito.reduce((a,b)=>a+b.subtotal,0)};
  const tiendaRes=await fetch("http://localhost:3000/tienda");
  const tienda=await tiendaRes.json();

  const factura={
    numero_factura: Math.floor(Math.random()*10000),
    fecha:new Date().toISOString(),
    cliente:nombreCliente,
    ci:ciCliente,
    detalle:carrito.map(i=>`${i.cantidad} x ${i.nombre} = ${i.subtotal} Bs.`).join(" | "),
    total:venta.calcularTotal(),
    total_letras: numeroALetras(venta.calcularTotal()),
    metodo_pago:pago.tipo,
    pago_detalle:pago.detalle,
    tienda:tienda
  };

  facturaDiv.innerHTML=`
    <h2>Factura N° ${factura.numero_factura}</h2>
    <p>Tienda: ${tienda.nombre_tienda}</p>
    <p>Ubicación: ${tienda.ubicacion}</p>
    <p>Teléfono: ${tienda.telefono}</p>
    <p>Cliente: ${factura.cliente} (CI/NIT: ${factura.ci})</p>
    <p>Detalle:</p>
    <ul>${carrito.map(i=>`<li>${i.cantidad} x ${i.nombre} = ${i.subtotal} Bs.</li>`).join("")}</ul>
    <p>Total: ${factura.total} Bs. (${factura.total_letras})</p>
    <p>Método de pago: ${pago.detalle}</p>
    <a href="http://localhost:3000/facturas/${factura.numero_factura}/pdf" target="_blank">Descargar PDF con QR</a>
  `;

  fetch("http://localhost:3000/facturas",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(factura)
  }).then(res=>res.json()).then(d=>console.log("Factura guardada",d)).catch(err=>console.error(err));

  carrito=[];
});

// ===== Historial por NIT/CI =====
document.getElementById("ver-historial-btn").addEventListener("click",async ()=>{
  const nit=nitHistorial.value.trim();
  if(!nit) return alert("Ingrese NIT/CI");
  const res = await fetch(`http://localhost:3000/facturas?nit=${nit}`);
  const facturas = await res.json();
  historialLista.innerHTML="";
  if(facturas.length===0) historialLista.innerHTML="<li>No hay facturas para este NIT/CI.</li>";
  facturas.forEach(f=>{
    const li = document.createElement("li");
    li.innerHTML = `<b>Factura #${f.numero_factura}</b> - ${f.fecha}<br>
      Cliente: ${f.cliente} (CI/NIT: ${f.ci})<br>
      Detalle: ${f.detalle}<br>
      Total: ${f.total} Bs. (${numeroALetras(f.total)}) | Pago: ${f.pago_detalle}<br>
      <a href="http://localhost:3000/facturas/${f.numero_factura}/pdf" target="_blank">Descargar PDF</a>`;
    historialLista.appendChild(li);
  });
});

// ===== Administración de tienda =====
const tiendaForm=document.getElementById("tienda-form");
async function cargarTienda(){
  const res=await fetch("http://localhost:3000/tienda");
  const tienda=await res.json();
  document.getElementById("nombre-tienda").value=tienda.nombre_tienda;
  document.getElementById("ubicacion-tienda").value=tienda.ubicacion;
  document.getElementById("telefono-tienda").value=tienda.telefono;
  document.getElementById("codigo-tienda").value=tienda.codigo_autorizacion;
  document.getElementById("nit-tienda").value=tienda.nit;
}
tiendaForm.addEventListener("submit", async e=>{
  e.preventDefault();
  const nuevaTienda={
    nombre_tienda:document.getElementById("nombre-tienda").value,
    ubicacion:document.getElementById("ubicacion-tienda").value,
    telefono:Number(document.getElementById("telefono-tienda").value),
    codigo_autorizacion:Number(document.getElementById("codigo-tienda").value),
    nit:Number(document.getElementById("nit-tienda").value)
  };
  const res = await fetch("http://localhost:3000/tienda",{
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(nuevaTienda)
  });
  const data=await res.json();
  alert(data.mensaje);
});
cargarTienda();
