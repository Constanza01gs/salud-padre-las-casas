
/*
============================================================
DASHBOARD OIRS DSM
DEPARTAMENTO DE SALUD MUNICIPAL DE PADRE LAS CASAS
============================================================

Prototipo académico frontend.

FUNCIONALIDADES:
1. Validación demostrativa de sesión.
2. Supervisión de solicitudes de toda la red.
3. Indicadores generales.
4. Seguimiento referencial de plazos de reclamos.
5. Consulta, búsqueda y filtros de solicitudes.
6. Detalle e historial de movimientos.
7. Derivaciones y gestión de solicitudes.
8. Estadísticas de solicitudes y encuestas.
9. Filtros de reportes.
10. Exportación CSV sin datos personales.

ALMACENAMIENTO COMPARTIDO:
- plc_oirs_solicitudes_demo_v1
- plc_encuestas_demo_v1
- plc_oirs_sesion_demo_v1

IMPORTANTE:
No existe backend, autenticación real, envío de correos
ni conexión con sistemas institucionales.

Los datos son demostrativos y se guardan en el navegador.
============================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    // ========================================================
    // 1. CONFIGURACIÓN
    // ========================================================

    const CLAVE_SESION = "plc_oirs_sesion_demo_v1";

    const CLAVE_SOLICITUDES =
        "plc_oirs_solicitudes_demo_v1";

    const CLAVE_ENCUESTAS =
        "plc_encuestas_demo_v1";

    const ESTADOS = [
        "Ingresada",
        "En proceso",
        "Derivada",
        "Respondida",
        "Cerrada"
    ];

    const TIPOS = [
        "Reclamo",
        "Consulta",
        "Sugerencia",
        "Solicitud",
        "Felicitación"
    ];

    const SECCIONES = [
        "inicio",
        "solicitudes",
        "derivaciones",
        "reportes"
    ];

    const DIAS_HABILES_RECLAMO = 15;

    const UMBRAL_PROXIMO_VENCIMIENTO = 3;

    const elemento = function (id) {
        return document.getElementById(id);
    };


    // ========================================================
    // 2. VALIDACIÓN DE SESIÓN
    // ========================================================

    function obtenerSesion() {

        try {

            const contenido = sessionStorage.getItem(
                CLAVE_SESION
            );

            return contenido
                ? JSON.parse(contenido)
                : null;

        } catch (error) {

            console.error(
                "No fue posible leer la sesión:",
                error
            );

            return null;
        }
    }

    const sesion = obtenerSesion();

    /*
    Se acepta el rol DSM del prototipo.

    Si el login utiliza otro identificador para este rol,
    debe unificarse en la revisión de accesos.
    */

    const ROLES_DSM = [
        "OIRS_DSM",
        "DSM",
        "ADMIN_DSM"
    ];

    if (
        !sesion ||
        !ROLES_DSM.includes(sesion.rol)
    ) {

        window.location.replace("login.html");
        return;
    }

    const nombreFuncionario =
        sesion.nombre ||
        sesion.nombreCompleto ||
        sesion.usuario ||
        "Funcionario OIRS DSM";

    elemento("nombre-funcionario").textContent =
        nombreFuncionario;

    elemento("cerrar-sesion").addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(CLAVE_SESION);

            window.location.replace("login.html");
        }
    );


    // ========================================================
    // 3. ALMACENAMIENTO
    // ========================================================

    function leerArreglo(clave) {

        try {

            const contenido = localStorage.getItem(clave);

            if (contenido === null) {
                return [];
            }

            const registros = JSON.parse(contenido);

            if (!Array.isArray(registros)) {

                throw new Error(
                    "Los datos almacenados no son un arreglo."
                );
            }

            return registros;

        } catch (error) {

            console.error(
                `Error al leer ${clave}:`,
                error
            );

            return [];
        }
    }

    /*
    La escritura utiliza una lectura estricta.

    Si los datos están dañados, no se sobrescriben
    con una lista vacía.
    */

    function leerSolicitudesParaGuardar() {

        const contenido = localStorage.getItem(
            CLAVE_SOLICITUDES
        );

        if (contenido === null) {
            return [];
        }

        const solicitudes = JSON.parse(contenido);

        if (!Array.isArray(solicitudes)) {

            throw new Error(
                "El almacenamiento de solicitudes es inválido."
            );
        }

        return solicitudes;
    }

    function guardarSolicitudes(solicitudes) {

        localStorage.setItem(
            CLAVE_SOLICITUDES,
            JSON.stringify(solicitudes)
        );
    }

    function obtenerSolicitudes() {

        return leerArreglo(CLAVE_SOLICITUDES).filter(
            solicitud =>
                solicitud &&
                typeof solicitud === "object"
        );
    }

    function obtenerEncuestas() {

        return leerArreglo(CLAVE_ENCUESTAS).filter(
            encuesta =>
                encuesta &&
                typeof encuesta === "object"
        );
    }


    // ========================================================
    // 4. FUNCIONES GENERALES
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

    function valorCampo(id) {

        return String(
            elemento(id)?.value || ""
        ).trim();
    }

    function actualizarNumero(id, valor) {

        const destino = elemento(id);

        if (destino) {
            destino.textContent = String(valor);
        }
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

    function inicioDia(valor) {

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

    function claveDia(valor) {

        const fecha = inicioDia(valor);

        if (!fecha) {
            return "";
        }

        return [
            fecha.getFullYear(),
            String(
                fecha.getMonth() + 1
            ).padStart(2, "0"),
            String(
                fecha.getDate()
            ).padStart(2, "0")
        ].join("-");
    }

    function ordenarSolicitudes(solicitudes) {

        return [...solicitudes].sort(function (a, b) {

            const fechaA =
                fechaValida(a.fechaRegistro)?.getTime() || 0;

            const fechaB =
                fechaValida(b.fechaRegistro)?.getTime() || 0;

            return fechaB - fechaA;
        });
    }

    function esFinalizada(solicitud) {

        return [
            "Respondida",
            "Cerrada"
        ].includes(solicitud.estado);
    }

    function mostrarMensaje(id, mensaje, esError = false) {

        const contenedor = elemento(id);

        if (!contenedor) {
            return;
        }

        contenedor.textContent = mensaje;

        contenedor.classList.toggle(
            "error",
            esError
        );

        contenedor.hidden = false;
    }

    function ocultarMensaje(id) {

        const contenedor = elemento(id);

        if (!contenedor) {
            return;
        }

        contenedor.textContent = "";
        contenedor.classList.remove("error");
        contenedor.hidden = true;
    }


    // ========================================================
    // 5. CÁLCULO REFERENCIAL DE PLAZOS
    // ========================================================

    /*
    Referencia académica:
    15 días hábiles para reclamos.

    Se excluyen sábados y domingos.
    No se descuentan feriados chilenos.

    Este cálculo no reemplaza la normativa
    ni el seguimiento administrativo oficial.
    */

    function esDiaHabil(fecha) {

        const dia = fecha.getDay();

        return dia !== 0 && dia !== 6;
    }

    function sumarDiasHabiles(fechaInicial, cantidad) {

        const fecha = inicioDia(fechaInicial);

        if (!fecha) {
            return null;
        }

        let contador = 0;

        while (contador < cantidad) {

            fecha.setDate(
                fecha.getDate() + 1
            );

            if (esDiaHabil(fecha)) {
                contador++;
            }
        }

        return fecha;
    }

    function contarDiasHabiles(desde, hasta) {

        if (!desde || !hasta) {
            return 0;
        }

        const fecha = new Date(desde);

        let contador = 0;

        while (fecha < hasta) {

            fecha.setDate(
                fecha.getDate() + 1
            );

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

        const limite = sumarDiasHabiles(
            solicitud.fechaRegistro,
            DIAS_HABILES_RECLAMO
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

        const hoy = inicioDia(new Date());

        if (hoy > limite) {

            return {
                clave: "Vencida",
                etiqueta: "Vencida",
                clase: "vencida",
                limite
            };
        }

        const diasRestantes = contarDiasHabiles(
            hoy,
            limite
        );

        if (
            diasRestantes <=
            UMBRAL_PROXIMO_VENCIMIENTO
        ) {

            return {
                clave: "Próxima a vencer",
                etiqueta:
                    `${diasRestantes} día(s) hábil(es)`,
                clase: "proxima",
                limite
            };
        }

        return {
            clave: "En plazo",
            etiqueta:
                `${diasRestantes} día(s) hábil(es)`,
            clase: "en-plazo",
            limite
        };
    }


    // ========================================================
    // 6. COMPONENTES DE TABLAS
    // ========================================================

    function crearCelda(fila, contenido = "") {

        const celda = document.createElement("td");

        celda.textContent = texto(contenido);

        fila.appendChild(celda);

        return celda;
    }

    function crearEtiqueta(
        celda,
        contenido,
        claseBase,
        claseEstado
    ) {

        const etiqueta = document.createElement("span");

        etiqueta.className =
            `${claseBase} ${claseEstado}`;

        etiqueta.textContent = contenido;

        celda.appendChild(etiqueta);
    }

    function claseEstado(estado) {

        const clases = {
            "En proceso": "proceso",
            "Derivada": "derivada",
            "Respondida": "respondida",
            "Cerrada": "cerrada"
        };

        return clases[estado] || "";
    }

    function agregarEstado(fila, solicitud) {

        const celda = crearCelda(fila, "");

        celda.textContent = "";

        crearEtiqueta(
            celda,
            solicitud.estado || "Ingresada",
            "dsm-estado",
            claseEstado(solicitud.estado)
        );
    }

    function agregarPlazo(fila, solicitud) {

        const celda = crearCelda(fila, "");

        celda.textContent = "";

        const plazo = calcularPlazo(solicitud);

        crearEtiqueta(
            celda,
            plazo.etiqueta,
            "dsm-plazo",
            plazo.clase
        );
    }

    function tablaVacia(id, columnas, mensaje) {

        const tabla = elemento(id);

        const fila = document.createElement("tr");

        const celda = document.createElement("td");

        celda.colSpan = columnas;
        celda.textContent = mensaje;

        fila.appendChild(celda);
        tabla.appendChild(fila);
    }

    function crearBoton(
        textoBoton,
        accion,
        secundario = true
    ) {

        const boton = document.createElement("button");

        boton.type = "button";

        boton.className = secundario
            ? "dsm-boton secundario"
            : "dsm-boton";

        boton.textContent = textoBoton;

        boton.addEventListener(
            "click",
            accion
        );

        return boton;
    }


    // ========================================================
    // 7. COMPONENTES DE DETALLE E HISTORIAL
    // ========================================================

    function agregarDato(
        contenedor,
        titulo,
        contenido,
        completo = false
    ) {

        const bloque = document.createElement("div");

        bloque.className = completo
            ? "dsm-dato completo"
            : "dsm-dato";

        const etiqueta = document.createElement("strong");

        etiqueta.textContent = titulo;

        const valor = document.createElement("span");

        valor.textContent = texto(contenido);

        bloque.append(etiqueta, valor);

        contenedor.appendChild(bloque);
    }

    function nombreCompleto(persona) {

        if (!persona) {
            return "";
        }

        return [
            persona.nombre,
            persona.apellidoPaterno,
            persona.apellidoMaterno
        ].filter(Boolean).join(" ");
    }

    function mostrarDatosSolicitud(id, solicitud) {

        const contenedor = elemento(id);

        contenedor.replaceChildren();

        const plazo = calcularPlazo(solicitud);

        const nombrePaciente =
            nombreCompleto(solicitud.paciente) ||
            [
                solicitud.nombre,
                solicitud.apellido
            ].filter(Boolean).join(" ");

        const nombreSolicitante =
            nombreCompleto(solicitud.solicitante) ||
            [
                solicitud.nombre,
                solicitud.apellido
            ].filter(Boolean).join(" ");

        const datos = [
            ["Folio", solicitud.folio],
            ["Tipo", solicitud.tipo],
            ["Estado", solicitud.estado],
            ["Establecimiento", solicitud.establecimiento],
            ["Unidad", solicitud.unidad],
            ["Origen", solicitud.origen],
            [
                "Fecha de ingreso",
                formatearFecha(solicitud.fechaRegistro)
            ],
            [
                "Última actualización",
                formatearFecha(
                    solicitud.fechaActualizacion ||
                    solicitud.fechaRegistro
                )
            ],
            ["Motivo", solicitud.motivo],
            ["Otro motivo", solicitud.otroMotivo],
            ["Asignado a", solicitud.asignadoA],
            [
                "Fecha límite referencial",
                plazo.limite
                    ? formatearDia(plazo.limite)
                    : "No aplica"
            ],
            ["Situación del plazo", plazo.etiqueta],
            ["Persona afectada", nombrePaciente],
            [
                "RUT de persona afectada",
                solicitud.paciente?.rut
            ],
            ["Solicitante", nombreSolicitante],
            [
                "Relación con el paciente",
                solicitud.solicitante?.relacionPaciente
            ],
            ["Correo", solicitud.correo],
            ["Teléfono", solicitud.telefono],
            ["Asunto", solicitud.asunto, true],
            ["Descripción", solicitud.descripcion, true],
            ["Petición", solicitud.peticion, true],
            ["Respuesta registrada", solicitud.respuesta, true]
        ];

        datos.forEach(function (dato) {

            agregarDato(
                contenedor,
                dato[0],
                dato[1],
                Boolean(dato[2])
            );
        });
    }

    function mostrarHistorial(id, solicitud) {

        const lista = elemento(id);

        lista.replaceChildren();

        const movimientos =
            Array.isArray(solicitud.historial)
                ? solicitud.historial
                : [];

        if (!movimientos.length) {

            const item = document.createElement("li");

            item.textContent =
                "No hay movimientos registrados.";

            lista.appendChild(item);

            return;
        }

        movimientos.forEach(function (movimiento) {

            const item = document.createElement("li");

            const accion = document.createElement("strong");

            accion.textContent = texto(movimiento.accion);

            const detalle = document.createElement("p");

            detalle.textContent = texto(movimiento.detalle);

            const informacion = document.createElement("small");

            informacion.textContent =
                `${formatearFecha(movimiento.fecha)} · ` +
                `${texto(movimiento.usuario)}`;

            item.append(
                accion,
                detalle,
                informacion
            );

            lista.appendChild(item);
        });
    }


    // ========================================================
    // 8. NAVEGACIÓN DEL DASHBOARD
    // ========================================================

    function navegar(seccion) {

        if (!SECCIONES.includes(seccion)) {
            return;
        }

        SECCIONES.forEach(function (nombre) {

            elemento(`seccion-${nombre}`).hidden =
                nombre !== seccion;
        });

        document
            .querySelectorAll("[data-seccion]")
            .forEach(function (boton) {

                const activo =
                    boton.dataset.seccion === seccion;

                boton.classList.toggle(
                    "activo",
                    activo
                );

                if (activo) {

                    boton.setAttribute(
                        "aria-current",
                        "page"
                    );

                } else {

                    boton.removeAttribute(
                        "aria-current"
                    );
                }
            });

        if (seccion === "derivaciones") {
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
        .forEach(function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    navegar(
                        boton.dataset.seccion ||
                        boton.dataset.ir
                    );
                }
            );
        });


    // ========================================================
    // 9. INDICADORES DEL PANEL PRINCIPAL
    // ========================================================

    function renderizarInicio() {

        const solicitudes = obtenerSolicitudes();

        actualizarNumero(
            "indicador-total",
            solicitudes.length
        );

        actualizarNumero(
            "indicador-ingresadas",
            solicitudes.filter(
                solicitud =>
                    (solicitud.estado || "Ingresada") ===
                    "Ingresada"
            ).length
        );

        actualizarNumero(
            "indicador-proceso",
            solicitudes.filter(
                solicitud =>
                    [
                        "En proceso",
                        "Derivada"
                    ].includes(solicitud.estado)
            ).length
        );

        actualizarNumero(
            "indicador-finalizadas",
            solicitudes.filter(esFinalizada).length
        );

        const reclamosPendientes =
            solicitudes.filter(
                solicitud =>
                    solicitud.tipo === "Reclamo" &&
                    !esFinalizada(solicitud)
            );

        actualizarNumero(
            "indicador-reclamos-pendientes",
            reclamosPendientes.length
        );

        actualizarNumero(
            "indicador-en-plazo",
            reclamosPendientes.filter(
                solicitud =>
                    calcularPlazo(solicitud).clave ===
                    "En plazo"
            ).length
        );

        actualizarNumero(
            "indicador-proximas-vencer",
            reclamosPendientes.filter(
                solicitud =>
                    calcularPlazo(solicitud).clave ===
                    "Próxima a vencer"
            ).length
        );

        actualizarNumero(
            "indicador-vencidas",
            reclamosPendientes.filter(
                solicitud =>
                    calcularPlazo(solicitud).clave ===
                    "Vencida"
            ).length
        );

        renderizarPrioritarias(reclamosPendientes);

        renderizarRecientes(solicitudes);
    }


    // ========================================================
    // 10. RECLAMOS PRIORITARIOS
    // ========================================================

    function renderizarPrioritarias(reclamos) {

        const tabla = elemento("tabla-prioritarias");

        tabla.replaceChildren();

        const prioritarias = reclamos
            .filter(
                solicitud =>
                    [
                        "Próxima a vencer",
                        "Vencida"
                    ].includes(
                        calcularPlazo(solicitud).clave
                    )
            )
            .sort(function (a, b) {

                const fechaA =
                    calcularPlazo(a).limite?.getTime() || 0;

                const fechaB =
                    calcularPlazo(b).limite?.getTime() || 0;

                return fechaA - fechaB;
            })
            .slice(0, 10);

        if (!prioritarias.length) {

            tablaVacia(
                "tabla-prioritarias",
                6,
                "No hay reclamos próximos a vencer o vencidos."
            );

            return;
        }

        prioritarias.forEach(function (solicitud) {

            const fila = document.createElement("tr");

            crearCelda(fila, solicitud.folio);

            crearCelda(
                fila,
                solicitud.establecimiento
            );

            crearCelda(fila, solicitud.asunto);

            crearCelda(
                fila,
                formatearDia(
                    calcularPlazo(solicitud).limite
                )
            );

            agregarPlazo(fila, solicitud);

            const celdaAccion = crearCelda(fila, "");

            celdaAccion.textContent = "";

            celdaAccion.appendChild(
                crearBoton(
                    "Seguimiento",
                    function () {
                        irASeguimiento(solicitud.folio);
                    }
                )
            );

            tabla.appendChild(fila);
        });
    }


    // ========================================================
    // 11. SOLICITUDES RECIENTES
    // ========================================================

    function renderizarRecientes(solicitudes) {

        const tabla = elemento("tabla-recientes");

        tabla.replaceChildren();

        const recientes =
            ordenarSolicitudes(solicitudes).slice(0, 6);

        if (!recientes.length) {

            tablaVacia(
                "tabla-recientes",
                5,
                "No existen solicitudes registradas en la red."
            );

            return;
        }

        recientes.forEach(function (solicitud) {

            const fila = document.createElement("tr");

            crearCelda(fila, solicitud.folio);

            crearCelda(
                fila,
                solicitud.establecimiento
            );

            crearCelda(fila, solicitud.tipo);

            agregarEstado(fila, solicitud);

            crearCelda(
                fila,
                formatearFecha(solicitud.fechaRegistro)
            );

            tabla.appendChild(fila);
        });
    }


    // ========================================================
    // 12. ESTABLECIMIENTOS PARA FILTROS
    // ========================================================

    function obtenerEstablecimientos() {

        const nombres = new Set();

        obtenerSolicitudes().forEach(function (solicitud) {

            if (solicitud.establecimiento) {

                nombres.add(
                    String(solicitud.establecimiento).trim()
                );
            }
        });

        obtenerEncuestas().forEach(function (encuesta) {

            if (encuesta.establecimiento) {

                nombres.add(
                    String(encuesta.establecimiento).trim()
                );
            }
        });

        return [...nombres].sort(
            (a, b) =>
                a.localeCompare(b, "es")
        );
    }

    function actualizarSelectorEstablecimientos(id) {

        const selector = elemento(id);

        const seleccionado = selector.value;

        selector.replaceChildren();

        const opcionInicial =
            document.createElement("option");

        opcionInicial.value = "";

        opcionInicial.textContent =
            "Todos los establecimientos";

        selector.appendChild(opcionInicial);

        obtenerEstablecimientos().forEach(
            function (establecimiento) {

                const opcion =
                    document.createElement("option");

                opcion.value = establecimiento;

                opcion.textContent = establecimiento;

                selector.appendChild(opcion);
            }
        );

        if (
            [...selector.options].some(
                opcion => opcion.value === seleccionado
            )
        ) {

            selector.value = seleccionado;
        }
    }


    // ========================================================
    // 13. LISTADO Y FILTROS DE SOLICITUDES
    // ========================================================

    let folioDetalle = null;

    function renderizarSolicitudes() {

        actualizarSelectorEstablecimientos(
            "filtro-establecimiento"
        );

        const busqueda = valorCampo(
            "buscar-solicitudes"
        ).toLocaleLowerCase("es");

        const establecimiento = valorCampo(
            "filtro-establecimiento"
        );

        const tipo = valorCampo("filtro-tipo");

        const estado = valorCampo("filtro-estado");

        const plazo = valorCampo("filtro-plazo");

        const solicitudes = ordenarSolicitudes(
            obtenerSolicitudes()
        ).filter(function (solicitud) {

            const campos = [
                solicitud.folio,
                solicitud.asunto,
                solicitud.establecimiento,
                solicitud.tipo,
                solicitud.motivo
            ];

            const coincideBusqueda =
                !busqueda ||
                campos.some(
                    campo =>
                        String(campo || "")
                            .toLocaleLowerCase("es")
                            .includes(busqueda)
                );

            const coincideEstablecimiento =
                !establecimiento ||
                solicitud.establecimiento ===
                establecimiento;

            const coincideTipo =
                !tipo ||
                solicitud.tipo === tipo;

            const coincideEstado =
                !estado ||
                (solicitud.estado || "Ingresada") === estado;

            const coincidePlazo =
                !plazo ||
                calcularPlazo(solicitud).clave === plazo;

            return (
                coincideBusqueda &&
                coincideEstablecimiento &&
                coincideTipo &&
                coincideEstado &&
                coincidePlazo
            );
        });

        const tabla = elemento("tabla-solicitudes");

        tabla.replaceChildren();

        if (!solicitudes.length) {

            tablaVacia(
                "tabla-solicitudes",
                7,
                "No hay solicitudes que coincidan con los filtros."
            );
        }

        solicitudes.forEach(function (solicitud) {

            const fila = document.createElement("tr");

            crearCelda(fila, solicitud.folio);

            crearCelda(
                fila,
                solicitud.establecimiento
            );

            crearCelda(fila, solicitud.tipo);

            crearCelda(fila, solicitud.asunto);

            agregarEstado(fila, solicitud);

            agregarPlazo(fila, solicitud);

            const celdaAccion = crearCelda(fila, "");

            celdaAccion.textContent = "";

            celdaAccion.appendChild(
                crearBoton(
                    "Ver detalle",
                    function () {
                        abrirDetalle(solicitud.folio);
                    }
                )
            );

            tabla.appendChild(fila);
        });

        if (folioDetalle) {

            const solicitud =
                obtenerSolicitudes().find(
                    item => item.folio === folioDetalle
                );

            if (solicitud) {

                mostrarDetalle(solicitud);

            } else {

                cerrarDetalle();
            }
        }
    }

    [
        "buscar-solicitudes",
        "filtro-establecimiento",
        "filtro-tipo",
        "filtro-estado",
        "filtro-plazo"
    ].forEach(function (id) {

        elemento(id).addEventListener(
            id === "buscar-solicitudes"
                ? "input"
                : "change",
            renderizarSolicitudes
        );
    });


    // ========================================================
    // 14. DETALLE DE SOLICITUD
    // ========================================================

    function mostrarDetalle(solicitud) {

        elemento("detalle-solicitud").hidden = false;

        mostrarDatosSolicitud(
            "detalle-contenido",
            solicitud
        );

        mostrarHistorial(
            "detalle-historial",
            solicitud
        );

        elemento(
            "boton-seguimiento-detalle"
        ).disabled =
            solicitud.estado === "Cerrada";
    }

    function abrirDetalle(folio) {

        const solicitud =
            obtenerSolicitudes().find(
                item => item.folio === folio
            );

        if (!solicitud) {
            return;
        }

        folioDetalle = folio;

        mostrarDetalle(solicitud);

        elemento("detalle-solicitud").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function cerrarDetalle() {

        folioDetalle = null;

        elemento("detalle-solicitud").hidden = true;
    }

    elemento("cerrar-detalle").addEventListener(
        "click",
        cerrarDetalle
    );

    elemento(
        "boton-seguimiento-detalle"
    ).addEventListener(
        "click",
        function () {

            if (folioDetalle) {
                irASeguimiento(folioDetalle);
            }
        }
    );


    // ========================================================
    // 15. SELECTOR DE DERIVACIONES
    // ========================================================

    let folioGestion = null;

    function renderizarSelectorGestion() {

        const selector = elemento("gestion-solicitud");

        const seleccionado =
            selector.value || folioGestion;

        selector.replaceChildren();

        const opcionInicial =
            document.createElement("option");

        opcionInicial.value = "";

        opcionInicial.textContent =
            "Seleccionar solicitud";

        selector.appendChild(opcionInicial);

        ordenarSolicitudes(
            obtenerSolicitudes()
        ).forEach(function (solicitud) {

            const opcion =
                document.createElement("option");

            opcion.value = solicitud.folio;

            opcion.textContent =
                `${solicitud.folio} · ` +
                `${solicitud.establecimiento || "Sin establecimiento"} · ` +
                `${solicitud.tipo} · ` +
                `${solicitud.estado || "Ingresada"}`;

            selector.appendChild(opcion);
        });

        const existe =
            obtenerSolicitudes().some(
                solicitud =>
                    solicitud.folio === seleccionado
            );

        if (seleccionado && existe) {

            selector.value = seleccionado;

        } else {

            folioGestion = null;

            elemento("gestion-contenedor").hidden = true;
        }
    }

    function irASeguimiento(folio) {

        navegar("derivaciones");

        elemento("gestion-solicitud").value = folio;

        seleccionarGestion();

        elemento("seccion-derivaciones").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // ========================================================
    // 16. MOSTRAR GESTIÓN DE SOLICITUD
    // ========================================================

    function seleccionarGestion() {

        ocultarMensaje("mensaje-gestion");

        folioGestion = valorCampo("gestion-solicitud");

        const solicitud =
            obtenerSolicitudes().find(
                item => item.folio === folioGestion
            );

        elemento("gestion-contenedor").hidden =
            !solicitud;

        if (!solicitud) {
            return;
        }

        const resumen = elemento("gestion-resumen");

        resumen.replaceChildren();

        [
            ["Folio", solicitud.folio],
            ["Establecimiento", solicitud.establecimiento],
            ["Tipo", solicitud.tipo],
            ["Estado actual", solicitud.estado || "Ingresada"],
            ["Asignado a", solicitud.asignadoA],
            ["Fecha de ingreso", formatearFecha(solicitud.fechaRegistro)],
            ["Motivo", solicitud.motivo],
            ["Asunto", solicitud.asunto, true],
            ["Petición", solicitud.peticion, true]
        ].forEach(function (dato) {

            agregarDato(
                resumen,
                dato[0],
                dato[1],
                Boolean(dato[2])
            );
        });

        const plazo = calcularPlazo(solicitud);

        const panel = elemento("gestion-panel-plazo");

        panel.hidden = solicitud.tipo !== "Reclamo";

        panel.classList.toggle(
            "alerta",
            plazo.clave === "Próxima a vencer"
        );

        panel.classList.toggle(
            "vencido",
            plazo.clave === "Vencida"
        );

        elemento("gestion-detalle-plazo").textContent =
            `Fecha límite referencial: ` +
            `${formatearDia(plazo.limite)}. ` +
            `Situación: ${plazo.etiqueta}.`;

        elemento("gestion-estado").value =
            solicitud.estado || "Ingresada";

        const selectorDestino =
            elemento("gestion-destino");

        selectorDestino.value =
            solicitud.asignadoA || "";

        if (
            selectorDestino.value !==
            String(solicitud.asignadoA || "")
        ) {
            selectorDestino.value = "";
        }

        elemento("gestion-respuesta").value =
            solicitud.respuesta || "";

        elemento("gestion-observacion").value = "";

        mostrarHistorial(
            "gestion-historial",
            solicitud
        );

        const cerrada =
            solicitud.estado === "Cerrada";

        elemento("formulario-gestion")
            .querySelectorAll(
                "select, textarea, button"
            )
            .forEach(function (control) {

                control.disabled = cerrada;
            });

        if (cerrada) {

            mostrarMensaje(
                "mensaje-gestion",
                "La solicitud está cerrada. " +
                "Sus antecedentes pueden consultarse, " +
                "pero no modificarse."
            );
        }
    }

    elemento("gestion-solicitud").addEventListener(
        "change",
        seleccionarGestion
    );


    // ========================================================
    // 17. GUARDAR DERIVACIÓN O SEGUIMIENTO
    // ========================================================

    elemento("formulario-gestion").addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            ocultarMensaje("mensaje-gestion");

            const estado = valorCampo("gestion-estado");

            const destino = valorCampo("gestion-destino");

            const respuesta = valorCampo("gestion-respuesta");

            const observacion = valorCampo(
                "gestion-observacion"
            );

            if (!ESTADOS.includes(estado)) {

                mostrarMensaje(
                    "mensaje-gestion",
                    "Selecciona un estado válido.",
                    true
                );

                return;
            }

            if (
                estado === "Derivada" &&
                !destino
            ) {

                mostrarMensaje(
                    "mensaje-gestion",
                    "Debes seleccionar una unidad " +
                    "o destinatario para la derivación.",
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
                    "Debes registrar una respuesta " +
                    "antes de responder o cerrar la solicitud.",
                    true
                );

                return;
            }

            try {

                const solicitudes =
                    leerSolicitudesParaGuardar();

                const indice = solicitudes.findIndex(
                    solicitud =>
                        solicitud.folio === folioGestion
                );

                if (indice === -1) {

                    throw new Error(
                        "La solicitud ya no está disponible."
                    );
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

                const cambios = [];

                const estadoAnterior =
                    solicitud.estado || "Ingresada";

                if (estadoAnterior !== estado) {

                    cambios.push(
                        `Estado: ${estadoAnterior} → ${estado}`
                    );
                }

                if (
                    (solicitud.asignadoA || "") !== destino
                ) {

                    cambios.push(
                        `Asignación: ${destino || "Sin asignación"}`
                    );
                }

                if (
                    (solicitud.respuesta || "") !== respuesta
                ) {

                    cambios.push(
                        "Respuesta actualizada"
                    );
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

                const ahora =
                    new Date().toISOString();

                solicitud.estado = estado;

                solicitud.asignadoA = destino;

                solicitud.respuesta = respuesta;

                solicitud.fechaActualizacion = ahora;

                if (
                    estado === "Respondida" &&
                    !solicitud.fechaRespuesta
                ) {

                    solicitud.fechaRespuesta = ahora;
                }

                if (
                    estado === "Cerrada"
                ) {

                    if (!solicitud.fechaRespuesta) {
                        solicitud.fechaRespuesta = ahora;
                    }

                    solicitud.fechaCierre = ahora;
                }

                if (
                    !Array.isArray(solicitud.historial)
                ) {

                    solicitud.historial = [];
                }

                solicitud.historial.push({

                    fecha: ahora,

                    accion: "Seguimiento DSM",

                    detalle: cambios.join(". "),

                    usuario:
                        `${nombreFuncionario} · DSM`
                });

                guardarSolicitudes(solicitudes);

                actualizarTodo();

                elemento("gestion-solicitud").value =
                    folioGestion;

                seleccionarGestion();

                mostrarMensaje(
                    "mensaje-gestion",
                    "Seguimiento guardado correctamente. " +
                    "El movimiento queda registrado " +
                    "en el historial compartido con OIRS. " +
                    "No se envían correos ni notificaciones reales."
                );

            } catch (error) {

                console.error(
                    "Error al guardar seguimiento:",
                    error
                );

                mostrarMensaje(
                    "mensaje-gestion",
                    "No se pudo guardar el seguimiento. " +
                    "Los datos anteriores no se han modificado.",
                    true
                );
            }
        }
    );


    // ========================================================
    // 18. FILTROS DE REPORTES
    // ========================================================

    function validarRango() {

        const desde = valorCampo(
            "reporte-fecha-desde"
        );

        const hasta = valorCampo(
            "reporte-fecha-hasta"
        );

        return (
            !desde ||
            !hasta ||
            desde <= hasta
        );
    }

    function fechaEnRango(valorFecha) {

        const desde = valorCampo(
            "reporte-fecha-desde"
        );

        const hasta = valorCampo(
            "reporte-fecha-hasta"
        );

        const fecha = claveDia(valorFecha);

        if (!fecha) {
            return !desde && !hasta;
        }

        return (
            (!desde || fecha >= desde) &&
            (!hasta || fecha <= hasta)
        );
    }

    function solicitudesDelReporte() {

        const establecimiento = valorCampo(
            "reporte-establecimiento"
        );

        return obtenerSolicitudes().filter(
            function (solicitud) {

                return (
                    (
                        !establecimiento ||
                        solicitud.establecimiento ===
                        establecimiento
                    ) &&
                    fechaEnRango(
                        solicitud.fechaRegistro
                    )
                );
            }
        );
    }

    function encuestasDelReporte() {

        const establecimiento = valorCampo(
            "reporte-establecimiento"
        );

        return obtenerEncuestas().filter(
            function (encuesta) {

                return (
                    (
                        !establecimiento ||
                        encuesta.establecimiento ===
                        establecimiento
                    ) &&
                    fechaEnRango(
                        encuesta.fechaRegistro ||
                        encuesta.fecha ||
                        encuesta.fechaRespuesta
                    )
                );
            }
        );
    }


    // ========================================================
    // 19. COMPONENTES DE REPORTES
    // ========================================================

    function mostrarDesglose(id, datos) {

        const contenedor = elemento(id);

        contenedor.replaceChildren();

        if (!datos.length) {

            const mensaje =
                document.createElement("p");

            mensaje.className = "dsm-ayuda";

            mensaje.textContent =
                "No hay datos disponibles para este período.";

            contenedor.appendChild(mensaje);

            return;
        }

        datos.forEach(function ([nombre, cantidad]) {

            const tarjeta =
                document.createElement("div");

            tarjeta.className =
                "dsm-desglose-item";

            const numero =
                document.createElement("strong");

            numero.textContent = String(cantidad);

            const titulo =
                document.createElement("span");

            titulo.textContent = nombre;

            tarjeta.append(numero, titulo);

            contenedor.appendChild(tarjeta);
        });
    }

    function contarPorCampo(
        registros,
        campo,
        categorias
    ) {

        return categorias.map(function (categoria) {

            return [
                categoria,
                registros.filter(
                    registro =>
                        registro[campo] === categoria
                ).length
            ];
        });
    }


    // ========================================================
    // 20. REPORTES GENERALES
    // ========================================================

    function renderizarReportes() {

        actualizarSelectorEstablecimientos(
            "reporte-establecimiento"
        );

        if (!validarRango()) {

            elemento(
                "reporte-periodo-mensaje"
            ).textContent =
                "La fecha inicial debe ser anterior " +
                "o igual a la fecha final.";

            return;
        }

        elemento(
            "reporte-periodo-mensaje"
        ).textContent = "";

        const solicitudes =
            solicitudesDelReporte();

        const encuestas =
            encuestasDelReporte();

        actualizarNumero(
            "reporte-total",
            solicitudes.length
        );

        const reclamos =
            solicitudes.filter(
                solicitud =>
                    solicitud.tipo === "Reclamo"
            );

        actualizarNumero(
            "reporte-reclamos",
            reclamos.length
        );

        actualizarNumero(
            "reporte-encuestas",
            encuestas.length
        );

        // ----------------------------------------------------
        // SATISFACCIÓN PROMEDIO
        // ----------------------------------------------------

        const calificaciones = encuestas
            .map(
                encuesta =>
                    Number(
                        encuesta.satisfaccionGeneral
                    )
            )
            .filter(
                valor =>
                    Number.isFinite(valor) &&
                    valor >= 1 &&
                    valor <= 5
            );

        if (calificaciones.length) {

            const suma = calificaciones.reduce(
                (acumulado, valor) =>
                    acumulado + valor,
                0
            );

            const promedio =
                suma / calificaciones.length;

            elemento(
                "reporte-promedio"
            ).textContent =
                `${promedio.toFixed(1).replace(".", ",")} / 5`;

        } else {

            elemento(
                "reporte-promedio"
            ).textContent = "—";
        }

        // ----------------------------------------------------
        // SOLICITUDES POR ESTABLECIMIENTO
        // ----------------------------------------------------

        const establecimientos =
            [...new Set(
                solicitudes.map(
                    solicitud =>
                        solicitud.establecimiento ||
                        "Sin establecimiento"
                )
            )].sort(
                (a, b) =>
                    a.localeCompare(b, "es")
            );

        mostrarDesglose(
            "desglose-establecimientos",
            contarPorCampo(
                solicitudes.map(
                    solicitud => ({
                        ...solicitud,
                        establecimiento:
                            solicitud.establecimiento ||
                            "Sin establecimiento"
                    })
                ),
                "establecimiento",
                establecimientos
            )
        );

        // ----------------------------------------------------
        // SOLICITUDES POR TIPO
        // ----------------------------------------------------

        mostrarDesglose(
            "desglose-tipos",
            contarPorCampo(
                solicitudes,
                "tipo",
                TIPOS
            )
        );

        // ----------------------------------------------------
        // SOLICITUDES POR ESTADO
        // ----------------------------------------------------

        mostrarDesglose(
            "desglose-estados",
            ESTADOS.map(function (estado) {

                return [
                    estado,
                    solicitudes.filter(
                        solicitud =>
                            (
                                solicitud.estado ||
                                "Ingresada"
                            ) === estado
                    ).length
                ];
            })
        );

        // ----------------------------------------------------
        // SEGUIMIENTO DE PLAZOS
        // ----------------------------------------------------

        mostrarDesglose(
            "desglose-plazos",
            [
                [
                    "Reclamos pendientes",
                    reclamos.filter(
                        solicitud =>
                            !esFinalizada(solicitud)
                    ).length
                ],
                [
                    "En plazo",
                    reclamos.filter(
                        solicitud =>
                            calcularPlazo(solicitud).clave ===
                            "En plazo"
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
                            calcularPlazo(solicitud).clave ===
                            "Vencida"
                    ).length
                ],
                [
                    "Respondidos / cerrados",
                    reclamos.filter(
                        esFinalizada
                    ).length
                ]
            ]
        );

        // ----------------------------------------------------
        // MOTIVOS FRECUENTES
        // ----------------------------------------------------

        const conteosMotivos = new Map();

        solicitudes.forEach(function (solicitud) {

            const motivo =
                solicitud.motivo === "Otro"
                    ? (
                        solicitud.otroMotivo ||
                        "Otro"
                    )
                    : (
                        solicitud.motivo ||
                        "Sin especificar"
                    );

            conteosMotivos.set(
                motivo,
                (conteosMotivos.get(motivo) || 0) + 1
            );
        });

        const motivosOrdenados =
            [...conteosMotivos.entries()]
                .sort(
                    (a, b) => b[1] - a[1]
                );

        mostrarDesglose(
            "desglose-motivos",
            motivosOrdenados
        );
    }


    // ========================================================
    // 21. EVENTOS DE REPORTES
    // ========================================================

    [
        "reporte-fecha-desde",
        "reporte-fecha-hasta",
        "reporte-establecimiento"
    ].forEach(function (id) {

        elemento(id).addEventListener(
            "change",
            renderizarReportes
        );
    });

    elemento(
        "reporte-limpiar-filtros"
    ).addEventListener(
        "click",
        function () {

            elemento(
                "reporte-fecha-desde"
            ).value = "";

            elemento(
                "reporte-fecha-hasta"
            ).value = "";

            elemento(
                "reporte-establecimiento"
            ).value = "";

            renderizarReportes();
        }
    );


    // ========================================================
    // 22. EXPORTACIÓN CSV
    // ========================================================

    /*
    Se exportan solamente campos de seguimiento.

    No se incluyen:
    - Nombres.
    - RUT.
    - Correos.
    - Teléfonos.
    - Descripciones.
    - Peticiones.
    - Respuestas.
    */

    function escaparCSV(valor) {

        let contenido = String(valor ?? "");

        /*
        Evita que algunos programas de planillas
        interpreten el contenido como una fórmula.
        */

        if (/^[\s]*[=+\-@\t\r\n]/.test(contenido)) {

            contenido = "'" + contenido;
        }

        contenido = contenido.replace(
            /"/g,
            '""'
        );

        return `"${contenido}"`;
    }

    elemento(
        "reporte-exportar-csv"
    ).addEventListener(
        "click",
        function () {

            if (!validarRango()) {

                alert(
                    "Corrige el rango de fechas " +
                    "antes de exportar."
                );

                return;
            }

            const encabezados = [
                "Folio",
                "Establecimiento",
                "Tipo",
                "Motivo",
                "Estado",
                "Fecha de ingreso",
                "Fecha de actualización",
                "Fecha límite referencial",
                "Situación del plazo",
                "Asignado a"
            ];

            const filas = solicitudesDelReporte()
                .map(function (solicitud) {

                    const plazo =
                        calcularPlazo(solicitud);

                    return [
                        solicitud.folio,
                        solicitud.establecimiento,
                        solicitud.tipo,
                        solicitud.motivo,
                        solicitud.estado || "Ingresada",
                        solicitud.fechaRegistro,
                        solicitud.fechaActualizacion,
                        plazo.limite
                            ? claveDia(plazo.limite)
                            : "",
                        plazo.clave,
                        solicitud.asignadoA
                    ];
                });

            const contenido =
                "\uFEFF" +
                [encabezados, ...filas]
                    .map(
                        fila =>
                            fila.map(
                                escaparCSV
                            ).join(";")
                    )
                    .join("\r\n");

            const archivo = new Blob(
                [contenido],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );

            const url =
                URL.createObjectURL(archivo);

            const enlace =
                document.createElement("a");

            enlace.href = url;

            enlace.download =
                "reporte-general-dsm-" +
                claveDia(new Date()) +
                ".csv";

            document.body.appendChild(enlace);

            enlace.click();

            enlace.remove();

            setTimeout(
                function () {

                    URL.revokeObjectURL(url);
                },
                1000
            );
        }
    );


    // ========================================================
    // 23. ACTUALIZACIÓN GENERAL
    // ========================================================

    function actualizarTodo() {

        renderizarInicio();

        renderizarSolicitudes();

        renderizarSelectorGestion();

        renderizarReportes();

        /*
        Si existe una solicitud seleccionada
        para seguimiento, actualizamos sus datos.
        */

        if (folioGestion) {

            const existe =
                obtenerSolicitudes().some(
                    solicitud =>
                        solicitud.folio === folioGestion
                );

            if (existe) {

                elemento("gestion-solicitud").value =
                    folioGestion;

                seleccionarGestion();
            }
        }
    }


    // ========================================================
    // 24. SINCRONIZACIÓN ENTRE PESTAÑAS
    // ========================================================

    /*
    El evento storage permite actualizar este panel
    cuando otra pestaña modifica solicitudes o encuestas
    dentro del mismo almacenamiento del navegador.
    */

    window.addEventListener(
        "storage",
        function (evento) {

            if (
                [
                    CLAVE_SOLICITUDES,
                    CLAVE_ENCUESTAS
                ].includes(evento.key)
            ) {

                actualizarTodo();
            }
        }
    );

    /*
    También se actualiza al volver a la pestaña.
    */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (!document.hidden) {

                actualizarTodo();
            }
        }
    );


    // ========================================================
    // 25. INICIALIZACIÓN
    // ========================================================

    actualizarTodo();

    navegar("inicio");

});
