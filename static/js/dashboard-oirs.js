
/*
============================================================
DASHBOARD FUNCIONARIO OIRS
Departamento de Salud Municipal de Padre Las Casas
============================================================

Prototipo académico frontend.

- Gestión de solicitudes por establecimiento.
- Registro presencial compatible con el formulario ciudadano.
- Estados, derivaciones, respuestas e historial.
- Seguimiento demostrativo de 15 días hábiles para reclamos.
- Estadísticas dinámicas y reportes.
- Exportación CSV de registros ficticios.

IMPORTANTE:
No existe backend, autenticación real ni envío de correos.
Los datos se almacenan únicamente en el navegador.
============================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ========================================================
    // 1. CONFIGURACIÓN Y ALMACENAMIENTO
    // ========================================================

    const CLAVE_SESION = "plc_oirs_sesion_demo_v1";
    const CLAVE_SOLICITUDES = "plc_oirs_solicitudes_demo_v1";
    const CLAVE_ENCUESTAS = "plc_encuestas_demo_v1";

    const obtenerElemento = (id) => document.getElementById(id);

    function leerDatos(clave) {
        try {
            const datos = JSON.parse(localStorage.getItem(clave) || "[]");
            return Array.isArray(datos) ? datos : [];
        } catch (error) {
            console.error("Error al leer datos:", error);
            return [];
        }
    }

    function guardarDatos(clave, datos) {
        try {
            localStorage.setItem(clave, JSON.stringify(datos));
            return true;
        } catch (error) {
            console.error("Error al guardar datos:", error);
            return false;
        }
    }

    function leerSesion() {
        try {
            return JSON.parse(
                sessionStorage.getItem(CLAVE_SESION) || "null"
            );
        } catch {
            return null;
        }
    }

    const sesion = leerSesion();

    if (
        !sesion ||
        sesion.rol !== "OIRS_ESTABLECIMIENTO" ||
        !sesion.establecimiento
    ) {
        window.location.replace("login.html");
        return;
    }

    const establecimientoActual = sesion.establecimiento;
    const nombreFuncionario = sesion.nombre || "Funcionario OIRS";

    obtenerElemento("nombre-funcionario").textContent =
        nombreFuncionario;

    obtenerElemento("establecimiento-funcionario").textContent =
        establecimientoActual;

    obtenerElemento("bienvenida-establecimiento").textContent =
        `Gestión de solicitudes de ${establecimientoActual}.`;

    obtenerElemento("registro-establecimiento").value =
        establecimientoActual;

    function obtenerSolicitudes() {
        return leerDatos(CLAVE_SOLICITUDES).filter(
            solicitud =>
                solicitud &&
                solicitud.establecimiento === establecimientoActual
        );
    }

    function obtenerEncuestas() {
        return leerDatos(CLAVE_ENCUESTAS).filter(
            encuesta =>
                encuesta &&
                encuesta.establecimiento === establecimientoActual
        );
    }


    // ========================================================
    // 2. FUNCIONES GENERALES
    // ========================================================

    function texto(valor) {
        if (
            valor === null ||
            valor === undefined ||
            valor === ""
        ) {
            return "—";
        }

        return String(valor);
    }

    function fechaValida(valor) {
        if (!valor) {
            return null;
        }

        const fecha = new Date(valor);

        return Number.isFinite(fecha.getTime())
            ? fecha
            : null;
    }

    function formatearFecha(valor) {
        const fecha = fechaValida(valor);

        if (!fecha) {
            return "—";
        }

        return fecha.toLocaleString("es-CL", {
            dateStyle: "short",
            timeStyle: "short"
        });
    }

    function formatearDia(valor) {
        const fecha = fechaValida(valor);

        return fecha
            ? fecha.toLocaleDateString("es-CL")
            : "—";
    }

    function fechaInicioDia(valor) {
        const fecha = fechaValida(valor);

        if (!fecha) {
            return null;
        }

        return new Date(
            fecha.getFullYear(),
            fecha.getMonth(),
            fecha.getDate()
        );
    }

    function fechaHoy() {
        return fechaInicioDia(new Date());
    }

    function esDiaHabil(fecha) {
        const dia = fecha.getDay();

        return dia !== 0 && dia !== 6;
    }

    function obtenerValor(id) {
        return (obtenerElemento(id)?.value || "").trim();
    }

    function actualizarNumero(id, numero) {
        const elemento = obtenerElemento(id);

        if (elemento) {
            elemento.textContent = String(numero);
        }
    }

    function mostrarMensaje(id, contenido, error = false) {
        const elemento = obtenerElemento(id);

        if (!elemento) {
            return;
        }

        elemento.textContent = contenido;
        elemento.classList.toggle("error", error);
        elemento.hidden = false;
    }

    function ocultarMensaje(id) {
        const elemento = obtenerElemento(id);

        if (!elemento) {
            return;
        }

        elemento.textContent = "";
        elemento.classList.remove("error");
        elemento.hidden = true;
    }

    function ordenarPorFecha(solicitudes) {
        return [...solicitudes].sort((a, b) => {
            const fechaA = fechaValida(a.fechaRegistro)?.getTime() || 0;
            const fechaB = fechaValida(b.fechaRegistro)?.getTime() || 0;

            return fechaB - fechaA;
        });
    }

    function esFinalizada(solicitud) {
        return ["Respondida", "Cerrada"].includes(
            solicitud.estado
        );
    }


    // ========================================================
    // 3. CONTROL DEMOSTRATIVO DE PLAZOS
    // ========================================================

    /*
    Para reclamos se utiliza como referencia 15 días hábiles.

    Este cálculo:
    - Comienza el día siguiente al ingreso.
    - Excluye sábados y domingos.
    - No descuenta feriados chilenos.
    - No constituye un cálculo legal oficial.
    */

    function agregarDiasHabiles(fechaInicial, cantidad) {
        const fecha = fechaInicioDia(fechaInicial);

        if (!fecha) {
            return null;
        }

        let contador = 0;

        while (contador < cantidad) {
            fecha.setDate(fecha.getDate() + 1);

            if (esDiaHabil(fecha)) {
                contador++;
            }
        }

        return fecha;
    }

    function contarDiasHabiles(fechaDesde, fechaHasta) {
        if (!fechaDesde || !fechaHasta) {
            return 0;
        }

        const fecha = new Date(fechaDesde);
        let contador = 0;

        while (fecha < fechaHasta) {
            fecha.setDate(fecha.getDate() + 1);

            if (esDiaHabil(fecha)) {
                contador++;
            }
        }

        return contador;
    }

    function calcularPlazo(solicitud) {
        if (solicitud.tipo !== "Reclamo") {
            return {
                clave: "No aplica",
                etiqueta: "No aplica",
                clase: "no-aplica",
                limite: null
            };
        }

        const limite = agregarDiasHabiles(
            solicitud.fechaRegistro,
            15
        );

        if (!limite) {
            return {
                clave: "No aplica",
                etiqueta: "Sin fecha válida",
                clase: "no-aplica",
                limite: null
            };
        }

        if (esFinalizada(solicitud)) {
            return {
                clave: "Finalizada",
                etiqueta: "Finalizada",
                clase: "finalizada",
                limite
            };
        }

        const hoy = fechaHoy();

        if (hoy > limite) {
            return {
                clave: "Vencida",
                etiqueta: "Vencida",
                clase: "vencida",
                limite
            };
        }

        const restantes = contarDiasHabiles(hoy, limite);

        if (restantes <= 3) {
            return {
                clave: "Próxima a vencer",
                etiqueta: `${restantes} día(s) hábil(es)`,
                clase: "proxima",
                limite
            };
        }

        return {
            clave: "En plazo",
            etiqueta: `${restantes} día(s) hábil(es)`,
            clase: "en-plazo",
            limite
        };
    }


    // ========================================================
    // 4. ELEMENTOS DINÁMICOS DE TABLAS Y DETALLES
    // ========================================================

    function crearCelda(fila, contenido = "") {
        const celda = document.createElement("td");

        celda.textContent =
            contenido === "" ? "" : texto(contenido);

        fila.appendChild(celda);

        return celda;
    }

    function crearEtiqueta(celda, contenido, clase, tipo) {
        const etiqueta = document.createElement("span");

        etiqueta.className = `${tipo} ${clase}`;
        etiqueta.textContent = contenido;

        celda.appendChild(etiqueta);
    }

    function obtenerClaseEstado(estado) {
        const clases = {
            "En proceso": "proceso",
            "Derivada": "derivada",
            "Respondida": "respondida",
            "Cerrada": "cerrada"
        };

        return clases[estado] || "";
    }

    function agregarEstado(fila, solicitud) {
        const celda = crearCelda(fila);

        crearEtiqueta(
            celda,
            solicitud.estado || "Ingresada",
            obtenerClaseEstado(solicitud.estado),
            "oirs-estado"
        );
    }

    function agregarPlazo(fila, solicitud) {
        const celda = crearCelda(fila);
        const plazo = calcularPlazo(solicitud);

        crearEtiqueta(
            celda,
            plazo.etiqueta,
            plazo.clase,
            "oirs-plazo"
        );
    }

    function mostrarTablaVacia(tabla, columnas, mensaje) {
        const fila = document.createElement("tr");
        const celda = crearCelda(fila, mensaje);

        celda.colSpan = columnas;

        tabla.appendChild(fila);
    }

    function agregarDato(contenedor, titulo, valor, completo = false) {
        const bloque = document.createElement("div");

        bloque.className =
            `oirs-dato${completo ? " completo" : ""}`;

        const etiqueta = document.createElement("strong");
        etiqueta.textContent = titulo;

        const contenido = document.createElement("p");
        contenido.textContent = texto(valor);

        bloque.append(etiqueta, contenido);
        contenedor.appendChild(bloque);
    }

    function mostrarHistorial(id, solicitud) {
        const lista = obtenerElemento(id);

        lista.replaceChildren();

        const movimientos = Array.isArray(solicitud.historial)
            ? solicitud.historial
            : [];

        if (!movimientos.length) {
            const elemento = document.createElement("li");

            elemento.textContent =
                "Sin movimientos registrados.";

            lista.appendChild(elemento);
            return;
        }

        movimientos.forEach(movimiento => {
            const elemento = document.createElement("li");

            const accion = document.createElement("strong");
            accion.textContent = texto(movimiento.accion);

            const detalle = document.createElement("div");
            detalle.textContent = texto(movimiento.detalle);

            const informacion = document.createElement("small");
            informacion.textContent =
                `${formatearFecha(movimiento.fecha)} · ` +
                `${texto(movimiento.usuario)}`;

            elemento.append(accion, detalle, informacion);
            lista.appendChild(elemento);
        });
    }


    // ========================================================
    // 5. NAVEGACIÓN
    // ========================================================

    const secciones = [
        "inicio",
        "solicitudes",
        "registro",
        "gestion",
        "reportes"
    ];

    function navegar(seccion) {
        if (!secciones.includes(seccion)) {
            return;
        }

        secciones.forEach(nombre => {
            obtenerElemento(`seccion-${nombre}`).hidden =
                nombre !== seccion;
        });

        document.querySelectorAll("[data-seccion]").forEach(boton => {
            const activo = boton.dataset.seccion === seccion;

            boton.classList.toggle("activo", activo);

            if (activo) {
                boton.setAttribute("aria-current", "page");
            } else {
                boton.removeAttribute("aria-current");
            }
        });

        if (seccion === "registro") {
            obtenerElemento("registro-establecimiento").value =
                establecimientoActual;
        }

        if (seccion === "gestion") {
            renderizarSelectorGestion();
        }

        if (seccion === "reportes") {
            renderizarReportes();
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    document
        .querySelectorAll("[data-seccion], [data-ir]")
        .forEach(boton => {
            boton.addEventListener("click", () => {
                navegar(
                    boton.dataset.seccion ||
                    boton.dataset.ir
                );
            });
        });

    obtenerElemento("cerrar-sesion").addEventListener("click", () => {
        sessionStorage.removeItem(CLAVE_SESION);
        window.location.replace("login.html");
    });


    // ========================================================
    // 6. PANEL PRINCIPAL
    // ========================================================

    function renderizarInicio() {
        const solicitudes = obtenerSolicitudes();

        actualizarNumero(
            "total-solicitudes",
            solicitudes.length
        );

        actualizarNumero(
            "total-ingresadas",
            solicitudes.filter(
                solicitud => solicitud.estado === "Ingresada"
            ).length
        );

        actualizarNumero(
            "total-proceso",
            solicitudes.filter(
                solicitud =>
                    ["En proceso", "Derivada"].includes(
                        solicitud.estado
                    )
            ).length
        );

        actualizarNumero(
            "total-finalizadas",
            solicitudes.filter(esFinalizada).length
        );

        const reclamosPendientes = solicitudes.filter(
            solicitud =>
                solicitud.tipo === "Reclamo" &&
                !esFinalizada(solicitud)
        );

        actualizarNumero(
            "total-reclamos-pendientes",
            reclamosPendientes.length
        );

        actualizarNumero(
            "total-en-plazo",
            reclamosPendientes.filter(
                solicitud =>
                    calcularPlazo(solicitud).clave === "En plazo"
            ).length
        );

        actualizarNumero(
            "total-proximas-vencer",
            reclamosPendientes.filter(
                solicitud =>
                    calcularPlazo(solicitud).clave ===
                    "Próxima a vencer"
            ).length
        );

        actualizarNumero(
            "total-vencidas",
            reclamosPendientes.filter(
                solicitud =>
                    calcularPlazo(solicitud).clave === "Vencida"
            ).length
        );

        const prioritarias = reclamosPendientes
            .filter(solicitud =>
                ["Vencida", "Próxima a vencer"].includes(
                    calcularPlazo(solicitud).clave
                )
            )
            .sort((a, b) => {
                const fechaA =
                    calcularPlazo(a).limite?.getTime() || 0;

                const fechaB =
                    calcularPlazo(b).limite?.getTime() || 0;

                return fechaA - fechaB;
            });

        const tablaPrioritarias =
            obtenerElemento("tabla-prioritarias");

        tablaPrioritarias.replaceChildren();

        if (!prioritarias.length) {
            mostrarTablaVacia(
                tablaPrioritarias,
                5,
                "No hay reclamos próximos a vencer o vencidos."
            );
        }

        prioritarias.slice(0, 8).forEach(solicitud => {
            const fila = document.createElement("tr");

            crearCelda(fila, solicitud.folio);
            crearCelda(fila, solicitud.asunto);

            crearCelda(
                fila,
                formatearDia(calcularPlazo(solicitud).limite)
            );

            agregarPlazo(fila, solicitud);
            agregarEstado(fila, solicitud);

            tablaPrioritarias.appendChild(fila);
        });

        const tablaRecientes =
            obtenerElemento("tabla-recientes");

        tablaRecientes.replaceChildren();

        const recientes = ordenarPorFecha(solicitudes).slice(0, 5);

        if (!recientes.length) {
            mostrarTablaVacia(
                tablaRecientes,
                5,
                "Todavía no existen solicitudes para este establecimiento."
            );
        }

        recientes.forEach(solicitud => {
            const fila = document.createElement("tr");

            crearCelda(fila, solicitud.folio);
            crearCelda(fila, solicitud.tipo);
            crearCelda(fila, solicitud.asunto);
            agregarEstado(fila, solicitud);

            crearCelda(
                fila,
                formatearFecha(solicitud.fechaRegistro)
            );

            tablaRecientes.appendChild(fila);
        });
    }


    // ========================================================
    // 7. CONSULTA Y DETALLE DE SOLICITUDES
    // ========================================================

    let folioDetalle = null;

    function renderizarSolicitudes() {
        const busqueda = obtenerValor(
            "buscar-solicitudes"
        ).toLocaleLowerCase("es");

        const tipo = obtenerValor("filtrar-tipo");
        const estado = obtenerValor("filtrar-estado");
        const filtroPlazo = obtenerValor("filtrar-plazo");

        const solicitudes = ordenarPorFecha(
            obtenerSolicitudes()
        ).filter(solicitud => {
            const camposBusqueda = [
                solicitud.folio,
                solicitud.asunto,
                solicitud.tipo,
                solicitud.motivo,
                solicitud.nombre,
                solicitud.apellido,
                solicitud.paciente?.nombre,
                solicitud.solicitante?.nombre
            ];

            const coincideBusqueda =
                !busqueda ||
                camposBusqueda.some(campo =>
                    String(campo || "")
                        .toLocaleLowerCase("es")
                        .includes(busqueda)
                );

            const coincideTipo =
                !tipo || solicitud.tipo === tipo;

            const coincideEstado =
                !estado || solicitud.estado === estado;

            const coincidePlazo =
                !filtroPlazo ||
                calcularPlazo(solicitud).clave === filtroPlazo;

            return (
                coincideBusqueda &&
                coincideTipo &&
                coincideEstado &&
                coincidePlazo
            );
        });

        const tabla = obtenerElemento("tabla-solicitudes");

        tabla.replaceChildren();

        if (!solicitudes.length) {
            mostrarTablaVacia(
                tabla,
                6,
                "No hay solicitudes que coincidan con los filtros."
            );
        }

        solicitudes.forEach(solicitud => {
            const fila = document.createElement("tr");

            crearCelda(fila, solicitud.folio);
            crearCelda(fila, solicitud.tipo);
            crearCelda(fila, solicitud.asunto);

            agregarEstado(fila, solicitud);
            agregarPlazo(fila, solicitud);

            const celdaAccion = crearCelda(fila);

            const boton = document.createElement("button");

            boton.type = "button";
            boton.className = "oirs-boton secundario";
            boton.textContent = "Ver detalle";

            boton.addEventListener("click", () => {
                abrirDetalle(solicitud.folio);
            });

            celdaAccion.appendChild(boton);
            tabla.appendChild(fila);
        });

        if (folioDetalle) {
            const solicitud = obtenerSolicitudes().find(
                elemento => elemento.folio === folioDetalle
            );

            if (solicitud) {
                mostrarDetalle(solicitud);
            } else {
                cerrarDetalle();
            }
        }
    }

    function mostrarCamposSolicitud(contenedor, solicitud) {
        contenedor.replaceChildren();

        const plazo = calcularPlazo(solicitud);

        const paciente = solicitud.paciente || {};
        const solicitante = solicitud.solicitante || {};

        const nombrePaciente = [
            paciente.nombre,
            paciente.apellidoPaterno,
            paciente.apellidoMaterno
        ].filter(Boolean).join(" ") || [
            solicitud.nombre,
            solicitud.apellido
        ].filter(Boolean).join(" ");

        const nombreSolicitante = [
            solicitante.nombre,
            solicitante.apellidoPaterno,
            solicitante.apellidoMaterno
        ].filter(Boolean).join(" ") || [
            solicitud.nombre,
            solicitud.apellido
        ].filter(Boolean).join(" ");

        const datos = [
            ["Folio", solicitud.folio],
            ["Tipo", solicitud.tipo],
            ["Estado", solicitud.estado],
            ["Origen", solicitud.origen],
            ["Establecimiento", solicitud.establecimiento],
            ["Unidad o servicio", solicitud.unidad],
            ["Fecha de ingreso", formatearFecha(solicitud.fechaRegistro)],
            [
                "Última actualización",
                formatearFecha(
                    solicitud.fechaActualizacion ||
                    solicitud.fechaRegistro
                )
            ],
            ["Motivo", solicitud.motivo],
            ["Otro motivo", solicitud.otroMotivo],
            [
                "Fecha límite del reclamo",
                plazo.limite
                    ? formatearDia(plazo.limite)
                    : "No aplica"
            ],
            ["Situación del plazo", plazo.etiqueta],
            ["Asignado a", solicitud.asignadoA],
            ["Persona afectada", nombrePaciente],
            ["Documento de la persona afectada", paciente.rut],
            ["Solicitante / representante", nombreSolicitante],
            [
                "Relación con la persona afectada",
                solicitante.relacionPaciente
            ],
            ["Correo electrónico", solicitud.correo],
            ["Teléfono", solicitud.telefono],
            ["Asunto", solicitud.asunto, true],
            ["Descripción", solicitud.descripcion, true],
            ["Petición", solicitud.peticion, true],
            ["Respuesta registrada", solicitud.respuesta, true]
        ];

        datos.forEach(([titulo, valor, completo]) => {
            agregarDato(
                contenedor,
                titulo,
                valor,
                Boolean(completo)
            );
        });
    }

    function mostrarDetalle(solicitud) {
        obtenerElemento("detalle-solicitud").hidden = false;

        mostrarCamposSolicitud(
            obtenerElemento("detalle-contenido"),
            solicitud
        );

        mostrarHistorial(
            "historial-solicitud",
            solicitud
        );

        obtenerElemento("boton-gestionar-detalle").disabled =
            solicitud.estado === "Cerrada";
    }

    function abrirDetalle(folio) {
        const solicitud = obtenerSolicitudes().find(
            elemento => elemento.folio === folio
        );

        if (!solicitud) {
            return;
        }

        folioDetalle = folio;

        mostrarDetalle(solicitud);

        obtenerElemento("detalle-solicitud").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function cerrarDetalle() {
        folioDetalle = null;
        obtenerElemento("detalle-solicitud").hidden = true;
    }

    obtenerElemento("cerrar-detalle").addEventListener(
        "click",
        cerrarDetalle
    );

    obtenerElemento("boton-gestionar-detalle").addEventListener(
        "click",
        () => {
            if (!folioDetalle) {
                return;
            }

            navegar("gestion");

            obtenerElemento("gestion-solicitud").value =
                folioDetalle;

            seleccionarGestion();
        }
    );

    [
        "buscar-solicitudes",
        "filtrar-tipo",
        "filtrar-estado",
        "filtrar-plazo"
    ].forEach(id => {
        const evento =
            id === "buscar-solicitudes" ? "input" : "change";

        obtenerElemento(id).addEventListener(
            evento,
            renderizarSolicitudes
        );
    });


    // ========================================================
    // 8. REGISTRO PRESENCIAL
    // ========================================================

    const motivosPorTipo = {
        Reclamo: [
            "Trato recibido",
            "Tiempo de espera",
            "Problemas de atención",
            "Acceso a prestaciones",
            "Información entregada",
            "Infraestructura",
            "Otro"
        ],
        Consulta: [
            "Horarios de atención",
            "Prestaciones disponibles",
            "Requisitos para atención",
            "Funcionamiento del establecimiento",
            "Otro"
        ],
        Sugerencia: [
            "Mejorar la atención",
            "Mejorar los tiempos de espera",
            "Mejorar la infraestructura",
            "Mejorar la información entregada",
            "Otro"
        ],
        Solicitud: [
            "Solicitud de información",
            "Orientación sobre prestaciones",
            "Gestión administrativa",
            "Otro"
        ],
        Felicitación: [
            "Buen trato del personal",
            "Calidad de la atención",
            "Rapidez de la atención",
            "Apoyo recibido",
            "Otro"
        ]
    };

    function actualizarMotivos() {
        const tipo = obtenerValor("registro-tipo");

        const contenedor = obtenerElemento(
            "registro-contenedor-motivo"
        );

        const selector = obtenerElemento("registro-motivo");

        contenedor.hidden = !tipo;
        selector.disabled = !tipo;
        selector.required = Boolean(tipo);

        selector.replaceChildren();

        const opcionInicial = document.createElement("option");

        opcionInicial.value = "";
        opcionInicial.textContent = "Seleccionar motivo";

        selector.appendChild(opcionInicial);

        (motivosPorTipo[tipo] || []).forEach(motivo => {
            const opcion = document.createElement("option");

            opcion.value = motivo;
            opcion.textContent = motivo;

            selector.appendChild(opcion);
        });

        actualizarOtroMotivo();
    }

    function actualizarOtroMotivo() {
        const esOtro =
            obtenerValor("registro-motivo") === "Otro";

        obtenerElemento(
            "registro-contenedor-otro-motivo"
        ).hidden = !esOtro;

        const campo = obtenerElemento("registro-otro-motivo");

        campo.disabled = !esOtro;
        campo.required = esOtro;

        if (!esOtro) {
            campo.value = "";
        }
    }

    function actualizarRepresentante() {
        const mismaPersona = obtenerElemento(
            "registro-misma-persona"
        ).checked;

        obtenerElemento(
            "registro-datos-representante"
        ).hidden = mismaPersona;

        [
            "registro-nombre",
            "registro-apellido",
            "registro-apellido-materno",
            "registro-rut",
            "registro-relacion-paciente"
        ].forEach(id => {
            obtenerElemento(id).disabled = mismaPersona;
        });

        [
            "registro-nombre",
            "registro-apellido",
            "registro-relacion-paciente"
        ].forEach(id => {
            obtenerElemento(id).required = !mismaPersona;
        });
    }

    obtenerElemento("registro-tipo").addEventListener(
        "change",
        actualizarMotivos
    );

    obtenerElemento("registro-motivo").addEventListener(
        "change",
        actualizarOtroMotivo
    );

    obtenerElemento("registro-misma-persona").addEventListener(
        "change",
        actualizarRepresentante
    );

    obtenerElemento("formulario-presencial").addEventListener(
        "reset",
        () => {
            setTimeout(() => {
                actualizarMotivos();
                actualizarRepresentante();

                obtenerElemento("registro-establecimiento").value =
                    establecimientoActual;

                ocultarMensaje("mensaje-registro");
            }, 0);
        }
    );

    function generarFolio(solicitudes) {
        let folio;

        do {
            folio =
                "OIRS-" +
                Date.now().toString(36).toUpperCase() +
                "-" +
                Math.random()
                    .toString(36)
                    .slice(2, 6)
                    .toUpperCase();
        } while (
            solicitudes.some(
                solicitud => solicitud.folio === folio
            )
        );

        return folio;
    }

    obtenerElemento("formulario-presencial").addEventListener(
        "submit",
        evento => {
            evento.preventDefault();

            ocultarMensaje("mensaje-registro");

            const formulario = evento.currentTarget;

            if (!formulario.reportValidity()) {
                return;
            }

            const correo = obtenerValor("registro-correo");

            const autorizaCorreo = obtenerElemento(
                "registro-autoriza-correo"
            ).checked;

            if (autorizaCorreo && !correo) {
                mostrarMensaje(
                    "mensaje-registro",
                    "Para autorizar comunicaciones por correo, " +
                    "ingresa un correo electrónico o desmarca " +
                    "la autorización.",
                    true
                );
                return;
            }

            const mismaPersona = obtenerElemento(
                "registro-misma-persona"
            ).checked;

            const paciente = {
                nombre: obtenerValor("registro-paciente-nombre"),
                apellidoPaterno: obtenerValor(
                    "registro-paciente-apellido-paterno"
                ),
                apellidoMaterno: obtenerValor(
                    "registro-paciente-apellido-materno"
                ),
                rut: obtenerValor("registro-paciente-rut")
            };

            const solicitante = mismaPersona
                ? {
                    ...paciente,
                    relacionPaciente: "Paciente"
                }
                : {
                    nombre: obtenerValor("registro-nombre"),
                    apellidoPaterno: obtenerValor("registro-apellido"),
                    apellidoMaterno: obtenerValor(
                        "registro-apellido-materno"
                    ),
                    rut: obtenerValor("registro-rut"),
                    relacionPaciente: obtenerValor(
                        "registro-relacion-paciente"
                    )
                };

            const solicitudes = leerDatos(CLAVE_SOLICITUDES);

            const ahora = new Date().toISOString();

            const folio = generarFolio(solicitudes);

            const solicitud = {
                folio,
                tipo: obtenerValor("registro-tipo"),
                establecimiento: establecimientoActual,
                unidad: obtenerValor("registro-unidad"),
                motivo: obtenerValor("registro-motivo"),
                otroMotivo: obtenerValor("registro-otro-motivo"),

                paciente,
                solicitante,
                mismaPersona,

                nombre: solicitante.nombre,
                apellido: [
                    solicitante.apellidoPaterno,
                    solicitante.apellidoMaterno
                ].filter(Boolean).join(" "),

                correo,
                telefono: obtenerValor("registro-telefono"),

                asunto: obtenerValor("registro-asunto"),
                descripcion: obtenerValor("registro-descripcion"),
                peticion: obtenerValor("registro-peticion"),

                autorizaCorreo,

                estado: "Ingresada",
                origen: "Registro presencial",

                fechaRegistro: ahora,
                fechaActualizacion: ahora,

                asignadoA: "",
                respuesta: "",
                fechaCierre: null,
                adjuntos: [],

                historial: [
                    {
                        fecha: ahora,
                        accion: "Solicitud registrada",
                        detalle:
                            "Registro presencial efectuado " +
                            "por funcionario OIRS.",
                        usuario: nombreFuncionario
                    }
                ]
            };

            solicitudes.push(solicitud);

            if (
                !guardarDatos(
                    CLAVE_SOLICITUDES,
                    solicitudes
                )
            ) {
                mostrarMensaje(
                    "mensaje-registro",
                    "No se pudo guardar la solicitud. " +
                    "Revisa el almacenamiento del navegador.",
                    true
                );
                return;
            }

            formulario.reset();

            actualizarMotivos();
            actualizarRepresentante();

            obtenerElemento("registro-establecimiento").value =
                establecimientoActual;

            mostrarMensaje(
                "mensaje-registro",
                `Solicitud registrada correctamente. Folio: ${folio}. ` +
                "Puedes consultarla en Solicitudes OIRS."
            );

            actualizarTodo();
        }
    );


    // ========================================================
    // 9. GESTIÓN DE SOLICITUDES
    // ========================================================

    let folioGestion = null;

    function renderizarSelectorGestion() {
        const selector = obtenerElemento("gestion-solicitud");

        const seleccionado =
            selector.value || folioGestion;

        selector.replaceChildren();

        const opcionInicial = document.createElement("option");

        opcionInicial.value = "";
        opcionInicial.textContent = "Seleccionar solicitud";

        selector.appendChild(opcionInicial);

        ordenarPorFecha(obtenerSolicitudes()).forEach(solicitud => {
            const opcion = document.createElement("option");

            opcion.value = solicitud.folio;

            opcion.textContent =
                `${solicitud.folio} · ` +
                `${solicitud.tipo} · ` +
                `${solicitud.asunto || "Sin asunto"} ` +
                `(${solicitud.estado || "Ingresada"})`;

            selector.appendChild(opcion);
        });

        const existe = obtenerSolicitudes().some(
            solicitud => solicitud.folio === seleccionado
        );

        if (seleccionado && existe) {
            selector.value = seleccionado;

            if (
                folioGestion === seleccionado &&
                !obtenerElemento("gestion-formulario").hidden
            ) {
                seleccionarGestion();
            }
        } else {
            folioGestion = null;

            obtenerElemento("gestion-formulario").hidden = true;
        }
    }

    function seleccionarGestion() {
        ocultarMensaje("mensaje-gestion");

        folioGestion = obtenerValor("gestion-solicitud");

        const solicitud = obtenerSolicitudes().find(
            elemento => elemento.folio === folioGestion
        );

        obtenerElemento("gestion-formulario").hidden =
            !solicitud;

        if (!solicitud) {
            return;
        }

        const resumen = obtenerElemento("gestion-resumen");

        resumen.replaceChildren();

        const datos = [
            ["Folio", solicitud.folio],
            ["Tipo", solicitud.tipo],
            ["Asunto", solicitud.asunto],
            ["Estado actual", solicitud.estado],
            [
                "Ingreso",
                formatearFecha(solicitud.fechaRegistro)
            ],
            ["Asignado a", solicitud.asignadoA],
            ["Motivo", solicitud.motivo],
            ["Petición", solicitud.peticion, true]
        ];

        datos.forEach(([titulo, valor, completo]) => {
            agregarDato(
                resumen,
                titulo,
                valor,
                Boolean(completo)
            );
        });

        const plazo = calcularPlazo(solicitud);

        const detallePlazo = obtenerElemento(
            "gestion-detalle-plazo"
        );

        detallePlazo.replaceChildren();

        agregarDato(
            detallePlazo,
            "Fecha límite",
            plazo.limite
                ? formatearDia(plazo.limite)
                : "No aplica"
        );

        agregarDato(
            detallePlazo,
            "Situación",
            plazo.etiqueta
        );

        const panelPlazo = obtenerElemento(
            "gestion-panel-plazo"
        );

        panelPlazo.classList.toggle(
            "vencido",
            plazo.clave === "Vencida"
        );

        panelPlazo.classList.toggle(
            "alerta",
            plazo.clave === "Próxima a vencer"
        );

        obtenerElemento("gestion-estado").value =
            solicitud.estado || "Ingresada";

        const selectorAsignado = obtenerElemento(
            "gestion-asignado"
        );

        selectorAsignado.value = solicitud.asignadoA || "";

        if (
            selectorAsignado.value !==
            String(solicitud.asignadoA || "")
        ) {
            selectorAsignado.value = "";
        }

        obtenerElemento("gestion-respuesta").value =
            solicitud.respuesta || "";

        obtenerElemento("gestion-observacion").value = "";

        mostrarHistorial(
            "historial-gestion",
            solicitud
        );

        const cerrada = solicitud.estado === "Cerrada";

        obtenerElemento("formulario-gestion")
            .querySelectorAll("select, textarea, button")
            .forEach(elemento => {
                elemento.disabled = cerrada;
            });

        if (cerrada) {
            mostrarMensaje(
                "mensaje-gestion",
                "Esta solicitud está cerrada. " +
                "Puedes consultar sus antecedentes, " +
                "pero no modificarla."
            );
        }
    }

    obtenerElemento("gestion-solicitud").addEventListener(
        "change",
        seleccionarGestion
    );

    obtenerElemento("formulario-gestion").addEventListener(
        "submit",
        evento => {
            evento.preventDefault();

            ocultarMensaje("mensaje-gestion");

            const solicitudes = leerDatos(
                CLAVE_SOLICITUDES
            );

            const indice = solicitudes.findIndex(
                solicitud =>
                    solicitud.folio === folioGestion &&
                    solicitud.establecimiento === establecimientoActual
            );

            if (indice < 0) {
                mostrarMensaje(
                    "mensaje-gestion",
                    "No se encontró la solicitud " +
                    "en este establecimiento.",
                    true
                );
                return;
            }

            const solicitud = solicitudes[indice];

            if (solicitud.estado === "Cerrada") {
                mostrarMensaje(
                    "mensaje-gestion",
                    "No se puede modificar una solicitud cerrada.",
                    true
                );
                return;
            }

            const estado = obtenerValor("gestion-estado");
            const asignado = obtenerValor("gestion-asignado");
            const respuesta = obtenerValor("gestion-respuesta");
            const observacion = obtenerValor("gestion-observacion");

            if (!estado) {
                mostrarMensaje(
                    "mensaje-gestion",
                    "Selecciona un estado.",
                    true
                );
                return;
            }

            if (estado === "Derivada" && !asignado) {
                mostrarMensaje(
                    "mensaje-gestion",
                    "Selecciona el destino de la derivación.",
                    true
                );
                return;
            }

            if (
                ["Respondida", "Cerrada"].includes(estado) &&
                !respuesta
            ) {
                mostrarMensaje(
                    "mensaje-gestion",
                    "Debes registrar una respuesta antes " +
                    "de responder o cerrar la solicitud.",
                    true
                );
                return;
            }

            const cambios = [];

            if (solicitud.estado !== estado) {
                cambios.push(
                    `Estado: ${solicitud.estado || "Ingresada"} → ${estado}`
                );
            }

            if ((solicitud.asignadoA || "") !== asignado) {
                cambios.push(
                    `Asignación: ${asignado || "Sin asignación"}`
                );
            }

            if ((solicitud.respuesta || "") !== respuesta) {
                cambios.push("Respuesta actualizada");
            }

            if (observacion) {
                cambios.push(
                    `Observación: ${observacion}`
                );
            }

            if (!cambios.length) {
                mostrarMensaje(
                    "mensaje-gestion",
                    "No hay cambios que guardar."
                );
                return;
            }

            const ahora = new Date().toISOString();

            solicitud.estado = estado;
            solicitud.asignadoA = asignado;
            solicitud.respuesta = respuesta;
            solicitud.fechaActualizacion = ahora;

            if (estado === "Cerrada") {
                solicitud.fechaCierre = ahora;
            }

            if (
                estado === "Respondida" &&
                !solicitud.fechaRespuesta
            ) {
                solicitud.fechaRespuesta = ahora;
            }

            if (!Array.isArray(solicitud.historial)) {
                solicitud.historial = [];
            }

            solicitud.historial.push({
                fecha: ahora,
                accion: "Gestión actualizada",
                detalle: cambios.join(". "),
                usuario: nombreFuncionario
            });

            if (
                !guardarDatos(
                    CLAVE_SOLICITUDES,
                    solicitudes
                )
            ) {
                mostrarMensaje(
                    "mensaje-gestion",
                    "No se pudieron guardar los cambios.",
                    true
                );
                return;
            }

            actualizarTodo();

            obtenerElemento("gestion-solicitud").value =
                folioGestion;

            seleccionarGestion();

            mostrarMensaje(
                "mensaje-gestion",
                "Gestión guardada correctamente. " +
                "La respuesta queda registrada en este prototipo; " +
                "no se envía ningún correo ni notificación real."
            );
        }
    );


    // ========================================================
    // 10. REPORTES Y ESTADÍSTICAS
    // ========================================================

    function validarRango() {
        const desde = obtenerValor("reporte-fecha-desde");
        const hasta = obtenerValor("reporte-fecha-hasta");

        return !desde || !hasta || desde <= hasta;
    }

    function fechaDentroRango(valorFecha) {
        const desde = obtenerValor("reporte-fecha-desde");
        const hasta = obtenerValor("reporte-fecha-hasta");

        const fecha = fechaInicioDia(valorFecha);

        if (!fecha) {
            return !desde && !hasta;
        }

        const claveFecha = [
            fecha.getFullYear(),
            String(fecha.getMonth() + 1).padStart(2, "0"),
            String(fecha.getDate()).padStart(2, "0")
        ].join("-");

        return (
            (!desde || claveFecha >= desde) &&
            (!hasta || claveFecha <= hasta)
        );
    }

    function solicitudesParaReporte() {
        return obtenerSolicitudes().filter(
            solicitud =>
                fechaDentroRango(solicitud.fechaRegistro)
        );
    }

    function encuestasParaReporte() {
        return obtenerEncuestas().filter(
            encuesta =>
                fechaDentroRango(
                    encuesta.fechaRegistro ||
                    encuesta.fecha ||
                    encuesta.fechaRespuesta
                )
        );
    }

    function mostrarResumen(id, datos) {
        const contenedor = obtenerElemento(id);

        contenedor.replaceChildren();

        datos.forEach(([nombre, cantidad]) => {
            const tarjeta = document.createElement("div");

            tarjeta.className = "oirs-resumen-item";

            const numero = document.createElement("strong");
            numero.textContent = String(cantidad);

            const titulo = document.createElement("span");
            titulo.textContent = nombre;

            tarjeta.append(numero, titulo);
            contenedor.appendChild(tarjeta);
        });
    }

    function renderizarReportes() {
        const solicitudes = solicitudesParaReporte();
        const encuestas = encuestasParaReporte();

        actualizarNumero(
            "reporte-total",
            solicitudes.length
        );

        actualizarNumero(
            "reporte-reclamos",
            solicitudes.filter(
                solicitud => solicitud.tipo === "Reclamo"
            ).length
        );

        actualizarNumero(
            "reporte-encuestas",
            encuestas.length
        );

        const calificaciones = encuestas
            .map(encuesta =>
                Number(encuesta.satisfaccionGeneral)
            )
            .filter(
                numero =>
                    Number.isFinite(numero) &&
                    numero >= 1 &&
                    numero <= 5
            );

        if (calificaciones.length) {
            const suma = calificaciones.reduce(
                (acumulado, numero) => acumulado + numero,
                0
            );

            const promedio = (
                suma / calificaciones.length
            ).toFixed(1).replace(".", ",");

            obtenerElemento("reporte-promedio").textContent =
                `${promedio} / 5`;
        } else {
            obtenerElemento("reporte-promedio").textContent = "—";
        }

        // Solicitudes por tipo

        const tipos = [
            "Reclamo",
            "Consulta",
            "Sugerencia",
            "Solicitud",
            "Felicitación"
        ];

        mostrarResumen(
            "resumen-tipos",
            tipos.map(tipo => [
                tipo,
                solicitudes.filter(
                    solicitud => solicitud.tipo === tipo
                ).length
            ])
        );

        // Solicitudes por estado

        const estados = [
            "Ingresada",
            "En proceso",
            "Derivada",
            "Respondida",
            "Cerrada"
        ];

        mostrarResumen(
            "resumen-estados",
            estados.map(estado => [
                estado,
                solicitudes.filter(
                    solicitud => solicitud.estado === estado
                ).length
            ])
        );

        // Cumplimiento de plazos

        const reclamos = solicitudes.filter(
            solicitud => solicitud.tipo === "Reclamo"
        );

        mostrarResumen("resumen-plazos", [
            [
                "Reclamos pendientes",
                reclamos.filter(
                    solicitud => !esFinalizada(solicitud)
                ).length
            ],
            [
                "En plazo",
                reclamos.filter(
                    solicitud =>
                        calcularPlazo(solicitud).clave === "En plazo"
                ).length
            ],
            [
                "Próximos a vencer",
                reclamos.filter(
                    solicitud =>
                        calcularPlazo(solicitud).clave ===
                        "Próxima a vencer"
                ).length
            ],
            [
                "Vencidos",
                reclamos.filter(
                    solicitud =>
                        calcularPlazo(solicitud).clave === "Vencida"
                ).length
            ],
            [
                "Respondidos / cerrados",
                reclamos.filter(esFinalizada).length
            ]
        ]);

        // Principales motivos de reclamo

        const conteos = new Map();

        reclamos.forEach(solicitud => {
            const motivo =
                solicitud.motivo === "Otro"
                    ? solicitud.otroMotivo || "Otro"
                    : solicitud.motivo || "Sin especificar";

            conteos.set(
                motivo,
                (conteos.get(motivo) || 0) + 1
            );
        });

        const motivosOrdenados = [...conteos.entries()]
            .sort((a, b) => b[1] - a[1]);

        const contenedor = obtenerElemento("reporte-motivos");

        contenedor.replaceChildren();

        if (!motivosOrdenados.length) {
            const mensaje = document.createElement("p");

            mensaje.className = "oirs-ayuda";
            mensaje.textContent =
                "No hay reclamos registrados para este período.";

            contenedor.appendChild(mensaje);
        }

        motivosOrdenados.forEach(([nombre, cantidad]) => {
            const elemento = document.createElement("div");

            elemento.className = "oirs-estadistica-item";

            const encabezado = document.createElement("div");

            encabezado.className =
                "oirs-estadistica-encabezado";

            const titulo = document.createElement("span");
            titulo.textContent = nombre;

            const numero = document.createElement("strong");
            numero.textContent = String(cantidad);

            encabezado.append(titulo, numero);

            const barra = document.createElement("div");
            barra.className = "oirs-barra";

            const relleno = document.createElement("div");
            relleno.className = "oirs-barra-relleno";

            relleno.style.width =
                `${(cantidad / reclamos.length) * 100}%`;

            barra.appendChild(relleno);

            elemento.append(encabezado, barra);
            contenedor.appendChild(elemento);
        });
    }

    [
        "reporte-fecha-desde",
        "reporte-fecha-hasta"
    ].forEach(id => {
        obtenerElemento(id).addEventListener("change", () => {
            if (!validarRango()) {
                obtenerElemento(id).setCustomValidity(
                    "La fecha inicial debe ser anterior " +
                    "o igual a la fecha final."
                );

                obtenerElemento(id).reportValidity();
                return;
            }

            [
                "reporte-fecha-desde",
                "reporte-fecha-hasta"
            ].forEach(campo => {
                obtenerElemento(campo).setCustomValidity("");
            });

            renderizarReportes();
        });
    });

    obtenerElemento("reporte-limpiar-filtros").addEventListener(
        "click",
        () => {
            [
                "reporte-fecha-desde",
                "reporte-fecha-hasta"
            ].forEach(id => {
                obtenerElemento(id).value = "";
                obtenerElemento(id).setCustomValidity("");
            });

            renderizarReportes();
        }
    );


    // ========================================================
    // 11. EXPORTACIÓN CSV
    // ========================================================

    function escaparCampoCSV(valor) {
        const contenido = String(valor ?? "")
            .replace(/"/g, '""')
            .replace(/^[=+\-@]/, "'$&");

        return `"${contenido}"`;
    }

    obtenerElemento("reporte-exportar-csv").addEventListener(
        "click",
        () => {
            if (!validarRango()) {
                alert(
                    "Corrige el rango de fechas antes de exportar."
                );
                return;
            }

            const columnas = [
                "Folio",
                "Tipo",
                "Establecimiento",
                "Unidad",
                "Motivo",
                "Asunto",
                "Estado",
                "Origen",
                "Fecha de ingreso",
                "Fecha de actualización",
                "Fecha límite",
                "Situación del plazo",
                "Asignado a"
            ];

            const filas = solicitudesParaReporte().map(
                solicitud => {
                    const plazo = calcularPlazo(solicitud);

                    return [
                        solicitud.folio,
                        solicitud.tipo,
                        solicitud.establecimiento,
                        solicitud.unidad,
                        solicitud.motivo,
                        solicitud.asunto,
                        solicitud.estado,
                        solicitud.origen,
                        solicitud.fechaRegistro,
                        solicitud.fechaActualizacion,
                        plazo.limite
                            ? [
                                plazo.limite.getFullYear(),
                                String(
                                    plazo.limite.getMonth() + 1
                                ).padStart(2, "0"),
                                String(
                                    plazo.limite.getDate()
                                ).padStart(2, "0")
                            ].join("-")
                            : "",
                        plazo.clave,
                        solicitud.asignadoA
                    ];
                }
            );

            const contenidoCSV =
                "\uFEFF" +
                [columnas, ...filas]
                    .map(fila =>
                        fila.map(escaparCampoCSV).join(";")
                    )
                    .join("\r\n");

            const archivo = new Blob(
                [contenidoCSV],
                {
                    type: "text/csv;charset=utf-8;"
                }
            );

            const url = URL.createObjectURL(archivo);

            const enlace = document.createElement("a");

            enlace.href = url;

            enlace.download =
                "reporte-oirs-" +
                new Date().toISOString().slice(0, 10) +
                ".csv";

            document.body.appendChild(enlace);

            enlace.click();
            enlace.remove();

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
        }
    );


    // ========================================================
    // 12. ACTUALIZACIÓN GENERAL
    // ========================================================

    function actualizarTodo() {
        renderizarInicio();
        renderizarSolicitudes();
        renderizarSelectorGestion();
        renderizarReportes();
    }

    /*
    Si otra pestaña del mismo navegador modifica los datos,
    el panel actualiza sus indicadores.
    */

    window.addEventListener("storage", evento => {
        if (
            [
                CLAVE_SOLICITUDES,
                CLAVE_ENCUESTAS
            ].includes(evento.key)
        ) {
            actualizarTodo();
        }
    });


    // ========================================================
    // 13. INICIALIZACIÓN
    // ========================================================

    actualizarMotivos();
    actualizarRepresentante();
    actualizarTodo();

});
