
/*
============================================================
ENCUESTA DE SATISFACCIÓN
DEPARTAMENTO DE SALUD MUNICIPAL DE PADRE LAS CASAS
============================================================

Funciones:
1. Validar las respuestas obligatorias.
2. Obtener las evaluaciones de 1 a 5.
3. Registrar encuestas anónimas en localStorage.
4. Proteger los registros existentes ante errores.
5. Advertir sobre información personal en comentarios.
6. Mostrar la confirmación del registro.
7. Permitir responder otra encuesta.

IMPORTANTE:
Este sistema es un prototipo académico.
Los datos se almacenan únicamente en el navegador.
============================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // 1. ELEMENTOS DEL FORMULARIO
    // ========================================================

    const formulario = document.getElementById(
        "formulario-encuesta"
    );

    const seccionEncuesta = document.getElementById(
        "seccion-encuesta"
    );

    const seccionConfirmacion = document.getElementById(
        "seccion-confirmacion-encuesta"
    );

    const mensajeError = document.getElementById(
        "encuesta-error"
    );

    const botonOtraEncuesta = document.getElementById(
        "boton-otra-encuesta"
    );

    const campoEstablecimiento = document.getElementById(
        "encuesta-establecimiento"
    );

    const campoComentarios = document.getElementById(
        "encuesta-comentarios"
    );

    // Evitar errores si falta algún elemento del HTML.

    if (
        !formulario ||
        !seccionEncuesta ||
        !seccionConfirmacion ||
        !mensajeError ||
        !botonOtraEncuesta ||
        !campoEstablecimiento ||
        !campoComentarios
    ) {
        console.error(
            "No se encontraron todos los elementos " +
            "necesarios de la encuesta."
        );

        return;
    }


    // ========================================================
    // 2. CONFIGURACIÓN
    // ========================================================

    /*
    Mantener esta clave permite que el dashboard OIRS
    siga leyendo las encuestas registradas.
    */

    const CLAVE_ENCUESTAS = "plc_encuestas_demo_v1";

    const PREGUNTAS = [
        "trato",
        "tiempoEspera",
        "claridad",
        "satisfaccionGeneral"
    ];


    // ========================================================
    // 3. MOSTRAR Y OCULTAR ERRORES
    // ========================================================

    function mostrarError(texto) {

        mensajeError.textContent = texto;
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


    // ========================================================
    // 4. OBTENER UNA RESPUESTA SELECCIONADA
    // ========================================================

    function obtenerValorRadio(nombre) {

        const seleccionado = formulario.querySelector(
            'input[name="' + nombre + '"]:checked'
        );

        if (!seleccionado) {
            return null;
        }

        const valor = Number(seleccionado.value);

        if (
            !Number.isInteger(valor) ||
            valor < 1 ||
            valor > 5
        ) {
            return null;
        }

        return valor;
    }


    // ========================================================
    // 5. LEER ENCUESTAS EXISTENTES
    // ========================================================

    /*
    Antes, un error de lectura podía devolver [].

    Ahora diferenciamos entre:
    - No existen encuestas todavía: devolver [].
    - Hay información dañada: lanzar un error.

    De esta forma evitamos reemplazar accidentalmente
    registros anteriores.
    */

    function obtenerEncuestas() {

        const contenido = localStorage.getItem(
            CLAVE_ENCUESTAS
        );

        if (contenido === null) {
            return [];
        }

        let registros;

        try {

            registros = JSON.parse(contenido);

        } catch (error) {

            throw new Error(
                "Los registros anteriores no pudieron leerse."
            );
        }

        if (!Array.isArray(registros)) {

            throw new Error(
                "El formato de los registros anteriores " +
                "no es válido."
            );
        }

        return registros;
    }


    // ========================================================
    // 6. VALIDAR INFORMACIÓN PERSONAL EN COMENTARIOS
    // ========================================================

    /*
    Esta validación es preventiva.

    Detecta algunos formatos habituales de:
    - Correos electrónicos.
    - Números telefónicos chilenos.
    - RUT escritos con puntos y guion.

    No garantiza detectar todos los datos personales.
    */

    function contieneDatosPersonales(texto) {

        const correo = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

        const telefono = /(?:\+?56[\s.-]?)?9[\s.-]?\d{4}[\s.-]?\d{4}\b/;

        const rutConFormato = /\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/;

        return (
            correo.test(texto) ||
            telefono.test(texto) ||
            rutConFormato.test(texto)
        );
    }


    // ========================================================
    // 7. VALIDAR FORMULARIO
    // ========================================================

    function validarFormulario() {

        if (!formulario.reportValidity()) {
            return false;
        }

        if (!campoEstablecimiento.value.trim()) {

            mostrarError(
                "Debes seleccionar un establecimiento de salud."
            );

            return false;
        }

        const respuestasInvalidas = PREGUNTAS.some(
            function (pregunta) {

                return obtenerValorRadio(pregunta) === null;
            }
        );

        if (respuestasInvalidas) {

            mostrarError(
                "Debes responder las cuatro preguntas " +
                "obligatorias de evaluación."
            );

            return false;
        }

        const comentarios = campoComentarios.value.trim();

        if (comentarios.length > 1000) {

            mostrarError(
                "Los comentarios no pueden superar " +
                "los 1000 caracteres."
            );

            return false;
        }

        if (contieneDatosPersonales(comentarios)) {

            mostrarError(
                "Por seguridad, elimina los correos, " +
                "teléfonos o RUT de tus comentarios. " +
                "Esta encuesta debe ser anónima."
            );

            campoComentarios.focus();

            return false;
        }

        return true;
    }


    // ========================================================
    // 8. CONSTRUIR REGISTRO DE ENCUESTA
    // ========================================================

    /*
    Conservamos los mismos nombres de propiedades
    utilizados por el dashboard OIRS.
    */

    function construirEncuesta() {

        return {

            establecimiento:
                campoEstablecimiento.value.trim(),

            trato:
                obtenerValorRadio("trato"),

            tiempoEspera:
                obtenerValorRadio("tiempoEspera"),

            claridad:
                obtenerValorRadio("claridad"),

            satisfaccionGeneral:
                obtenerValorRadio("satisfaccionGeneral"),

            comentarios:
                campoComentarios.value.trim(),

            fechaRegistro:
                new Date().toISOString()
        };
    }


    // ========================================================
    // 9. GUARDAR ENCUESTA
    // ========================================================

    function guardarEncuesta(encuesta) {

        /*
        Si los registros existentes no se pueden leer,
        la operación se detiene antes de escribir.
        */

        const registros = obtenerEncuestas();

        registros.push(encuesta);

        localStorage.setItem(
            CLAVE_ENCUESTAS,
            JSON.stringify(registros)
        );
    }


    // ========================================================
    // 10. ENVIAR FORMULARIO
    // ========================================================

    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            ocultarError();

            // Validar campos y evaluaciones.

            if (!validarFormulario()) {
                return;
            }

            // Preparar registro anónimo.

            const encuesta = construirEncuesta();

            // Intentar guardar.

            try {

                guardarEncuesta(encuesta);

            } catch (error) {

                console.error(
                    "Error al guardar la encuesta:",
                    error
                );

                mostrarError(
                    "No fue posible guardar la encuesta. " +
                    "Los registros anteriores no se han " +
                    "modificado. Revisa el almacenamiento " +
                    "del navegador e inténtalo nuevamente."
                );

                return;
            }

            // Mostrar confirmación únicamente
            // cuando el almacenamiento fue exitoso.

            seccionEncuesta.hidden = true;

            seccionConfirmacion.hidden = false;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );


    // ========================================================
    // 11. RESPONDER OTRA ENCUESTA
    // ========================================================

    botonOtraEncuesta.addEventListener(
        "click",
        function () {

            formulario.reset();

            ocultarError();

            seccionConfirmacion.hidden = true;

            seccionEncuesta.hidden = false;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );


    // ========================================================
    // 12. LIMPIAR MENSAJES AL REINICIAR
    // ========================================================

    formulario.addEventListener(
        "reset",
        function () {

            ocultarError();
        }
    );

});
