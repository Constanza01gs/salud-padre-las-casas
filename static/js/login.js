
/*
============================================================
LOGIN - ACCESO DE FUNCIONARIOS
Departamento de Salud Municipal de Padre Las Casas
============================================================

Este archivo controla:

1. Los cinco perfiles demostrativos.
2. La descripción del perfil seleccionado.
3. La validación de selección.
4. El almacenamiento de la sesión de prueba.
5. La redirección al panel correspondiente.

IMPORTANTE:
Este acceso es exclusivamente académico y demostrativo.
No implementa autenticación ni autorización real.
============================================================
*/


document.addEventListener("DOMContentLoaded", function () {

    // ====================================================
    // 1. PERFILES DEMOSTRATIVOS
    // ====================================================

    const usuarios = {

        oirs_establecimiento: {
            id: "demo_oirs_establecimiento",
            nombre: "Funcionario OIRS",
            rol: "OIRS_ESTABLECIMIENTO",
            rolNombre: "Funcionario OIRS de establecimiento",
            establecimiento: "CESFAM Padre Las Casas",
            descripcion:
                "Gestiona solicitudes del establecimiento: " +
                "registro presencial, clasificación, " +
                "derivación, seguimiento y respuesta."
        },

        oirs_dsm: {
            id: "demo_oirs_dsm",
            nombre: "Funcionario OIRS DSM",
            rol: "OIRS_DSM",
            rolNombre: "Funcionario OIRS del Departamento de Salud",
            establecimiento: "Departamento de Salud Municipal",
            descripcion:
                "Supervisa solicitudes de la red, " +
                "gestiona derivaciones y revisa " +
                "indicadores de distintos establecimientos."
        },

        director: {
            id: "demo_director",
            nombre: "Director de establecimiento",
            rol: "DIRECTOR",
            rolNombre: "Director de establecimiento",
            establecimiento: "CESFAM Padre Las Casas",
            descripcion:
                "Consulta solicitudes, estados, " +
                "plazos y reportes correspondientes " +
                "a su establecimiento."
        },

        administrador: {
            id: "demo_administrador",
            nombre: "Administrador del sistema",
            rol: "ADMINISTRADOR",
            rolNombre: "Administrador del sistema",
            establecimiento: "Departamento de Salud Municipal",
            descripcion:
                "Administra usuarios, perfiles, " +
                "establecimientos y parámetros " +
                "de configuración del prototipo."
        },

        gestor_contenidos: {
            id: "demo_gestor_contenidos",
            nombre: "Gestor de Contenidos",
            rol: "GESTOR_CONTENIDOS",
            rolNombre: "Personal de Participación y Comunicaciones",
            establecimiento: "Departamento de Salud Municipal",
            descripcion:
                "Gestión de contenidos del portal institucional"
        }

    };


    // ====================================================
    // 2. ELEMENTOS DEL FORMULARIO
    // ====================================================

    const formulario = document.getElementById(
        "formulario-login"
    );

    const selector = document.getElementById(
        "usuario-demo"
    );

    const detalle = document.getElementById(
        "detalle-usuario"
    );

    const mensajeError = document.getElementById(
        "mensaje-login-error"
    );


    // ====================================================
    // 3. CLAVE DE SESIÓN
    // ====================================================

    // Debe coincidir con la clave utilizada por los
    // dashboards internos del prototipo.

    const CLAVE_SESION = "plc_oirs_sesion_demo_v1";


    // ====================================================
    // 4. COMPROBAR ELEMENTOS NECESARIOS
    // ====================================================

    if (
        !formulario ||
        !selector ||
        !detalle ||
        !mensajeError
    ) {
        console.error(
            "No se encontraron todos los elementos " +
            "necesarios del formulario de acceso."
        );

        return;
    }


    // ====================================================
    // 5. MOSTRAR DESCRIPCIÓN DEL PERFIL
    // ====================================================

    selector.addEventListener("change", function () {

        const usuario = usuarios[selector.value];

        // Ocultar cualquier mensaje de error anterior.
        mensajeError.hidden = true;

        if (!usuario) {

            detalle.innerHTML = `
                <h3>Selecciona un perfil</h3>

                <p>
                    Aquí aparecerán las funciones
                    disponibles para el usuario elegido.
                </p>
            `;

            return;
        }


        // Limpiar la información anterior.
        detalle.innerHTML = "";


        // Crear el título del perfil.
        const titulo = document.createElement("h3");

        titulo.textContent = usuario.rolNombre;


        // Crear la descripción.
        const texto = document.createElement("p");

        texto.textContent = usuario.descripcion;


        // Incorporar la información al contenedor.
        detalle.appendChild(titulo);
        detalle.appendChild(texto);

    });


    // ====================================================
    // 6. INGRESO SIMULADO
    // ====================================================

    formulario.addEventListener("submit", function (evento) {

        // Evitar que el formulario recargue la página.
        evento.preventDefault();


        // Obtener el perfil seleccionado.
        const usuario = usuarios[selector.value];


        // ====================================================
        // VALIDAR SELECCIÓN
        // ====================================================

        if (!usuario) {

            mensajeError.textContent =
                "Debes seleccionar un perfil de demostración.";

            mensajeError.hidden = false;

            return;
        }


        // ====================================================
        // PREPARAR DATOS DE LA SESIÓN
        // ====================================================

        const sesion = {
            ...usuario,
            fechaIngreso: new Date().toISOString()
        };


        // ====================================================
        // GUARDAR SESIÓN DEMOSTRATIVA
        // ====================================================

        try {

            sessionStorage.setItem(
                CLAVE_SESION,
                JSON.stringify(sesion)
            );

        } catch (error) {

            mensajeError.textContent =
                "No fue posible iniciar la sesión de prueba " +
                "en este navegador.";

            mensajeError.hidden = false;

            return;
        }


        // ====================================================
        // 7. REDIRECCIÓN SEGÚN EL ROL
        // ====================================================

        if (usuario.rol === "OIRS_ESTABLECIMIENTO") {

            window.location.href = "dashboard-oirs.html";

        } else if (usuario.rol === "OIRS_DSM") {

            window.location.href = "dashboard-dsm.html";

        } else if (usuario.rol === "DIRECTOR") {

            window.location.href = "dashboard-director.html";

        } else if (usuario.rol === "ADMINISTRADOR") {

            window.location.href = "dashboard-admin.html";

        } else if (usuario.rol === "GESTOR_CONTENIDOS") {

            window.location.href = "dashboard-contenidos.html";

        } else {

            window.location.href = "login.html";

        }

    });

});
