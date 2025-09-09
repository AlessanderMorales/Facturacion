document.addEventListener('DOMContentLoaded', () => {
    const ventaForm = document.getElementById('venta-form');
    const facturaContainer = document.getElementById('factura-container');
    const errorMessage = document.getElementById('error-message');
    ventaForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        facturaContainer.style.display = 'none';
        errorMessage.textContent = '';
        const ventaData = {
            cliente_id: 1,
            nit_cliente: 543210,
            items: [
                { "producto_id": 1, "cantidad": 1 },
                { "producto_id": 2, "cantidad": 2 }  
            ],
            pago: {
                "metodo": "cash"
            }
        };

        try {
            const response = await fetch('/ventas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ventaData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Ocurrió un error en el servidor.');
            }
            mostrarFactura(result);

        } catch (error) {
            console.error('Error al generar la factura:', error);
            errorMessage.textContent = `Error: ${error.message}`;
        }
    });

    function mostrarFactura(data) {
        document.getElementById('factura-cliente').textContent = data.factura.cliente;
        document.getElementById('factura-total').textContent = data.factura.total.toFixed(2);
        document.getElementById('factura-id').textContent = data.ventaId;
        document.getElementById('qr-code-img').src = data.factura.qr;
        facturaContainer.style.display = 'block';
    }
});