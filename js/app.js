// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a elementos del DOM
    const form = document.getElementById('calculatorForm');
    const calculosTableBody = document.getElementById('calculosTableBody');
    const exportExcelBtn = document.getElementById('exportExcelBtn');

    // Cargar cálculos existentes desde localStorage
    function cargarCalculos() {
        // Obtener cálculos guardados o usar un arreglo vacío
        const calculosGuardados = JSON.parse(localStorage.getItem('repuestosCalculations') || '[]');
        
        // Generar filas de la tabla
        calculosTableBody.innerHTML = calculosGuardados.map((calc, index) => `
            <tr class="border-b">
                <td class="p-3">${calc.frecuenciaUso}</td>
                <td class="p-3">${calc.tiempoEntrega}</td>
                <td class="p-3">${calc.cantidadMaquina}</td>
                <td class="p-3">${calc.minimo}</td>
                <td class="p-3">${calc.maximo}</td>
                <td class="p-3">
                    <button onclick="eliminarCalculo(${index})" class="text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Eliminar un cálculo específico
    window.eliminarCalculo = function(index) {
        const calculosGuardados = JSON.parse(localStorage.getItem('repuestosCalculations') || '[]');
        calculosGuardados.splice(index, 1);
        localStorage.setItem('repuestosCalculations', JSON.stringify(calculosGuardados));
        cargarCalculos();
    }

    // Exportar a Excel
    exportExcelBtn.addEventListener('click', () => {
        const calculosGuardados = JSON.parse(localStorage.getItem('repuestosCalculations') || '[]');
        
        // Preparar datos para Excel
        const worksheet = XLSX.utils.json_to_sheet(calculosGuardados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cálculos de Repuestos");
        
        // Guardar archivo Excel
        XLSX.writeFile(workbook, "calculos_repuestos.xlsx");
    });

    // Cargar cálculos iniciales
    cargarCalculos();

    // Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener valores de entrada
        const frecuenciaUso = parseFloat(document.getElementById('frecuenciaUso').value);
        const tiempoEntrega = parseInt(document.getElementById('tiempoEntrega').value);
        const cantidadMaquina = parseInt(document.getElementById('cantidadMaquina').value);

        // Realizar cálculos
        const dias = frecuenciaUso * 365;
        const factuso = 1 / dias;
        
        const minimo = Math.floor(cantidadMaquina * ((1 / (frecuenciaUso * 365)) * (tiempoEntrega))) + 1;
        const maximo = Math.round(factuso * (tiempoEntrega + 90) * cantidadMaquina) + 1;

        // Guardar cálculo en localStorage
        const calculosGuardados = JSON.parse(localStorage.getItem('repuestosCalculations') || '[]');
        const nuevoCalculo = {
            frecuenciaUso,
            tiempoEntrega,
            cantidadMaquina,
            minimo,
            maximo
        };
        calculosGuardados.push(nuevoCalculo);
        localStorage.setItem('repuestosCalculations', JSON.stringify(calculosGuardados));

        // Recargar tabla de cálculos
        cargarCalculos();

        // Reiniciar formulario
        form.reset();
    });
});