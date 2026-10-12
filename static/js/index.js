
/* ==========================================================
   PORTAL DE SALUD MUNICIPAL - PADRE LAS CASAS

   ARCHIVO: index.js

   FUNCIONES EXCLUSIVAS DE LA PÁGINA DE INICIO

   1. Obtener noticias del Gestor de Contenidos
   2. Filtrar publicaciones visibles
   3. Ordenar noticias por fecha
   4. Mostrar hasta tres noticias destacadas
   5. Conservar noticias de ejemplo como respaldo

   PROTOTIPO FRONTEND
   Almacenamiento mediante localStorage.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================
       1. CONFIGURACIÓN
       ====================================================== */

    const CLAVE_CONTENIDOS = "plc_contenidos_demo_v1";

    const contenedorNoticias = document.getElementById(
        "noticias-inicio"
    );

    // Este JavaScript solamente funciona en index.html.

    if (!contenedorNoticias) {
        return;
    }

    // Guardamos las tarjetas originales como respaldo.

    const noticiasOriginales = contenedorNoticias.innerHTML;


    /* ======================================================
       2. LEER CONTENIDOS ALMACENADOS
       ====================================================== */

    function obtenerContenidos() {

        try {

            const datos = JSON.parse(
                localStorage.getItem(CLAVE_CONTENIDOS) || "[]"
            );

            return Array.isArray(datos) ? datos : [];

        } catch (error) {

            console.error(
                "No fue posible leer los contenidos del portal.",
                error
            );

            return [];

        }

    }


    /* ======================================================
       3. OBTENER NOTICIAS PUBLICADAS

       Solo se muestran contenidos:
       - De la categoría noticias.
       - Con estado publicado.

       Los borradores no aparecen en el portal.
       ====================================================== */

    function obtenerNoticiasPublicadas() {

        return obtenerContenidos()
            .filter(function (contenido) {

                return (
                    contenido.categoria === "noticias" &&
                    contenido.estado === "publicado"
                );

            })
            .sort(function (a, b) {

                const fechaA = new Date(
                    a.fechaActualizacion ||
                    a.fechaCreacion ||
                    0
                );

                const fechaB = new Date(
                    b.fechaActualizacion ||
                    b.fechaCreacion ||
                    0
                );

                return fechaB - fechaA;

            })
            .slice(0, 3);

    }


    /* ======================================================
       4. FORMATEAR FECHAS
       ====================================================== */

    function formatearFecha(fechaOriginal) {

        if (!fechaOriginal) {
            return "Publicación institucional";
        }

        const fecha = new Date(fechaOriginal);

        if (Number.isNaN(fecha.getTime())) {
            return "Publicación institucional";
        }

        return fecha.toLocaleDateString("es-CL", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    }


    /* ======================================================
       5. CREAR TARJETA DE NOTICIA

       Utilizamos createElement y textContent para
       insertar los datos sin interpretar HTML.
       ====================================================== */

    function crearTarjetaNoticia(noticia, posicion) {

        const articulo = document.createElement("article");

        articulo.className = "tarjeta-noticia";


        // --------------------------------------------------
        // Imagen o encabezado visual
        // --------------------------------------------------

        const imagen = document.createElement("div");

        imagen.className = "noticia-imagen";

        // Alternamos los estilos visuales existentes.

        const estilosImagen = [
            "noticia-imagen-uno",
            "noticia-imagen-dos",
            "noticia-imagen-tres"
        ];

        imagen.classList.add(
            estilosImagen[posicion % estilosImagen.length]
        );

        const etiqueta = document.createElement("span");

        etiqueta.textContent = "Noticia";

        imagen.appendChild(etiqueta);


        // --------------------------------------------------
        // Contenido
        // --------------------------------------------------

        const contenido = document.createElement("div");

        contenido.className = "noticia-contenido";


        // Título

        const titulo = document.createElement("h3");

        titulo.textContent =
            noticia.titulo || "Noticia institucional";


        // Resumen

        const resumen = document.createElement("p");

        resumen.textContent =
            noticia.resumen ||
            "Conoce esta publicación del Departamento " +
            "de Salud Municipal.";


        // Fecha

        const fecha = document.createElement("p");

        fecha.className = "noticia-fecha";

        fecha.textContent = formatearFecha(
            noticia.fechaActualizacion ||
            noticia.fechaCreacion
        );


        // Enlace a la página de noticias

        const enlace = document.createElement("a");

        enlace.href = "pages/noticias.html";

        enlace.textContent = "Leer más →";


        // --------------------------------------------------
        // Construir tarjeta
        // --------------------------------------------------

        contenido.appendChild(titulo);

        contenido.appendChild(resumen);

        contenido.appendChild(fecha);

        contenido.appendChild(enlace);

        articulo.appendChild(imagen);

        articulo.appendChild(contenido);

        return articulo;

    }


    /* ======================================================
       6. MOSTRAR NOTICIAS DESTACADAS
       ====================================================== */

    function mostrarNoticiasDestacadas() {

        const noticiasPublicadas = obtenerNoticiasPublicadas();

        // Si no existen noticias publicadas, mantenemos
        // las tres tarjetas originales del HTML.

        if (noticiasPublicadas.length === 0) {

            contenedorNoticias.innerHTML = noticiasOriginales;

            return;

        }

        // Si existen noticias publicadas, mostramos
        // hasta las tres más recientes.

        contenedorNoticias.replaceChildren();

        noticiasPublicadas.forEach(function (noticia, indice) {

            const tarjeta = crearTarjetaNoticia(
                noticia,
                indice
            );

            contenedorNoticias.appendChild(tarjeta);

        });

    }


    /* ======================================================
       7. ACTUALIZAR EL INICIO

       La página vuelve a leer localStorage al abrirse.

       También actualizamos cuando otra pestaña modifica
       los contenidos del mismo origen.
       ====================================================== */

    mostrarNoticiasDestacadas();

    window.addEventListener("storage", function (evento) {

        if (evento.key === CLAVE_CONTENIDOS) {

            mostrarNoticiasDestacadas();

        }

    });

});
