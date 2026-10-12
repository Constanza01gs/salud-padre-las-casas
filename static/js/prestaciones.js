
/*
============================================================
PORTAL DE SALUD MUNICIPAL - PADRE LAS CASAS

ARCHIVO: prestaciones.js

FUNCIONALIDADES:

1. Catálogo de nueve áreas de prestaciones.
2. Búsqueda por nombre, descripción y prestación.
3. Filtros por categoría.
4. Colores individuales para cada área.
5. Despliegue de listados de prestaciones.
6. Conservación de los detalles abiertos al filtrar.

Los datos pertenecen al prototipo académico.
============================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    // ====================================================
    // 1. DATOS DEL CATÁLOGO
    // ====================================================

    const prestaciones = [

        {
            id: "nino-sano",
            titulo: "Control del niño sano",
            categoria: "ciclo-vida",
            descripcion:
                "Atenciones orientadas al crecimiento, desarrollo, " +
                "prevención y seguimiento de la salud infantil.",
            servicios: [
                "Control de salud del niño sano",
                "Evaluación del desarrollo psicomotor",
                "Control de malnutrición",
                "Control de lactancia materna",
                "Consulta nutricional",
                "Consulta de morbilidad",
                "Control de enfermedades crónicas",
                "Consulta por déficit del desarrollo psicomotor",
                "Consulta kinésica",
                "Consulta de salud mental",
                "Vacunación",
                "Programa Nacional de Alimentación Complementaria",
                "Atención a domicilio",
                "Educación a grupos de riesgo"
            ]
        },

        {
            id: "salud-sexual",
            titulo: "Salud sexual y reproductiva",
            categoria: "ciclo-vida",
            descripcion:
                "Controles y consejerías relacionadas con la salud " +
                "sexual, reproductiva, prenatal y ginecológica.",
            servicios: [
                "Control prenatal",
                "Control de puerperio",
                "Control de regulación de fecundidad",
                "Consejería en salud sexual y reproductiva",
                "Control ginecológico preventivo",
                "Consulta de morbilidad obstétrica",
                "Consulta de morbilidad ginecológica",
                "Consulta nutricional",
                "Educación grupal",
                "Programa Nacional de Alimentación Complementaria"
            ]
        },

        {
            id: "adolescente",
            titulo: "Salud adolescente",
            categoria: "ciclo-vida",
            descripcion:
                "Atenciones preventivas, controles y apoyo integral " +
                "para adolescentes.",
            servicios: [
                "Control de salud",
                "Consulta de morbilidad",
                "Control de enfermedades crónicas",
                "Control prenatal",
                "Control de puerperio",
                "Regulación de fecundidad",
                "Consejería en salud sexual y reproductiva",
                "Control ginecológico preventivo",
                "Intervención psicosocial",
                "Consulta y consejería de salud mental",
                "Educación grupal",
                "Programa Nacional de Alimentación Complementaria"
            ]
        },

        {
            id: "persona-mayor",
            titulo: "Salud de personas mayores",
            categoria: "ciclo-vida",
            descripcion:
                "Controles y atenciones para apoyar la salud, " +
                "autonomía y bienestar de las personas mayores.",
            servicios: [
                "Consulta de morbilidad",
                "Control de enfermedades crónicas",
                "Consulta nutricional",
                "Control de salud",
                "Intervención psicosocial",
                "Consulta y consejería de salud mental",
                "Educación grupal",
                "Atención a domicilio",
                "Atención podológica a pacientes con diabetes",
                "Curación del pie diabético",
                "Intervención grupal de actividad física"
            ]
        },

        {
            id: "cardiovascular",
            titulo: "Salud cardiovascular",
            categoria: "especializada",
            descripcion:
                "Seguimiento de enfermedades crónicas y actividades " +
                "de prevención y control cardiovascular.",
            servicios: [
                "Consulta de morbilidad",
                "Control de enfermedades crónicas",
                "Consulta nutricional",
                "Control de salud",
                "Intervención psicosocial",
                "Consulta de salud mental",
                "Educación grupal",
                "Consulta kinésica",
                "Vacunación contra influenza",
                "Atención a domicilio",
                "Atención podológica a pacientes con diabetes",
                "Curación del pie diabético"
            ]
        },

        {
            id: "salud-oral",
            titulo: "Salud oral",
            categoria: "especializada",
            descripcion:
                "Prestaciones odontológicas preventivas, " +
                "de tratamiento y atención de urgencias.",
            servicios: [
                "Examen de salud oral",
                "Educación grupal",
                "Urgencias odontológicas",
                "Exodoncias",
                "Destartraje y pulido coronario",
                "Obturaciones temporales y definitivas",
                "Aplicación de sellantes",
                "Pulpotomías",
                "Barniz de flúor",
                "Endodoncia"
            ]
        },

        {
            id: "salud-mental",
            titulo: "Salud mental",
            categoria: "especializada",
            descripcion:
                "Atenciones de apoyo psicológico, psicosocial " +
                "y tratamiento en el ámbito de salud mental.",
            servicios: [
                "Consulta de salud mental",
                "Consejería de salud mental",
                "Intervención psicosocial",
                "Psicoterapia",
                "Visitas domiciliarias",
                "Consejería familiar",
                "Consejería individual",
                "Intervención psicosocial grupal",
                "Tratamiento farmacológico",
                "Informes a tribunal, cuando corresponda"
            ]
        },

        {
            id: "ges",
            titulo: "Prestaciones asociadas a GES",
            categoria: "ges",
            descripcion:
                "Actividades de diagnóstico, tratamiento y seguimiento " +
                "asociadas a condiciones contempladas en las " +
                "Garantías Explícitas en Salud.",
            servicios: [
                "Hipertensión arterial",
                "Diabetes mellitus tipo 2",
                "Atención odontológica integral a niños de 6 años",
                "Epilepsia no refractaria",
                "Infecciones respiratorias agudas en menores de 5 años",
                "Neumonía de manejo ambulatorio en personas mayores",
                "Enfermedad pulmonar obstructiva crónica",
                "Asma bronquial",
                "Presbicia en personas de 65 años y más",
                "Artrosis de cadera y rodilla",
                "Urgencia odontológica ambulatoria",
                "Atención odontológica integral a adultos de 60 años",
                "Salud oral integral de la mujer embarazada",
                "Hipotiroidismo",
                "Tratamiento para erradicación de Helicobacter pylori"
            ]
        },

        {
            id: "generales",
            titulo: "Actividades generales de salud",
            categoria: "generales",
            descripcion:
                "Actividades transversales que complementan " +
                "las prestaciones de los distintos programas.",
            servicios: [
                "Educación grupal ambiental",
                "Consejería familiar",
                "Visita domiciliaria integral",
                "Consulta social",
                "Tratamientos y curaciones",
                "Intervención familiar psicosocial",
                "Diagnóstico y control de tuberculosis",
                "Exámenes de laboratorio básico"
            ]
        }

    ];

    // ====================================================
    // INTEGRACIÓN CON EL GESTOR DE CONTENIDOS
    // ====================================================

    const CLAVE_CONTENIDOS = "plc_contenidos_demo_v1";

    function obtenerPrestacionesPublicadas() {

        let contenidos = [];

        try {

            const datos = JSON.parse(
                localStorage.getItem(CLAVE_CONTENIDOS) || "[]"
            );

            contenidos = Array.isArray(datos) ? datos : [];

        } catch (error) {

            console.error(
                "Error al leer las prestaciones publicadas:",
                error
            );

            return [];
        }

        return contenidos
            .filter(function (item) {

                return (
                    item &&
                    item.categoria === "prestaciones" &&
                    item.estado === "publicado"
                );
            })
            .map(function (item) {

                return {
                    id: item.id,
                    titulo: item.titulo || "Prestación de salud",
                    categoria: "generales",
                    descripcion: item.resumen || "",
                    servicios: item.texto
                        ? item.texto.split(/\r?\n/)
                            .map(function (linea) {
                                return linea.trim();
                            })
                            .filter(Boolean)
                        : []
                };
            });
    }

    prestaciones.push(...obtenerPrestacionesPublicadas());


    // ====================================================
    // 2. ELEMENTOS DE LA INTERFAZ
    // ====================================================

    const lista = document.getElementById(
        "lista-prestaciones"
    );

    const buscador = document.getElementById(
        "buscar-prestacion"
    );

    const botones = document.querySelectorAll(
        ".prestacion-filtro"
    );

    const contador = document.getElementById(
        "contador-prestaciones"
    );

    const mensajeVacio = document.getElementById(
        "prestaciones-vacio"
    );

    let filtroActual = "todos";

    /*
       Conservamos qué áreas están desplegadas,
       incluso si se cambia la búsqueda o el filtro.
    */

    const detallesAbiertos = new Set();


    // ====================================================
    // 3. FUNCIONES AUXILIARES
    // ====================================================

    function escaparHTML(valor) {

        return String(valor ?? "").replace(
            /[&<>"']/g,
            function (caracter) {

                const equivalencias = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                };

                return equivalencias[caracter];
            }
        );
    }


    /*
       Permite buscar sin distinguir entre
       mayúsculas, minúsculas y tildes.
    */

    function normalizar(valor) {

        return String(valor ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }


    // ====================================================
    // 4. MOSTRAR PRESTACIONES
    // ====================================================

    function mostrarPrestaciones() {

        const busqueda = normalizar(
            buscador.value
        );

        /*
           Filtramos por categoría y también buscamos
           dentro de los listados de prestaciones.
        */

        const resultados = prestaciones.filter(
            function (item) {

                const coincideCategoria =
                    filtroActual === "todos" ||
                    item.categoria === filtroActual;

                const contenidoBuscable = [
                    item.titulo,
                    item.descripcion,
                    ...item.servicios
                ].join(" ");

                const coincideBusqueda =
                    normalizar(contenidoBuscable)
                        .includes(busqueda);

                return (
                    coincideCategoria &&
                    coincideBusqueda
                );
            }
        );


        // ------------------------------------------------
        // GENERAR TARJETAS
        // ------------------------------------------------

        lista.innerHTML = resultados.map(
            function (item) {

                const abierto = detallesAbiertos.has(
                    item.id
                );

                const serviciosHTML = item.servicios.map(
                    function (servicio) {

                        return `
                            <li>
                                ${escaparHTML(servicio)}
                            </li>
                        `;
                    }
                ).join("");


                return `
                    <article
                        class="prestacion-tarjeta"
                        data-area="${escaparHTML(item.id)}"
                    >

                        <!-- ICONO DE LA PRESTACIÓN -->

                        <div class="prestacion-icono">

                            <svg
                                class="icono"
                                aria-hidden="true"
                            >
                                <use href="#icon-heart"></use>
                            </svg>

                        </div>


                        <!-- NOMBRE -->

                        <h3>
                            ${escaparHTML(item.titulo)}
                        </h3>


                        <!-- DESCRIPCIÓN -->

                        <p class="prestacion-descripcion">

                            ${escaparHTML(item.descripcion)}

                        </p>


                        <!-- BOTÓN DESPLEGABLE -->

                        <button
                            type="button"
                            class="prestacion-boton"
                            data-id="${escaparHTML(item.id)}"
                            aria-expanded="${abierto}"
                            aria-controls="detalle-${escaparHTML(item.id)}"
                        >

                            ${
                                abierto
                                    ? "Ocultar prestaciones"
                                    : "Ver prestaciones"
                            }

                        </button>


                        <!-- LISTADO DE PRESTACIONES -->

                        <div
                            class="prestacion-detalle"
                            id="detalle-${escaparHTML(item.id)}"
                            ${abierto ? "" : "hidden"}
                        >

                            <h4>
                                Prestaciones y actividades
                            </h4>

                            <ul>
                                ${serviciosHTML}
                            </ul>

                        </div>

                    </article>
                `;
            }
        ).join("");


        // ------------------------------------------------
        // ACTUALIZAR CONTADOR
        // ------------------------------------------------

        contador.textContent =
            "Mostrando " +
            resultados.length +
            " de " +
            prestaciones.length +
            " áreas de prestaciones.";


        // ------------------------------------------------
        // MOSTRAR U OCULTAR MENSAJE SIN RESULTADOS
        // ------------------------------------------------

        mensajeVacio.hidden =
            resultados.length !== 0;
    }


    // ====================================================
    // 5. FILTROS POR CATEGORÍA
    // ====================================================

    botones.forEach(function (boton) {

        boton.addEventListener("click", function () {

            filtroActual = boton.dataset.filtro;

            botones.forEach(function (otroBoton) {

                const activo =
                    otroBoton === boton;

                otroBoton.classList.toggle(
                    "activo",
                    activo
                );

                otroBoton.setAttribute(
                    "aria-pressed",
                    String(activo)
                );
            });

            mostrarPrestaciones();
        });
    });


    // ====================================================
    // 6. BÚSQUEDA EN TIEMPO REAL
    // ====================================================

    buscador.addEventListener(
        "input",
        mostrarPrestaciones
    );


    // ====================================================
    // 7. MOSTRAR Y OCULTAR DETALLES
    // ====================================================

    /*
       Usamos delegación de eventos para que los
       botones sigan funcionando después de aplicar
       filtros o búsquedas.
    */

    lista.addEventListener("click", function (evento) {

        const boton = evento.target.closest(
            "button[data-id]"
        );

        if (!boton) {
            return;
        }

        const id = boton.dataset.id;

        if (detallesAbiertos.has(id)) {

            detallesAbiertos.delete(id);

        } else {

            detallesAbiertos.add(id);
        }

        /*
           Actualizamos el botón y su detalle sin
           reconstruir toda la cuadrícula.

           Así evitamos que el foco del teclado se
           pierda al abrir o cerrar una tarjeta.
        */

        const tarjeta = boton.closest(
            ".prestacion-tarjeta"
        );

        const detalle = tarjeta.querySelector(
            ".prestacion-detalle"
        );

        const abierto = detallesAbiertos.has(id);

        boton.setAttribute(
            "aria-expanded",
            String(abierto)
        );

        boton.textContent = abierto
            ? "Ocultar prestaciones"
            : "Ver prestaciones";

        detalle.hidden = !abierto;
    });


    // ====================================================
    // 8. INICIALIZACIÓN
    // ====================================================

    mostrarPrestaciones();

});
