
/* ==========================================================
   PORTAL DE SALUD MUNICIPAL - PADRE LAS CASAS

   ARCHIVO: script.js

   FUNCIONES GENERALES DEL PORTAL

   1. Menú principal para dispositivos móviles
   2. Menús desplegables
   3. Cierre de menús con Escape
   4. Buscador de secciones del portal
   5. Compatibilidad con el buscador anterior
   6. Navegación desde cualquier página

   Este archivo es compartido por todas las páginas.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================
       1. ELEMENTOS PRINCIPALES
       ====================================================== */

    const botonMenu = document.getElementById("boton-menu");

    const menuPrincipal = document.getElementById(
        "menu-principal"
    );

    const botonesDesplegables = document.querySelectorAll(
        ".menu-desplegable"
    );

    const botonBusqueda = document.getElementById(
        "boton-busqueda"
    );

    const panelBusqueda = document.getElementById(
        "panel-busqueda"
    );

    const campoBusqueda = document.getElementById(
        "campo-busqueda"
    );

    const resultadosBusqueda = document.getElementById(
        "resultados-busqueda"
    );

    const buscadorNavegacion = document.getElementById(
        "buscador-sitio"
    );


    /* ======================================================
       2. RUTAS DEL PROYECTO

       index.html se encuentra en la raíz.

       Las demás páginas se encuentran dentro de pages/.

       Esta función permite construir rutas correctas
       independientemente de la página actual.
       ====================================================== */

    const rutaActual = window.location.pathname;

    const estaEnCarpetaPages = rutaActual
        .split("/")
        .filter(Boolean)
        .slice(-2, -1)
        .includes("pages");

    const prefijoPaginas = estaEnCarpetaPages
        ? ""
        : "pages/";


    function construirRuta(nombreArchivo) {

        return prefijoPaginas + nombreArchivo;

    }


    /* ======================================================
       3. CERRAR SUBMENÚS

       Permite cerrar todos los submenús o mantener
       abierto solamente el indicado.
       ====================================================== */

    function cerrarSubmenus(excepto = null) {

        botonesDesplegables.forEach(function (boton) {

            if (boton !== excepto) {

                boton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    }


    /* ======================================================
       4. MENÚ PRINCIPAL EN DISPOSITIVOS MÓVILES
       ====================================================== */

    if (botonMenu && menuPrincipal) {

        botonMenu.addEventListener("click", function () {

            const abierto = menuPrincipal.classList.toggle(
                "menu-abierto"
            );

            botonMenu.setAttribute(
                "aria-expanded",
                String(abierto)
            );

            if (!abierto) {

                cerrarSubmenus();

            }

        });

    }


    /* ======================================================
       5. MENÚS DESPLEGABLES

       Solo permite mantener abierto un submenú
       a la vez.
       ====================================================== */

    botonesDesplegables.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const estabaAbierto =
                boton.getAttribute("aria-expanded") === "true";

            cerrarSubmenus();

            boton.setAttribute(
                "aria-expanded",
                String(!estabaAbierto)
            );

        });

    });


    /* ======================================================
       6. CERRAR MENÚS AL HACER CLIC FUERA
       ====================================================== */

    document.addEventListener("click", function (evento) {

        if (!evento.target.closest(".tiene-submenu")) {

            cerrarSubmenus();

        }

        if (
            buscadorNavegacion &&
            !buscadorNavegacion.contains(evento.target)
        ) {

            cerrarResultadosBusqueda();

        }

    });


    /* ======================================================
       7. CERRAR ELEMENTOS CON ESCAPE
       ====================================================== */

    document.addEventListener("keydown", function (evento) {

        if (evento.key !== "Escape") {

            return;

        }

        cerrarSubmenus();

        cerrarResultadosBusqueda();

        // Compatibilidad con el buscador anterior.

        if (panelBusqueda) {

            panelBusqueda.hidden = true;

        }

        if (botonBusqueda) {

            botonBusqueda.setAttribute(
                "aria-expanded",
                "false"
            );

        }

        // Cerrar el menú móvil.

        if (
            menuPrincipal &&
            menuPrincipal.classList.contains("menu-abierto")
        ) {

            menuPrincipal.classList.remove(
                "menu-abierto"
            );

            if (botonMenu) {

                botonMenu.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    });


    /* ======================================================
       8. BUSCADOR ANTERIOR

       Algunas páginas todavía tienen un botón que abre
       un panel de búsqueda debajo de la navegación.

       Mantendremos su funcionamiento hasta actualizar
       todos los HTML.
       ====================================================== */

    if (botonBusqueda && panelBusqueda) {

        botonBusqueda.addEventListener("click", function () {

            const abrir = panelBusqueda.hidden;

            panelBusqueda.hidden = !abrir;

            botonBusqueda.setAttribute(
                "aria-expanded",
                String(abrir)
            );

            cerrarSubmenus();

            if (abrir && campoBusqueda) {

                campoBusqueda.focus();

            }

        });

    }


    /* ======================================================
       9. SECCIONES DISPONIBLES EN EL BUSCADOR

       El buscador localiza páginas del prototipo.
       No realiza consultas a servidores externos.
       ====================================================== */

    const secciones = [

        {
            nombre: "Inicio",
            descripcion: "Página principal del portal",
            archivo: "../index.html",
            palabrasClave: [
                "inicio",
                "principal",
                "portal"
            ]
        },

        {
            nombre: "Institución",
            descripcion: "Información institucional",
            archivo: "institucion.html",
            palabrasClave: [
                "institución",
                "quiénes somos",
                "departamento",
                "salud municipal"
            ]
        },

        {
            nombre: "Contacto",
            descripcion: "Información de contacto",
            archivo: "contacto.html",
            palabrasClave: [
                "contacto",
                "teléfono",
                "correo",
                "dirección"
            ]
        },

        {
            nombre: "Establecimientos de salud",
            descripcion: "Directorio de establecimientos",
            archivo: "establecimientos.html",
            palabrasClave: [
                "establecimientos",
                "cesfam",
                "cecosf",
                "postas",
                "ubicación",
                "horarios"
            ]
        },

        {
            nombre: "Prestaciones de salud",
            descripcion: "Servicios y prestaciones disponibles",
            archivo: "prestaciones.html",
            palabrasClave: [
                "prestaciones",
                "atención",
                "servicios",
                "salud"
            ]
        },

        {
            nombre: "Programas de salud",
            descripcion: "Programas de salud municipal",
            archivo: "programas.html",
            palabrasClave: [
                "programas",
                "prevención",
                "promoción",
                "salud"
            ]
        },

        {
            nombre: "Noticias y actividades",
            descripcion: "Noticias y publicaciones",
            archivo: "noticias.html",
            palabrasClave: [
                "noticias",
                "actividades",
                "comunicados",
                "publicaciones"
            ]
        },

        {
            nombre: "Atención ciudadana OIRS",
            descripcion: "Ingreso de solicitudes ciudadanas",
            archivo: "oirs.html",
            palabrasClave: [
                "oirs",
                "reclamos",
                "consultas",
                "sugerencias",
                "felicitaciones",
                "agradecimientos",
                "solicitudes"
            ]
        },

        {
            nombre: "Encuesta de satisfacción",
            descripcion: "Evaluación de la atención recibida",
            archivo: "encuesta.html",
            palabrasClave: [
                "encuesta",
                "satisfacción",
                "opinión",
                "evaluación"
            ]
        },

        {
            nombre: "Participación ciudadana",
            descripcion: "Canales de participación",
            archivo: "participacion.html",
            palabrasClave: [
                "participación",
                "comunidad",
                "ciudadanía",
                "organizaciones"
            ]
        },

        {
            nombre: "Acceso a intranet existente",
            descripcion: "Información sobre la intranet municipal",
            archivo: "intranet.html",
            palabrasClave: [
                "intranet",
                "funcionarios",
                "acceso interno"
            ]
        }

    ];


    /* ======================================================
       10. CONSTRUIR URL DE CADA RESULTADO
       ====================================================== */

    function obtenerUrlSeccion(seccion) {

        if (seccion.archivo === "../index.html") {

            return estaEnCarpetaPages
                ? "../index.html"
                : "index.html";

        }

        return construirRuta(seccion.archivo);

    }


    /* ======================================================
       11. NORMALIZAR TEXTO PARA BÚSQUEDAS

       Permite encontrar coincidencias aunque el usuario
       escriba sin tildes o utilizando mayúsculas.
       ====================================================== */

    function normalizarTexto(texto) {

        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("es")
            .trim();

    }


    /* ======================================================
       12. CERRAR RESULTADOS DE BÚSQUEDA
       ====================================================== */

    function cerrarResultadosBusqueda() {

        if (resultadosBusqueda) {

            resultadosBusqueda.hidden = true;

        }

        if (campoBusqueda && buscadorNavegacion) {

            campoBusqueda.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    /* ======================================================
       13. MOSTRAR RESULTADOS DE BÚSQUEDA
       ====================================================== */

    function mostrarResultadosBusqueda() {

        if (!campoBusqueda || !resultadosBusqueda) {

            return;

        }

        const termino = normalizarTexto(
            campoBusqueda.value
        );

        resultadosBusqueda.replaceChildren();

        // Sin texto no mostramos sugerencias.

        if (!termino) {

            cerrarResultadosBusqueda();

            return;

        }

        const coincidencias = secciones.filter(
            function (seccion) {

                const textoBusqueda = normalizarTexto(
                    [
                        seccion.nombre,
                        seccion.descripcion,
                        ...seccion.palabrasClave
                    ].join(" ")
                );

                return textoBusqueda.includes(termino);

            }
        );

        // No hay resultados.

        if (coincidencias.length === 0) {

            const mensaje = document.createElement("p");

            mensaje.textContent =
                "No se encontraron secciones relacionadas.";

            resultadosBusqueda.appendChild(mensaje);

        } else {

            // Crear enlaces de manera segura.

            coincidencias.forEach(function (seccion) {

                const enlace = document.createElement("a");

                enlace.href = obtenerUrlSeccion(seccion);

                enlace.textContent = seccion.nombre;

                enlace.setAttribute(
                    "role",
                    "option"
                );

                resultadosBusqueda.appendChild(enlace);

            });

        }

        // El buscador nuevo muestra resultados flotantes.

        if (buscadorNavegacion) {

            resultadosBusqueda.hidden = false;

            campoBusqueda.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    /* ======================================================
       14. EVENTOS DEL CAMPO DE BÚSQUEDA
       ====================================================== */

    if (campoBusqueda && resultadosBusqueda) {

        // Buscar mientras el usuario escribe.

        campoBusqueda.addEventListener(
            "input",
            mostrarResultadosBusqueda
        );

        // Mostrar nuevamente las sugerencias al enfocar.

        campoBusqueda.addEventListener("focus", function () {

            if (campoBusqueda.value.trim()) {

                mostrarResultadosBusqueda();

            }

        });

        // Permitir Enter para abrir el primer resultado.

        campoBusqueda.addEventListener("keydown", function (evento) {

            if (evento.key !== "Enter") {

                return;

            }

            const primerResultado =
                resultadosBusqueda.querySelector("a");

            if (primerResultado) {

                evento.preventDefault();

                window.location.href = primerResultado.href;

            }

        });

    }

});
