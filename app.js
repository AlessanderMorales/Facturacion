document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES DE ESTADO ---
    let cart = {}; // Objeto para guardar los productos del carrito
    let products = [];
    let clients = [];

    // --- ELEMENTOS DEL DOM ---
    const productList = document.getElementById('product-list');
    const clientSelect = document.getElementById('cliente-select');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const errorMessageDiv = document.getElementById('error-message');
    
    const storeView = document.getElementById('store-view');
    const invoiceView = document.getElementById('invoice-view');
    const newSaleBtn = document.getElementById('new-sale-btn');

    // --- FUNCIONES DE RENDERIZADO ---

    const renderProducts = () => {
        productList.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${product.nombre}</h3>
                <p>Precio: Bs. ${parseFloat(product.precio).toFixed(2)}</p>
                <p>Stock: ${product.stock}</p>
                <button onclick="addProductToCart(${product.id})" ${product.stock == 0 ? 'disabled' : ''}>
                    ${product.stock == 0 ? 'Agotado' : 'Agregar al Carrito'}
                </button>
            `;
            productList.appendChild(card);
        });
    };

    const renderClients = () => {
        clientSelect.innerHTML = '<option value="">-- Seleccione un Cliente --</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.nombre} (ID: ${client.id})`;
            clientSelect.appendChild(option);
        });
    };

    const renderCart = () => {
        cartItemsList.innerHTML = '';
        let total = 0;
        for (const productId in cart) {
            const item = cart[productId];
            const itemTotal = item.quantity * parseFloat(item.product.precio);
            total += itemTotal;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.product.nombre} (x${item.quantity})</span>
                <strong>Bs. ${itemTotal.toFixed(2)}</strong>
            `;
            cartItemsList.appendChild(li);
        }
        cartTotalSpan.textContent = total.toFixed(2);
    };

    // --- LÓGICA DEL CARRITO ---

    window.addProductToCart = (productId) => {
        const product = products.find(p => Number(p.id) === productId);
        if (!product) return;

        if (cart[productId]) {
            if (cart[productId].quantity < product.stock) {
                cart[productId].quantity++;
            } else {
                alert('No puedes agregar más de este producto, stock máximo alcanzado.');
            }
        } else {
            cart[productId] = {
                product: product,
                quantity: 1
            };
        }
        renderCart();
    };

    // --- LÓGICA DE LA APLICACIÓN ---

    const initializeStore = async () => {
        try {
            // Cargar productos y clientes desde la API
            const [productsRes, clientsRes] = await Promise.all([
                fetch('/api/productos'),
                fetch('/api/clientes')
            ]);
            products = await productsRes.json();
            clients = await clientsRes.json();
            
            // Renderizar la tienda
            renderProducts();
            renderClients();
            showStoreView();
        } catch (error) {
            console.error('Error inicializando la tienda:', error);
            errorMessageDiv.textContent = 'No se pudo cargar la información de la tienda. Intente recargar la página.';
        }
    };

    const handleCheckout = async () => {
        const selectedClientId = clientSelect.value;
        if (!selectedClientId) {
            errorMessageDiv.textContent = 'Por favor, seleccione un cliente.';
            return;
        }
        if (Object.keys(cart).length === 0) {
            errorMessageDiv.textContent = 'El carrito está vacío.';
            return;
        }

        errorMessageDiv.textContent = ''; // Limpiar errores

        // Formatear los datos para la API
        const ventaData = {
            cliente_id: parseInt(selectedClientId),
            nit_cliente: clients.find(c => c.id === selectedClientId)?.id * 1111 || 123456, // Simulación de NIT
            items: Object.values(cart).map(item => ({
                producto_id: parseInt(item.product.id),
                cantidad: item.quantity
            })),
            pago: {
                metodo: "cash" // Por simplicidad, asumimos pago en efectivo
            }
        };

        try {
            const response = await fetch('/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ventaData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Ocurrió un error en el servidor.');
            }

            // Si la compra es exitosa, mostrar la factura
            showInvoiceView(result);

        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            errorMessageDiv.textContent = `Error: ${error.message}`;
        }
    };

    // --- MANEJO DE VISTAS ---

    const showStoreView = () => {
        // Reiniciar estado
        cart = {};
        renderCart();
        clientSelect.value = '';
        errorMessageDiv.textContent = '';
        // Cambiar vistas
        storeView.classList.remove('hidden');
        storeView.style.display = 'flex'; // Usamos flex para mantener el layout
        invoiceView.style.display = 'none';
    };

    const showInvoiceView = (data) => {
        // Rellenar datos de la factura
        document.getElementById('factura-cliente').textContent = data.factura.cliente;
        document.getElementById('factura-total').textContent = data.factura.total.toFixed(2);
        document.getElementById('factura-id').textContent = data.ventaId;
        document.getElementById('qr-code-img').src = data.factura.qr;
        
        // Cambiar vistas
        storeView.style.display = 'none';
        invoiceView.style.display = 'block';
    };

    // --- EVENT LISTENERS ---
    checkoutBtn.addEventListener('click', handleCheckout);
    newSaleBtn.addEventListener('click', initializeStore); // Al hacer clic en nueva venta, reiniciamos todo

    // --- INICIO ---
    initializeStore();
});