
/*
============================================================
DASHBOARD DE GESTIÓN DE CONTENIDOS
Departamento de Salud Municipal de Padre Las Casas
============================================================

Prototipo académico con almacenamiento local.

Funcionalidades:
1. Validación de sesión.
2. Administración de noticias.
3. Administración de prestaciones.
4. Administración de programas.
5. Administración de información institucional.
6. Creación y edición de contenidos.
7. Publicación y despublicación.
8. Filtros y búsqueda.
9. Vista previa.
10. Historial de modificaciones.
11. Indicadores y contenidos recientes.
12. Gestión de información de establecimientos.
13. Navegación y cierre de sesión.

============================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    // ====================================================
    // 1. CONFIGURACIÓN
    // ====================================================

    const CLAVE_SESION = "plc_oirs_sesion_demo_v1";
    const CLAVE_CONTENIDOS = "plc_contenidos_demo_v1";
    const CLAVE_ESTABLECIMIENTOS = "plc_establecimientos_info_demo_v1";
    const CLAVE_ESTABLECIMIENTOS_ADMIN =
        "plc_establecimientos_demo_v1";
    const CLAVE_SOLICITUDES = "plc_oirs_solicitudes_demo_v1";

    const CATEGORIAS = {
        noticias: "Noticias",
        prestaciones: "Prestaciones",
        programas: "Programas",
        institucion: "Información institucional"
    };


    // ====================================================
    // 2. VALIDACIÓN DE SESIÓN
    // ====================================================

    let sesion = null;

    try {
        sesion = JSON.parse(
            sessionStorage.getItem(CLAVE_SESION) || "null"
        );
    } catch (error) {
        sesion = null;
    }

    if (!sesion || sesion.rol !== "GESTOR_CONTENIDOS") {
        window.location.replace("login.html");
        return;
    }

    document.getElementById("nombre-gestor").textContent =
        sesion.nombre || "Gestor de contenidos";


    // ====================================================
    // 3. ALMACENAMIENTO LOCAL
    // ====================================================

    function obtenerContenidos() {

        try {
            const datos = JSON.parse(
                localStorage.getItem(CLAVE_CONTENIDOS) || "[]"
            );

            return Array.isArray(datos) ? datos : [];

        } catch (error) {
            return [];
        }
    }


    function guardarContenidos(datos) {

        try {
            localStorage.setItem(
                CLAVE_CONTENIDOS,
                JSON.stringify(datos)
            );

            return true;

        } catch (error) {
            return false;
        }
    }


    function generarId() {

        return "contenido_" +
            Date.now() + "_" +
            Math.random().toString(36).slice(2, 10);
    }


    function fechaActual() {
        return new Date().toISOString();
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


    // ====================================================
    // 4. FUNCIONES DE INTERFAZ
    // ====================================================

    function crearElemento(etiqueta, clase, texto) {

        const elemento = document.createElement(etiqueta);

        if (clase) {
            elemento.className = clase;
        }

        if (texto !== undefined) {
            elemento.textContent = texto;
        }

        return elemento;
    }


    function crearBoton(texto, clase, accion) {

        const boton = crearElemento(
            "button",
            "gc-boton " + clase,
            texto
        );

        boton.type = "button";

        boton.addEventListener("click", accion);

        return boton;
    }


    function mostrarMensaje(categoria, texto, error = false) {

        const elemento = document.getElementById(
            "mensaje-" + categoria
        );

        elemento.textContent = texto;
        elemento.classList.toggle("error", error);
        elemento.hidden = false;
    }


    function ocultarMensaje(categoria) {

        document.getElementById(
            "mensaje-" + categoria
        ).hidden = true;
    }


    // ====================================================
    // 5. CONSTRUCCIÓN DE FORMULARIOS Y TABLAS
    // ====================================================

    function construirCategoria(categoria) {

        const contenedor = document.getElementById(
            "contenedor-" + categoria
        );

        // ------------------------------------------------
        // TARJETA DEL FORMULARIO
        // ------------------------------------------------

        const tarjetaFormulario = crearElemento(
            "div",
            "gc-card"
        );

        const tituloFormulario = crearElemento(
            "h2",
            "",
            "Crear contenido"
        );

        tituloFormulario.id =
            "titulo-formulario-" + categoria;

        tarjetaFormulario.appendChild(tituloFormulario);

        const formulario = crearElemento("form");

        formulario.id = "formulario-" + categoria;

        const campoId = crearElemento("input");

        campoId.type = "hidden";
        campoId.id = "id-" + categoria;

        formulario.appendChild(campoId);

        const grid = crearElemento(
            "div",
            "gc-form-grid"
        );


        // ------------------------------------------------
        // CAMPO: TÍTULO
        // ------------------------------------------------

        const grupoTitulo = crearElemento(
            "div",
            "gc-campo completo"
        );

        const labelTitulo = crearElemento(
            "label",
            "",
            "Título *"
        );

        labelTitulo.htmlFor = "titulo-" + categoria;

        const inputTitulo = crearElemento("input");

        inputTitulo.type = "text";
        inputTitulo.id = "titulo-" + categoria;
        inputTitulo.maxLength = 180;
        inputTitulo.required = true;

        grupoTitulo.appendChild(labelTitulo);
        grupoTitulo.appendChild(inputTitulo);

        grid.appendChild(grupoTitulo);


        // ------------------------------------------------
        // CAMPO: RESUMEN
        // ------------------------------------------------

        const grupoResumen = crearElemento(
            "div",
            "gc-campo completo"
        );

        const labelResumen = crearElemento(
            "label",
            "",
            "Resumen o descripción breve *"
        );

        labelResumen.htmlFor = "resumen-" + categoria;

        const inputResumen = crearElemento("textarea");

        inputResumen.id = "resumen-" + categoria;
        inputResumen.maxLength = 500;
        inputResumen.required = true;

        grupoResumen.appendChild(labelResumen);
        grupoResumen.appendChild(inputResumen);

        grid.appendChild(grupoResumen);


        // ------------------------------------------------
        // CAMPO: CONTENIDO COMPLETO
        // ------------------------------------------------

        const grupoContenido = crearElemento(
            "div",
            "gc-campo completo"
        );

        const labelContenido = crearElemento(
            "label",
            "",
            "Contenido completo *"
        );

        labelContenido.htmlFor = "texto-" + categoria;

        const inputContenido = crearElemento("textarea");

        inputContenido.id = "texto-" + categoria;
        inputContenido.maxLength = 10000;
        inputContenido.required = true;
        inputContenido.style.minHeight = "170px";

        grupoContenido.appendChild(labelContenido);
        grupoContenido.appendChild(inputContenido);

        grid.appendChild(grupoContenido);


        // ------------------------------------------------
        // CAMPO: ESTADO DE PUBLICACIÓN
        // ------------------------------------------------

        const grupoEstado = crearElemento(
            "div",
            "gc-campo"
        );

        const labelEstado = crearElemento(
            "label",
            "",
            "Estado de publicación *"
        );

        labelEstado.htmlFor = "estado-" + categoria;

        const selectEstado = crearElemento("select");

        selectEstado.id = "estado-" + categoria;

        [
            ["borrador", "Borrador"],
            ["publicado", "Publicado"]
        ].forEach(function (opcion) {

            const elemento = crearElemento("option");

            elemento.value = opcion[0];
            elemento.textContent = opcion[1];

            selectEstado.appendChild(elemento);
        });

        grupoEstado.appendChild(labelEstado);
        grupoEstado.appendChild(selectEstado);

        grid.appendChild(grupoEstado);

        formulario.appendChild(grid);


        // ------------------------------------------------
        // BOTONES DEL FORMULARIO
        // ------------------------------------------------

        const acciones = crearElemento(
            "div",
            "gc-acciones"
        );

        const guardar = crearElemento(
            "button",
            "gc-boton",
            "Guardar contenido"
        );

        guardar.type = "submit";

        const cancelar = crearBoton(
            "Cancelar",
            "secundario",
            function () {
                limpiarFormulario(categoria);
                ocultarMensaje(categoria);
            }
        );

        const previa = crearBoton(
            "Vista previa",
            "secundario",
            function () {
                mostrarVistaPreviaFormulario(categoria);
            }
        );

        acciones.appendChild(guardar);
        acciones.appendChild(cancelar);
        acciones.appendChild(previa);

        formulario.appendChild(acciones);


        // ------------------------------------------------
        // MENSAJES DEL FORMULARIO
        // ------------------------------------------------

        const mensaje = crearElemento(
            "div",
            "gc-mensaje"
        );

        mensaje.id = "mensaje-" + categoria;
        mensaje.hidden = true;

        mensaje.setAttribute("role", "status");
        mensaje.setAttribute("aria-live", "polite");

        formulario.appendChild(mensaje);

        formulario.addEventListener(
            "submit",
            function (evento) {
                guardarFormulario(evento, categoria);
            }
        );

        tarjetaFormulario.appendChild(formulario);


        // ------------------------------------------------
        // VISTA PREVIA DEL FORMULARIO
        // ------------------------------------------------

        const panelPrevia = crearElemento(
            "div",
            "gc-previa"
        );

        panelPrevia.id =
            "previa-formulario-" + categoria;

        panelPrevia.hidden = true;

        tarjetaFormulario.appendChild(panelPrevia);

        contenedor.appendChild(tarjetaFormulario);


        // ------------------------------------------------
        // TARJETA DE CONTENIDOS REGISTRADOS
        // ------------------------------------------------

        const tarjetaListado = crearElemento(
            "div",
            "gc-card"
        );

        tarjetaListado.appendChild(
            crearElemento(
                "h2",
                "",
                "Contenidos registrados"
            )
        );


        // ------------------------------------------------
        // FILTROS DE BÚSQUEDA
        // ------------------------------------------------

        const filtros = crearElemento(
            "div",
            "gc-filtros"
        );

        const busqueda = crearElemento("input");

        busqueda.type = "search";
        busqueda.id = "buscar-" + categoria;
        busqueda.placeholder = "Buscar contenido...";

        busqueda.setAttribute(
            "aria-label",
            "Buscar contenidos"
        );

        const filtroEstado = crearElemento("select");

        filtroEstado.id = "filtro-" + categoria;

        [
            ["", "Todos los estados"],
            ["publicado", "Publicados"],
            ["borrador", "Borradores"]
        ].forEach(function (opcion) {

            const elemento = crearElemento("option");

            elemento.value = opcion[0];
            elemento.textContent = opcion[1];

            filtroEstado.appendChild(elemento);
        });

        busqueda.addEventListener(
            "input",
            function () {
                renderizarCategoria(categoria);
            }
        );

        filtroEstado.addEventListener(
            "change",
            function () {
                renderizarCategoria(categoria);
            }
        );

        filtros.appendChild(busqueda);
        filtros.appendChild(filtroEstado);

        tarjetaListado.appendChild(filtros);


        // ------------------------------------------------
        // TABLA DE CONTENIDOS
        // ------------------------------------------------

        const tablaContenedor = crearElemento(
            "div",
            "gc-tabla-contenedor"
        );

        const tabla = crearElemento(
            "table",
            "gc-tabla"
        );

        const cabecera = crearElemento("thead");
        const filaCabecera = crearElemento("tr");

        [
            "Título",
            "Estado",
            "Última actualización",
            "Acciones"
        ].forEach(function (texto) {

            filaCabecera.appendChild(
                crearElemento("th", "", texto)
            );
        });

        cabecera.appendChild(filaCabecera);
        tabla.appendChild(cabecera);

        const cuerpo = crearElemento("tbody");

        cuerpo.id = "tabla-" + categoria;

        tabla.appendChild(cuerpo);
        tablaContenedor.appendChild(tabla);

        tarjetaListado.appendChild(tablaContenedor);


        // ------------------------------------------------
        // DETALLE E HISTORIAL
        // ------------------------------------------------

        const detalle = crearElemento(
            "div",
            "gc-previa"
        );

        detalle.id = "detalle-" + categoria;
        detalle.hidden = true;

        tarjetaListado.appendChild(detalle);

        contenedor.appendChild(tarjetaListado);
    }


    // ====================================================
    // 6. GUARDAR CONTENIDO
    // ====================================================

    function guardarFormulario(evento, categoria) {

        evento.preventDefault();

        ocultarMensaje(categoria);

        const id = document.getElementById(
            "id-" + categoria
        ).value;

        const titulo = document.getElementById(
            "titulo-" + categoria
        ).value.trim();

        const resumen = document.getElementById(
            "resumen-" + categoria
        ).value.trim();

        const texto = document.getElementById(
            "texto-" + categoria
        ).value.trim();

        const estado = document.getElementById(
            "estado-" + categoria
        ).value;

        if (!titulo || !resumen || !texto) {

            mostrarMensaje(
                categoria,
                "Completa todos los campos obligatorios.",
                true
            );

            return;
        }

        if (!["borrador", "publicado"].includes(estado)) {

            mostrarMensaje(
                categoria,
                "Selecciona un estado válido.",
                true
            );

            return;
        }

        const contenidos = obtenerContenidos();
        const ahora = fechaActual();

        // ------------------------------------------------
        // ACTUALIZAR CONTENIDO EXISTENTE
        // ------------------------------------------------

        if (id) {

            const contenido = contenidos.find(
                c => c.id === id &&
                     c.categoria === categoria
            );

            if (!contenido) {

                mostrarMensaje(
                    categoria,
                    "No se encontró el contenido seleccionado.",
                    true
                );

                return;
            }

            const estadoAnterior = contenido.estado;

            contenido.titulo = titulo;
            contenido.resumen = resumen;
            contenido.texto = texto;
            contenido.estado = estado;
            contenido.fechaActualizacion = ahora;

            if (!Array.isArray(contenido.historial)) {
                contenido.historial = [];
            }

            contenido.historial.push({
                fecha: ahora,
                accion: estadoAnterior !== estado
                    ? "Contenido actualizado y estado modificado"
                    : "Contenido actualizado",
                usuario: sesion.nombre || "Gestor de contenidos"
            });

        } else {

            // --------------------------------------------
            // CREAR CONTENIDO
            // --------------------------------------------

            contenidos.push({

                id: generarId(),
                categoria: categoria,
                titulo: titulo,
                resumen: resumen,
                texto: texto,
                estado: estado,

                fechaCreacion: ahora,
                fechaActualizacion: ahora,

                autor: sesion.nombre || "Gestor de contenidos",

                historial: [
                    {
                        fecha: ahora,
                        accion: estado === "publicado"
                            ? "Contenido creado y publicado"
                            : "Borrador creado",
                        usuario: sesion.nombre || "Gestor de contenidos"
                    }
                ]

            });
        }

        if (!guardarContenidos(contenidos)) {

            mostrarMensaje(
                categoria,
                "No fue posible guardar el contenido.",
                true
            );

            return;
        }

        limpiarFormulario(categoria);
        actualizarTodo();

        mostrarMensaje(
            categoria,
            id
                ? "Contenido actualizado correctamente."
                : "Contenido registrado correctamente."
        );
    }


    // ====================================================
    // 7. EDITAR CONTENIDO
    // ====================================================

    function editarContenido(categoria, id) {

        const contenido = obtenerContenidos().find(
            c => c.id === id &&
                 c.categoria === categoria
        );

        if (!contenido) {
            return;
        }

        document.getElementById(
            "id-" + categoria
        ).value = contenido.id;

        document.getElementById(
            "titulo-" + categoria
        ).value = contenido.titulo;

        document.getElementById(
            "resumen-" + categoria
        ).value = contenido.resumen;

        document.getElementById(
            "texto-" + categoria
        ).value = contenido.texto;

        document.getElementById(
            "estado-" + categoria
        ).value = contenido.estado;

        document.getElementById(
            "titulo-formulario-" + categoria
        ).textContent = "Editar contenido";

        ocultarMensaje(categoria);

        document.getElementById(
            "formulario-" + categoria
        ).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // ====================================================
    // 8. LIMPIAR FORMULARIO
    // ====================================================

    function limpiarFormulario(categoria) {

        document.getElementById(
            "formulario-" + categoria
        ).reset();

        document.getElementById(
            "id-" + categoria
        ).value = "";

        document.getElementById(
            "titulo-formulario-" + categoria
        ).textContent = "Crear contenido";

        document.getElementById(
            "previa-formulario-" + categoria
        ).hidden = true;
    }


    // ====================================================
    // 9. PUBLICAR Y DESPUBLICAR
    // ====================================================

    function cambiarPublicacion(categoria, id) {

        const contenidos = obtenerContenidos();

        const contenido = contenidos.find(
            c => c.id === id &&
                 c.categoria === categoria
        );

        if (!contenido) {
            return;
        }

        const publicar = contenido.estado !== "publicado";

        contenido.estado = publicar
            ? "publicado"
            : "borrador";

        contenido.fechaActualizacion = fechaActual();

        if (!Array.isArray(contenido.historial)) {
            contenido.historial = [];
        }

        contenido.historial.push({

            fecha: contenido.fechaActualizacion,

            accion: publicar
                ? "Contenido publicado"
                : "Contenido despublicado",

            usuario: sesion.nombre || "Gestor de contenidos"

        });

        if (!guardarContenidos(contenidos)) {

            mostrarMensaje(
                categoria,
                "No fue posible actualizar la publicación.",
                true
            );

            return;
        }

        actualizarTodo();

        mostrarMensaje(
            categoria,
            publicar
                ? "Contenido publicado correctamente."
                : "Contenido despublicado correctamente."
        );
    }


    // ====================================================
    // 10. VISTA PREVIA
    // ====================================================

    function llenarVistaPrevia(
        panel,
        titulo,
        resumen,
        texto,
        estado
    ) {

        panel.innerHTML = "";

        panel.appendChild(
            crearElemento(
                "h3",
                "",
                titulo || "Sin título"
            )
        );

        panel.appendChild(
            crearElemento(
                "p",
                "",
                resumen || "Sin resumen"
            )
        );

        panel.appendChild(
            crearElemento(
                "p",
                "",
                texto || "Sin contenido"
            )
        );

        panel.appendChild(
            crearElemento(
                "span",
                estado === "publicado"
                    ? "gc-estado publicado"
                    : "gc-estado",
                estado === "publicado"
                    ? "Publicado"
                    : "Borrador"
            )
        );

        panel.hidden = false;
    }


    function mostrarVistaPreviaFormulario(categoria) {

        const titulo = document.getElementById(
            "titulo-" + categoria
        ).value.trim();

        const resumen = document.getElementById(
            "resumen-" + categoria
        ).value.trim();

        const texto = document.getElementById(
            "texto-" + categoria
        ).value.trim();

        const estado = document.getElementById(
            "estado-" + categoria
        ).value;

        const panel = document.getElementById(
            "previa-formulario-" + categoria
        );

        llenarVistaPrevia(
            panel,
            titulo,
            resumen,
            texto,
            estado
        );

        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // ====================================================
    // 11. DETALLE E HISTORIAL DE CONTENIDO
    // ====================================================

    function mostrarDetalle(categoria, id) {

        const contenido = obtenerContenidos().find(
            c => c.id === id &&
                 c.categoria === categoria
        );

        if (!contenido) {
            return;
        }

        const panel = document.getElementById(
            "detalle-" + categoria
        );

        llenarVistaPrevia(
            panel,
            contenido.titulo,
            contenido.resumen,
            contenido.texto,
            contenido.estado
        );

        panel.appendChild(
            crearElemento(
                "small",
                "",
                "Creado: " +
                formatearFecha(contenido.fechaCreacion)
            )
        );

        panel.appendChild(
            crearElemento(
                "small",
                "",
                "Última actualización: " +
                formatearFecha(contenido.fechaActualizacion)
            )
        );

        panel.appendChild(
            crearElemento(
                "h3",
                "",
                "Historial de cambios"
            )
        );

        const lista = crearElemento(
            "ol",
            "gc-historial"
        );

        const historial = Array.isArray(contenido.historial)
            ? contenido.historial
            : [];

        if (historial.length === 0) {

            lista.appendChild(
                crearElemento(
                    "li",
                    "",
                    "Sin movimientos registrados."
                )
            );

        } else {

            historial.forEach(function (movimiento) {

                const item = crearElemento("li");

                item.appendChild(
                    crearElemento(
                        "strong",
                        "",
                        movimiento.accion || "Movimiento"
                    )
                );

                item.appendChild(
                    crearElemento(
                        "small",
                        "",
                        formatearFecha(movimiento.fecha) +
                        " · " +
                        (movimiento.usuario || "Sistema")
                    )
                );

                lista.appendChild(item);
            });
        }

        panel.appendChild(lista);

        const acciones = crearElemento(
            "div",
            "gc-acciones"
        );

        acciones.appendChild(
            crearBoton(
                "Cerrar detalle",
                "secundario",
                function () {
                    panel.hidden = true;
                }
            )
        );

        panel.appendChild(acciones);

        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // ====================================================
    // 12. TABLAS DE CONTENIDOS
    // ====================================================

    function renderizarCategoria(categoria) {

        const tabla = document.getElementById(
            "tabla-" + categoria
        );

        tabla.innerHTML = "";

        const busqueda = document.getElementById(
            "buscar-" + categoria
        ).value.trim().toLowerCase();

        const filtro = document.getElementById(
            "filtro-" + categoria
        ).value;

        const contenidos = obtenerContenidos()
            .filter(function (contenido) {

                const textoBusqueda = [
                    contenido.titulo,
                    contenido.resumen
                ].join(" ").toLowerCase();

                return (
                    contenido.categoria === categoria &&
                    textoBusqueda.includes(busqueda) &&
                    (!filtro || contenido.estado === filtro)
                );
            })
            .sort((a, b) =>
                new Date(b.fechaActualizacion) -
                new Date(a.fechaActualizacion)
            );

        if (contenidos.length === 0) {

            const fila = crearElemento("tr");

            const celda = crearElemento(
                "td",
                "gc-vacio",
                "No hay contenidos para mostrar."
            );

            celda.colSpan = 4;

            fila.appendChild(celda);
            tabla.appendChild(fila);

            return;
        }

        contenidos.forEach(function (contenido) {

            const fila = crearElemento("tr");

            // TÍTULO

            fila.appendChild(
                crearElemento(
                    "td",
                    "",
                    contenido.titulo
                )
            );

            // ESTADO

            const celdaEstado = crearElemento("td");

            celdaEstado.appendChild(
                crearElemento(
                    "span",
                    contenido.estado === "publicado"
                        ? "gc-estado publicado"
                        : "gc-estado",
                    contenido.estado === "publicado"
                        ? "Publicado"
                        : "Borrador"
                )
            );

            fila.appendChild(celdaEstado);

            // FECHA

            fila.appendChild(
                crearElemento(
                    "td",
                    "",
                    formatearFecha(
                        contenido.fechaActualizacion
                    )
                )
            );

            // ACCIONES

            const celdaAcciones = crearElemento("td");

            const acciones = crearElemento(
                "div",
                "gc-acciones"
            );

            acciones.appendChild(
                crearBoton(
                    "Ver",
                    "pequeno secundario",
                    function () {
                        mostrarDetalle(
                            categoria,
                            contenido.id
                        );
                    }
                )
            );

            acciones.appendChild(
                crearBoton(
                    "Editar",
                    "pequeno secundario",
                    function () {
                        editarContenido(
                            categoria,
                            contenido.id
                        );
                    }
                )
            );

            acciones.appendChild(
                crearBoton(
                    contenido.estado === "publicado"
                        ? "Despublicar"
                        : "Publicar",
                    contenido.estado === "publicado"
                        ? "pequeno peligro"
                        : "pequeno",
                    function () {
                        cambiarPublicacion(
                            categoria,
                            contenido.id
                        );
                    }
                )
            );

            celdaAcciones.appendChild(acciones);
            fila.appendChild(celdaAcciones);

            tabla.appendChild(fila);
        });
    }


    // ====================================================
    // 13. INDICADORES
    // ====================================================

    function actualizarIndicadores() {

        const contenidos = obtenerContenidos();

        document.getElementById(
            "indicador-total"
        ).textContent = contenidos.length;

        document.getElementById(
            "indicador-publicados"
        ).textContent = contenidos.filter(
            c => c.estado === "publicado"
        ).length;

        document.getElementById(
            "indicador-borradores"
        ).textContent = contenidos.filter(
            c => c.estado === "borrador"
        ).length;

        document.getElementById(
            "indicador-noticias"
        ).textContent = contenidos.filter(
            c => c.categoria === "noticias" &&
                 c.estado === "publicado"
        ).length;
    }


    // ====================================================
    // 14. CONTENIDOS RECIENTES
    // ====================================================

    function renderizarRecientes() {

        const tabla = document.getElementById(
            "tabla-recientes"
        );

        tabla.innerHTML = "";

        const contenidos = obtenerContenidos()
            .slice()
            .sort((a, b) =>
                new Date(b.fechaActualizacion) -
                new Date(a.fechaActualizacion)
            )
            .slice(0, 5);

        if (contenidos.length === 0) {

            const fila = crearElemento("tr");

            const celda = crearElemento(
                "td",
                "gc-vacio",
                "Todavía no hay contenidos registrados."
            );

            celda.colSpan = 4;

            fila.appendChild(celda);
            tabla.appendChild(fila);

            return;
        }

        contenidos.forEach(function (contenido) {

            const fila = crearElemento("tr");

            fila.appendChild(
                crearElemento(
                    "td",
                    "",
                    contenido.titulo
                )
            );

            fila.appendChild(
                crearElemento(
                    "td",
                    "",
                    CATEGORIAS[contenido.categoria] ||
                    contenido.categoria
                )
            );

            const celdaEstado = crearElemento("td");

            celdaEstado.appendChild(
                crearElemento(
                    "span",
                    contenido.estado === "publicado"
                        ? "gc-estado publicado"
                        : "gc-estado",
                    contenido.estado === "publicado"
                        ? "Publicado"
                        : "Borrador"
                )
            );

            fila.appendChild(celdaEstado);

            fila.appendChild(
                crearElemento(
                    "td",
                    "",
                    formatearFecha(
                        contenido.fechaActualizacion
                    )
                )
            );

            tabla.appendChild(fila);
        });
    }


    // ====================================================
    // 15. ACTUALIZACIÓN GENERAL
    // ====================================================

    function actualizarTodo() {

        actualizarIndicadores();
        renderizarRecientes();

        Object.keys(CATEGORIAS).forEach(function (categoria) {
            renderizarCategoria(categoria);
        });

        renderizarEstablecimientos();
    }


    // ====================================================
    // CONTINÚA EN LA PARTE 3:
    // GESTIÓN DE ESTABLECIMIENTOS, NAVEGACIÓN E INICIO
    // ====================================================

    // ====================================================
    // 15-A. INFORMACIÓN PÚBLICA DE ESTABLECIMIENTOS
    // ====================================================

    /*
    Este perfil administra la información pública de los
    establecimientos de salud.

    Permite:
    - Seleccionar un establecimiento existente.
    - Actualizar su descripción.
    - Actualizar dirección y horario.
    - Actualizar teléfono y correo.
    - Registrar prestaciones asociadas.
    - Visualizar la información antes de guardarla.
    - Consultar el historial de modificaciones.

    No permite crear ni eliminar establecimientos.

    Los datos se guardan en localStorage como parte
    del prototipo académico.
    */


    // ====================================================
    // 16. LECTURA SEGURA DE DATOS
    // ====================================================

    function leerLista(clave) {

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
    // 17. OBTENER ESTABLECIMIENTOS DISPONIBLES
    // ====================================================

    function obtenerNombresEstablecimientos() {

    const establecimientos = leerLista(
        CLAVE_ESTABLECIMIENTOS_ADMIN
    );

    return establecimientos
        .filter(function (item) {

            return (
                item &&
                item.activo !== false &&
                typeof item.nombre === "string" &&
                item.nombre.trim() !== ""
            );
        })
        .map(function (item) {

            return item.nombre.trim();
        })
        .sort(function (a, b) {

            return a.localeCompare(b, "es");
        });
}


    // ====================================================
    // 18. OBTENER FICHAS INFORMATIVAS
    // ====================================================

    function obtenerFichas() {

        return leerLista(CLAVE_ESTABLECIMIENTOS);
    }


    // ====================================================
    // 19. CREAR CAMPOS DEL FORMULARIO
    // ====================================================

    function agregarCampoFicha(
        formulario,
        nombre,
        etiqueta,
        tipo,
        requerido = false
    ) {

        const grupo = crearElemento(
            "div",
            "gc-campo"
        );

        const label = crearElemento(
            "label",
            "",
            etiqueta
        );

        label.htmlFor = "gc-est-" + nombre;

        const control = document.createElement(
            tipo === "textarea"
                ? "textarea"
                : "input"
        );

        if (tipo !== "textarea") {

            control.type = tipo;
        }

        control.id = "gc-est-" + nombre;
        control.name = nombre;
        control.required = requerido;

        control.maxLength =
            tipo === "textarea" ? 1000 : 200;

        grupo.appendChild(label);
        grupo.appendChild(control);

        formulario.appendChild(grupo);

        return control;
    }


    // ====================================================
    // 20. CONSTRUIR GESTIÓN DE ESTABLECIMIENTOS
    // ====================================================

    function construirEstablecimientos() {

        const contenedor = document.getElementById(
            "contenedor-establecimientos"
        );

        if (!contenedor) {
            return;
        }

        contenedor.innerHTML = "";

        // ------------------------------------------------
        // FORMULARIO
        // ------------------------------------------------

        const formulario = crearElemento(
            "form",
            "gc-formulario"
        );

        formulario.id = "gc-form-establecimientos";


        // ------------------------------------------------
        // SELECCIÓN DEL ESTABLECIMIENTO
        // ------------------------------------------------

        const grupoSeleccion = crearElemento(
            "div",
            "gc-campo completo"
        );

        const etiqueta = crearElemento(
            "label",
            "",
            "Establecimiento *"
        );

        etiqueta.htmlFor = "gc-est-nombre";

        const selector = crearElemento("select");

        selector.id = "gc-est-nombre";
        selector.required = true;

        grupoSeleccion.appendChild(etiqueta);
        grupoSeleccion.appendChild(selector);

        formulario.appendChild(grupoSeleccion);


        // ------------------------------------------------
        // DESCRIPCIÓN
        // ------------------------------------------------

        const descripcion = agregarCampoFicha(
            formulario,
            "descripcion",
            "Descripción pública",
            "textarea"
        );

        descripcion.parentElement.classList.add(
            "completo"
        );


        // ------------------------------------------------
        // DIRECCIÓN
        // ------------------------------------------------

        const direccion = agregarCampoFicha(
            formulario,
            "direccion",
            "Dirección",
            "text"
        );


        // ------------------------------------------------
        // HORARIO
        // ------------------------------------------------

        const horario = agregarCampoFicha(
            formulario,
            "horario",
            "Horario de atención",
            "text"
        );


        // ------------------------------------------------
        // TELÉFONO
        // ------------------------------------------------

        const telefono = agregarCampoFicha(
            formulario,
            "telefono",
            "Teléfono de contacto",
            "tel"
        );


        // ------------------------------------------------
        // CORREO
        // ------------------------------------------------

        const correo = agregarCampoFicha(
            formulario,
            "correo",
            "Correo de contacto",
            "email"
        );


        // ------------------------------------------------
        // PRESTACIONES ASOCIADAS
        // ------------------------------------------------

        const prestaciones = agregarCampoFicha(
            formulario,
            "prestaciones",
            "Prestaciones asociadas",
            "textarea"
        );

        prestaciones.parentElement.classList.add(
            "completo"
        );


        // ------------------------------------------------
        // BOTONES
        // ------------------------------------------------

        const acciones = crearElemento(
            "div",
            "gc-acciones completo"
        );

        const guardar = crearElemento(
            "button",
            "gc-boton",
            "Guardar información"
        );

        guardar.type = "submit";

        const vista = crearBoton(
            "Vista previa",
            "secundario",
            function () {

                mostrarVistaFicha();
            }
        );

        acciones.appendChild(guardar);
        acciones.appendChild(vista);

        formulario.appendChild(acciones);


        // ------------------------------------------------
        // MENSAJES
        // ------------------------------------------------

        const mensaje = crearElemento(
            "div",
            "gc-mensaje completo"
        );

        mensaje.id = "gc-est-mensaje";
        mensaje.hidden = true;

        mensaje.setAttribute(
            "role",
            "status"
        );

        formulario.appendChild(mensaje);


        // ------------------------------------------------
        // PANEL DE VISTA PREVIA
        // ------------------------------------------------

        const previa = crearElemento(
            "div",
            "gc-establecimiento-detalle"
        );

        previa.id = "gc-est-previa";
        previa.hidden = true;

        contenedor.appendChild(formulario);
        contenedor.appendChild(previa);


        // ------------------------------------------------
        // HISTORIAL
        // ------------------------------------------------

        const historialTitulo = crearElemento(
            "h3",
            "",
            "Historial de actualizaciones"
        );

        const historial = crearElemento(
            "ol",
            "gc-historial"
        );

        historial.id = "gc-est-historial";

        contenedor.appendChild(historialTitulo);
        contenedor.appendChild(historial);


        // ------------------------------------------------
        // CAMBIO DE ESTABLECIMIENTO
        // ------------------------------------------------

        selector.addEventListener(
            "change",
            cargarFichaSeleccionada
        );


        // ------------------------------------------------
        // GUARDAR INFORMACIÓN
        // ------------------------------------------------

        formulario.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();

                const nombre = selector.value;

                if (
                    !nombre ||
                    !obtenerNombresEstablecimientos().includes(nombre)
                ) {

                    mostrarMensajeFicha(
                        "Selecciona un establecimiento válido.",
                        true
                    );

                    return;
                }

                const datos = {

                    nombre: nombre,

                    descripcion: descripcion.value.trim(),

                    direccion: direccion.value.trim(),

                    horario: horario.value.trim(),

                    telefono: telefono.value.trim(),

                    correo: correo.value.trim(),

                    prestaciones: prestaciones.value.trim()

                };

                const fichas = obtenerFichas();

                const anterior = fichas.find(
                    f => f.nombre === nombre
                );

                const ahora = fechaActual();

                datos.fechaActualizacion = ahora;

                datos.historial =
                    anterior &&
                    Array.isArray(anterior.historial)
                        ? anterior.historial.slice()
                        : [];

                datos.historial.push({

                    fecha: ahora,

                    accion: anterior
                        ? "Información actualizada"
                        : "Ficha informativa creada",

                    usuario: sesion.nombre ||
                        "Gestor de contenidos"

                });

                const indice = fichas.findIndex(
                    f => f.nombre === nombre
                );

                if (indice >= 0) {

                    fichas[indice] = datos;

                } else {

                    fichas.push(datos);
                }

                try {

                    localStorage.setItem(
                        CLAVE_ESTABLECIMIENTOS,
                        JSON.stringify(fichas)
                    );

                    mostrarMensajeFicha(
                        "Información del establecimiento guardada correctamente."
                    );

                    renderizarEstablecimientos(nombre);

                } catch (error) {

                    mostrarMensajeFicha(
                        "No fue posible guardar la información.",
                        true
                    );
                }
            }
        );
    }


    // ====================================================
    // 21. MENSAJES DE ESTABLECIMIENTOS
    // ====================================================

    function mostrarMensajeFicha(
        texto,
        error = false
    ) {

        const mensaje = document.getElementById(
            "gc-est-mensaje"
        );

        if (!mensaje) {
            return;
        }

        mensaje.textContent = texto;

        mensaje.classList.toggle(
            "error",
            error
        );

        mensaje.hidden = false;
    }


    // ====================================================
    // 22. CARGAR INFORMACIÓN DEL ESTABLECIMIENTO
    // ====================================================

    function cargarFichaSeleccionada() {

        const selector = document.getElementById(
            "gc-est-nombre"
        );

        if (!selector) {
            return;
        }

        const ficha = obtenerFichas().find(
            f => f.nombre === selector.value
        ) || {};

        [
            "descripcion",
            "direccion",
            "horario",
            "telefono",
            "correo",
            "prestaciones"
        ].forEach(function (campo) {

            document.getElementById(
                "gc-est-" + campo
            ).value = ficha[campo] || "";
        });

        document.getElementById(
            "gc-est-previa"
        ).hidden = true;


        // ------------------------------------------------
        // HISTORIAL
        // ------------------------------------------------

        const historial = document.getElementById(
            "gc-est-historial"
        );

        historial.innerHTML = "";

        const movimientos = Array.isArray(ficha.historial)
            ? ficha.historial
            : [];

        if (movimientos.length === 0) {

            historial.appendChild(
                crearElemento(
                    "li",
                    "",
                    "Sin actualizaciones registradas."
                )
            );

        } else {

            movimientos
                .slice()
                .reverse()
                .forEach(function (movimiento) {

                    historial.appendChild(
                        crearElemento(
                            "li",
                            "",
                            formatearFecha(
                                movimiento.fecha
                            ) +
                            " — " +
                            (
                                movimiento.accion ||
                                "Actualización"
                            ) +
                            " — " +
                            (
                                movimiento.usuario ||
                                "Gestor"
                            )
                        )
                    );
                });
        }
    }


    // ====================================================
    // 23. VISTA PREVIA DEL ESTABLECIMIENTO
    // ====================================================

    function mostrarVistaFicha() {

        const selector = document.getElementById(
            "gc-est-nombre"
        );

        if (!selector || !selector.value) {

            mostrarMensajeFicha(
                "Selecciona un establecimiento para visualizar su información.",
                true
            );

            return;
        }

        const previa = document.getElementById(
            "gc-est-previa"
        );

        previa.innerHTML = "";

        previa.appendChild(
            crearElemento(
                "h3",
                "",
                selector.value
            )
        );

        const campos = [

            ["Descripción", "descripcion"],

            ["Dirección", "direccion"],

            ["Horario de atención", "horario"],

            ["Teléfono", "telefono"],

            ["Correo", "correo"],

            ["Prestaciones asociadas", "prestaciones"]

        ];

        campos.forEach(function (campo) {

            const parrafo = crearElemento("p");

            const negrita = crearElemento(
                "strong",
                "",
                campo[0] + ": "
            );

            const valor = document.getElementById(
                "gc-est-" + campo[1]
            ).value.trim();

            parrafo.appendChild(negrita);

            parrafo.appendChild(
                document.createTextNode(
                    valor || "Sin información"
                )
            );

            previa.appendChild(parrafo);
        });

        previa.hidden = false;

        previa.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // ====================================================
    // 24. RENDERIZAR ESTABLECIMIENTOS
    // ====================================================

    function renderizarEstablecimientos(
        seleccionPreferida
    ) {

        const selector = document.getElementById(
            "gc-est-nombre"
        );

        if (!selector) {
            return;
        }

        const seleccion =
            seleccionPreferida || selector.value;

        const nombres =
            obtenerNombresEstablecimientos();

        selector.innerHTML = "";

        const opcionInicial = document.createElement(
            "option"
        );

        opcionInicial.value = "";

        opcionInicial.textContent = nombres.length
            ? "Selecciona un establecimiento"
            : "No hay establecimientos registrados en el prototipo";

        selector.appendChild(opcionInicial);

        nombres.forEach(function (nombre) {

            const opcion = document.createElement(
                "option"
            );

            opcion.value = nombre;
            opcion.textContent = nombre;

            selector.appendChild(opcion);
        });

        selector.value = nombres.includes(seleccion)
            ? seleccion
            : "";

        cargarFichaSeleccionada();
    }


    // ====================================================
    // 25. NAVEGACIÓN ENTRE SECCIONES
    // ====================================================

    const secciones = [

        "inicio",
        "noticias",
        "prestaciones",
        "programas",
        "establecimientos",
        "institucion"

    ];


    function mostrarSeccion(nombre) {

        if (!secciones.includes(nombre)) {
            return;
        }

        secciones.forEach(function (seccion) {

            const elemento = document.getElementById(
                "seccion-" + seccion
            );

            if (elemento) {

                elemento.hidden = seccion !== nombre;
            }
        });


        // ------------------------------------------------
        // ACTUALIZAR MENÚ ACTIVO
        // ------------------------------------------------

        document.querySelectorAll(
            ".gc-menu button[data-seccion]"
        ).forEach(function (boton) {

            boton.classList.toggle(
                "activo",
                boton.dataset.seccion === nombre
            );
        });


        // ------------------------------------------------
        // ACTUALIZAR INFORMACIÓN
        // ------------------------------------------------

        actualizarTodo();


        // ------------------------------------------------
        // VOLVER AL INICIO DE LA PÁGINA
        // ------------------------------------------------

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // ====================================================
    // 26. EVENTOS DE NAVEGACIÓN
    // ====================================================

    document.querySelectorAll(
        "[data-seccion], [data-ir]"
    ).forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                mostrarSeccion(
                    boton.dataset.seccion ||
                    boton.dataset.ir
                );
            }
        );
    });


    // ====================================================
    // 27. CERRAR SESIÓN
    // ====================================================

    document.getElementById(
        "cerrar-sesion"
    ).addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                CLAVE_SESION
            );

            window.location.replace(
                "login.html"
            );
        }
    );

    // ====================================================
    // ACTUALIZACIÓN AUTOMÁTICA DE DATOS
    // ====================================================

    window.addEventListener("storage", function (evento) {

        if (
            evento.key === CLAVE_CONTENIDOS ||
            evento.key === CLAVE_ESTABLECIMIENTOS ||
            evento.key === CLAVE_ESTABLECIMIENTOS_ADMIN ||
            evento.key === null
        ) {

            actualizarTodo();

        }

    });


    // ====================================================
    // 28. INICIALIZACIÓN DEL DASHBOARD
    // ====================================================

    /*
    Construir formularios y tablas de:

    - Noticias
    - Prestaciones
    - Programas
    - Información institucional
    */

    Object.keys(CATEGORIAS).forEach(function (categoria) {

        construirCategoria(categoria);
    });


    /*
    Construir el formulario para administrar
    información pública de establecimientos.
    */

    construirEstablecimientos();


    /*
    Cargar los indicadores, contenidos y
    establecimientos almacenados.
    */

    actualizarTodo();


});
