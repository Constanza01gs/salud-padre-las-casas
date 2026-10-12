
/*
============================================================
OIRS - SOLICITUD CIUDADANA
Departamento de Salud Municipal de Padre Las Casas
============================================================

FUNCIONALIDADES:

1. Selección del tipo de solicitud.
2. Motivos dinámicos para los cinco tipos.
3. Opción "Otro" con descripción personalizada.
4. Datos del paciente y representante.
5. Validación del formulario.
6. Registro de solicitudes de demostración.
7. Generación de folio.
8. Confirmación de registro.
9. Consulta pública del estado.
10. Compatibilidad con el dashboard OIRS.
11. Restablecimiento del formulario.

IMPORTANTE:
Este prototipo utiliza localStorage.
No envía correos ni almacena archivos adjuntos.
Utilizar solamente datos ficticios.
============================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    // ====================================================
    // 1. CONFIGURACIÓN
    // ====================================================

    const CLAVE_SOLICITUDES =
        "plc_oirs_solicitudes_demo_v1";

    const formulario = document.getElementById(
        "formulario-oirs"
    );

    if (!formulario) {
        return;
    }

    const seccionFormulario = document.getElementById(
        "seccion-formulario"
    );

    const seccionConfirmacion = document.getElementById(
        "seccion-confirmacion"
    );

    const mensajeError = document.getElementById(
        "mensaje-error"
    );

    const mismaPersona = document.getElementById(
        "misma-persona"
    );

    const datosRepresentante = document.getElementById(
        "datos-representante"
    );

    const contenedorMotivo = document.getElementById(
        "contenedor-motivo"
    );

    const contenedorOtroMotivo = document.getElementById(
        "contenedor-otro-motivo"
    );

    // Se conserva el ID original para no modificar
    // innecesariamente la estructura del HTML.

    const motivoReclamo = document.getElementById(
        "motivo-reclamo"
    );

    const otroMotivo = document.getElementById(
        "otro-motivo"
    );

    const etiquetaMotivo = document.getElementById(
        "etiqueta-motivo"
    );

    const ayudaMotivo = document.getElementById(
        "ayuda-motivo"
    );

    const botonEnviar = document.getElementById(
        "boton-enviar"
    );

    const formularioConsulta = document.getElementById(
        "formulario-consulta"
    );

    const folioConsulta = document.getElementById(
        "folio-consulta"
    );

    const resultadoConsulta = document.getElementById(
        "resultado-consulta"
    );

    const contenidoConsulta = document.getElementById(
        "consulta-contenido"
    );


    // ====================================================
    // 2. MOTIVOS SEGÚN TIPO DE SOLICITUD
    // ====================================================

    const MOTIVOS_POR_TIPO = {

        "Reclamo": [
            "Trato recibido",
            "Tiempo de espera",
            "Problemas de atención",
            "Acceso a prestaciones",
            "Información entregada",
            "Infraestructura",
            "Otro"
        ],

        "Consulta": [
            "Horarios de atención",
            "Prestaciones disponibles",
            "Requisitos para atención",
            "Funcionamiento del establecimiento",
            "Otro"
        ],

        "Sugerencia": [
            "Mejorar la atención",
            "Mejorar los tiempos de espera",
            "Mejorar la infraestructura",
            "Mejorar la información entregada",
            "Otro"
        ],

        "Solicitud": [
            "Solicitud de información",
            "Orientación sobre prestaciones",
            "Gestión administrativa",
            "Otro"
        ],

        "Felicitación": [
            "Buen trato del personal",
            "Calidad de la atención",
            "Rapidez de la atención",
            "Apoyo recibido",
            "Otro"
        ]

    };


    // ====================================================
    // 3. FUNCIONES AUXILIARES
    // ====================================================

    function obtenerValor(id) {

        const elemento = document.getElementById(id);

        return elemento
            ? elemento.value.trim()
            : "";
    }


    function leerSolicitudes() {

        try {

            const datos = JSON.parse(
                localStorage.getItem(CLAVE_SOLICITUDES) || "[]"
            );

            return Array.isArray(datos)
                ? datos
                : [];

        } catch (error) {

            return [];
        }
    }


    function guardarSolicitudes(solicitudes) {

        try {

            localStorage.setItem(
                CLAVE_SOLICITUDES,
                JSON.stringify(solicitudes)
            );

            return true;

        } catch (error) {

            return false;
        }
    }


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


    function mostrarError(mensaje) {

        mensajeError.textContent = mensaje;
        mensajeError.hidden = false;

        mensajeError.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    function ocultarError() {

        mensajeError.textContent = "";
        mensajeError.hidden = true;
    }


    function crearFolio() {

        const anio = new Date().getFullYear();

        let identificador;

        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {

            identificador = window.crypto.randomUUID()
                .replace(/-/g, "")
                .slice(0, 10)
                .toUpperCase();

        } else {

            identificador =
                Date.now().toString(36).toUpperCase() +
                Math.random().toString(36)
                    .slice(2, 7)
                    .toUpperCase();
        }

        return "OIRS-" + anio + "-" + identificador;
    }


    // ====================================================
    // 4. SELECCIÓN DEL TIPO DE SOLICITUD
    // ====================================================

    function obtenerTipoSeleccionado() {

        const seleccionado = formulario.querySelector(
            'input[name="tipo"]:checked'
        );

        return seleccionado
            ? seleccionado.value
            : "";
    }


    function actualizarTipoSolicitud() {

        const tipo = obtenerTipoSeleccionado();

        const motivos = MOTIVOS_POR_TIPO[tipo] || [];

        const tieneTipoValido = motivos.length > 0;

        // El motivo se muestra para cualquiera
        // de los cinco tipos de solicitud.

        contenedorMotivo.hidden = !tieneTipoValido;

        motivoReclamo.disabled = !tieneTipoValido;
        motivoReclamo.required = tieneTipoValido;

        // Se reconstruyen las opciones cada vez
        // que cambia el tipo seleccionado.

        motivoReclamo.innerHTML = "";

        const opcionInicial = document.createElement(
            "option"
        );

        opcionInicial.value = "";
        opcionInicial.textContent = "Seleccionar motivo";

        motivoReclamo.appendChild(opcionInicial);

        motivos.forEach(function (motivo) {

            const opcion = document.createElement(
                "option"
            );

            opcion.value = motivo;
            opcion.textContent = motivo;

            motivoReclamo.appendChild(opcion);
        });

        // El usuario debe seleccionar un motivo nuevo
        // cuando cambia el tipo de solicitud.

        motivoReclamo.value = "";

        otroMotivo.value = "";

        if (etiquetaMotivo) {
            etiquetaMotivo.textContent =
                "Motivo de la solicitud *";
        }

        if (ayudaMotivo) {

            ayudaMotivo.textContent = tieneTipoValido
                ? "Selecciona el motivo que mejor describa tu " +
                  tipo.toLowerCase() + "."
                : "Las opciones se mostrarán según el tipo " +
                  "de solicitud seleccionado.";
        }

        actualizarOtroMotivo();

        ocultarError();
    }


    function actualizarOtroMotivo() {

        const tipo = obtenerTipoSeleccionado();

        const tipoValido = Object.prototype.hasOwnProperty.call(
            MOTIVOS_POR_TIPO,
            tipo
        );

        const mostrar =
            tipoValido &&
            motivoReclamo.value === "Otro";

        contenedorOtroMotivo.hidden = !mostrar;

        otroMotivo.required = mostrar;
        otroMotivo.disabled = !mostrar;

        if (!mostrar) {
            otroMotivo.value = "";
        }
    }


    formulario.querySelectorAll(
        'input[name="tipo"]'
    ).forEach(function (radio) {

        radio.addEventListener(
            "change",
            actualizarTipoSolicitud
        );
    });


    motivoReclamo.addEventListener(
        "change",
        actualizarOtroMotivo
    );


    // ====================================================
    // 5. PACIENTE Y REPRESENTANTE
    // ====================================================

    const camposRepresentante = [
        "nombre-solicitante",
        "apellido-solicitante",
        "apellido-materno-solicitante",
        "rut-solicitante",
        "relacion-paciente"
    ];


    function actualizarRepresentante() {

        const esMismaPersona = mismaPersona.checked;

        datosRepresentante.hidden = esMismaPersona;

        camposRepresentante.forEach(function (id) {

            const campo = document.getElementById(id);

            campo.disabled = esMismaPersona;

            if (esMismaPersona) {
                campo.value = "";
            }
        });

        document.getElementById(
            "nombre-solicitante"
        ).required = !esMismaPersona;

        document.getElementById(
            "apellido-solicitante"
        ).required = !esMismaPersona;

        document.getElementById(
            "relacion-paciente"
        ).required = !esMismaPersona;

        ocultarError();
    }


    mismaPersona.addEventListener(
        "change",
        actualizarRepresentante
    );


    // ====================================================
    // 6. VALIDACIÓN DEL FORMULARIO
    // ====================================================

    function validarFormulario() {

        ocultarError();

        const tipo = obtenerTipoSeleccionado();

        // Validación del tipo de solicitud.

        if (!tipo || !MOTIVOS_POR_TIPO[tipo]) {

            mostrarError(
                "Selecciona el tipo de solicitud."
            );

            return false;
        }

        // Validación del motivo para los cinco tipos.

        const motivosPermitidos = MOTIVOS_POR_TIPO[tipo];

        if (
            !motivoReclamo.value ||
            !motivosPermitidos.includes(motivoReclamo.value)
        ) {

            mostrarError(
                "Selecciona un motivo válido para la solicitud."
            );

            motivoReclamo.focus();

            return false;
        }

        // El texto adicional es obligatorio
        // únicamente cuando se selecciona "Otro".

        if (
            motivoReclamo.value === "Otro" &&
            !otroMotivo.value.trim()
        ) {

            mostrarError(
                "Especifica el motivo de la solicitud."
            );

            otroMotivo.focus();

            return false;
        }

        // Validaciones HTML del resto del formulario.

        if (!formulario.reportValidity()) {
            return false;
        }

        if (
            !mismaPersona.checked &&
            !obtenerValor("nombre-solicitante")
        ) {

            mostrarError(
                "Ingresa el nombre del representante."
            );

            return false;
        }

        if (
            !mismaPersona.checked &&
            !obtenerValor("apellido-solicitante")
        ) {

            mostrarError(
                "Ingresa el apellido del representante."
            );

            return false;
        }

        if (
            !mismaPersona.checked &&
            !obtenerValor("relacion-paciente")
        ) {

            mostrarError(
                "Selecciona la relación del representante con el paciente."
            );

            return false;
        }

        if (
            !document.getElementById(
                "confirmacion-datos"
            ).checked
        ) {

            mostrarError(
                "Debes confirmar que utilizarás datos ficticios."
            );

            return false;
        }

        return true;
    }


    // ====================================================
    // 7. CONSTRUIR SOLICITUD
    // ====================================================

    function construirSolicitud() {

        const fecha = new Date().toISOString();

        const esMismaPersona = mismaPersona.checked;

        // DATOS DE LA PERSONA AFECTADA

        const paciente = {

            nombre: obtenerValor(
                "paciente-nombre"
            ),

            apellidoPaterno: obtenerValor(
                "paciente-apellido-paterno"
            ),

            apellidoMaterno: obtenerValor(
                "paciente-apellido-materno"
            ),

            rut: obtenerValor(
                "paciente-rut"
            )
        };


        // DATOS DEL SOLICITANTE O REPRESENTANTE

        const solicitante = esMismaPersona
            ? {

                nombre: paciente.nombre,

                apellidoPaterno:
                    paciente.apellidoPaterno,

                apellidoMaterno:
                    paciente.apellidoMaterno,

                rut: paciente.rut,

                relacionPaciente: "Paciente"

            }
            : {

                nombre: obtenerValor(
                    "nombre-solicitante"
                ),

                apellidoPaterno: obtenerValor(
                    "apellido-solicitante"
                ),

                apellidoMaterno: obtenerValor(
                    "apellido-materno-solicitante"
                ),

                rut: obtenerValor(
                    "rut-solicitante"
                ),

                relacionPaciente: obtenerValor(
                    "relacion-paciente"
                )
            };


        // COMPATIBILIDAD CON DASHBOARDS EXISTENTES

        const solicitud = {

            folio: crearFolio(),

            tipo: obtenerTipoSeleccionado(),

            establecimiento: obtenerValor(
                "establecimiento-solicitud"
            ),

            unidad: obtenerValor(
                "unidad-solicitud"
            ),

            // El motivo ahora se registra
            // para los cinco tipos de solicitudes.

            motivo: motivoReclamo.value,

            otroMotivo: motivoReclamo.value === "Otro"
                ? otroMotivo.value.trim()
                : "",

            asunto: obtenerValor(
                "asunto-solicitud"
            ),

            descripcion: obtenerValor(
                "descripcion-solicitud"
            ),

            peticion: obtenerValor(
                "peticion-solicitud"
            ),

            paciente: paciente,

            solicitante: solicitante,

            mismaPersona: esMismaPersona,

            // Campos que utilizan los dashboards actuales.

            nombre: solicitante.nombre,

            apellido: solicitante.apellidoPaterno,

            correo: obtenerValor(
                "correo-solicitante"
            ),

            telefono: obtenerValor(
                "telefono-solicitante"
            ),

            autorizaCorreo: document.getElementById(
                "autoriza-correo"
            ).checked,

            // No se almacenan archivos adjuntos.

            adjuntos: [],

            fechaRegistro: fecha,

            fechaActualizacion: fecha,

            estado: "Ingresada",

            origen: "Formulario web",

            asignadoA: "",

            respuesta: "",

            fechaCierre: null,

            historial: [
                {
                    fecha: fecha,

                    accion: "Solicitud registrada",

                    detalle:
                        "Ingreso desde el formulario web ciudadano.",

                    usuario: "Ciudadano"
                }
            ]
        };

        return solicitud;
    }


    // ====================================================
    // 8. REGISTRAR SOLICITUD
    // ====================================================

    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            if (!validarFormulario()) {
                return;
            }

            botonEnviar.disabled = true;

            const solicitud = construirSolicitud();

            const solicitudes = leerSolicitudes();

            // Evitar folios duplicados.

            while (
                solicitudes.some(
                    item => item.folio === solicitud.folio
                )
            ) {

                solicitud.folio = crearFolio();
            }

            solicitudes.push(solicitud);

            const guardado = guardarSolicitudes(
                solicitudes
            );

            botonEnviar.disabled = false;

            if (!guardado) {

                mostrarError(
                    "No fue posible registrar la solicitud. " +
                    "Comprueba que el navegador permita almacenamiento local."
                );

                return;
            }

            mostrarConfirmacion(solicitud);
        }
    );


    // ====================================================
    // 9. MOSTRAR CONFIRMACIÓN
    // ====================================================

    let ultimoFolio = "";


    function mostrarConfirmacion(solicitud) {

        ultimoFolio = solicitud.folio;

        document.getElementById(
            "folio-generado"
        ).textContent = solicitud.folio;

        document.getElementById(
            "resumen-tipo"
        ).textContent = solicitud.tipo;

        document.getElementById(
            "resumen-establecimiento"
        ).textContent = solicitud.establecimiento;

        document.getElementById(
            "resumen-asunto"
        ).textContent = solicitud.asunto;

        document.getElementById(
            "resumen-fecha"
        ).textContent = formatearFecha(
            solicitud.fechaRegistro
        );

        document.getElementById(
            "resumen-estado"
        ).textContent = solicitud.estado;

        seccionFormulario.hidden = true;

        seccionConfirmacion.hidden = false;

        seccionConfirmacion.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // ====================================================
    // 10. COPIAR FOLIO
    // ====================================================

    document.getElementById(
        "boton-copiar-folio"
    ).addEventListener(
        "click",
        async function () {

            const mensaje = document.getElementById(
                "mensaje-copia"
            );

            try {

                if (!navigator.clipboard) {

                    throw new Error(
                        "Portapapeles no disponible"
                    );
                }

                await navigator.clipboard.writeText(
                    ultimoFolio
                );

                mensaje.textContent =
                    "Folio copiado correctamente.";

            } catch (error) {

                mensaje.textContent =
                    "No fue posible copiar automáticamente. " +
                    "Puedes seleccionar y copiar el folio mostrado.";
            }
        }
    );


    // ====================================================
    // 11. CONSULTAR ESTADO POR FOLIO
    // ====================================================

    function agregarDatoConsulta(
        contenedor,
        etiqueta,
        valor
    ) {

        const parrafo = document.createElement("p");

        const titulo = document.createElement("strong");

        titulo.textContent = etiqueta + ": ";

        const contenido = document.createElement("span");

        contenido.textContent = valor || "—";

        parrafo.appendChild(titulo);
        parrafo.appendChild(contenido);

        contenedor.appendChild(parrafo);
    }


    function consultarEstado(folio) {

        contenidoConsulta.innerHTML = "";

        const solicitudes = leerSolicitudes();

        const solicitud = solicitudes.find(
            item =>
                String(item.folio || "")
                    .trim()
                    .toUpperCase() === folio.trim().toUpperCase()
        );

        resultadoConsulta.hidden = false;

        if (!solicitud) {

            const mensaje = document.createElement("p");

            mensaje.textContent =
                "No se encontró una solicitud con ese folio " +
                "en este navegador.";

            contenidoConsulta.appendChild(mensaje);

            return;
        }

        agregarDatoConsulta(
            contenidoConsulta,
            "Folio",
            solicitud.folio
        );

        agregarDatoConsulta(
            contenidoConsulta,
            "Tipo",
            solicitud.tipo
        );

        agregarDatoConsulta(
            contenidoConsulta,
            "Establecimiento",
            solicitud.establecimiento
        );

        agregarDatoConsulta(
            contenidoConsulta,
            "Fecha de ingreso",
            formatearFecha(solicitud.fechaRegistro)
        );

        // ESTADO ACTUAL

        const parrafoEstado = document.createElement("p");

        const tituloEstado = document.createElement("strong");

        tituloEstado.textContent = "Estado actual: ";

        const estado = document.createElement("span");

        estado.className = "oirs-estado";

        estado.textContent =
            solicitud.estado || "Ingresada";

        if (
            solicitud.estado === "En proceso" ||
            solicitud.estado === "Derivada"
        ) {

            estado.classList.add("proceso");
        }

        if (solicitud.estado === "Respondida") {

            estado.classList.add("respondida");
        }

        if (solicitud.estado === "Cerrada") {

            estado.classList.add("cerrada");
        }

        parrafoEstado.appendChild(tituloEstado);
        parrafoEstado.appendChild(estado);

        contenidoConsulta.appendChild(parrafoEstado);

        // ÚLTIMA ACTUALIZACIÓN

        const historial = Array.isArray(
            solicitud.historial
        )
            ? solicitud.historial
            : [];

        const ultimoMovimiento = historial.length
            ? historial[historial.length - 1]
            : null;

        agregarDatoConsulta(
            contenidoConsulta,
            "Última actualización",
            formatearFecha(
                ultimoMovimiento?.fecha ||
                solicitud.fechaActualizacion ||
                solicitud.fechaRegistro
            )
        );

        // AVISO DE PRIVACIDAD

        const aviso = document.createElement("p");

        aviso.textContent =
            "Por privacidad, esta consulta muestra " +
            "únicamente información general del seguimiento.";

        contenidoConsulta.appendChild(aviso);
    }


    formularioConsulta.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            const folio = folioConsulta.value.trim();

            if (!folio) {
                return;
            }

            consultarEstado(folio);
        }
    );


    // ====================================================
    // 12. CONSULTAR FOLIO RECIÉN GENERADO
    // ====================================================

    document.getElementById(
        "boton-consultar-folio"
    ).addEventListener(
        "click",
        function () {

            seccionConfirmacion.hidden = true;

            seccionFormulario.hidden = false;

            folioConsulta.value = ultimoFolio;

            consultarEstado(ultimoFolio);

            document.getElementById(
                "consulta-estado"
            ).scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    );


    // ====================================================
    // 13. NUEVA SOLICITUD
    // ====================================================

    function reiniciarFormulario() {

        formulario.reset();

        mismaPersona.checked = true;

        actualizarTipoSolicitud();
        actualizarRepresentante();

        ocultarError();

        seccionConfirmacion.hidden = true;

        seccionFormulario.hidden = false;

        resultadoConsulta.hidden = true;

        contenidoConsulta.innerHTML = "";

        folioConsulta.value = "";

        document.getElementById(
            "mensaje-copia"
        ).textContent = "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    document.getElementById(
        "boton-nueva-solicitud"
    ).addEventListener(
        "click",
        reiniciarFormulario
    );


    // ====================================================
    // 14. LIMPIAR FORMULARIO
    // ====================================================

    formulario.addEventListener(
        "reset",
        function () {

            // Esperar a que el navegador restablezca
            // los valores predeterminados.

            requestAnimationFrame(function () {

                mismaPersona.checked = true;

                actualizarTipoSolicitud();
                actualizarRepresentante();

                ocultarError();
            });
        }
    );


    // ====================================================
    // 15. INICIALIZACIÓN
    // ====================================================

    actualizarTipoSolicitud();

    actualizarRepresentante();

});
