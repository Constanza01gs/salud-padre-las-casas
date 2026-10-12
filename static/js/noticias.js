
/*
============================================================
NOTICIAS Y ACTIVIDADES
Departamento de Salud Municipal de Padre Las Casas
============================================================

Funcionalidades:

1. Cargar las nueve publicaciones históricas.
2. Incorporar noticias del gestor de contenidos.
3. Buscar publicaciones por palabra clave.
4. Filtrar por noticias o actividades.
5. Mostrar tarjetas con categorías diferenciadas.
6. Abrir la ficha individual de cada publicación.
7. Permitir regresar al listado.
8. Conservar la navegación mediante la URL.

Las publicaciones se consultan dentro del prototipo.
No se generan enlaces a sitios oficiales externos.

============================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    // ====================================================
    // 1. PUBLICACIONES HISTÓRICAS
    // ====================================================

    const noticias = [

        {
            id: "proyectos-fndr",
            titulo: "Personas mayores y cuidadores de Padre Las Casas fueron favorecidos con proyectos FNDR que promueven hábitos saludables",
            tipo: "noticia",
            categoria: "Noticia institucional",
            fecha: "25 de agosto de 2025",
            resumen:
                "Proyectos comunitarios apoyaron la promoción de " +
                "hábitos saludables, la atención domiciliaria y " +
                "la formación de monitores de salud.",
            contenido: [
                "El Departamento de Salud Municipal informó sobre proyectos financiados mediante fondos FNDR que beneficiaron a personas mayores, cuidadores y organizaciones comunitarias.",
                "Las iniciativas contemplaron capacitación en autocuidado, prevención de emergencias cardiovasculares y entrega de equipamiento para apoyar el monitoreo de salud.",
                "También se desarrollaron acciones de apoyo a personas con dependencia y a sus cuidadores."
            ]
        },

        {
            id: "laboratorio-clinico",
            titulo: "Inauguran nuevo y moderno equipamiento para el Laboratorio Clínico de Padre Las Casas",
            tipo: "noticia",
            categoria: "Noticia institucional",
            fecha: "25 de agosto de 2025",
            resumen:
                "La comuna incorporó equipamiento para fortalecer " +
                "la capacidad de procesamiento de exámenes clínicos.",
            contenido: [
                "Se inauguró equipamiento moderno destinado al Laboratorio Clínico de Padre Las Casas.",
                "La publicación destaca que la nueva tecnología permite fortalecer la realización de exámenes y mejorar los procesos de atención a usuarios de la comuna.",
                "La iniciativa busca contribuir a una atención más resolutiva en la red de salud municipal."
            ]
        },

        {
            id: "sigaps",
            titulo: "Proyecto de salud pública permitirá priorizar áreas con mayores necesidades de inversión",
            tipo: "noticia",
            categoria: "Noticia institucional",
            fecha: "20 de agosto de 2025",
            resumen:
                "La publicación presenta un proyecto de análisis " +
                "territorial para apoyar la identificación de " +
                "necesidades de salud y la planificación pública.",
            contenido: [
                "El sitio institucional informó sobre el proyecto denominado Sistema Georreferenciado de Privación Múltiple y Salud (SIGAPS).",
                "La iniciativa está orientada a aportar información territorial que contribuya a identificar áreas con mayores necesidades y apoyar la toma de decisiones.",
                "El proyecto se presenta como un antecedente para comprender iniciativas de planificación y análisis de necesidades de salud."
            ]
        },

        {
            id: "convocatoria-medicos",
            titulo: "DSM Padre Las Casas convoca a presentar antecedentes",
            tipo: "noticia",
            categoria: "Noticia institucional",
            fecha: "2 de mayo de 2025",
            resumen:
                "Publicación institucional relacionada con una " +
                "convocatoria para profesionales médicos.",
            contenido: [
                "El Departamento de Salud Municipal publicó una convocatoria para presentar antecedentes profesionales en el área médica.",
                "Se trata de una publicación histórica de mayo de 2025. No debe interpretarse como una convocatoria actualmente abierta.",
                "La información se conserva únicamente como referencia histórica y no constituye una convocatoria vigente."
            ]
        },

        {
            id: "invernadero",
            titulo: "Entrega de invernadero a Jardín Infantil Pilmaiquén con fondos de Promoción de Salud",
            tipo: "actividad",
            categoria: "Actividad comunitaria",
            fecha: "8 de enero de 2025",
            resumen:
                "Actividad vinculada a la promoción de salud " +
                "y entrega de recursos a un jardín infantil.",
            contenido: [
                "El Departamento de Salud Municipal publicó una actividad relacionada con la entrega de un invernadero e insumos al Jardín Infantil Pilmaiquén.",
                "La iniciativa se desarrolló en el contexto de acciones de promoción de salud.",
                "La fecha indicada corresponde a la publicación institucional de la actividad."
            ]
        },

        {
            id: "bailaton",
            titulo: "Primera Bailatón de Personas Mayores de Padre Las Casas",
            tipo: "actividad",
            categoria: "Actividad comunitaria",
            fecha: "8 de enero de 2025",
            resumen:
                "Actividad de encuentro y movimiento orientada " +
                "a fomentar el envejecimiento activo.",
            contenido: [
                "La primera Bailatón de Personas Mayores reunió a participantes de la comuna en una actividad de promoción de la actividad física.",
                "La iniciativa destacó el autocuidado, la prevención de caídas y los estilos de vida saludables.",
                "La actividad fue impulsada desde programas de salud municipal vinculados a promoción de salud y personas mayores."
            ]
        },

        {
            id: "corrida-zumbaton",
            titulo: "Primera corrida familiar en salud y Zumbatón Femenina",
            tipo: "actividad",
            categoria: "Actividad comunitaria",
            fecha: "8 de enero de 2025",
            resumen:
                "Actividad comunitaria relacionada con la " +
                "vida saludable y la participación de la comunidad.",
            contenido: [
                "El sitio institucional publicó información sobre una corrida familiar y una Zumbatón Femenina.",
                "Estas actividades se vinculan con la promoción de hábitos saludables y la participación comunitaria.",
                "Se presenta como registro de una actividad pasada, no como una invitación vigente."
            ]
        },

        {
            id: "interculturalidad",
            titulo: "Equipos de Salud Municipal de Padre Las Casas se capacitan en interculturalidad y cosmovisión mapuche",
            tipo: "noticia",
            categoria: "Noticia institucional",
            fecha: "13 de diciembre de 2023",
            resumen:
                "Capacitación de equipos de salud municipal " +
                "en interculturalidad y cosmovisión mapuche.",
            contenido: [
                "La publicación informa sobre una capacitación dirigida a equipos de la red municipal de salud.",
                "La actividad abordó temáticas de interculturalidad y cosmovisión mapuche.",
                "El registro forma parte de las publicaciones históricas del Departamento de Salud Municipal."
            ]
        },

        {
            id: "plaza-salud-rural",
            titulo: "Primera Plaza de la Salud Rural con Trafkintü y rogativa mapuche",
            tipo: "actividad",
            categoria: "Actividad comunitaria",
            fecha: "21 de noviembre de 2023",
            resumen:
                "Encuentro comunitario rural con actividades " +
                "vinculadas a la salud y la cultura mapuche.",
            contenido: [
                "El Departamento de Salud Municipal publicó una actividad denominada Primera Plaza de la Salud Rural.",
                "El encuentro incluyó Trafkintü y rogativa mapuche, en un contexto de participación y acercamiento comunitario.",
                "La fecha corresponde al registro histórico publicado en el portal."
            ]
        }

    ];


    // ====================================================
    // 2. NOTICIAS DEL GESTOR DE CONTENIDOS
    // ====================================================

    const CLAVE_CONTENIDOS = "plc_contenidos_demo_v1";

    function obtenerNoticiasGestionadas() {

        let contenidos = [];

        try {

            const datos = JSON.parse(
                localStorage.getItem(CLAVE_CONTENIDOS) || "[]"
            );

            contenidos = Array.isArray(datos) ? datos : [];

        } catch (error) {

            console.error(
                "No fue posible cargar las noticias del gestor.",
                error
            );

            return [];
        }

        return contenidos

            .filter(function (contenido) {

                return contenido.categoria === "noticias" &&
                       contenido.estado === "publicado";

            })

            .sort(function (a, b) {

                return new Date(b.fechaActualizacion) -
                       new Date(a.fechaActualizacion);

            })

            .map(function (contenido) {

                const fecha = new Date(
                    contenido.fechaActualizacion ||
                    contenido.fechaCreacion
                );

                const fechaFormateada =
                    Number.isNaN(fecha.getTime())
                        ? "Fecha no disponible"
                        : fecha.toLocaleDateString("es-CL", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        });

                return {

                    id: String(contenido.id),

                    titulo: contenido.titulo,

                    tipo: "noticia",

                    categoria: "Noticia institucional",

                    fecha: fechaFormateada,

                    resumen: contenido.resumen,

                    contenido: String(contenido.texto || "")
                        .split(/\n+/)
                        .map(function (parrafo) {
                            return parrafo.trim();
                        })
                        .filter(Boolean),

                    esGestionada: true

                };

            });
    }


    // Mostrar primero las noticias nuevas del gestor.

    noticias.unshift(...obtenerNoticiasGestionadas());


    // ====================================================
    // 3. ELEMENTOS DEL HTML
    // ====================================================

    const lista = document.getElementById(
        "lista-noticias"
    );

    const filtros = document.querySelectorAll(
        ".noticia-filtro"
    );

    const contador = document.getElementById(
        "contador-noticias"
    );

    const vacio = document.getElementById(
        "noticias-vacio"
    );

    const seccionNoticias = document.getElementById(
        "seccion-noticias"
    );

    const seccionFicha = document.getElementById(
        "seccion-ficha-noticia"
    );

    const botonVolver = document.getElementById(
        "volver-noticias"
    );

    const fichaCategoria = document.getElementById(
        "ficha-noticia-categoria"
    );

    const fichaTitulo = document.getElementById(
        "ficha-noticia-titulo"
    );

    const fichaFecha = document.getElementById(
        "ficha-noticia-fecha"
    );

    const fichaFechaLateral = document.getElementById(
        "ficha-noticia-fecha-lateral"
    );

    const fichaTipo = document.getElementById(
        "ficha-noticia-tipo"
    );

    const fichaContenido = document.getElementById(
        "ficha-noticia-contenido"
    );

    let filtroActual = "todos";


    // ====================================================
    // 4. FUNCIONES DE UTILIDAD
    // ====================================================

    function escaparHTML(texto) {

        return String(texto ?? "").replace(
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

        return String(texto ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }


    // ====================================================
    // 5. MOSTRAR TARJETAS DE PUBLICACIONES
    // ====================================================

    function mostrarNoticias() {

    const resultados = noticias.filter(function (item) {

        return filtroActual === "todos" ||
               item.tipo === filtroActual;

    });

    lista.innerHTML = resultados.map(function (item) {

        return `
            <article class="noticia-tarjeta"
                     data-tipo="${escaparHTML(item.tipo)}">

                <div class="noticia-imagen">

                    <svg class="icono" aria-hidden="true">
                        <use href="#icon-news"></use>
                    </svg>

                </div>

                <div class="noticia-cuerpo">

                    <span class="noticia-categoria">
                        ${escaparHTML(item.categoria)}
                    </span>

                    <div class="noticia-fecha">
                        ${escaparHTML(item.fecha)}
                    </div>

                    <h3>${escaparHTML(item.titulo)}</h3>

                    <p>${escaparHTML(item.resumen)}</p>

                    <button type="button"
                            class="noticia-boton"
                            data-id="${escaparHTML(item.id)}">
                        Leer publicación
                    </button>

                </div>

            </article>
        `;

    }).join("");

    contador.textContent =
        "Mostrando " + resultados.length +
        " de " + noticias.length + " publicaciones.";

    vacio.hidden = resultados.length !== 0;
}


    // ====================================================
    // 6. FILTROS Y BUSCADOR
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

            mostrarNoticias();

        });

    });


    // ====================================================
    // 7. COMPLETAR FICHA INDIVIDUAL
    // ====================================================

    function rellenarFicha(item) {

        // Categoría y color pastel.

        fichaCategoria.textContent = item.categoria;

        fichaCategoria.classList.remove(
            "categoria-noticia",
            "categoria-actividad"
        );

        fichaCategoria.classList.add(
            item.tipo === "actividad"
                ? "categoria-actividad"
                : "categoria-noticia"
        );


        // Información principal.

        fichaTitulo.textContent = item.titulo;

        fichaFecha.textContent =
            "Publicado el " + item.fecha;

        fichaFechaLateral.textContent = item.fecha;

        fichaTipo.textContent =
            item.tipo === "noticia"
                ? "Noticia"
                : "Actividad realizada";


        // Párrafos de la publicación.

        fichaContenido.innerHTML = item.contenido
            .map(function (parrafo) {

                return `<p>${escaparHTML(parrafo)}</p>`;

            })
            .join("");

    }


    // ====================================================
    // 8. ABRIR UNA PUBLICACIÓN
    // ====================================================

    function abrirFicha(id) {

        const item = noticias.find(function (registro) {
            return String(registro.id) === String(id);
        });

        if (!item) {
            return;
        }

        rellenarFicha(item);

        seccionNoticias.hidden = true;
        seccionFicha.hidden = false;

        history.pushState(
            { noticia: String(id) },
            "",
            "#noticia=" + encodeURIComponent(id)
        );

        window.scrollTo(0, 0);

        fichaTitulo.setAttribute(
            "tabindex",
            "-1"
        );

        fichaTitulo.focus({
            preventScroll: true
        });

    }


    // ====================================================
    // 9. EVENTOS DE LAS TARJETAS
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
    // 10. VOLVER AL LISTADO
    // ====================================================

    function mostrarDirectorio() {

        seccionFicha.hidden = true;
        seccionNoticias.hidden = false;

        window.scrollTo(0, 0);

    }


    botonVolver.addEventListener("click", function () {

        history.pushState(
            {},
            "",
            window.location.pathname +
            window.location.search
        );

        mostrarDirectorio();

    });


    // ====================================================
    // 11. NAVEGACIÓN MEDIANTE URL
    // ====================================================

    function revisarURL() {

        const hash = window.location.hash;

        if (hash.startsWith("#noticia=")) {

            let id = "";

            try {

                id = decodeURIComponent(
                    hash.substring("#noticia=".length)
                );

            } catch (error) {

                mostrarDirectorio();
                return;

            }

            const item = noticias.find(function (registro) {

                return String(registro.id) === String(id);

            });

            if (item) {

                rellenarFicha(item);

                seccionNoticias.hidden = true;
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
    );"buscar-noticia"



    // ====================================================
    // 12. INICIALIZACIÓN
    // ====================================================

    mostrarNoticias();

    revisarURL();

});
