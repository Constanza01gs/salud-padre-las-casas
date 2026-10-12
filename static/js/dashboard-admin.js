
/*
============================================================
DASHBOARD - ADMINISTRADOR GENERAL
Departamento de Salud Municipal de Padre Las Casas
============================================================

Prototipo académico con almacenamiento local.

Funciones:
1. Validación de sesión administrativa.
2. Almacenamiento de usuarios y establecimientos.
3. Inicialización de datos demostrativos.
4. Funciones auxiliares.
5. Indicadores generales.
6. Gestión de usuarios.
7. Gestión de establecimientos.
8. Supervisión de solicitudes OIRS.
9. Configuración del sistema.
10. Navegación y cierre de sesión.

IMPORTANTE:
Este prototipo utiliza localStorage y sessionStorage.
No implementa autenticación ni autorización real.

============================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    // ====================================================
    // 1. CLAVES DE ALMACENAMIENTO
    // ====================================================

    const CLAVE_SESION = "plc_oirs_sesion_demo_v1";

    const CLAVE_SOLICITUDES =
        "plc_oirs_solicitudes_demo_v1";
    
    const CLAVE_ENCUESTAS =
        "plc_encuestas_demo_v1";

    const CLAVE_USUARIOS =
        "plc_usuarios_demo_v1";

    const CLAVE_ESTABLECIMIENTOS =
        "plc_establecimientos_demo_v1";

    const CLAVE_CONFIGURACION =
        "plc_configuracion_demo_v1";


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

    // Solo el perfil Administrador puede acceder
    // a este dashboard demostrativo.

    if (
        !sesion ||
        sesion.rol !== "ADMINISTRADOR"
    ) {

        window.location.replace("login.html");
        return;

    }

    const nombreAdministrador = document.getElementById(
        "nombre-administrador"
    );

    if (nombreAdministrador) {

        nombreAdministrador.textContent =
            sesion.nombre || "Administrador del sistema";

    }


    // ====================================================
    // 3. FUNCIONES DE ALMACENAMIENTO
    // ====================================================

    /*
    Permite leer arreglos almacenados en localStorage.
    Si no existen o están dañados, devuelve un arreglo vacío.
    */

    function leerArreglo(clave) {

        try {

            const datos = JSON.parse(
                localStorage.getItem(clave) || "[]"
            );

            return Array.isArray(datos) ? datos : [];

        } catch (error) {

            console.error(
                "Error al leer los datos:",
                clave,
                error
            );

            return [];

        }

    }


    /*
    Guarda arreglos en localStorage.
    Devuelve true cuando se guardaron correctamente.
    */

    function guardarArreglo(clave, datos) {

        try {

            localStorage.setItem(
                clave,
                JSON.stringify(datos)
            );

            return true;

        } catch (error) {

            console.error(
                "Error al guardar los datos:",
                clave,
                error
            );

            return false;

        }

    }


    // ====================================================
    // 4. FUNCIONES DE CONSULTA
    // ====================================================

    function obtenerUsuarios() {

        return leerArreglo(CLAVE_USUARIOS);

    }


    function obtenerEstablecimientos() {

        return leerArreglo(CLAVE_ESTABLECIMIENTOS);

    }


    function obtenerSolicitudes() {

        return leerArreglo(CLAVE_SOLICITUDES);

    }


    /*
    Genera identificadores únicos para los registros
    demostrativos del sistema.
    */

    function generarId(prefijo) {

        const aleatorio = Math.random()
            .toString(36)
            .slice(2, 10);

        return (
            prefijo +
            "_" +
            Date.now() +
            "_" +
            aleatorio
        );

    }


    // ====================================================
    // 5. DATOS INICIALES DE DEMOSTRACIÓN
    // ====================================================

    /*
    Los datos iniciales solamente se crean cuando
    todavía no existe información almacenada.

    Esto evita reemplazar usuarios o establecimientos
    que hayan sido modificados por el administrador.
    */

    function inicializarDatos() {

        // ------------------------------------------------
        // ESTABLECIMIENTOS INICIALES
        // ------------------------------------------------

        if (
            localStorage.getItem(
                CLAVE_ESTABLECIMIENTOS
            ) === null
        ) {

            const establecimientosIniciales = [

                {
                    id: "establecimiento_demo_1",
                    nombre: "CESFAM Padre Las Casas",
                    tipo: "CESFAM",
                    direccion: "",
                    activo: true
                }

            ];

            guardarArreglo(
                CLAVE_ESTABLECIMIENTOS,
                establecimientosIniciales
            );

        }


        // ------------------------------------------------
        // USUARIOS DEMOSTRATIVOS
        // ------------------------------------------------

        if (
            localStorage.getItem(
                CLAVE_USUARIOS
            ) === null
        ) {

            const usuariosIniciales = [

                {
                    id: "demo_oirs_establecimiento",
                    nombre: "Funcionario OIRS",
                    correo: "oirs.establecimiento@demo.local",
                    rol: "OIRS_ESTABLECIMIENTO",
                    establecimiento: "CESFAM Padre Las Casas",
                    activo: true
                },

                {
                    id: "demo_oirs_dsm",
                    nombre: "Funcionario OIRS DSM",
                    correo: "oirs.dsm@demo.local",
                    rol: "OIRS_DSM",
                    establecimiento:
                        "Departamento de Salud Municipal",
                    activo: true
                },

                {
                    id: "demo_director",
                    nombre: "Director de establecimiento",
                    correo: "director@demo.local",
                    rol: "DIRECTOR",
                    establecimiento: "CESFAM Padre Las Casas",
                    activo: true
                },

                {
                    id: "demo_administrador",
                    nombre: "Administrador del sistema",
                    correo: "administrador@demo.local",
                    rol: "ADMINISTRADOR",
                    establecimiento:
                        "Departamento de Salud Municipal",
                    activo: true
                },

                {
                    id: "demo_gestor_contenidos",
                    nombre: "Gestor de Contenidos",
                    correo: "contenidos@demo.local",
                    rol: "GESTOR_CONTENIDOS",
                    establecimiento:
                        "Departamento de Salud Municipal",
                    activo: true
                }

            ];

            guardarArreglo(
                CLAVE_USUARIOS,
                usuariosIniciales
            );

        }


        // ------------------------------------------------
        // CONFIGURACIÓN INICIAL
        // ------------------------------------------------

        if (
            localStorage.getItem(
                CLAVE_CONFIGURACION
            ) === null
        ) {

            const configuracionInicial = {

                nombre:
                    "Sistema OIRS y Portal Web Institucional",

                prefijo: "OIRS",

                correo: "",

                mensaje:
                    "Bienvenido al sistema de gestión OIRS."

            };

            try {

                localStorage.setItem(
                    CLAVE_CONFIGURACION,
                    JSON.stringify(configuracionInicial)
                );

            } catch (error) {

                console.error(
                    "No fue posible guardar la configuración inicial.",
                    error
                );

            }

        }

    }


    // ====================================================
    // 6. FUNCIONES AUXILIARES
    // ====================================================

    /*
    Formatea las fechas de las solicitudes
    utilizando el formato de Chile.
    */

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


    /*
    Crea una celda para las tablas.
    Se utiliza textContent para mostrar los datos.
    */

    function crearCelda(fila, texto) {

        const celda = document.createElement("td");

        celda.textContent = texto ?? "—";

        fila.appendChild(celda);

        return celda;

    }


    /*
    Crea las etiquetas visuales de estado.
    */

    function crearEstado(texto, clase = "") {

        const estado = document.createElement("span");

        estado.className = "admin-estado";

        if (clase) {

            estado.classList.add(clase);

        }

        estado.textContent = texto;

        return estado;

    }


    /*
    Determina el estilo de una solicitud según su estado.
    */

    function claseEstadoSolicitud(estado) {

        if (
            estado === "En proceso" ||
            estado === "Derivada"
        ) {

            return "proceso";

        }

        if (estado === "Respondida") {

            return "respondida";

        }

        if (estado === "Cerrada") {

            return "cerrada";

        }

        return "ingresada";

    }


    /*
    Crea botones de acción para las tablas.
    */

    function crearBoton(texto, clase, accion) {

        const boton = document.createElement("button");

        boton.type = "button";

        boton.className = "admin-boton pequeno";

        if (clase) {

            boton.classList.add(clase);

        }

        boton.textContent = texto;

        boton.addEventListener(
            "click",
            accion
        );

        return boton;

    }


    /*
    Contenedor para mostrar los botones
    Editar, Activar e Inactivar horizontalmente.
    */

    function crearAccionesTabla() {

        const contenedor = document.createElement("div");

        contenedor.className = "admin-acciones-tabla";

        return contenedor;

    }


    /*
    Agrega campos al detalle de una solicitud.
    */

    function agregarDato(
        contenedor,
        etiqueta,
        valor,
        completo = false
    ) {

        const campo = document.createElement("div");

        campo.className = "admin-dato";

        if (completo) {

            campo.classList.add("completo");

        }

        const titulo = document.createElement("strong");

        titulo.textContent = etiqueta;

        const texto = document.createElement("p");

        texto.textContent = valor || "—";

        campo.appendChild(titulo);
        campo.appendChild(texto);

        contenedor.appendChild(campo);

    }


    /*
    Muestra mensajes de éxito o error.
    */

    function mostrarMensaje(
        id,
        texto,
        error = false
    ) {

        const elemento = document.getElementById(id);

        if (!elemento) {

            return;

        }

        elemento.textContent = texto;

        elemento.classList.toggle(
            "error",
            error
        );

        elemento.hidden = false;

    }


    /*
    Oculta mensajes anteriores.
    */

    function ocultarMensaje(id) {

        const elemento = document.getElementById(id);

        if (elemento) {

            elemento.hidden = true;

        }

    }


    /*
    Devuelve el nombre visible de cada rol.
    */

    function nombreRol(rol) {

        const roles = {

            OIRS_ESTABLECIMIENTO:
                "Funcionario OIRS establecimiento",

            OIRS_DSM:
                "Funcionario OIRS DSM",

            DIRECTOR:
                "Director de establecimiento",

            ADMINISTRADOR:
                "Administrador",

            GESTOR_CONTENIDOS:
                "Gestor de contenidos"

        };

        return roles[rol] || rol;

    }


    // ====================================================
    // 7. INDICADORES DEL PANEL PRINCIPAL
    // ====================================================

    /*
    Los indicadores utilizan los registros reales
    almacenados en el navegador.
    */

    function actualizarIndicadores() {

        const usuarios = obtenerUsuarios();

        const establecimientos = obtenerEstablecimientos();

        const solicitudes = obtenerSolicitudes();


        // Usuarios activos

        document.getElementById(
            "indicador-usuarios"
        ).textContent = usuarios.filter(
            usuario => usuario.activo !== false
        ).length;


        // Establecimientos activos

        document.getElementById(
            "indicador-establecimientos"
        ).textContent = establecimientos.filter(
            establecimiento =>
                establecimiento.activo !== false
        ).length;


        // Solicitudes registradas

        document.getElementById(
            "indicador-solicitudes"
        ).textContent = solicitudes.length;


        // Solicitudes pendientes

        const estadosPendientes = [
            "Ingresada",
            "En proceso",
            "Derivada"
        ];

        document.getElementById(
            "indicador-pendientes"
        ).textContent = solicitudes.filter(
            solicitud =>
                estadosPendientes.includes(
                    solicitud.estado || "Ingresada"
                )
        ).length;

    }


    // ====================================================
    // 8. SOLICITUDES RECIENTES
    // ====================================================

    /*
    Muestra las solicitudes más recientes en el inicio.
    El administrador puede supervisarlas, pero no
    modificar su tramitación.
    */

    function actualizarSolicitudesRecientes() {

        const tabla = document.getElementById(
            "tabla-recientes"
        );

        if (!tabla) return;

        const cuerpo = tabla.tagName === "TBODY"
            ? tabla
            : tabla.querySelector("tbody");

        if (!cuerpo) return;

        cuerpo.replaceChildren();

        const solicitudes = obtenerSolicitudes()
            .slice()
            .sort((a, b) => {

                const fechaA = new Date(
                    a.fechaRegistro || a.fechaCreacion || a.fecha || 0
                ).getTime() || 0;

                const fechaB = new Date(
                    b.fechaRegistro || b.fechaCreacion || b.fecha || 0
                ).getTime() || 0;

                return fechaB - fechaA;

            })
            .slice(0, 5);

        if (solicitudes.length === 0) {

            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 5;
            celda.textContent =
                "Todavía no existen solicitudes registradas.";

            fila.appendChild(celda);
            cuerpo.appendChild(fila);
            return;

        }

        solicitudes.forEach(solicitud => {

            const fila = document.createElement("tr");

            crearCelda(
                fila,
                solicitud.folio || solicitud.id || "—"
            );

            crearCelda(
                fila,
                solicitud.establecimiento || "—"
            );

            crearCelda(
                fila,
                solicitud.tipo || "—"
            );

            const celdaEstado = document.createElement("td");

            celdaEstado.appendChild(
                crearEstado(
                    solicitud.estado || "Ingresada",
                    claseEstadoSolicitud(solicitud.estado)
                )
            );

            fila.appendChild(celdaEstado);

            crearCelda(
                fila,
                formatearFecha(
                    solicitud.fechaRegistro || solicitud.fechaCreacion || solicitud.fecha
                )
            );

            cuerpo.appendChild(fila);

        });


    }


    // ====================================================
    // 9. GESTIÓN DE USUARIOS
    // ====================================================

    const formularioUsuario = document.getElementById(
        "formulario-usuario"
    );

    const tablaUsuarios = document.getElementById(
        "tabla-usuarios"
    );

    const campoUsuarioId = document.getElementById(
        "usuario-id"
    );

    const campoUsuarioNombre = document.getElementById(
        "usuario-nombre"
    );

    const campoUsuarioCorreo = document.getElementById(
        "usuario-correo"
    );

    const campoUsuarioRol = document.getElementById(
        "usuario-rol"
    );

    const campoUsuarioEstablecimiento = document.getElementById(
        "usuario-establecimiento"
    );

    const filtroUsuarioBusqueda = document.getElementById(
        "buscar-usuarios"
    );

    const filtroUsuarioRol = document.getElementById(
        "filtro-usuario-rol"
    );

    const filtroUsuarioEstado = document.getElementById(
        "filtro-usuarios-estado"
    );


    // ====================================================
    // 10. ESTABLECIMIENTOS DISPONIBLES PARA USUARIOS
    // ====================================================

    function actualizarOpcionesEstablecimientos() {

        if (!campoUsuarioEstablecimiento) return;

        const valorActual = campoUsuarioEstablecimiento.value;

        campoUsuarioEstablecimiento.replaceChildren();

        const opcionInicial = document.createElement("option");

        opcionInicial.value = "";
        opcionInicial.textContent =
            "Seleccione un establecimiento";

        campoUsuarioEstablecimiento.appendChild(opcionInicial);

        const establecimientos = obtenerEstablecimientos()
            .filter(item => item.activo !== false)
            .sort((a, b) =>
                a.nombre.localeCompare(b.nombre, "es")
            );

        establecimientos.forEach(establecimiento => {

            const opcion = document.createElement("option");

            opcion.value = establecimiento.nombre;
            opcion.textContent = establecimiento.nombre;

            campoUsuarioEstablecimiento.appendChild(opcion);

        });

        // Se conserva la selección si sigue disponible.

        if (
            Array.from(campoUsuarioEstablecimiento.options)
                .some(opcion => opcion.value === valorActual)
        ) {

            campoUsuarioEstablecimiento.value = valorActual;

        }

    }


    // ====================================================
    // 11. VALIDACIÓN DE USUARIOS
    // ====================================================

    function validarUsuario(datos, idActual = null) {

        const usuarios = obtenerUsuarios();

        if (!datos.nombre || datos.nombre.length < 3) {

            return "Ingrese un nombre de al menos 3 caracteres.";

        }

        if (!datos.correo) {

            return "Debe ingresar un correo electrónico.";

        }

        const correoValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correoValido.test(datos.correo)) {

            return "Ingrese un correo electrónico válido.";

        }

        const rolesPermitidos = [
            "OIRS_ESTABLECIMIENTO",
            "OIRS_DSM",
            "DIRECTOR",
            "ADMINISTRADOR",
            "GESTOR_CONTENIDOS"
        ];

        if (!rolesPermitidos.includes(datos.rol)) {

            return "Seleccione un rol válido.";

        }

        const correoDuplicado = usuarios.some(usuario => {

            return (
                usuario.id !== idActual &&
                String(usuario.correo || "")
                    .toLowerCase() === datos.correo.toLowerCase()
            );

        });

        if (correoDuplicado) {

            return "Ya existe un usuario con ese correo.";

        }

        if (
            ["OIRS_ESTABLECIMIENTO", "DIRECTOR"]
                .includes(datos.rol) &&
            !datos.establecimiento
        ) {

            return "Debe seleccionar un establecimiento.";

        }

        return null;

    }


    // ====================================================
    // 12. LISTADO Y FILTROS DE USUARIOS
    // ====================================================

    function actualizarTablaUsuarios() {

        if (!tablaUsuarios) return;

        const cuerpo = tablaUsuarios.tagName === "TBODY"
            ? tablaUsuarios
            : tablaUsuarios.querySelector("tbody");

        if (!cuerpo) return;

        cuerpo.replaceChildren();

        const busqueda = (
            filtroUsuarioBusqueda?.value || ""
        ).trim().toLowerCase();

        const rolSeleccionado =
            filtroUsuarioRol?.value || "";

        const estadoSeleccionado =
            filtroUsuarioEstado?.value || "";

        const usuarios = obtenerUsuarios()
            .filter(usuario => {

                const texto = [
                    usuario.nombre,
                    usuario.correo,
                    nombreRol(usuario.rol),
                    usuario.establecimiento
                ].join(" ").toLowerCase();

                const coincideBusqueda =
                    texto.includes(busqueda);

                const coincideRol =
                    !rolSeleccionado ||
                    usuario.rol === rolSeleccionado;

                let coincideEstado = true;

                if (estadoSeleccionado === "activo") {

                    coincideEstado =
                        usuario.activo !== false;

                } else if (
                    estadoSeleccionado === "inactivo"
                ) {

                    coincideEstado =
                        usuario.activo === false;

                }

                return (
                    coincideBusqueda &&
                    coincideRol &&
                    coincideEstado
                );

            })
            .sort((a, b) =>
                a.nombre.localeCompare(b.nombre, "es")
            );

        if (usuarios.length === 0) {

            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 6;
            celda.textContent =
                "No se encontraron usuarios.";

            fila.appendChild(celda);
            cuerpo.appendChild(fila);

            return;

        }

        usuarios.forEach(usuario => {

            const fila = document.createElement("tr");

            crearCelda(fila, usuario.nombre);
            crearCelda(fila, usuario.correo);
            crearCelda(fila, nombreRol(usuario.rol));

            crearCelda(
                fila,
                usuario.establecimiento || "—"
            );

            const celdaEstado = document.createElement("td");

            celdaEstado.appendChild(
                crearEstado(
                    usuario.activo === false
                        ? "Inactivo"
                        : "Activo",
                    usuario.activo === false
                        ? "inactivo"
                        : "activo"
                )
            );

            fila.appendChild(celdaEstado);

            const celdaAcciones = document.createElement("td");

            const acciones = crearAccionesTabla();

            const botonEditar = document.createElement("button");

            botonEditar.type = "button";
            botonEditar.textContent = "Editar";

            botonEditar.addEventListener("click", () => {

                editarUsuario(usuario.id);

            });

            acciones.appendChild(botonEditar);

            const botonEstado = document.createElement("button");

            botonEstado.type = "button";

            const estaActivo = usuario.activo !== false;

            botonEstado.textContent = estaActivo
                ? "Inactivar"
                : "Activar";

            botonEstado.className = estaActivo
                ? "admin-accion-peligro"
                : "admin-accion-activar";

            botonEstado.addEventListener("click", () => {

                cambiarEstadoUsuario(usuario.id);

            });

            acciones.appendChild(botonEstado);

            celdaAcciones.appendChild(acciones);
            fila.appendChild(celdaAcciones);

            cuerpo.appendChild(fila);

        });

    }


    // ====================================================
    // 13. CREAR Y EDITAR USUARIOS
    // ====================================================

    function editarUsuario(id) {

        const usuario = obtenerUsuarios().find(
            item => item.id === id
        );

        if (!usuario) return;

        
        const titulo = document.getElementById(
            "titulo-formulario-usuario"
        );

        if (titulo) {
            titulo.textContent = "Editar usuario";
        }

        actualizarOpcionesEstablecimientos();

        campoUsuarioId.value = usuario.id;
        campoUsuarioNombre.value = usuario.nombre || "";
        campoUsuarioCorreo.value = usuario.correo || "";
        campoUsuarioRol.value = usuario.rol || "";
        campoUsuarioEstablecimiento.value =
            usuario.establecimiento || "";

        ocultarMensaje("mensaje-usuario");

        formularioUsuario?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    function guardarUsuario(evento) {

        evento.preventDefault();

        ocultarMensaje("mensaje-usuario");

        const idActual = campoUsuarioId.value || null;

        const datos = {

            nombre: campoUsuarioNombre.value.trim(),

            correo: campoUsuarioCorreo.value
                .trim()
                .toLowerCase(),

            rol: campoUsuarioRol.value,

            establecimiento:
                campoUsuarioEstablecimiento.value

        };

        const error = validarUsuario(datos, idActual);

        if (error) {

            mostrarMensaje(
                "mensaje-usuario",
                error,
                true
            );

            return;

        }

        const usuarios = obtenerUsuarios();

        if (idActual) {

            const indice = usuarios.findIndex(
                usuario => usuario.id === idActual
            );

            if (indice === -1) {

                mostrarMensaje(
                    "mensaje-usuario",
                    "No se encontró el usuario que desea editar.",
                    true
                );

                return;

            }

            usuarios[indice] = {
                ...usuarios[indice],
                ...datos
            };

        } else {

            usuarios.push({

                id: generarId("usuario"),

                ...datos,

                activo: true

            });

        }

        if (!guardarArreglo(CLAVE_USUARIOS, usuarios)) {

            mostrarMensaje(
                "mensaje-usuario",
                "No fue posible guardar el usuario.",
                true
            );

            return;

        }

        limpiarFormularioUsuario();

        actualizarOpcionesEstablecimientos();
        actualizarTablaUsuarios();
        actualizarIndicadores();

        mostrarMensaje(
            "mensaje-usuario",
            idActual
                ? "Usuario actualizado correctamente."
                : "Usuario registrado correctamente."
        );

    }


    // ====================================================
    // 14. ACTIVAR E INACTIVAR USUARIOS
    // ====================================================

    function cambiarEstadoUsuario(id) {

        const usuarios = obtenerUsuarios();

        const usuario = usuarios.find(
            item => item.id === id
        );

        if (!usuario) return;

        /*
        Evita inactivar la cuenta administrativa
        con la que se inició la sesión.
        */

        if (
            usuario.rol === "ADMINISTRADOR" &&
            (
                usuario.id === sesion.id ||
                usuario.correo === sesion.correo
            )
        ) {

            mostrarMensaje(
                "mensaje-usuario",
                "No puede inactivar su propia cuenta administrativa.",
                true
            );

            return;

        }

        const nuevoEstado = usuario.activo === false;

        const accion = nuevoEstado
            ? "activar"
            : "inactivar";

        if (!window.confirm(
            `¿Está seguro de ${accion} a ${usuario.nombre}?`
        )) {

            return;

        }

        usuario.activo = nuevoEstado;

        if (!guardarArreglo(CLAVE_USUARIOS, usuarios)) {

            mostrarMensaje(
                "mensaje-usuario",
                "No fue posible cambiar el estado del usuario.",
                true
            );

            return;

        }

        actualizarTablaUsuarios();
        actualizarIndicadores();

        mostrarMensaje(
            "mensaje-usuario",
            nuevoEstado
                ? "Usuario activado correctamente."
                : "Usuario inactivado correctamente."
        );

    }


    // ====================================================
    // 15. EVENTOS DE GESTIÓN DE USUARIOS
    // ====================================================

    if (formularioUsuario) {

        formularioUsuario.addEventListener(
            "submit",
            guardarUsuario
        );

    }

    [
        filtroUsuarioBusqueda,
        filtroUsuarioRol,
        filtroUsuarioEstado
    ].forEach(filtro => {

        if (!filtro) return;

        filtro.addEventListener(
            filtro.tagName === "INPUT"
                ? "input"
                : "change",
            actualizarTablaUsuarios
        );

    });
    
    // ====================================================
    // CANCELAR CREACIÓN O EDICIÓN DE USUARIO
    // ====================================================

    function limpiarFormularioUsuario() {

        if (!formularioUsuario) return;

        formularioUsuario.reset();

        if (campoUsuarioId) {
            campoUsuarioId.value = "";
        }

        const titulo = document.getElementById(
            "titulo-formulario-usuario"
        );

        if (titulo) {
            titulo.textContent = "Registrar usuario";
        }

        actualizarOpcionesEstablecimientos();
        ocultarMensaje("mensaje-usuario");

    }

    document.getElementById(
        "cancelar-usuario"
    )?.addEventListener("click", limpiarFormularioUsuario);



    // ====================================================
    // 16. GESTIÓN DE ESTABLECIMIENTOS
    // ====================================================

    
    // ====================================================
    // ACTUALIZAR REFERENCIAS DE ESTABLECIMIENTO
    // ====================================================

    function actualizarReferenciasEstablecimiento(
        nombreAnterior,
        nombreNuevo
    ) {

        const claves = [
            CLAVE_USUARIOS,
            CLAVE_SOLICITUDES,
            CLAVE_ENCUESTAS
        ];

        const cambios = [];

        try {

            // Preparar todos los cambios sin guardar todavía.

            claves.forEach(clave => {

                const original = localStorage.getItem(clave);

                if (original === null) {
                    return;
                }

                const registros = JSON.parse(original);

                if (!Array.isArray(registros)) {
                    throw new Error("Datos inválidos: " + clave);
                }

                const actualizados = registros.map(registro => {

                    if (
                        registro &&
                        registro.establecimiento === nombreAnterior
                    ) {
                        return {
                            ...registro,
                            establecimiento: nombreNuevo
                        };
                    }

                    return registro;

                });

                cambios.push({
                    clave,
                    original,
                    actualizados
                });

            });

            // Guardar los cambios.

            const guardados = [];

            try {

                cambios.forEach(cambio => {

                    localStorage.setItem(
                        cambio.clave,
                        JSON.stringify(cambio.actualizados)
                    );

                    guardados.push(cambio);

                });

            } catch (error) {

                // Intentar restaurar los datos anteriores.

                guardados.reverse().forEach(cambio => {

                    try {
                        localStorage.setItem(
                            cambio.clave,
                            cambio.original
                        );
                    } catch (errorRestauracion) {
                        console.error(
                            "No fue posible restaurar:",
                            cambio.clave,
                            errorRestauracion
                        );
                    }

                });

                throw error;

            }

            return true;

        } catch (error) {

            console.error(
                "Error al actualizar referencias:",
                error
            );

            return false;

        }

    }


    const formularioEstablecimiento = document.getElementById(
        "formulario-establecimiento"
    );

    const campoEstablecimientoId = document.getElementById(
        "establecimiento-id"
    );

    const campoEstablecimientoNombre = document.getElementById(
        "establecimiento-nombre"
    );

    const campoEstablecimientoTipo = document.getElementById(
        "establecimiento-tipo"
    );

    const campoEstablecimientoDireccion = document.getElementById(
        "establecimiento-direccion"
    );


    function limpiarFormularioEstablecimiento() {

        formularioEstablecimiento?.reset();

        if (campoEstablecimientoId) {
            campoEstablecimientoId.value = "";
        }

        const titulo = document.getElementById(
            "titulo-formulario-establecimiento"
        );

        if (titulo) {
            titulo.textContent = "Registrar establecimiento";
        }

    }


    function actualizarTablaEstablecimientos() {

        const tabla = document.getElementById(
            "tabla-establecimientos"
        );

        if (!tabla) return;

        const cuerpo = tabla.tagName === "TBODY"
            ? tabla
            : tabla.querySelector("tbody");

        if (!cuerpo) return;

        cuerpo.replaceChildren();

        const establecimientos = obtenerEstablecimientos()
            .sort((a, b) =>
                String(a.nombre || "").localeCompare(
                    String(b.nombre || ""),
                    "es"
                )
            );

        if (establecimientos.length === 0) {

            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 5;
            celda.textContent =
                "No existen establecimientos registrados.";

            fila.appendChild(celda);
            cuerpo.appendChild(fila);
            return;

        }

        establecimientos.forEach(establecimiento => {

            const fila = document.createElement("tr");

            crearCelda(fila, establecimiento.nombre);
            crearCelda(fila, establecimiento.tipo);
            crearCelda(fila, establecimiento.direccion || "—");

            const celdaEstado = document.createElement("td");

            celdaEstado.appendChild(
                crearEstado(
                    establecimiento.activo === false
                        ? "Inactivo"
                        : "Activo",
                    establecimiento.activo === false
                        ? "inactivo"
                        : "activo"
                )
            );

            fila.appendChild(celdaEstado);

            const celdaAcciones = document.createElement("td");
            const acciones = crearAccionesTabla();

            const botonEditar = document.createElement("button");

            botonEditar.type = "button";
            botonEditar.textContent = "Editar";

            botonEditar.addEventListener("click", () => {
                editarEstablecimiento(establecimiento.id);
            });

            acciones.appendChild(botonEditar);

            const botonEstado = document.createElement("button");

            botonEstado.type = "button";

            const activo = establecimiento.activo !== false;

            botonEstado.textContent = activo
                ? "Inactivar"
                : "Activar";

            botonEstado.className = activo
                ? "admin-accion-peligro"
                : "admin-accion-activar";

            botonEstado.addEventListener("click", () => {
                cambiarEstadoEstablecimiento(
                    establecimiento.id
                );
            });

            acciones.appendChild(botonEstado);
            celdaAcciones.appendChild(acciones);
            fila.appendChild(celdaAcciones);
            cuerpo.appendChild(fila);

        });

    }


    function editarEstablecimiento(id) {

        const establecimiento = obtenerEstablecimientos()
            .find(item => item.id === id);

        if (!establecimiento) return;

        campoEstablecimientoId.value = establecimiento.id;
        campoEstablecimientoNombre.value =
            establecimiento.nombre || "";
        campoEstablecimientoTipo.value =
            establecimiento.tipo || "";
        campoEstablecimientoDireccion.value =
            establecimiento.direccion || "";

        const titulo = document.getElementById(
            "titulo-formulario-establecimiento"
        );

        if (titulo) {
            titulo.textContent = "Editar establecimiento";
        }

        ocultarMensaje("mensaje-establecimiento");

        formularioEstablecimiento?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    function guardarEstablecimiento(evento) {

        evento.preventDefault();

        ocultarMensaje("mensaje-establecimiento");

        const idActual = campoEstablecimientoId.value;

        const nombre = campoEstablecimientoNombre.value.trim();
        const tipo = campoEstablecimientoTipo.value;
        const direccion = campoEstablecimientoDireccion.value.trim();

        if (!nombre || !tipo) {

            mostrarMensaje(
                "mensaje-establecimiento",
                "Complete el nombre y el tipo de establecimiento.",
                true
            );

            return;
        }

        const establecimientos = obtenerEstablecimientos();

        const duplicado = establecimientos.some(item =>
            item.id !== idActual &&
            String(item.nombre || "").trim().toLowerCase() ===
                nombre.toLowerCase()
        );

        if (duplicado) {

            mostrarMensaje(
                "mensaje-establecimiento",
                "Ya existe un establecimiento con ese nombre.",
                true
            );

            return;
        }

        if (idActual) {

            const indice = establecimientos.findIndex(
                item => item.id === idActual
            );

            if (indice === -1) return;

            const nombreAnterior = establecimientos[indice].nombre;

            establecimientos[indice] = {
                ...establecimientos[indice],
                nombre,
                tipo,
                direccion
            };

            /*
            Si cambia el nombre del establecimiento,
            actualizamos las referencias en usuarios,
            solicitudes y encuestas.
            */

            if (nombreAnterior !== nombre) {

                const actualizado =
                    actualizarReferenciasEstablecimiento(
                        nombreAnterior,
                        nombre
                    );

                if (!actualizado) {

                    mostrarMensaje(
                        "mensaje-establecimiento",
                        "No fue posible actualizar las referencias del establecimiento.",
                        true
                    );

                    return;
                }

            }


        } else {

            establecimientos.push({
                id: generarId("establecimiento"),
                nombre,
                tipo,
                direccion,
                activo: true
            });

        }

        if (!guardarArreglo(
            CLAVE_ESTABLECIMIENTOS,
            establecimientos
        )) {

            mostrarMensaje(
                "mensaje-establecimiento",
                "No fue posible guardar el establecimiento.",
                true
            );

            return;
        }

        limpiarFormularioEstablecimiento();

        actualizarTablaEstablecimientos();
        actualizarOpcionesEstablecimientos();
        actualizarTablaUsuarios();
        actualizarIndicadores();

        mostrarMensaje(
            "mensaje-establecimiento",
            idActual
                ? "Establecimiento actualizado correctamente."
                : "Establecimiento registrado correctamente."
        );

    }


    function cambiarEstadoEstablecimiento(id) {

        const establecimientos = obtenerEstablecimientos();

        const establecimiento = establecimientos.find(
            item => item.id === id
        );

        if (!establecimiento) return;

        const activar = establecimiento.activo === false;

        if (!activar) {

            const usuariosActivos = obtenerUsuarios().filter(
                usuario =>
                    usuario.activo !== false &&
                    usuario.establecimiento === establecimiento.nombre
            );

            if (usuariosActivos.length > 0) {

                mostrarMensaje(
                    "mensaje-establecimiento",
                    "No puede inactivar este establecimiento porque tiene usuarios activos asociados.",
                    true
                );

                return;
            }

        }

        const accion = activar ? "activar" : "inactivar";

        if (!window.confirm(
            `¿Está seguro de ${accion} ${establecimiento.nombre}?`
        )) {
            return;
        }

        establecimiento.activo = activar;

        if (!guardarArreglo(
            CLAVE_ESTABLECIMIENTOS,
            establecimientos
        )) {
            mostrarMensaje(
                "mensaje-establecimiento",
                "No fue posible cambiar el estado.",
                true
            );
            return;
        }

        actualizarTablaEstablecimientos();
        actualizarOpcionesEstablecimientos();
        actualizarIndicadores();

        mostrarMensaje(
            "mensaje-establecimiento",
            activar
                ? "Establecimiento activado correctamente."
                : "Establecimiento inactivado correctamente."
        );

    }


    formularioEstablecimiento?.addEventListener(
        "submit",
        guardarEstablecimiento
    );

    document.getElementById(
        "cancelar-establecimiento"
    )?.addEventListener("click", () => {

        limpiarFormularioEstablecimiento();
        ocultarMensaje("mensaje-establecimiento");

    });


    // ====================================================
    // 17. SUPERVISIÓN DE SOLICITUDES OIRS
    // ====================================================

    function actualizarTablaSolicitudes() {

        const tabla = document.getElementById(
            "tabla-solicitudes"
        );

        if (!tabla) return;

        const cuerpo = tabla.tagName === "TBODY"
            ? tabla
            : tabla.querySelector("tbody");

        if (!cuerpo) return;

        cuerpo.replaceChildren();

        const busqueda = (
            document.getElementById(
                "buscar-solicitudes"
            )?.value || ""
        ).trim().toLowerCase();

        const filtroEstado = document.getElementById(
            "filtro-solicitudes-estado"
        )?.value || "";

        const solicitudes = obtenerSolicitudes()
            .filter(solicitud => {

                const texto = [
                    solicitud.folio,
                    solicitud.id,
                    solicitud.tipo,
                    solicitud.establecimiento,
                    solicitud.estado
                ].join(" ").toLowerCase();

                return (
                    texto.includes(busqueda) &&
                    (!filtroEstado ||
                        solicitud.estado === filtroEstado)
                );

            });

        if (solicitudes.length === 0) {

            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 6;
            celda.textContent =
                "No se encontraron solicitudes.";

            fila.appendChild(celda);
            cuerpo.appendChild(fila);
            return;
        }

        solicitudes.forEach(solicitud => {

            const fila = document.createElement("tr");

            crearCelda(
                fila,
                solicitud.folio || solicitud.id || "—"
            );

            crearCelda(
                fila,
                solicitud.establecimiento || "—"
            );

            crearCelda(
                fila,
                solicitud.tipo || "—"
            );

            crearCelda(
                fila,
                solicitud.asunto || "—"
            );

            const celdaEstado = document.createElement("td");

            celdaEstado.appendChild(
                crearEstado(
                    solicitud.estado || "Ingresada",
                    claseEstadoSolicitud(solicitud.estado)
                )
            );

            fila.appendChild(celdaEstado);

            const celdaAccion = document.createElement("td");

            const boton = document.createElement("button");

            boton.type = "button";
            boton.className = "admin-boton secundario";
            boton.textContent = "Ver detalle";

            boton.addEventListener("click", () => {
                mostrarDetalleSolicitud(solicitud);
            });

            celdaAccion.appendChild(boton);
            fila.appendChild(celdaAccion);

            cuerpo.appendChild(fila);

        });


    }


    function mostrarDetalleSolicitud(solicitud) {

        const panel = document.getElementById(
            "detalle-solicitud"
        );

        const contenido = document.getElementById(
            "detalle-contenido"
        );

        const historial = document.getElementById(
            "detalle-historial"
        );

        if (!panel || !contenido || !historial) return;

        contenido.replaceChildren();
        historial.replaceChildren();

        agregarDato(
            contenido,
            "Folio",
            solicitud.folio || solicitud.id
        );

        agregarDato(
            contenido,
            "Tipo de solicitud",
            solicitud.tipo
        );

        agregarDato(
            contenido,
            "Establecimiento",
            solicitud.establecimiento
        );

        agregarDato(
            contenido,
            "Estado",
            solicitud.estado || "Ingresada"
        );

        agregarDato(
            contenido,
            "Fecha de ingreso",
            formatearFecha(
                solicitud.fechaRegistro || solicitud.fechaCreacion || solicitud.fecha || solicitud.historial?.[0]?.fecha
            )
        );

        agregarDato(
            contenido,
            "Descripción",
            solicitud.descripcion || solicitud.detalle,
            true
        );

        const movimientos = Array.isArray(solicitud.historial)
            ? solicitud.historial
            : [];

        if (movimientos.length === 0) {

            const elemento = document.createElement("li");

            elemento.textContent =
                "No hay movimientos registrados.";

            historial.appendChild(elemento);

        } else {

            movimientos.forEach(movimiento => {

                const elemento = document.createElement("li");

                if (typeof movimiento === "string") {

                    elemento.textContent = movimiento;

                } else {

                    elemento.textContent = [
                        formatearFecha(movimiento.fecha),
                        movimiento.accion ||
                            movimiento.descripcion ||
                            movimiento.detalle ||
                            "Movimiento registrado"
                    ].join(" — ");

                }

                historial.appendChild(elemento);

            });

        }

        panel.hidden = false;

        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    document.getElementById(
        "cerrar-detalle"
    )?.addEventListener("click", () => {

        const panel = document.getElementById(
            "detalle-solicitud"
        );

        if (panel) panel.hidden = true;

    });

    document.getElementById(
        "buscar-solicitudes"
    )?.addEventListener("input", actualizarTablaSolicitudes);

    document.getElementById(
        "filtro-solicitudes-estado"
    )?.addEventListener("change", actualizarTablaSolicitudes);


    // ====================================================
    // 18. CONFIGURACIÓN GENERAL
    // ====================================================

    function cargarConfiguracion() {

        let configuracion = {};

        try {

            configuracion = JSON.parse(
                localStorage.getItem(CLAVE_CONFIGURACION) || "{}"
            ) || {};

        } catch (error) {

            configuracion = {};

        }

        const campos = {
            "config-nombre": configuracion.nombre,
            "config-prefijo": configuracion.prefijo,
            "config-correo": configuracion.correo,
            "config-mensaje": configuracion.mensaje
        };

        Object.entries(campos).forEach(([id, valor]) => {

            const campo = document.getElementById(id);

            if (campo) {
                campo.value = valor || "";
            }

        });

    }


    document.getElementById(
        "formulario-configuracion"
    )?.addEventListener("submit", evento => {

        evento.preventDefault();

        const configuracion = {

            nombre: document.getElementById(
                "config-nombre"
            )?.value.trim() || "",

            prefijo: document.getElementById(
                "config-prefijo"
            )?.value.trim() || "",

            correo: document.getElementById(
                "config-correo"
            )?.value.trim() || "",

            mensaje: document.getElementById(
                "config-mensaje"
            )?.value.trim() || ""

        };

        try {

            localStorage.setItem(
                CLAVE_CONFIGURACION,
                JSON.stringify(configuracion)
            );

            mostrarMensaje(
                "mensaje-configuracion",
                "Configuración guardada correctamente."
            );

        } catch (error) {

            mostrarMensaje(
                "mensaje-configuracion",
                "No fue posible guardar la configuración.",
                true
            );

        }

    });


    // ====================================================
    // 19. ACTUALIZACIÓN GENERAL
    // ====================================================

    function actualizarTodo() {

        actualizarIndicadores();
        actualizarSolicitudesRecientes();
        actualizarOpcionesEstablecimientos();
        actualizarTablaUsuarios();
        actualizarTablaEstablecimientos();
        actualizarTablaSolicitudes();

    }


    // ====================================================
    // 20. NAVEGACIÓN ENTRE SECCIONES
    // ====================================================

    const secciones = [
        "inicio",
        "usuarios",
        "establecimientos",
        "solicitudes",
        "configuracion"
    ];

    function mostrarSeccion(nombre) {

        if (!secciones.includes(nombre)) return;

        secciones.forEach(seccion => {

            const elemento = document.getElementById(
                "seccion-" + seccion
            );

            if (elemento) {
                elemento.hidden = seccion !== nombre;
            }

        });

        document.querySelectorAll(
            ".admin-menu button[data-seccion]"
        ).forEach(boton => {

            const activo = boton.dataset.seccion === nombre;

            boton.classList.toggle("activo", activo);

            if (activo) {
                boton.setAttribute("aria-current", "page");
            } else {
                boton.removeAttribute("aria-current");
            }

        });

        actualizarTodo();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    document.querySelectorAll(
        "[data-seccion], [data-ir]"
    ).forEach(boton => {

        boton.addEventListener("click", () => {

            mostrarSeccion(
                boton.dataset.seccion || boton.dataset.ir
            );

        });

    });


    // ====================================================
    // 21. CIERRE DE SESIÓN
    // ====================================================

    document.getElementById(
        "cerrar-sesion"
    )?.addEventListener("click", () => {

        sessionStorage.removeItem(CLAVE_SESION);

        window.location.replace("login.html");

    });

    
    // ====================================================
    // ACTUALIZACIÓN AUTOMÁTICA DE DATOS
    // ====================================================

    /*
        Actualiza la información del Administrador
        cuando otra pestaña modifica solicitudes,
        usuarios o establecimientos.

        No modifica los registros almacenados.
    */

    window.addEventListener("storage", function (evento) {

        if (
            evento.key === CLAVE_SOLICITUDES ||
            evento.key === CLAVE_USUARIOS ||
            evento.key === CLAVE_ESTABLECIMIENTOS ||
            evento.key === null
        ) {

            actualizarIndicadores();
            actualizarSolicitudesRecientes();
            actualizarTablaUsuarios();
            actualizarTablaEstablecimientos();
            actualizarOpcionesEstablecimientos();
            actualizarTablaSolicitudes();

        }

    });


    // ====================================================
    // 22. INICIALIZACIÓN DEL PANEL
    // ====================================================

    inicializarDatos();

    cargarConfiguracion();

    actualizarTodo();

    mostrarSeccion("inicio");

});
