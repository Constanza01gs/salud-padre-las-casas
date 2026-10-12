
/*
============================================================
DASHBOARD - DIRECTOR DE ESTABLECIMIENTO
Departamento de Salud Municipal de Padre Las Casas
============================================================

Prototipo académico con almacenamiento local.

Funciones:
1. Validación de sesión del director.
2. Consulta de solicitudes del establecimiento.
3. Indicadores del panel principal.
4. Seguimiento de plazos de reclamos.
5. Tabla de reclamos prioritarios.
6. Solicitudes recientes.
7. Búsqueda y filtros.
8. Detalle e historial.
9. Reportes de gestión y satisfacción.
10. Navegación y cierre de sesión.

IMPORTANTE:
- Acceso exclusivamente de solo lectura.
- El director no modifica solicitudes.
- Los plazos son una referencia académica.
- Se consideran 15 días hábiles desde el día
  siguiente al ingreso.
- Se excluyen sábados y domingos, pero no feriados.
============================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    // ====================================================
    // 1. CONFIGURACIÓN Y SESIÓN
    // ====================================================

    const CLAVE_SESION = "plc_oirs_sesion_demo_v1";
    const CLAVE_SOLICITUDES = "plc_oirs_solicitudes_demo_v1";
    const CLAVE_ENCUESTAS = "plc_encuestas_demo_v1";

    const DIAS_HABILES_PLAZO = 15;
    const DIAS_ALERTA = 3;

    let sesion = null;

    try {
        sesion = JSON.parse(
            sessionStorage.getItem(CLAVE_SESION) || "null"
        );
    } catch (error) {
        sesion = null;
    }

    if (
        !sesion ||
        sesion.rol !== "DIRECTOR" ||
        !sesion.establecimiento
    ) {
        window.location.replace("login.html");
        return;
    }

    document.getElementById("nombre-director").textContent =
        sesion.nombre || "Director de establecimiento";

    document.getElementById("establecimiento-director").textContent =
        sesion.establecimiento;

    document.getElementById("bienvenida-director").textContent =
        "Supervisión de solicitudes de " +
        sesion.establecimiento + ".";


    // ====================================================
    // 2. ALMACENAMIENTO LOCAL
    // ====================================================

    function leerArreglo(clave) {

        try {

            const datos = JSON.parse(
                localStorage.getItem(clave) || "[]"
            );

            return Array.isArray(datos) ? datos : [];

        } catch (error) {
            return [];
        }
    }


    // ====================================================
    // 3. DATOS DEL ESTABLECIMIENTO
    // ====================================================

    function solicitudesDelEstablecimiento() {

        return leerArreglo(CLAVE_SOLICITUDES)
            .filter(function (solicitud) {

                return (
                    solicitud &&
                    solicitud.establecimiento ===
                    sesion.establecimiento
                );

            });
    }

    function encuestasDelEstablecimiento() {

        return leerArreglo(CLAVE_ENCUESTAS)
            .filter(function (encuesta) {

                return (
                    encuesta &&
                    encuesta.establecimiento ===
                    sesion.establecimiento
                );

            });
    }


    // ====================================================
    // 4. FUNCIONES AUXILIARES
    // ====================================================

    function formatearFecha(fecha) {

        if (!fecha) {
            return "Sin fecha";
        }

        const valor = new Date(fecha);

        if (Number.isNaN(valor.getTime())) {
            return "Sin fecha";
        }

        return valor.toLocaleString("es-CL", {
            dateStyle: "short",
            timeStyle: "short"
        });
    }

    function formatearSoloFecha(fecha) {

        if (!fecha) {
            return "Sin fecha";
        }

        const valor = new Date(fecha);

        if (Number.isNaN(valor.getTime())) {
            return "Sin fecha";
        }

        return valor.toLocaleDateString("es-CL");
    }

    function crearCelda(fila, texto) {

        const celda = document.createElement("td");

        celda.textContent = texto ?? "—";

        fila.appendChild(celda);

        return celda;
    }

    function crearEstado(estado) {

        const elemento = document.createElement("span");

        elemento.className = "director-estado";
        elemento.textContent = estado || "Ingresada";

        if (
            estado === "En proceso" ||
            estado === "Derivada"
        ) {
            elemento.classList.add("proceso");
        }

        if (estado === "Respondida") {
            elemento.classList.add("respondida");
        }

        if (estado === "Cerrada") {
            elemento.classList.add("cerrada");
        }

        return elemento;
    }

    function agregarDato(
        contenedor,
        etiqueta,
        valor,
        completo = false
    ) {

        const campo = document.createElement("div");
        campo.className = "director-dato";

        if (completo) {
            campo.classList.add("completo");
        }

        const titulo = document.createElement("strong");
        titulo.textContent = etiqueta;

        const texto = document.createElement("p");
        texto.textContent = valor ?? "—";

        campo.appendChild(titulo);
        campo.appendChild(texto);

        contenedor.appendChild(campo);
    }

    function crearFilaVacia(tabla, mensaje, columnas) {

        const fila = document.createElement("tr");

        const celda = crearCelda(fila, mensaje);

        celda.colSpan = columnas;
        celda.className = "director-vacio";

        tabla.appendChild(fila);
    }


    // ====================================================
    // 5. CÁLCULO DE PLAZOS
    // ====================================================

    function obtenerFechaLocal(valor) {

        if (!valor) {
            return null;
        }

        const fecha = new Date(valor);

        if (Number.isNaN(fecha.getTime())) {
            return null;
        }

        return new Date(
            fecha.getFullYear(),
            fecha.getMonth(),
            fecha.getDate()
        );
    }

    function esDiaHabil(fecha) {

        const dia = fecha.getDay();

        return dia !== 0 && dia !== 6;
    }

    function agregarDiasHabiles(fechaInicial, cantidad) {

        const fecha = new Date(fechaInicial);

        let diasAgregados = 0;

        while (diasAgregados < cantidad) {

            fecha.setDate(fecha.getDate() + 1);

            if (esDiaHabil(fecha)) {
                diasAgregados++;
            }
        }

        return fecha;
    }

    function contarDiasHabilesRestantes(fechaInicio, fechaFin) {

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (inicio.getTime() === fin.getTime()) {
            return 0;
        }

        const diferencia = inicio < fin ? 1 : -1;

        let fecha = new Date(inicio);
        let contador = 0;

        while (
            diferencia === 1
                ? fecha < fin
                : fecha > fin
        ) {

            fecha.setDate(
                fecha.getDate() + diferencia
            );

            if (esDiaHabil(fecha)) {
                contador += diferencia;
            }
        }

        return contador;
    }

    function esSolicitudFinalizada(solicitud) {

        return (
            solicitud.estado === "Respondida" ||
            solicitud.estado === "Cerrada"
        );
    }

    function calcularPlazo(solicitud) {

        if (solicitud.tipo !== "Reclamo") {

            return {
                estado: "No aplica",
                clase: "no-aplica",
                fechaLimite: null,
                diasRestantes: null
            };
        }

        const fechaIngreso = obtenerFechaLocal(
            solicitud.fechaRegistro
        );

        if (!fechaIngreso) {

            return {
                estado: "Sin fecha",
                clase: "no-aplica",
                fechaLimite: null,
                diasRestantes: null
            };
        }

        const fechaLimite = agregarDiasHabiles(
            fechaIngreso,
            DIAS_HABILES_PLAZO
        );

        if (esSolicitudFinalizada(solicitud)) {

            return {
                estado: "Finalizada",
                clase: "finalizada",
                fechaLimite: fechaLimite,
                diasRestantes: null
            };
        }

        const hoy = obtenerFechaLocal(new Date());

        const diasRestantes = contarDiasHabilesRestantes(
            hoy,
            fechaLimite
        );

        if (hoy > fechaLimite) {

            return {
                estado: "Vencida",
                clase: "vencida",
                fechaLimite: fechaLimite,
                diasRestantes: diasRestantes
            };
        }

        if (diasRestantes <= DIAS_ALERTA) {

            return {
                estado: "Próxima a vencer",
                clase: "proxima",
                fechaLimite: fechaLimite,
                diasRestantes: diasRestantes
            };
        }

        return {
            estado: "En plazo",
            clase: "en-plazo",
            fechaLimite: fechaLimite,
            diasRestantes: diasRestantes
        };
    }

    function crearEtiquetaPlazo(resultado) {

        const etiqueta = document.createElement("span");

        etiqueta.className =
            "director-plazo " + resultado.clase;

        etiqueta.textContent = resultado.estado;

        return etiqueta;
    }


    // ====================================================
    // 6. INDICADORES DEL PANEL PRINCIPAL
    // ====================================================

    function actualizarIndicadores() {

        const solicitudes = solicitudesDelEstablecimiento();

        document.getElementById(
            "indicador-total"
        ).textContent = solicitudes.length;

        document.getElementById(
            "indicador-ingresadas"
        ).textContent = solicitudes.filter(
            solicitud => solicitud.estado === "Ingresada"
        ).length;

        document.getElementById(
            "indicador-proceso"
        ).textContent = solicitudes.filter(
            solicitud =>
                solicitud.estado === "En proceso" ||
                solicitud.estado === "Derivada"
        ).length;

        document.getElementById(
            "indicador-finalizadas"
        ).textContent = solicitudes.filter(
            solicitud => esSolicitudFinalizada(solicitud)
        ).length;
    }


    // ====================================================
    // 7. INDICADORES DE PLAZOS
    // ====================================================

    function obtenerResumenPlazos() {

        const reclamosPendientes =
            solicitudesDelEstablecimiento().filter(
                solicitud =>
                    solicitud.tipo === "Reclamo" &&
                    !esSolicitudFinalizada(solicitud)
            );

        const resultados = reclamosPendientes.map(
            solicitud => ({
                solicitud: solicitud,
                plazo: calcularPlazo(solicitud)
            })
        );

        return {
            pendientes: reclamosPendientes.length,

            enPlazo: resultados.filter(
                item => item.plazo.estado === "En plazo"
            ).length,

            proximas: resultados.filter(
                item => item.plazo.estado === "Próxima a vencer"
            ).length,

            vencidas: resultados.filter(
                item => item.plazo.estado === "Vencida"
            ).length,

            resultados: resultados
        };
    }

    function actualizarIndicadoresPlazos() {

        const resumen = obtenerResumenPlazos();

        document.getElementById(
            "indicador-reclamos-pendientes"
        ).textContent = resumen.pendientes;

        document.getElementById(
            "indicador-en-plazo"
        ).textContent = resumen.enPlazo;

        document.getElementById(
            "indicador-proximas-vencer"
        ).textContent = resumen.proximas;

        document.getElementById(
            "indicador-vencidas"
        ).textContent = resumen.vencidas;
    }


    // ====================================================
    // 8. TABLA DE RECLAMOS PRIORITARIOS
    // ====================================================

    function renderizarPrioritarias() {

        const tabla = document.getElementById(
            "tabla-prioritarias"
        );

        tabla.innerHTML = "";

        const prioridades = obtenerResumenPlazos()
            .resultados
            .filter(item =>
                item.plazo.estado === "Próxima a vencer" ||
                item.plazo.estado === "Vencida"
            )
            .sort(function (a, b) {

                return (
                    a.plazo.fechaLimite -
                    b.plazo.fechaLimite
                );
            });

        if (prioridades.length === 0) {

            crearFilaVacia(
                tabla,
                "No hay reclamos próximos a vencer o vencidos.",
                5
            );

            return;
        }

        prioridades.forEach(function (item) {

            const solicitud = item.solicitud;
            const plazo = item.plazo;

            const fila = document.createElement("tr");

            crearCelda(fila, solicitud.folio);
            crearCelda(fila, solicitud.asunto);

            crearCelda(
                fila,
                formatearSoloFecha(plazo.fechaLimite)
            );

            const celdaPlazo = document.createElement("td");

            celdaPlazo.appendChild(
                crearEtiquetaPlazo(plazo)
            );

            fila.appendChild(celdaPlazo);

            const celdaAccion = document.createElement("td");

            const boton = document.createElement("button");

            boton.type = "button";
            boton.className = "director-boton";
            boton.textContent = "Ver detalle";

            boton.addEventListener("click", function () {

                mostrarSeccion("solicitudes");

                mostrarDetalle(solicitud.folio);
            });

            celdaAccion.appendChild(boton);
            fila.appendChild(celdaAccion);

            tabla.appendChild(fila);
        });
    }


    // ====================================================
    // 9. SOLICITUDES RECIENTES
    // ====================================================

    function renderizarRecientes() {

        const tabla = document.getElementById(
            "tabla-recientes"
        );

        tabla.innerHTML = "";

        const solicitudes = solicitudesDelEstablecimiento()
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.fechaRegistro) -
                    new Date(a.fechaRegistro)
            )
            .slice(0, 5);

        if (solicitudes.length === 0) {

            crearFilaVacia(
                tabla,
                "No hay solicitudes registradas para este establecimiento.",
                5
            );

            return;
        }

        solicitudes.forEach(function (solicitud) {

            const fila = document.createElement("tr");

            crearCelda(fila, solicitud.folio);
            crearCelda(fila, solicitud.tipo);
            crearCelda(fila, solicitud.asunto);

            const celdaEstado = document.createElement("td");

            celdaEstado.appendChild(
                crearEstado(solicitud.estado)
            );

            fila.appendChild(celdaEstado);

            crearCelda(
                fila,
                formatearFecha(solicitud.fechaRegistro)
            );

            tabla.appendChild(fila);
        });
    }


    // ====================================================
    // 10. LISTADO Y FILTROS DE SOLICITUDES
    // ====================================================

    function renderizarSolicitudes() {

        const tabla = document.getElementById(
            "tabla-solicitudes"
        );

        tabla.innerHTML = "";

        const busqueda = document.getElementById(
            "buscar-solicitudes"
        ).value.trim().toLowerCase();

        const tipo = document.getElementById(
            "filtro-tipo"
        ).value;

        const estado = document.getElementById(
            "filtro-estado"
        ).value;

        const filtroPlazo = document.getElementById(
            "filtro-plazo"
        ).value;

        const solicitudes = solicitudesDelEstablecimiento()
            .filter(function (solicitud) {

                const texto = [
                    solicitud.folio,
                    solicitud.asunto,
                    solicitud.tipo
                ].join(" ").toLowerCase();

                const plazo = calcularPlazo(solicitud);

                return (
                    texto.includes(busqueda) &&
                    (!tipo || solicitud.tipo === tipo) &&
                    (!estado || solicitud.estado === estado) &&
                    (
                        !filtroPlazo ||
                        plazo.estado === filtroPlazo
                    )
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.fechaRegistro) -
                    new Date(a.fechaRegistro)
            );

        if (solicitudes.length === 0) {

            crearFilaVacia(
                tabla,
                "No se encontraron solicitudes.",
                6
            );

            document.getElementById(
                "detalle-solicitud"
            ).hidden = true;

            return;
        }

        solicitudes.forEach(function (solicitud) {

            const fila = document.createElement("tr");

            crearCelda(fila, solicitud.folio);
            crearCelda(fila, solicitud.tipo);
            crearCelda(fila, solicitud.asunto);

            const celdaEstado = document.createElement("td");

            celdaEstado.appendChild(
                crearEstado(solicitud.estado)
            );

            fila.appendChild(celdaEstado);

            const plazo = calcularPlazo(solicitud);

            const celdaPlazo = document.createElement("td");

            celdaPlazo.appendChild(
                crearEtiquetaPlazo(plazo)
            );

            fila.appendChild(celdaPlazo);

            const celdaAccion = document.createElement("td");

            const contenedorAcciones =
                document.createElement("div");

            contenedorAcciones.className =
                "director-acciones-tabla";

            const boton = document.createElement("button");

            boton.type = "button";
            boton.className = "director-boton";
            boton.textContent = "Ver detalle";

            boton.addEventListener("click", function () {
                mostrarDetalle(solicitud.folio);
            });

            contenedorAcciones.appendChild(boton);
            celdaAccion.appendChild(contenedorAcciones);

            fila.appendChild(celdaAccion);

            tabla.appendChild(fila);
        });
    }


    // ====================================================
    // 11. HISTORIAL DE SOLICITUDES
    // ====================================================

    function construirHistorial(solicitud) {

        const contenedor = document.getElementById(
            "detalle-historial"
        );

        contenedor.innerHTML = "";

        const historial = Array.isArray(solicitud.historial)
            ? solicitud.historial
            : [];

        if (historial.length === 0) {

            const item = document.createElement("li");

            item.textContent =
                "Sin movimientos registrados.";

            contenedor.appendChild(item);
            return;
        }

        historial.forEach(function (movimiento) {

            const item = document.createElement("li");

            const accion = document.createElement("strong");

            accion.textContent =
                movimiento.accion || "Movimiento";

            const detalle = document.createElement("div");

            detalle.textContent =
                movimiento.detalle || "";

            const fecha = document.createElement("small");

            fecha.textContent =
                formatearFecha(movimiento.fecha) +
                " · " +
                (movimiento.usuario || "Sistema");

            item.appendChild(accion);
            item.appendChild(detalle);
            item.appendChild(fecha);

            contenedor.appendChild(item);
        });
    }


    // ====================================================
    // 12. PANEL DE INFORMACIÓN DE PLAZO
    // ====================================================

    function actualizarDetallePlazo(solicitud) {

        const panel = document.getElementById(
            "detalle-panel-plazo"
        );

        const informacion = document.getElementById(
            "detalle-informacion-plazo"
        );

        panel.classList.remove("alerta", "vencido");

        if (solicitud.tipo !== "Reclamo") {

            panel.hidden = true;
            informacion.textContent = "";

            return;
        }

        const plazo = calcularPlazo(solicitud);

        panel.hidden = false;

        if (!plazo.fechaLimite) {

            informacion.textContent =
                "No es posible calcular el plazo porque " +
                "la solicitud no tiene una fecha de ingreso válida.";

            return;
        }

        const fechaLimite = formatearSoloFecha(
            plazo.fechaLimite
        );

        if (plazo.estado === "Finalizada") {

            informacion.textContent =
                "Reclamo finalizado. Fecha límite " +
                "referencial: " + fechaLimite + ".";

            return;
        }

        if (plazo.estado === "Vencida") {

            panel.classList.add("vencido");

            informacion.textContent =
                "Plazo referencial vencido. " +
                "Fecha límite: " + fechaLimite + ".";

            return;
        }

        if (plazo.estado === "Próxima a vencer") {

            panel.classList.add("alerta");

            informacion.textContent =
                "Reclamo próximo a vencer. " +
                "Fecha límite: " + fechaLimite + ". " +
                "Días hábiles restantes: " +
                plazo.diasRestantes + ".";

            return;
        }

        informacion.textContent =
            "Reclamo dentro del plazo referencial. " +
            "Fecha límite: " + fechaLimite + ". " +
            "Días hábiles restantes: " +
            plazo.diasRestantes + ".";
    }


    // ====================================================
    // 13. DETALLE DE SOLICITUD
    // ====================================================

    function mostrarDetalle(folio) {

        const solicitud = solicitudesDelEstablecimiento()
            .find(
                solicitud => solicitud.folio === folio
            );

        if (!solicitud) {
            return;
        }

        const contenido = document.getElementById(
            "detalle-contenido"
        );

        contenido.innerHTML = "";

        agregarDato(
            contenido,
            "Folio",
            solicitud.folio
        );

        agregarDato(
            contenido,
            "Tipo",
            solicitud.tipo
        );

        agregarDato(
            contenido,
            "Estado",
            solicitud.estado
        );

        agregarDato(
            contenido,
            "Origen",
            solicitud.origen
        );

        agregarDato(
            contenido,
            "Fecha de ingreso",
            formatearFecha(solicitud.fechaRegistro)
        );

        agregarDato(
            contenido,
            "Asignado a",
            solicitud.asignadoA
        );

        agregarDato(
            contenido,
            "Fecha de cierre",
            solicitud.fechaCierre
                ? formatearFecha(solicitud.fechaCierre)
                : "No cerrada"
        );

        agregarDato(
            contenido,
            "Asunto",
            solicitud.asunto,
            true
        );

        agregarDato(
            contenido,
            "Descripción",
            solicitud.descripcion,
            true
        );

        agregarDato(
            contenido,
            "Respuesta",
            solicitud.respuesta,
            true
        );

        /*
        El director no visualiza nombre,
        correo ni teléfono del solicitante.

        El acceso es de supervisión.
        */

        actualizarDetallePlazo(solicitud);

        construirHistorial(solicitud);

        const panel = document.getElementById(
            "detalle-solicitud"
        );

        panel.hidden = false;

        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // ====================================================
    // 14. EVENTOS DE SOLICITUDES
    // ====================================================

    document.getElementById("cerrar-detalle")
        .addEventListener("click", function () {

            document.getElementById(
                "detalle-solicitud"
            ).hidden = true;
        });

    document.getElementById("buscar-solicitudes")
        .addEventListener(
            "input",
            renderizarSolicitudes
        );

    document.getElementById("filtro-tipo")
        .addEventListener(
            "change",
            renderizarSolicitudes
        );

    document.getElementById("filtro-estado")
        .addEventListener(
            "change",
            renderizarSolicitudes
        );

    document.getElementById("filtro-plazo")
        .addEventListener(
            "change",
            renderizarSolicitudes
        );


    // ====================================================
    // 15. TARJETAS DE DESGLOSE
    // ====================================================

    function crearDesglose(idContenedor, elementos) {

        const contenedor = document.getElementById(
            idContenedor
        );

        contenedor.innerHTML = "";

        elementos.forEach(function (elemento) {

            const tarjeta = document.createElement("div");
            tarjeta.className = "director-desglose-item";

            // Número principal
            const cantidad = document.createElement("strong");
            cantidad.textContent = elemento.cantidad;

            // Nombre de la categoría
            const categoria = document.createElement("span");
            categoria.textContent = elemento.nombre;

            tarjeta.appendChild(cantidad);
            tarjeta.appendChild(categoria);

            contenedor.appendChild(tarjeta);
        });
    }

    // ====================================================
    // 16. REPORTES DE GESTIÓN
    // ====================================================

    function actualizarReportes() {

        const solicitudes = solicitudesDelEstablecimiento();
        const encuestas = encuestasDelEstablecimiento();

        document.getElementById(
            "reporte-total"
        ).textContent = solicitudes.length;

        document.getElementById(
            "reporte-reclamos"
        ).textContent = solicitudes.filter(
            solicitud => solicitud.tipo === "Reclamo"
        ).length;

        document.getElementById(
            "reporte-encuestas"
        ).textContent = encuestas.length;

        // Promedio de satisfacción: escala 1 a 5.

        const valores = encuestas
            .map(
                encuesta =>
                    Number(encuesta.satisfaccionGeneral)
            )
            .filter(
                valor =>
                    Number.isFinite(valor) &&
                    valor >= 1 &&
                    valor <= 5
            );

        const promedio = valores.length
            ? valores.reduce(
                (a, b) => a + b,
                0
            ) / valores.length
            : null;

        document.getElementById(
            "reporte-promedio"
        ).textContent = promedio === null
            ? "—"
            : promedio.toFixed(1) + " / 5";


        // Solicitudes por tipo.

        const tipos = [
            "Consulta",
            "Reclamo",
            "Sugerencia",
            "Solicitud",
            "Felicitación"
        ].map(function (tipo) {

            return {
                nombre: tipo,
                cantidad: solicitudes.filter(
                    solicitud => solicitud.tipo === tipo
                ).length
            };
        });

        crearDesglose("desglose-tipos", tipos);


        // Solicitudes por estado.

        const estados = [
            "Ingresada",
            "En proceso",
            "Derivada",
            "Respondida",
            "Cerrada"
        ].map(function (estado) {

            return {
                nombre: estado,
                cantidad: solicitudes.filter(
                    solicitud => solicitud.estado === estado
                ).length
            };
        });

        crearDesglose("desglose-estados", estados);


        // Seguimiento de plazos.

        const resumen = obtenerResumenPlazos();

        const plazos = [
            {
                nombre: "Reclamos pendientes",
                cantidad: resumen.pendientes
            },
            {
                nombre: "En plazo",
                cantidad: resumen.enPlazo
            },
            {
                nombre: "Próximos a vencer",
                cantidad: resumen.proximas
            },
            {
                nombre: "Vencidos",
                cantidad: resumen.vencidas
            }
        ];

        crearDesglose("desglose-plazos", plazos);
    }


    // ====================================================
    // 17. ACTUALIZACIÓN GENERAL
    // ====================================================

    function actualizarTodo() {

        actualizarIndicadores();

        actualizarIndicadoresPlazos();

        renderizarPrioritarias();

        renderizarRecientes();

        renderizarSolicitudes();

        actualizarReportes();
    }


    // ====================================================
    // 18. NAVEGACIÓN ENTRE SECCIONES
    // ====================================================

    const secciones = [
        "inicio",
        "solicitudes",
        "reportes"
    ];

    function mostrarSeccion(nombre) {

        if (!secciones.includes(nombre)) {
            return;
        }

        secciones.forEach(function (seccion) {

            document.getElementById(
                "seccion-" + seccion
            ).hidden = seccion !== nombre;
        });

        document.querySelectorAll(
            ".director-menu button[data-seccion]"
        ).forEach(function (boton) {

            boton.classList.toggle(
                "activo",
                boton.dataset.seccion === nombre
            );
        });

        actualizarTodo();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    document.querySelectorAll(
        "[data-seccion], [data-ir]"
    ).forEach(function (boton) {

        boton.addEventListener("click", function () {

            mostrarSeccion(
                boton.dataset.seccion ||
                boton.dataset.ir
            );
        });
    });


    // ====================================================
    // 19. CERRAR SESIÓN
    // ====================================================

    document.getElementById("cerrar-sesion")
        .addEventListener("click", function () {

            sessionStorage.removeItem(CLAVE_SESION);

            window.location.replace("login.html");
        });

    
    // ====================================================
    // 20. ACTUALIZACIÓN AUTOMÁTICA DE DATOS
    // ====================================================

    /*
        Cuando otra pestaña del mismo navegador modifica
        las solicitudes o encuestas, el dashboard del
        Director actualiza sus indicadores y tablas.

        No modifica los registros almacenados.
        El Director mantiene acceso de solo lectura.
    */

    window.addEventListener("storage", function (evento) {

        if (
            evento.key === CLAVE_SOLICITUDES ||
            evento.key === CLAVE_ENCUESTAS ||
            evento.key === null
        ) {

            actualizarTodo();
        }

    });


    // ====================================================
    // 21. INICIALIZACIÓN
    // ====================================================

    actualizarTodo();

});
