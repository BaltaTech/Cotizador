// ==================== doGet CORREGIDO (soporta JSONP para guardados) ====================
function doGet(e) {
  const accion = e?.parameter?.accion || '';
  const callback = e?.parameter?.callback || '';
  
  // 🔑 NUEVO: Manejar acciones de guardado vía GET (JSONP)
  if (accion === 'guardarCotizacion' || accion === 'guardarSeguimiento' || 
      accion === 'actualizarSeguimiento' || accion === 'guardarLead') {
    return manejarGuardadoJSONP(e);
  }
  
  switch (accion) {
    case 'verificarUsuario':
      const resultado = verificarUsuarioGoogle();
      return ContentService
        .createTextOutput(JSON.stringify(resultado))
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'verificarCredenciales':   
      const usuario = e?.parameter?.usuario || '';
      const password = e?.parameter?.password || '';
      const resultadoLogin = verificarCredenciales(usuario, password);
      
      let output = JSON.stringify(resultadoLogin);
      if (callback) {
        output = `${callback}(${output})`;
        return ContentService
          .createTextOutput(output)
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return ContentService
        .createTextOutput(output)
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'obtenerEquipos':
      const callbackEquipos = e?.parameter?.callback || '';
      const equiposData = obtenerEquiposPublico();
      let outputEquipos = JSON.stringify(equiposData);
      if (callbackEquipos) {
        outputEquipos = `${callbackEquipos}(${outputEquipos})`;
        return ContentService
          .createTextOutput(outputEquipos)
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return ContentService
        .createTextOutput(outputEquipos)
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'obtenerServicios':
      const serviciosData = obtenerServiciosPublico();
      const callbackServicios = e?.parameter?.callback || '';
      let outputServicios = JSON.stringify(serviciosData);
      if (callbackServicios) {
        outputServicios = `${callbackServicios}(${outputServicios})`;
        return ContentService
          .createTextOutput(outputServicios)
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return ContentService
        .createTextOutput(outputServicios)
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'obtenerConfiguracion':
      return ContentService
        .createTextOutput(JSON.stringify(obtenerConfiguracionPublica()))
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'obtenerCotizaciones':
      const usu = e?.parameter?.usuario || '';
      const resultadoCotizaciones = obtenerCotizacionesPorVendedor(usu);
      return ContentService
        .createTextOutput(JSON.stringify(resultadoCotizaciones))
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'obtenerMisCotizaciones':
      const usuarioCotizaciones = e?.parameter?.usuario || '';
      if (!usuarioCotizaciones) {
        return ContentService
          .createTextOutput(JSON.stringify({ exito: false, mensaje: 'Usuario requerido' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const misCotizaciones = obtenerCotizacionesPorVendedor(usuarioCotizaciones);
      return ContentService
        .createTextOutput(JSON.stringify(misCotizaciones))
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'obtenerMisSeguimientos':
      const usuarioSeguimientos = e?.parameter?.usuario || '';
      if (!usuarioSeguimientos) {
        return ContentService
          .createTextOutput(JSON.stringify({ exito: false, mensaje: 'Usuario requerido' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const misSeguimientos = obtenerSeguimientosPorVendedor(usuarioSeguimientos);
      return ContentService
        .createTextOutput(JSON.stringify(misSeguimientos))
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'obtenerMisLeads':
      const usuarioLeads = e?.parameter?.usuario || '';
      if (!usuarioLeads) {
        return ContentService
          .createTextOutput(JSON.stringify({ exito: false, mensaje: 'Usuario requerido' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const misLeads = obtenerLeadsPorVendedor(usuarioLeads);
      return ContentService
        .createTextOutput(JSON.stringify(misLeads))
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'obtenerLeadsSinAsignar':
      const leadsPendientes = obtenerLeadsSinAsignar();
      return ContentService
        .createTextOutput(JSON.stringify(leadsPendientes))
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'obtenerListaVendedores':
      const vendedores = obtenerListaVendedores();
      return ContentService
        .createTextOutput(JSON.stringify(vendedores))
        .setMimeType(ContentService.MimeType.JSON);
    
    case 'testSimple':
      const diagnostico = testSimple();
      return ContentService
        .createTextOutput(JSON.stringify(diagnostico))
        .setMimeType(ContentService.MimeType.JSON);
    
    default:
      return ContentService
        .createTextOutput(JSON.stringify({ 
          exito: true, 
          mensaje: 'API funcionando correctamente',
          endpoints: [
            'verificarUsuario', 
            'verificarCredenciales', 
            'obtenerEquipos', 
            'obtenerServicios', 
            'obtenerConfiguracion',
            'obtenerCotizaciones',
            'obtenerMisCotizaciones',
            'obtenerMisSeguimientos',
            'obtenerMisLeads',
            'obtenerLeadsSinAsignar',
            'obtenerListaVendedores',
            'guardarCotizacion',
            'guardarSeguimiento',
            'actualizarSeguimiento',
            'guardarLead',
            'testSimple'
          ]
        }))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================== NUEVA FUNCIÓN PARA MANEJAR GUARDADOS VÍA JSONP ====================
function manejarGuardadoJSONP(e) {
  const accion = e?.parameter?.accion || '';
  const callback = e?.parameter?.callback || '';
  
  // Decodificar los datos enviados desde el frontend
  let datos = {};
  try {
    const datosRaw = e?.parameter?._datos || '{}';
    datos = JSON.parse(datosRaw);
  } catch (error) {
    const respuesta = { exito: false, mensaje: 'Error decodificando datos: ' + error.toString() };
    const output = `${callback}(${JSON.stringify(respuesta)})`;
    return ContentService
      .createTextOutput(output)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  // Crear objeto de sesión
  const sesion = datos.sesion || { 
    usuario: e?.parameter?._vendedor || 'Desconocido', 
    nombre: 'Desconocido', 
    rol: 'vendedor' 
  };
  
  let resultado;
  
  switch (accion) {
    case 'guardarCotizacion':
      resultado = guardarCotizacion(sesion, datos);
      break;
    case 'guardarSeguimiento':
      resultado = guardarSeguimiento(sesion, datos);
      break;
    case 'actualizarSeguimiento':
      resultado = actualizarSeguimiento(sesion, datos);
      break;
    case 'guardarLead':
      resultado = guardarLead(sesion, datos);
      break;
    default:
      resultado = { exito: false, mensaje: 'Acción no válida: ' + accion };
  }
  
  // Devolver en formato JSONP para que el frontend pueda leer la respuesta
  const output = `${callback}(${JSON.stringify(resultado)})`;
  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// ==================== doPost (se mantiene para compatibilidad, pero ya no se usa) ====================
function doPost(e) {
  // Redirigir al manejador JSONP para mantener compatibilidad
  const params = {
    parameter: {
      accion: JSON.parse(e.postData.contents)?.accion,
      _datos: e.postData.contents,
      callback: 'jsonp_callback'
    }
  };
  return manejarGuardadoJSONP(params);
}

// ==================== AUTENTICACIÓN ====================

function verificarUsuarioGoogle() {
  try {
    const email = Session.getActiveUser().getEmail();
    
    if (!email || email === '') {
      return { exito: false, mensaje: 'No hay sesión activa de Google', autenticado: false };
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('Usuarios');
    
    if (!hoja) {
      return { exito: false, mensaje: 'Hoja Usuarios no encontrada', autenticado: false };
    }
    
    const datos = hoja.getDataRange().getValues();
    
    for (let i = 1; i < datos.length; i++) {
      const emailHoja = datos[i][3];
      const activo = datos[i][4];
      const usuario = datos[i][0];
      const nombre = datos[i][1];
      const rol = datos[i][2];
      
      if (emailHoja === email && (activo === true || activo === 'TRUE')) {
        hoja.getRange(i + 1, 6).setValue(new Date().toISOString());
        
        return {
          exito: true,
          autenticado: true,
          usuario: usuario,
          nombre: nombre,
          rol: rol,
          email: email
        };
      }
    }
    
    return { exito: false, mensaje: 'Correo no autorizado', autenticado: false };
    
  } catch (error) {
    return { exito: false, mensaje: error.toString(), autenticado: false };
  }
}

function verificarCredenciales(usuario, password) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('Usuarios');
    
    if (!hoja) {
      return { exito: false, mensaje: 'Hoja Usuarios no encontrada', autenticado: false };
    }
    
    const datos = hoja.getDataRange().getValues();
    
    for (let i = 1; i < datos.length; i++) {
      const usuarioHoja = datos[i][0];
      const passwordHoja = datos[i][7];
      const nombre = datos[i][1];
      const rol = datos[i][2];
      const emailHoja = datos[i][3];
      
      if (usuarioHoja === usuario && String(passwordHoja) === String(password)) {
        hoja.getRange(i + 1, 6).setValue(new Date().toISOString());
        
        return {
          exito: true,
          autenticado: true,
          usuario: usuarioHoja,
          nombre: nombre,
          rol: rol,
          email: emailHoja
        };
      }
    }
    
    return { exito: false, mensaje: 'Usuario o contraseña incorrectos', autenticado: false };
    
  } catch (error) {
    return { exito: false, mensaje: error.toString(), autenticado: false };
  }
}

// ==================== FUNCIONES PARA GENERAR ID ====================

function generarIdUnico(prefijo, usuario) {
  const timestamp = Date.now();
  const aleatorio = Math.random().toString(36).substring(2, 7);
  const usuarioPrefijo = usuario.substring(0, 3).toUpperCase();
  return `${prefijo}_${usuarioPrefijo}_${timestamp}_${aleatorio}`;
}

// ==================== FUNCIONES PARA GUARDAR EN SHEETS ====================

function guardarCotizacion(sesion, datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let hoja = ss.getSheetByName('Cotizaciones');
    
    if (!hoja) {
      hoja = ss.insertSheet('Cotizaciones');
      hoja.appendRow([
        'IdCotizacion', 'No Cotizacion', 'Ejecutivo', 'Cliente', 
        'Fecha Elaboracion', 'Precio', 'Moneda', 'Equipo (Descripción)', 
        'Estatus', 'Condiciones Pago'
      ]);
    }
    
    const idInterno = generarIdUnico('COT', sesion.usuario);
    let numeroCotizacion = datos.numeroCotizacion || datos.numero || datos.noCotizacion;
    
    if (!numeroCotizacion) {
      const prefijo = sesion.usuario.substring(0, 3).toUpperCase();
      const keyUltimoNumero = `ultimoNumero_${prefijo}`;
      let ultimoNumero = parseInt(PropertiesService.getScriptProperties().getProperty(keyUltimoNumero) || '0');
      ultimoNumero++;
      numeroCotizacion = `${prefijo}-${String(ultimoNumero).padStart(3, '0')}`;
      PropertiesService.getScriptProperties().setProperty(keyUltimoNumero, ultimoNumero);
    }
    
    const fecha = new Date().toISOString().split('T')[0];
    
    let listaEquipos = datos.equipos || [];
    let listaInstalaciones = datos.instalaciones || datos.servicios || [];
    
    let sumaEquipos = listaEquipos.reduce(function(acc, eq) {
      let p = eq.precioUnitario || eq.precioVenta || eq.precio || 0;
      return acc + (parseFloat(p) * (parseInt(eq.cantidad) || 1));
    }, 0);
    
    let sumaInstalaciones = listaInstalaciones.reduce(function(acc, inst) {
      let p = inst.costoUnitario || inst.precio || 0;
      return acc + (parseFloat(p) * (parseInt(inst.cantidad) || 1));
    }, 0);
    
    let importeCalculado = sumaEquipos + sumaInstalaciones;
    let importe = datos.total || datos.importe || importeCalculado || 0;
    
    let descEquipos = '';
    let partes = [];
    if (listaEquipos.length > 0) {
      const txtEq = listaEquipos.map(e => `📦 ${e.marca || ''} ${e.modelo || ''} (${e.cantidad || 1})`).join(', ');
      partes.push(txtEq);
    }
    if (listaInstalaciones.length > 0) {
      const txtInst = listaInstalaciones.map(i => `🔧 ${i.concepto || i.descripcion || ''} (${i.cantidad || 1})`).join(', ');
      partes.push(txtInst);
    }
    
    descEquipos = partes.join(' | ');
    if (!descEquipos || descEquipos === '') {
      descEquipos = datos.descripcionEquipo || datos.descEquipo || 'Cotización sin desglose';
    }
    
    const ultimaFila = hoja.getLastRow() + 1;
    const filaFija = [
      idInterno,
      numeroCotizacion,
      sesion.usuario || '',
      datos.cliente || datos.nombre || 'Cliente Nuevo',
      fecha,
      importe,
      datos.moneda || 'MXN',
      descEquipos,
      datos.estado || 'cotizada',
      datos.condicionesPago || datos.condiciones || ''
    ];
    
    hoja.getRange(ultimaFila, 1, 1, 10).setValues([filaFija]);
    
    console.log(`✅ Guardado: ${numeroCotizacion} - $${importe}`);
    return { exito: true, mensaje: 'Cotización guardada', id: idInterno, numeroCotizacion: numeroCotizacion };
    
  } catch (error) {
    console.error("❌ Error:", error);
    return { exito: false, mensaje: error.toString() };
  }
}

function guardarSeguimiento(sesion, datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let hoja = ss.getSheetByName('Seguimientos');
    
    if (!hoja) {
      hoja = ss.insertSheet('Seguimientos');
      hoja.appendRow([
        'CotizacionId', 'IdSeguimiento', 'Ejecutivo', 'Cliente', 
        'Fecha', 'Estado', 'Medio', 'Importe', 'Comentarios', 'FechaCreacion'
      ]);
    }
    
    const idSeguimiento = datos.id || generarIdUnico('SEG', sesion.usuario);
    const fecha = datos.fecha || new Date().toISOString().split('T')[0];
    const fechaCreacion = new Date().toLocaleDateString('es-MX');
    
    hoja.appendRow([
      datos.cotizacionId || '',
      idSeguimiento,
      sesion.usuario,
      datos.cliente || 'Sin nombre',
      fecha,
      datos.estado || '10',
      datos.medio || 'Teléfono',
      datos.importe || 0,
      datos.comentarios || '',
      fechaCreacion
    ]);
    
    console.log(`✅ Seguimiento guardado: ${idSeguimiento}`);
    return { exito: true, mensaje: 'Seguimiento guardado', id: idSeguimiento };
    
  } catch (error) {
    console.error("❌ Error:", error);
    return { exito: false, mensaje: error.toString() };
  }
}

function actualizarSeguimiento(sesion, datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('Seguimientos');
    
    if (!hoja) {
      return { exito: false, mensaje: 'Hoja Seguimientos no encontrada' };
    }
    
    const datosHoja = hoja.getDataRange().getValues();
    let filaEncontrada = -1;
    
    for (let i = 1; i < datosHoja.length; i++) {
      if (datosHoja[i][1] === datos.id) {
        filaEncontrada = i + 1;
        break;
      }
    }
    
    if (filaEncontrada === -1) {
      return { exito: false, mensaje: 'Seguimiento no encontrado' };
    }
    
    if (datos.cliente) hoja.getRange(filaEncontrada, 4).setValue(datos.cliente);
    if (datos.fecha) hoja.getRange(filaEncontrada, 5).setValue(datos.fecha);
    if (datos.estado) hoja.getRange(filaEncontrada, 6).setValue(datos.estado);
    if (datos.medio) hoja.getRange(filaEncontrada, 7).setValue(datos.medio);
    if (datos.importe !== undefined) hoja.getRange(filaEncontrada, 8).setValue(datos.importe);
    if (datos.comentarios !== undefined) hoja.getRange(filaEncontrada, 9).setValue(datos.comentarios);
    
    return { exito: true, mensaje: 'Seguimiento actualizado' };
    
  } catch (error) {
    return { exito: false, mensaje: error.toString() };
  }
}

function guardarLead(sesion, datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let hoja = ss.getSheetByName('Leads');
    
    if (!hoja) {
      hoja = ss.insertSheet('Leads');
      hoja.appendRow(['ID', 'Creado por', 'Asignado a', 'Contacto', 'Telefono', 'Email', 'Empresa', 'Categoria', 'Fecha', 'Estado']);
    }
    
    const id = datos.id || generarIdUnico('L', sesion.usuario);
    const fecha = new Date().toLocaleDateString('es-MX');
    const vendedorAsignado = datos.vendedorAsignado || sesion.usuario;
    
    hoja.appendRow([
      id,
      sesion.usuario,
      vendedorAsignado,
      datos.contacto || '',
      datos.telefono || '',
      datos.email || '',
      datos.empresa || '',
      datos.categoria || 'Nuevo',
      fecha,
      datos.estado || 'pendiente'
    ]);
    
    return { exito: true, mensaje: 'Lead guardado', id: id };
    
  } catch (error) {
    return { exito: false, mensaje: error.toString() };
  }
}

// ==================== FUNCIONES DE LECTURA ====================

function obtenerCotizacionesPorVendedor(usuario) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('Cotizaciones');
    
    if (!hoja) {
      return { exito: false, mensaje: 'Hoja Cotizaciones no encontrada', cotizaciones: [] };
    }
    
    const datos = hoja.getDataRange().getValues();
    if (datos.length <= 1) {
      return { exito: true, cotizaciones: [] };
    }
    
    const headers = datos[0];
    const idxId = headers.indexOf('IdCotizacion');
    const idxNo = headers.indexOf('No Cotizacion');
    const idxEje = headers.indexOf('Ejecutivo');
    const idxCli = headers.indexOf('Cliente');
    const idxFec = headers.indexOf('Fecha Elaboracion');
    const idxPre = headers.indexOf('Precio');
    const idxMon = headers.indexOf('Moneda');
    const idxEqu = headers.indexOf('Equipo (Descripción)');
    const idxEst = headers.indexOf('Estatus');
    const idxCon = headers.indexOf('Condiciones Pago');
    
    const cotizaciones = [];
    const usuarioNormalizado = (usuario || '').trim().toUpperCase();
    
    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      const ejecutivoOriginal = fila[idxEje] || '';
      const ejecutivoNormalizado = ejecutivoOriginal.trim().toUpperCase();
      
      if (ejecutivoNormalizado !== usuarioNormalizado && usuarioNormalizado !== 'ADMIN') continue;
      
      let importe = 0;
      let valorPrecio = fila[idxPre];
      if (valorPrecio !== undefined && valorPrecio !== '') {
        importe = typeof valorPrecio === 'number' ? valorPrecio : parseFloat(String(valorPrecio).replace(/[$,]/g, '')) || 0;
      }
      
      let fechaOriginal = fila[idxFec];
      let fechaFormateada = '';
      if (fechaOriginal instanceof Date) {
        fechaFormateada = fechaOriginal.toISOString().split('T')[0];
      } else if (fechaOriginal) {
        fechaFormateada = String(fechaOriginal).split(' ')[0];
      } else {
        fechaFormateada = new Date().toISOString().split('T')[0];
      }
      
      cotizaciones.push({
        id: fila[idxId] || '',
        numeroCotizacion: fila[idxNo] || '',
        nombre: fila[idxCli] || '',
        idCliente: 'N/A',
        medio: 'Cotización directa',
        importe: importe,
        moneda: fila[idxMon] || 'MXN',
        descEquipo: String(fila[idxEqu] || ''),
        categoria: fila[idxEst] || 'Nuevo',
        ejecutivo: ejecutivoOriginal,
        fecha: fechaFormateada,
        condicionesPago: fila[idxCon] || ''
      });
    }
    
    return { exito: true, cotizaciones: cotizaciones, total: cotizaciones.length };
    
  } catch (error) {
    return { exito: false, mensaje: error.toString(), cotizaciones: [] };
  }
}

function obtenerSeguimientosPorVendedor(usuario) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('Seguimientos');
    
    if (!hoja) {
      return { exito: false, mensaje: 'Hoja Seguimientos no encontrada', seguimientos: [] };
    }
    
    const datos = hoja.getDataRange().getValues();
    if (datos.length <= 1) {
      return { exito: true, seguimientos: [] };
    }
    
    const seguimientos = [];
    const usuarioNormalizado = (usuario || '').trim().toUpperCase();
    
    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      const ejecutivoOriginal = fila[2] || '';
      const ejecutivoNormalizado = ejecutivoOriginal.trim().toUpperCase();
      
      if (ejecutivoNormalizado !== usuarioNormalizado && usuarioNormalizado !== 'ADMIN') continue;
      
      let importeLimpio = 0;
      if (fila[7]) {
        importeLimpio = typeof fila[7] === 'number' ? fila[7] : parseFloat(String(fila[7]).replace(/[$,]/g, '')) || 0;
      }
      
      let fechaOriginal = fila[4];
      let fechaFormateada = '';
      if (fechaOriginal instanceof Date) {
        fechaFormateada = fechaOriginal.toISOString().split('T')[0];
      } else if (fechaOriginal) {
        fechaFormateada = String(fechaOriginal).split(' ')[0];
      }
      
      seguimientos.push({
        id: fila[1] || '',
        nombre: fila[3] || '',
        cotizacionId: fila[0] || '',
        medio: fila[6] || 'Teléfono',
        importe: importeLimpio,
        moneda: 'MXN',
        descEquipo: 'No especificado',
        fecha: fechaFormateada,
        estado: String(fila[5] || '10'),
        comentarios: fila[8] || '',
        ejecutivo: ejecutivoOriginal,
        fechaCreacion: fila[9] || new Date().toLocaleDateString('es-MX')
      });
    }
    
    return { exito: true, seguimientos: seguimientos, total: seguimientos.length };
    
  } catch (error) {
    return { exito: false, mensaje: error.toString(), seguimientos: [] };
  }
}

function obtenerLeadsPorVendedor(usuario) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('Leads');
    
    if (!hoja) {
      return { exito: false, mensaje: 'Hoja Leads no encontrada', leads: [] };
    }
    
    const datos = hoja.getDataRange().getValues();
    if (datos.length <= 1) {
      return { exito: true, leads: [] };
    }
    
    const leads = [];
    const usuarioNormalizado = (usuario || '').trim().toUpperCase();
    
    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      const asignadoA = fila[2] || '';
      const asignadoNormalizado = asignadoA.trim().toUpperCase();
      
      if (asignadoNormalizado !== usuarioNormalizado && asignadoNormalizado !== '' && usuarioNormalizado !== 'ADMIN') continue;
      
      leads.push({
        id: fila[0] || '',
        contacto: fila[3] || '',
        telefono: fila[4] || '',
        correo: fila[5] || '',
        empresa: fila[6] || '',
        categoria: fila[7] || 'Nuevo',
        ejecutivo: asignadoA,
        fecha: fila[8] || '',
        estado: fila[9] || 'pendiente'
      });
    }
    
    return { exito: true, leads: leads, total: leads.length };
    
  } catch (error) {
    return { exito: false, mensaje: error.toString(), leads: [] };
  }
}

function obtenerLeadsSinAsignar() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('Leads');
    
    if (!hoja) {
      return { exito: false, mensaje: 'Hoja Leads no encontrada', leads: [] };
    }
    
    const datos = hoja.getDataRange().getValues();
    if (datos.length <= 1) {
      return { exito: true, leads: [] };
    }
    
    const leads = [];
    
    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      const asignadoA = fila[2] || '';
      const estado = fila[9] || '';
      
      if (asignadoA === '' && estado !== 'asignado') {
        leads.push({
          id: fila[0] || '',
          contacto: fila[3] || '',
          telefono: fila[4] || '',
          correo: fila[5] || '',
          empresa: fila[6] || '',
          categoria: fila[7] || 'Nuevo',
          fecha: fila[8] || ''
        });
      }
    }
    
    return { exito: true, leads: leads, total: leads.length };
    
  } catch (error) {
    return { exito: false, mensaje: error.toString(), leads: [] };
  }
}

function obtenerListaVendedores() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('Usuarios');
    
    if (!hoja) {
      return { exito: false, mensaje: 'Hoja Usuarios no encontrada', vendedores: [] };
    }
    
    const datos = hoja.getDataRange().getValues();
    const vendedores = [];
    
    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      const rol = fila[2] || '';
      const activo = fila[4];
      const usuario = fila[0] || '';
      const nombre = fila[1] || '';
      
      if ((rol === 'vendedor' || rol === 'VENDEDOR') && (activo === true || activo === 'TRUE')) {
        vendedores.push({ usuario: usuario, nombre: nombre, rol: rol });
      }
    }
    
    return { exito: true, vendedores: vendedores, total: vendedores.length };
    
  } catch (error) {
    return { exito: false, mensaje: error.toString(), vendedores: [] };
  }
}

// ==================== FUNCIONES PÚBLICAS ====================

function obtenerConfiguracion() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Configuracion');
    if (!sheet) {
      return { tipo_cambio_default: 20.50, iva_porcentaje: 16, utilidad_global_empresa: 20, utilidad_global_vendedor: 10, umbral_autorizacion: 500000 };
    }
    
    const datos = sheet.getDataRange().getValues();
    const config = {};
    for (let i = 1; i < datos.length; i++) {
      const parametro = datos[i][0];
      const valor = datos[i][1];
      if (parametro && valor) config[parametro] = valor;
    }
    return config;
  } catch (error) {
    return { tipo_cambio_default: 20.50, iva_porcentaje: 16, utilidad_global_empresa: 20, utilidad_global_vendedor: 10, umbral_autorizacion: 500000 };
  }
}

function obtenerEquiposPublico() {
  try {
    const hojaCatalogo = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Catalogos');
    if (!hojaCatalogo) {
      return { exito: false, error: 'Hoja Catalogos no encontrada', equipos: [] };
    }
    
    const datos = hojaCatalogo.getDataRange().getValues();
    const equipos = [];
    
    for (let i = 1; i < datos.length; i++) {
      const activo = datos[i][9];
      if (activo !== true && activo !== 'TRUE') continue;
      
      equipos.push({
        marca: datos[i][0],
        modelo: datos[i][1],
        tipo: datos[i][2],
        capacidad: datos[i][3],
        tension: datos[i][4],
        tecnologia: datos[i][5],
        precioVenta: parseFloat(datos[i][6]) || 0
      });
    }
    
    return { exito: true, equipos: equipos };
  } catch (error) {
    return { exito: false, error: error.toString(), equipos: [] };
  }
}

function obtenerServiciosPublico() {
  try {
    const hojaServicios = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Servicios');
    if (!hojaServicios) {
      return { exito: false, error: 'Hoja Servicios no encontrada', servicios: [] };
    }
    
    const datos = hojaServicios.getDataRange().getValues();
    const servicios = [];
    
    for (let i = 1; i < datos.length; i++) {
      const activo = datos[i][4];
      if (activo !== true && activo !== 'TRUE') continue;
      
      servicios.push({
        categoria: datos[i][0],
        concepto: datos[i][1],
        descripcion: datos[i][2],
        costoUnitario: datos[i][3]
      });
    }
    
    return { exito: true, servicios: servicios };
  } catch (error) {
    return { exito: false, error: error.toString(), servicios: [] };
  }
}

function obtenerConfiguracionPublica() {
  const config = obtenerConfiguracion();
  return {
    exito: true,
    config: {
      tipo_cambio: config.tipo_cambio_default || 20.50,
      iva_porcentaje: config.iva_porcentaje || 16,
      umbral_autorizacion: config.umbral_autorizacion || 500000,
      company_name: config.company_name || 'Grupo AYCE',
      company_phone: config.company_phone || '5541668383',
      company_email: config.company_email || 'direccion@aireacondicionadoayw.com.mx',
      company_address: config.company_address || 'Periférico Adolfo Lopez Mateos No. 4293'
    }
  };
}

// ==================== FUNCIONES DE DIAGNÓSTICO ====================

function testSimple() {
  return {
    exito: true,
    mensaje: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  };
}

function diagnosticarEstructuraHojas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resultado = { nombreArchivo: ss.getName(), url: ss.getUrl(), hojas: [] };
  const hojas = ss.getSheets();
  
  for (let i = 0; i < hojas.length; i++) {
    const hoja = hojas[i];
    const datos = hoja.getDataRange().getValues();
    resultado.hojas.push({
      nombre: hoja.getName(),
      tieneDatos: datos.length > 1,
      filasConDatos: datos.length - 1,
      columnas: datos[0] ? datos[0].length : 0,
      encabezados: datos[0] || []
    });
  }
  
  return resultado;
}

function probarEscritura() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let hojaCotizaciones = ss.getSheetByName('Cotizaciones');
    if (!hojaCotizaciones) {
      hojaCotizaciones = ss.insertSheet('Cotizaciones');
      hojaCotizaciones.appendRow(['IdCotizacion', 'No Cotizacion', 'Ejecutivo', 'Cliente', 'Fecha', 'Importe', 'Moneda', 'Descripcion', 'Estatus']);
    }
    
    const testId = 'TEST_' + Date.now();
    hojaCotizaciones.appendRow([testId, 'TEST-001', 'test_user', 'Cliente Test', new Date().toISOString(), 1000, 'MXN', 'Test de escritura', 'test']);
    
    return { exito: true, mensaje: 'Escritura exitosa', idTest: testId };
  } catch (error) {
    return { exito: false, error: error.toString() };
  }
}

function probarAutenticacion() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaUsuarios = ss.getSheetByName('Usuarios');
  if (!hojaUsuarios) return { exito: false, mensaje: 'No existe hoja Usuarios' };
  const datos = hojaUsuarios.getDataRange().getValues();
  return { exito: true, totalUsuarios: datos.length - 1, encabezados: datos[0] };
}