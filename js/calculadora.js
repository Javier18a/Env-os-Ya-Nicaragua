document.addEventListener("DOMContentLoaded", function () {
    const tarifas = {
        aereo: {
            precio: 6.50,
            descripcion: "Modalidad aérea · Miami, USA → Managua, Nicaragua"
        },
        maritimo: {
            precio: 2.70,
            descripcion: "Modalidad marítima · Miami, USA → Managua, Nicaragua"
        }
    };

    const tabs = document.querySelectorAll(".calculadora-tab");
    const pesoInput = document.getElementById("pesoPaquete");
    const tarifaTexto = document.getElementById("calculadoraTarifa");
    const descripcionTexto = document.getElementById("calculadoraDescripcion");
    const totalTexto = document.getElementById("calculadoraTotal");
    const detalleTexto = document.getElementById("calculadoraDetalle");

    if (
        !tabs.length ||
        !pesoInput ||
        !tarifaTexto ||
        !descripcionTexto ||
        !totalTexto ||
        !detalleTexto
    ) {
        return;
    }

    let modalidadActual = "aereo";

    function formatoUSD(cantidad) {
        return cantidad.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function actualizarCalculadora() {
        const tarifa = tarifas[modalidadActual];
        const peso = Number(pesoInput.value);

        tarifaTexto.textContent = formatoUSD(tarifa.precio);
        descripcionTexto.textContent = tarifa.descripcion;

        if (pesoInput.value.trim() === "" || !Number.isFinite(peso) || peso <= 0) {
            totalTexto.textContent = formatoUSD(0);
            detalleTexto.textContent =
                "Ingresa el peso para calcular el costo aproximado.";
            return;
        }

        if (peso > 100000) {
            totalTexto.textContent = "—";
            detalleTexto.textContent =
                "Ingresa un peso de hasta 100,000 libras.";
            return;
        }

        const total = peso * tarifa.precio;

        totalTexto.textContent = formatoUSD(total);
        detalleTexto.textContent =
            `${peso.toLocaleString("es-NI")} lb × ${formatoUSD(tarifa.precio)} por libra.`;
    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            modalidadActual = this.dataset.modalidad;

            tabs.forEach(function (item) {
                const seleccionada = item === tab;
                item.classList.toggle("activa", seleccionada);
                item.setAttribute("aria-pressed", String(seleccionada));
            });

            actualizarCalculadora();
        });
    });

    pesoInput.addEventListener("input", actualizarCalculadora);

    actualizarCalculadora();
});
