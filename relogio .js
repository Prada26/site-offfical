// ==========================================
// RELÓGIO DA LOJA SHALOM
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    function atualizarRelogio() {

        const agora = new Date();


        // ======================================
        // HORA DO BRASIL
        // ======================================

        const hora = new Intl.DateTimeFormat(
            "pt-BR",
            {
                timeZone: "America/Sao_Paulo",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        ).format(agora);


        // ======================================
        // DATA DO BRASIL
        // ======================================

        const data = new Intl.DateTimeFormat(
            "pt-BR",
            {
                timeZone: "America/Sao_Paulo",
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        ).format(agora);


        // ======================================
        // MOSTRAR HORA
        // ======================================

        const relogio =
            document.getElementById(
                "relogioBrasil"
            );

        if (relogio) {
            relogio.textContent = hora;
        }


        // ======================================
        // MOSTRAR DATA
        // ======================================

        const dataElemento =
            document.getElementById(
                "dataBrasil"
            );

        if (dataElemento) {
            dataElemento.textContent = data;
        }

    }


    // Executar imediatamente
    atualizarRelogio();


    // Atualizar a cada segundo
    setInterval(
        atualizarRelogio,
        1000
    );

});