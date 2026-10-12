
/*
============================================================
PORTAL DE SALUD MUNICIPAL - PADRE LAS CASAS
ARCHIVO: programas.js

FUNCIONALIDADES:
1. Cargar los seis programas de salud.
2. Mostrar tarjetas informativas.
3. Buscar programas por palabras clave.
4. Filtrar programas por categoría.
5. Mostrar fichas individuales.
6. Regresar al directorio.
7. Permitir enlaces directos mediante la URL.

El menú y el buscador general del sitio se gestionan
desde script.js.
============================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    // ====================================================
    // 1. DATOS DE LOS PROGRAMAS
    // ====================================================

    /*
    Los contenidos son orientativos para el prototipo.
    Los requisitos y la disponibilidad deben validarse
    con el Departamento de Salud Municipal.
    */

    const programas = [

        {
            id: "dependencia-severa",
            nombre: "Programa de Atención Domiciliaria para Personas con Dependencia Severa",
            categoria: "domiciliaria",
            area: "Atención domiciliaria",
            publico: "Personas con dependencia severa y sus cuidadores",

            resumen:
                "Atención y acompañamiento de salud en el domicilio " +
                "para personas que presentan dependencia severa.",

            descripcion:
                "Este programa busca contribuir a la continuidad " +
                "de la atención de salud de personas con dependencia " +
                "severa mediante acciones desarrolladas en el hogar " +
                "y orientación a quienes participan en sus cuidados.",

            objetivo:
                "Apoyar la atención integral y el cuidado de personas " +
                "con dependencia severa en su entorno domiciliario.",

            acciones: [
                "Atención y seguimiento de salud en el domicilio.",
                "Orientación y educación a cuidadores.",
                "Coordinación con el equipo de atención primaria.",
                "Apoyo para la continuidad de los cuidados."
            ]
        },

        {
            id: "acompanamiento-psicosocial",
            nombre: "Programa de Acompañamiento Psicosocial",
            categoria: "bienestar",
            area: "Salud mental y apoyo psicosocial",

            publico:
                "Personas que requieren acompañamiento psicosocial, " +
                "según los criterios del programa",

            resumen:
                "Acompañamiento y apoyo psicosocial orientado " +
                "a fortalecer el bienestar y la continuidad " +
                "de la atención.",

            descripcion:
                "El acompañamiento psicosocial considera acciones " +
                "de apoyo y seguimiento de personas que requieren " +
                "atención en el ámbito de la salud mental y " +
                "su entorno social.",

            objetivo:
                "Favorecer el bienestar psicosocial mediante " +
                "acompañamiento, seguimiento y articulación " +
                "con las redes de apoyo disponibles.",

            acciones: [
                "Acompañamiento y seguimiento psicosocial.",
                "Orientación individual y familiar.",
                "Vinculación con redes de apoyo.",
                "Coordinación con equipos de salud."
            ]
        },

        {
            id: "chile-crece-contigo",
            nombre: "Programa Chile Crece Contigo",
            categoria: "infancia",
            area: "Infancia y desarrollo infantil",

            publico:
                "Niños, niñas y familias, según las etapas " +
                "y criterios del programa",

            resumen:
                "Apoyo al desarrollo infantil y acompañamiento " +
                "a las familias durante las primeras etapas de vida.",

            descripcion:
                "Chile Crece Contigo forma parte de las iniciativas " +
                "de apoyo al desarrollo integral de niños y niñas, " +
                "considerando el acompañamiento de las familias " +
                "y la articulación con servicios de salud " +
                "y protección social.",

            objetivo:
                "Promover el desarrollo integral infantil " +
                "y apoyar a las familias en el proceso " +
                "de crianza y cuidado.",

            acciones: [
                "Acompañamiento del desarrollo infantil.",
                "Orientación a madres, padres y cuidadores.",
                "Apoyo a la crianza.",
                "Articulación con redes de atención y apoyo."
            ]
        },

        {
            id: "elige-vida-sana",
            nombre: "Programa Elige Vida Sana",
            categoria: "bienestar",
            area: "Promoción de estilos de vida saludables",

            publico:
                "Personas que cumplen los criterios " +
                "de ingreso del programa",

            resumen:
                "Promoción de hábitos saludables, actividad física " +
                "y alimentación equilibrada.",

            descripcion:
                "El programa promueve cambios de hábitos " +
                "relacionados con la alimentación, la actividad " +
                "física y el autocuidado, mediante acciones " +
                "preventivas y de acompañamiento.",

            objetivo:
                "Favorecer estilos de vida saludables y contribuir " +
                "a la prevención de factores de riesgo " +
                "asociados a enfermedades crónicas.",

            acciones: [
                "Orientación sobre alimentación saludable.",
                "Promoción de actividad física.",
                "Educación para el autocuidado.",
                "Seguimiento de hábitos y objetivos de salud."
            ]
        },

        {
            id: "mas-ama",
            nombre: "Programa Más Adultos Mayores Autovalentes (Más AMA)",
            categoria: "mayores",
            area: "Personas mayores",

            publico:
                "Personas mayores que cumplen los criterios " +
                "de ingreso del programa",

            resumen:
                "Actividades grupales de autocuidado y estimulación " +
                "funcional para mantener la autonomía.",

            descripcion:
                "El programa desarrolla intervenciones promocionales " +
                "y preventivas mediante actividades grupales " +
                "de autocuidado y estimulación de habilidades " +
                "motoras y cognitivas, con apoyo de profesionales " +
                "de kinesiología y terapia ocupacional.",

            objetivo:
                "Contribuir a mejorar la calidad de vida " +
                "de las personas mayores y prolongar " +
                "su autovalencia.",

            acciones: [
                "Estimulación funcional de habilidades motoras.",
                "Estimulación de habilidades cognitivas.",
                "Actividades grupales de autocuidado.",
                "Promoción del envejecimiento activo.",
                "Trabajo con organizaciones sociales y redes locales."
            ]
        },

        {
            id: "mejor-ninez",
            nombre: "Programa Mejor Niñez",
            categoria: "infancia",
            area: "Infancia y adolescencia",

            publico:
                "Niños, niñas y adolescentes, según los criterios " +
                "y objetivos del programa",

            resumen:
                "Iniciativa vinculada al bienestar y apoyo " +
                "de niños, niñas y adolescentes.",

            descripcion:
                "Este programa aparece en el directorio " +
                "institucional de salud municipal. Su descripción " +
                "operativa específica debe validarse con " +
                "la contraparte antes de una publicación real.",

            objetivo:
                "Apoyar el bienestar de niños, niñas y adolescentes " +
                "según los objetivos definidos por el programa.",

            acciones: [
                "Información y orientación sobre el programa.",
                "Coordinación con las redes pertinentes.",
                "Acciones específicas pendientes de validación institucional."
            ]
        }

    ];

    // ====================================================
    // INTEGRACIÓN CON EL GESTOR DE CONTENIDOS
    // ====================================================

    const CLAVE_CONTENIDOS = "plc_contenidos_demo_v1";

    function obtenerProgramasPublicados() {

        let contenidos = [];

        try {

            const datos = JSON.parse(
                localStorage.getItem(CLAVE_CONTENIDOS) || "[]"
            );

            contenidos = Array.isArray(datos) ? datos : [];

        } catch (error) {

            console.error(
                "Error al leer los programas publicados:",
                error
            );

            return [];
        }

        return contenidos
            .filter(function (item) {

                return (
                    item &&
                    item.categoria === "programas" &&
                    item.estado === "publicado"
                );
            })
            .map(function (item) {

                return {
                    id: item.id,
                    nombre: item.titulo || "Programa de salud",
                    categoria: "general",
                    area: "Programa de salud",
                    publico: "Consultar con el establecimiento",

                    resumen: item.resumen || "",
                    descripcion: item.texto || "",

                    objetivo: "Consultar la descripción del programa.",

                    acciones: []
                };
            });
    }

    programas.push(...obtenerProgramasPublicados());


    // ====================================================
    // 2. ELEMENTOS DEL HTML
    // ====================================================

    const lista = document.getElementById(
        "lista-programas"
    );

    const buscador = document.getElementById(
        "buscar-programa"
    );

    const filtros = document.querySelectorAll(
        ".programa-filtro"
    );

    const contador = document.getElementById(
        "contador-programas"
    );

    const vacio = document.getElementById(
        "programas-vacio"
    );

    const seccionProgramas = document.getElementById(
        "seccion-programas"
    );

    const seccionFicha = document.getElementById(
        "seccion-ficha-programa"
    );

    const botonVolver = document.getElementById(
        "volver-programas"
    );

    let filtroActual = "todos";


    // ====================================================
    // 3. FUNCIONES DE SEGURIDAD Y BÚSQUEDA
    // ====================================================

    function escaparHTML(texto) {

        return String(texto).replace(
            /[&<>"']/g,
            function (caracter) {

                const mapa = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                };

                return mapa[caracter];
            }
        );
    }


    function normalizar(texto) {

        return String(texto)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }


    // ====================================================
    // 4. MOSTRAR PROGRAMAS EN TARJETAS
    // ====================================================

    function mostrarProgramas() {

        const busqueda = normalizar(buscador.value);

        const resultados = programas.filter(function (item) {

            const coincideFiltro =
                filtroActual === "todos" ||
                item.categoria === filtroActual;

            const contenidoBuscable = [
                item.nombre,
                item.area,
                item.publico,
                item.resumen,
                item.descripcion
            ].join(" ");

            const coincideBusqueda =
                normalizar(contenidoBuscable).includes(busqueda);

            return coincideFiltro && coincideBusqueda;
        });


        lista.innerHTML = resultados.map(function (item) {

            return `
                <article class="programa-tarjeta">

                    <div class="programa-imagen">
                        <svg class="icono" aria-hidden="true">
                            <use href="#icon-heart"></use>
                        </svg>
                    </div>

                    <div class="programa-cuerpo">

                        <span class="programa-categoria categoria-${escaparHTML(item.categoria)}">
                            ${escaparHTML(item.area)}
                        </span>

                        <h3>${escaparHTML(item.nombre)}</h3>

                        <p>${escaparHTML(item.resumen)}</p>

                        <button type="button"
                                class="programa-boton"
                                data-id="${escaparHTML(item.id)}">
                            Ver información del programa
                        </button>

                    </div>

                </article>
            `;

        }).join("");


        contador.textContent =
            "Mostrando " + resultados.length +
            " de " + programas.length + " programas.";

        vacio.hidden = resultados.length !== 0;
    }


    // ====================================================
    // 5. FILTRAR PROGRAMAS
    // ====================================================

    filtros.forEach(function (boton) {

        boton.addEventListener("click", function () {

            filtroActual = boton.dataset.filtro;

            filtros.forEach(function (otro) {

                const activo = otro === boton;

                otro.classList.toggle(
                    "activo",
                    activo
                );

                otro.setAttribute(
                    "aria-pressed",
                    String(activo)
                );
            });

            mostrarProgramas();
        });
    });


    // ====================================================
    // 6. BUSCADOR DE PROGRAMAS
    // ====================================================

    buscador.addEventListener(
        "input",
        mostrarProgramas
    );


    // ====================================================
    // 7. COMPLETAR FICHA INDIVIDUAL
    // ====================================================

    function rellenarFicha(item) {

        document.getElementById(
            "ficha-programa-categoria"
        ).textContent = item.area;

        document.getElementById(
            "ficha-programa-nombre"
        ).textContent = item.nombre;

        document.getElementById(
            "ficha-programa-resumen"
        ).textContent = item.resumen;

        document.getElementById(
            "ficha-programa-descripcion"
        ).textContent = item.descripcion;

        document.getElementById(
            "ficha-programa-objetivo"
        ).textContent = item.objetivo;

        document.getElementById(
            "ficha-programa-area"
        ).textContent = item.area;

        document.getElementById(
            "ficha-programa-publico"
        ).textContent = item.publico;

        document.getElementById(
            "ficha-programa-acciones"
        ).innerHTML = item.acciones.map(function (accion) {

            return `<li>${escaparHTML(accion)}</li>`;

        }).join("");
    }


    // ====================================================
    // 8. ABRIR FICHA
    // ====================================================

    function abrirFicha(id) {

        const item = programas.find(function (registro) {
            return registro.id === id;
        });

        if (!item) {
            return;
        }

        rellenarFicha(item);

        seccionProgramas.hidden = true;
        seccionFicha.hidden = false;

        history.pushState(
            { programa: id },
            "",
            "#programa=" + encodeURIComponent(id)
        );

        window.scrollTo(0, 0);

        const titulo = document.getElementById(
            "ficha-programa-nombre"
        );

        titulo.setAttribute("tabindex", "-1");
        titulo.focus({ preventScroll: true });
    }


    // ====================================================
    // 9. VOLVER AL DIRECTORIO
    // ====================================================

    function mostrarDirectorio() {

        seccionFicha.hidden = true;
        seccionProgramas.hidden = false;

        window.scrollTo(0, 0);
    }


    botonVolver.addEventListener("click", function () {

        history.pushState(
            {},
            "",
            window.location.pathname + window.location.search
        );

        mostrarDirectorio();
    });


    // ====================================================
    // 10. EVENTOS DE LAS TARJETAS
    // ====================================================

    lista.addEventListener("click", function (evento) {

        const boton = evento.target.closest(
            "button[data-id]"
        );

        if (!boton) {
            return;
        }

        abrirFicha(boton.dataset.id);
    });


    // ====================================================
    // 11. NAVEGACIÓN MEDIANTE URL
    // ====================================================

    function revisarURL() {

        const hash = window.location.hash;

        if (hash.startsWith("#programa=")) {

            const id = decodeURIComponent(
                hash.substring(10)
            );

            const item = programas.find(function (registro) {
                return registro.id === id;
            });

            if (item) {

                rellenarFicha(item);

                seccionProgramas.hidden = true;
                seccionFicha.hidden = false;

                return;
            }
        }

        mostrarDirectorio();
    }


    window.addEventListener(
        "popstate",
        revisarURL
    );

    window.addEventListener(
        "hashchange",
        revisarURL
    );


    // ====================================================
    // 12. INICIALIZACIÓN
    // ====================================================

    mostrarProgramas();
    revisarURL();

});
