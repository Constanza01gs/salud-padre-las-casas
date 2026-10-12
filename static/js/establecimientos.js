
/*
============================================================
PORTAL DE SALUD MUNICIPAL - PADRE LAS CASAS

ARCHIVO: establecimientos.js

FUNCIONALIDADES:

1. Datos de los 12 establecimientos.
2. Búsqueda por nombre, dirección y categoría.
3. Filtros por tipo de establecimiento.
4. Tarjetas con categorías diferenciadas.
5. Fichas individuales.
6. Enlaces telefónicos y de correo.
7. Navegación mediante URL y botones del navegador.
8. Preparación para fotografías futuras.

Los datos corresponden al prototipo académico.
============================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    // ====================================================
    // 1. CONFIGURACIÓN Y DATOS
    // ====================================================

    const horarioCesfam =
        "Lunes a jueves: 08:00 a 17:00 hrs. " +
        "Viernes: 08:00 a 16:00 hrs.";

    const descripcionCesfam =
        "Los Centros de Salud Familiar brindan atención " +
        "primaria con acciones de promoción, prevención, " +
        "tratamiento y rehabilitación, mediante un enfoque " +
        "de salud familiar y comunitaria.";

    const descripcionRural =
        "Centro de salud rural mencionado en el directorio " +
        "institucional. Sus datos específicos están " +
        "pendientes de verificación.";

    /*
       La propiedad imagen se mantiene vacía por ahora.

       Cuando tengamos fotografías, podremos indicar
       su ruta sin modificar el HTML de las tarjetas.

       Ejemplo:
       imagen: "../static/img/establecimientos/cesfam.jpg"
    */

    const establecimientos = [

        {
            id: "cesfam-padre-las-casas",
            nombre: "CESFAM Padre Las Casas",
            tipo: "cesfam",
            categoria: "Centro de Salud Familiar",
            direccion: "Almirante Barroso 365, Padre Las Casas",
            telefono: "452962020",
            correo: "roberto.balmora@padrelascasas.cl",
            responsable: "Roberto Balmora Torres",
            cargo: "Director de establecimiento",
            horario: horarioCesfam,
            descripcion: descripcionCesfam,
            imagen: "",
            activo: true
        },

        {
            id: "cesfam-las-colinas",
            nombre: "CESFAM Las Colinas",
            tipo: "cesfam",
            categoria: "Centro de Salud Familiar",
            direccion: "Mañil 130, Padre Las Casas",
            telefono: "452962250",
            correo: "celso.navarrete@padrelascasas.cl",
            responsable: "Celso Navarrete Berríos",
            cargo: "Director de establecimiento",
            horario: horarioCesfam,
            descripcion: descripcionCesfam,
            imagen: "",
            activo: true
        },

        {
            id: "cesfam-pulmahue",
            nombre: "CESFAM Pulmahue",
            tipo: "cesfam",
            categoria: "Centro de Salud Familiar",
            direccion: "Avenida La Quebrada N.º 1419, Padre Las Casas",
            telefono: "452962100",
            correo: "gquezada@padrelascasas.cl",
            responsable: "Gabriela Quezada Vásquez",
            cargo: "Directora de establecimiento",
            horario: horarioCesfam,
            descripcion: descripcionCesfam,
            imagen: "",
            activo: true
        },

        {
            id: "cesfam-conunhuenu",
            nombre: "CESFAM Conunhuenu",
            tipo: "cesfam",
            categoria: "Centro de Salud Familiar",
            direccion: "Avenida Pulmahue 1405, Padre Las Casas",
            telefono: "452742300",
            correo: "erosales@padrelascasas.cl",
            responsable: "Elizabeth Rosales Velozo",
            cargo: "Directora de establecimiento",
            horario: horarioCesfam,
            descripcion: descripcionCesfam,
            imagen: "",
            activo: true
        },

        {
            id: "sar-padre-las-casas",
            nombre: "SAR Padre Las Casas",
            tipo: "urgencia",
            categoria: "Servicio de Urgencia de Alta Resolución",
            direccion: "Las Águilas 1402, Padre Las Casas",
            telefono: "",
            correo: "aaranda@padrelascasas.cl",
            responsable: "Anita Aranda Parra",
            cargo: "Directora de establecimiento",
            horario: "Atención las 24 horas",
            descripcion:
                "El SAR proporciona atención de urgencias " +
                "de menor y mediana complejidad. También " +
                "permite estabilizar y derivar a centros " +
                "hospitalarios los casos que lo requieran.",
            imagen: "",
            activo: true
        },

        {
            id: "ccr",
            nombre: "Centro Comunitario de Rehabilitación (CCR)",
            tipo: "rehabilitacion",
            categoria: "Centro Comunitario de Rehabilitación",
            direccion: "Francisco Pizarro 680, Padre Las Casas",
            telefono: "452746450",
            correo: "contacto.ccr@padrelascasas.cl",
            responsable: "Josefa Molina Sandoval",
            cargo: "Encargada de programa",
            horario: horarioCesfam,
            descripcion:
                "El Centro Comunitario de Rehabilitación " +
                "brinda apoyo a personas que presentan " +
                "condiciones de salud asociadas a discapacidad " +
                "física, mediante servicios como kinesiología, " +
                "terapia ocupacional, psicología, asistencia " +
                "social y fonoaudiología.",
            imagen: "",
            activo: true
        },

        {
            id: "rural-roble-huacho",
            nombre: "Centro de Salud Rural Roble Huacho",
            tipo: "rural",
            categoria: "Centro de Salud Rural",
            direccion: "",
            telefono: "",
            correo: "",
            responsable: "",
            cargo: "",
            horario: "",
            descripcion: descripcionRural,
            imagen: "",
            activo: true
        },

        {
            id: "rural-san-ramon",
            nombre: "Centro de Salud Rural San Ramón",
            tipo: "rural",
            categoria: "Centro de Salud Rural",
            direccion: "",
            telefono: "",
            correo: "",
            responsable: "",
            cargo: "",
            horario: "",
            descripcion: descripcionRural,
            imagen: "",
            activo: true
        },

        {
            id: "rural-laurel-huacho",
            nombre: "Centro de Salud Rural Laurel Huacho",
            tipo: "rural",
            categoria: "Centro de Salud Rural",
            direccion: "",
            telefono: "",
            correo: "",
            responsable: "",
            cargo: "",
            horario: "",
            descripcion: descripcionRural,
            imagen: "",
            activo: true
        },

        {
            id: "rural-metrenco",
            nombre: "Centro de Salud Rural Metrenco",
            tipo: "rural",
            categoria: "Centro de Salud Rural",
            direccion: "",
            telefono: "",
            correo: "",
            responsable: "",
            cargo: "",
            horario: "",
            descripcion: descripcionRural,
            imagen: "",
            activo: true
        },

        {
            id: "rural-codopille",
            nombre: "Centro de Salud Rural Codopille",
            tipo: "rural",
            categoria: "Centro de Salud Rural",
            direccion: "",
            telefono: "",
            correo: "",
            responsable: "",
            cargo: "",
            horario: "",
            descripcion: descripcionRural,
            imagen: "",
            activo: true
        },

        {
            id: "rural-truf-truf",
            nombre: "Centro de Salud Rural Truf Truf",
            tipo: "rural",
            categoria: "Centro de Salud Rural",
            direccion: "",
            telefono: "",
            correo: "",
            responsable: "",
            cargo: "",
            horario: "",
            descripcion: descripcionRural,
            imagen: "",
            activo: true
        }

    ];


    // ====================================================
    // 2. ELEMENTOS DE LA INTERFAZ
    // ====================================================

    const lista = document.getElementById(
        "lista-establecimientos"
    );

    const buscador = document.getElementById(
        "buscar-establecimiento"
    );

    const botonesFiltro = document.querySelectorAll(
        ".filtro-boton"
    );

    const contador = document.getElementById(
        "contador-establecimientos"
    );

    const mensajeVacio = document.getElementById(
        "directorio-vacio"
    );

    const seccionDirectorio = document.getElementById(
        "seccion-directorio"
    );

    const seccionFicha = document.getElementById(
        "seccion-ficha"
    );

    const botonVolver = document.getElementById(
        "volver-directorio"
    );

    const fichaCategoria = document.getElementById(
        "ficha-categoria"
    );

    const fichaNombre = document.getElementById(
        "ficha-nombre"
    );

    const fichaResumen = document.getElementById(
        "ficha-resumen"
    );

    const fichaDatos = document.getElementById(
        "ficha-datos"
    );

    let filtroActual = "todos";


    // ====================================================
    // 3. UTILIDADES
    // ====================================================

    /*
       Evita que los valores incorporados en el HTML
       sean interpretados como etiquetas o código.
    */

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
       Permite buscar sin distinguir entre mayúsculas,
       minúsculas o tildes.
    */

    function normalizar(texto) {

        return String(texto ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }


    function datoDisponible(valor) {

        const texto = String(valor ?? "").trim();

        return texto || "Información pendiente de confirmar";
    }


    /*
       Por ahora utilizamos el icono de edificio.
       Posteriormente se reemplazará por fotografías.
    */

    function obtenerImagen(item) {

        if (item.imagen) {

            return `
                <img
                    src="${escaparHTML(item.imagen)}"
                    alt="${escaparHTML(item.nombre)}"
                    loading="lazy"
                >
            `;
        }

        return `
            <svg class="icono" aria-hidden="true">
                <use href="#icon-building"></use>
            </svg>
        `;
    }


    // ====================================================
    // 4. OBTENER ESTABLECIMIENTOS VISIBLES
    // ====================================================

    /*
       La propiedad activo permite preparar el directorio
       para una futura administración de establecimientos.

       Por ahora los registros son locales y todos
       permanecen activos.

       La integración con el almacenamiento del panel
       administrativo se realizará cuando revisemos
       su estructura real.
    */

    function obtenerEstablecimientosActivos() {

        const CLAVE_ADMIN = "plc_establecimientos_demo_v1";
        const CLAVE_FICHAS = "plc_establecimientos_info_demo_v1";

        function leerDatos(clave) {

            try {

                const datos = JSON.parse(
                    localStorage.getItem(clave) || "[]"
                );

                return Array.isArray(datos) ? datos : [];

            } catch (error) {

                console.error(
                    "Error al leer establecimientos:",
                    error
                );

                return [];
            }
        }

        const registrosAdmin = leerDatos(CLAVE_ADMIN);
        const fichas = leerDatos(CLAVE_FICHAS);

        function buscarRegistro(lista, nombre) {

            return lista.find(function (item) {

                return (
                    item &&
                    normalizar(item.nombre) === normalizar(nombre)
                );

            });
        }

        function normalizarTipo(tipo) {

            const valor = normalizar(tipo);

            if (valor.includes("cesfam")) {
                return "cesfam";
            }

            if (
                valor.includes("rural") ||
                valor.includes("posta")
            ) {
                return "rural";
            }

            if (
                valor.includes("urgencia") ||
                valor.includes("sar") ||
                valor.includes("sapu")
            ) {
                return "urgencia";
            }

            if (valor.includes("rehabilitacion")) {
                return "rehabilitacion";
            }

            return "otros";
        }

        function obtenerCategoria(tipo) {

            const categorias = {
                cesfam: "Centro de Salud Familiar",
                rural: "Centro de Salud Rural",
                urgencia: "Servicio de Urgencia",
                rehabilitacion: "Centro de Rehabilitación",
                otros: "Establecimiento de salud"
            };

            return categorias[tipo] || categorias.otros;
        }

        // ====================================================
        // 1. CONSERVAR LOS ESTABLECIMIENTOS ORIGINALES
        // ====================================================

        const resultado = establecimientos
            .filter(function (item) {

                return item.activo !== false;

            })
            .map(function (item) {

                const ficha = buscarRegistro(
                    fichas,
                    item.nombre
                );

                if (!ficha) {
                    return { ...item };
                }

                return {
                    ...item,

                    descripcion:
                        ficha.descripcion || item.descripcion,

                    direccion:
                        ficha.direccion || item.direccion,

                    horario:
                        ficha.horario || item.horario,

                    telefono:
                        ficha.telefono || item.telefono,

                    correo:
                        ficha.correo || item.correo
                };
            });

        // ====================================================
        // 2. INCORPORAR ESTABLECIMIENTOS DEL ADMINISTRADOR
        // ====================================================

        registrosAdmin.forEach(function (registro) {

            if (
                !registro ||
                registro.activo === false ||
                !registro.nombre
            ) {
                return;
            }

            // Evitar duplicar establecimientos originales.

            const yaExiste = buscarRegistro(
                resultado,
                registro.nombre
            );

            if (yaExiste) {
                return;
            }

            const ficha = buscarRegistro(
                fichas,
                registro.nombre
            );

            const tipo = normalizarTipo(registro.tipo);

            resultado.push({

                id: String(registro.id),

                nombre: registro.nombre,

                tipo: tipo,

                categoria: obtenerCategoria(tipo),

                direccion:
                    ficha?.direccion ||
                    registro.direccion ||
                    "",

                telefono:
                    ficha?.telefono || "",

                correo:
                    ficha?.correo || "",

                horario:
                    ficha?.horario || "",

                descripcion:
                    ficha?.descripcion ||
                    "Información pendiente de confirmar.",

                responsable: "",

                cargo: "",

                imagen: "",

                activo: true
            });
        });

        return resultado;
    }


    // ====================================================
    // 5. MOSTRAR TARJETAS
    // ====================================================

    function mostrarEstablecimientos() {

        const texto = normalizar(buscador.value);

        const disponibles = obtenerEstablecimientosActivos();

        const resultados = disponibles.filter(function (item) {

            const coincideTipo =
                filtroActual === "todos" ||
                item.tipo === filtroActual;

            const contenidoBuscable = normalizar(
                [
                    item.nombre,
                    item.direccion,
                    item.categoria
                ].join(" ")
            );

            const coincideTexto =
                contenidoBuscable.includes(texto);

            return coincideTipo && coincideTexto;
        });


        lista.innerHTML = resultados.map(function (item) {

            return `
                <article
                    class="establecimiento-tarjeta"
                    data-tipo="${escaparHTML(item.tipo)}"
                >

                    <div class="establecimiento-imagen">

                        ${obtenerImagen(item)}

                    </div>

                    <div class="establecimiento-cuerpo">

                        <span class="establecimiento-categoria">

                            ${escaparHTML(item.categoria)}

                        </span>

                        <h3>
                            ${escaparHTML(item.nombre)}
                        </h3>

                        <p class="establecimiento-dato">

                            <strong>Dirección:</strong>

                            ${escaparHTML(
                                datoDisponible(item.direccion)
                            )}

                        </p>

                        <p class="establecimiento-dato">

                            <strong>Horario:</strong>

                            ${escaparHTML(
                                datoDisponible(item.horario)
                            )}

                        </p>

                        <div class="establecimiento-acciones">

                            <button
                                class="boton-ficha"
                                type="button"
                                data-id="${escaparHTML(item.id)}"
                            >

                                Ver ficha del establecimiento

                            </button>

                        </div>

                    </div>

                </article>
            `;

        }).join("");


        contador.textContent =
            "Mostrando " +
            resultados.length +
            " de " +
            disponibles.length +
            " establecimientos.";


        mensajeVacio.hidden = resultados.length !== 0;
    }


    // ====================================================
    // 6. FILTRAR POR CATEGORÍA
    // ====================================================

    botonesFiltro.forEach(function (boton) {

        boton.addEventListener("click", function () {

            filtroActual = boton.dataset.filtro;

            botonesFiltro.forEach(function (otroBoton) {

                const activo = otroBoton === boton;

                otroBoton.classList.toggle(
                    "activo",
                    activo
                );

                otroBoton.setAttribute(
                    "aria-pressed",
                    String(activo)
                );
            });

            mostrarEstablecimientos();
        });
    });


    // ====================================================
    // 7. BÚSQUEDA EN TIEMPO REAL
    // ====================================================

    buscador.addEventListener(
        "input",
        mostrarEstablecimientos
    );


    // ====================================================
    // 8. CREAR CAMPOS DE LA FICHA
    // ====================================================

    function crearDato(titulo, valor, tipo) {

        let contenido = escaparHTML(
            datoDisponible(valor)
        );

        if (valor && tipo === "telefono") {

            const telefonoLimpio = String(valor)
                .replace(/[^\d+]/g, "");

            contenido = `
                <a href="tel:${escaparHTML(telefonoLimpio)}">

                    ${escaparHTML(valor)}

                </a>
            `;
        }

        if (valor && tipo === "correo") {

            contenido = `
                <a href="mailto:${escaparHTML(valor)}">

                    ${escaparHTML(valor)}

                </a>
            `;
        }

        return `
            <div class="ficha-dato">

                <dt>
                    ${escaparHTML(titulo)}
                </dt>

                <dd>
                    ${contenido}
                </dd>

            </div>
        `;
    }


    // ====================================================
    // 9. MOSTRAR INFORMACIÓN DE UNA FICHA
    // ====================================================

    /*
       Esta función reúne toda la construcción de la ficha.

       De esta forma evitamos repetir código al:
       - Abrir una tarjeta.
       - Acceder directamente mediante una URL.
       - Utilizar los botones atrás y adelante.
    */

    function mostrarFicha(item) {

        fichaCategoria.textContent = item.categoria;

        fichaCategoria.dataset.tipo = item.tipo;

        fichaNombre.textContent = item.nombre;

        fichaResumen.textContent = item.descripcion;

        fichaDatos.innerHTML =

            crearDato(
                "Dirección",
                item.direccion
            ) +

            crearDato(
                "Teléfono",
                item.telefono,
                "telefono"
            ) +

            crearDato(
                "Correo electrónico",
                item.correo,
                "correo"
            ) +

            crearDato(
                "Horario de funcionamiento",
                item.horario
            ) +

            crearDato(
                item.cargo || "Responsable",
                item.responsable
            );


        seccionDirectorio.hidden = true;

        seccionFicha.hidden = false;


        window.scrollTo({
            top: 0,
            behavior: "instant"
        });


        fichaNombre.setAttribute(
            "tabindex",
            "-1"
        );

        fichaNombre.focus({
            preventScroll: true
        });
    }


    // ====================================================
    // 10. ABRIR FICHA DESDE UNA TARJETA
    // ====================================================

    function abrirFicha(id) {

        const disponibles = obtenerEstablecimientosActivos();

        const item = disponibles.find(function (registro) {
            return registro.id === id;
        });

        if (!item) {
            return;
        }

        const nuevoHash =
            "#ficha=" + encodeURIComponent(id);


        /*
           Actualizamos la URL para permitir compartir
           el enlace de una ficha individual.
        */

        if (window.location.hash !== nuevoHash) {

            history.pushState(
                { establecimiento: id },
                "",
                nuevoHash
            );
        }

        mostrarFicha(item);
    }


    // ====================================================
    // 11. REGRESAR AL DIRECTORIO
    // ====================================================

    function mostrarDirectorio() {

        seccionFicha.hidden = true;

        seccionDirectorio.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }


    botonVolver.addEventListener("click", function () {

        /*
           Quitamos el identificador de la ficha
           conservando la ruta actual.
        */

        const rutaDirectorio =
            window.location.pathname +
            window.location.search;

        history.pushState(
            {},
            "",
            rutaDirectorio
        );

        mostrarDirectorio();
    });


    // ====================================================
    // 12. EVENTOS DE LAS TARJETAS
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
    // 13. REVISAR URL Y NAVEGACIÓN DEL NAVEGADOR
    // ====================================================

    function revisarURL() {

        const hash = window.location.hash;

        if (hash.startsWith("#ficha=")) {

            let id = "";

            try {

                id = decodeURIComponent(
                    hash.substring(7)
                );

            } catch (error) {

                mostrarDirectorio();
                return;
            }

            const disponibles =
                obtenerEstablecimientosActivos();

            const item = disponibles.find(
                function (registro) {

                    return registro.id === id;
                }
            );

            if (item) {

                mostrarFicha(item);
                return;
            }
        }

        mostrarDirectorio();
    }


    /*
       popstate:
       Se ejecuta cuando el usuario utiliza
       los botones atrás o adelante del navegador.

       hashchange:
       Permite reaccionar a cambios directos
       del identificador de la URL.
    */

    window.addEventListener(
        "popstate",
        revisarURL
    );

    window.addEventListener(
        "hashchange",
        revisarURL
    );


    // ====================================================
    // 14. INICIALIZACIÓN
    // ====================================================

    mostrarEstablecimientos();

    revisarURL();

});
