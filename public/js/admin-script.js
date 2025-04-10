document.addEventListener('DOMContentLoaded', () => {
    const formProducto = document.getElementById('producto-form');
    const listaProductosAdmin = document.getElementById('productos-admin-list');
    const btnLimpiarForm = document.getElementById('btn-limpiar-form');
    const inputProductoId = document.getElementById('producto-id');

    // --- Cargar Productos al cargar la página ---
    const cargarProductosAdmin = async () => {
        try {
            const respuesta = await fetch('/api/productos');
            const productos = await respuesta.json();
            mostrarProductosAdmin(productos);
        } catch (error) {
            console.error('Error al cargar productos admin:', error);
            listaProductosAdmin.innerHTML = '<p>Error al cargar productos.</p>';
        }
    };

    // --- Mostrar Productos en la lista de administración ---
    const mostrarProductosAdmin = (productos) => {
        listaProductosAdmin.innerHTML = ''; // Limpiar lista
        if (productos.length === 0) {
            listaProductosAdmin.innerHTML = '<p>No hay productos registrados.</p>';
            return;
        }
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto-admin-item'); // Clase para estilos

            productoDiv.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio.toFixed(2)}</p>
                <img src="${producto.imagen}" alt="${producto.nombre}" style="max-width: 100px; height: auto;">
                <div class="acciones-producto">
                    <button class="btn-editar" data-id="${producto._id}">Editar</button>
                    <button class="btn-eliminar" data-id="${producto._id}">Eliminar</button>
                </div>
            `;
            listaProductosAdmin.appendChild(productoDiv);
        });

        // --- Event Listeners para botones de Editar y Eliminar (después de crear los botones) ---
        agregarEventListenersBotonesAccion();
    };

    // --- Agregar Event Listeners a los botones de Editar y Eliminar (delegación de eventos) ---
    const agregarEventListenersBotonesAccion = () => {
        listaProductosAdmin.addEventListener('click', async (event) => {
            if (event.target.classList.contains('btn-editar')) {
                const productoId = event.target.dataset.id;
                cargarProductoParaEditar(productoId);
            } else if (event.target.classList.contains('btn-eliminar')) {
                const productoId = event.target.dataset.id;
                eliminarProducto(productoId);
            }
        });
    };

    // --- Cargar Producto para Editar en el formulario ---
    const cargarProductoParaEditar = async (id) => {
        try {
            const respuesta = await fetch(`/api/productos/${id}`);
            const producto = await respuesta.json();
            if (producto) {
                inputProductoId.value = producto._id; // Establecer ID en campo oculto para edición
                document.getElementById('nombre').value = producto.nombre;
                document.getElementById('descripcion').value = producto.descripcion;
                document.getElementById('imagen').value = producto.imagen;
                document.getElementById('precio').value = producto.precio;
                document.getElementById('rebaja').checked = producto.rebaja || false; // Manejar si rebaja es undefined
            } else {
                alert('Producto no encontrado para editar.');
            }
        } catch (error) {
            console.error('Error al cargar producto para editar:', error);
            alert('Error al cargar producto para editar.');
        }
    };

    // --- Enviar Formulario para Crear o Actualizar Producto ---
    formProducto.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar la recarga de página por defecto

        const productoData = {
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value,
            imagen: document.getElementById('imagen').value,
            precio: parseFloat(document.getElementById('precio').value),
            rebaja: document.getElementById('rebaja').checked
        };

        const productoId = inputProductoId.value; // Obtener ID del campo oculto (vacío si es nuevo producto)
        const metodo = productoId ? 'PUT' : 'POST'; // PUT para actualizar, POST para crear
        const url = productoId ? `/api/productos/${productoId}` : '/api/productos';

        try {
            const respuesta = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoData)
            });

            if (respuesta.ok) {
                cargarProductosAdmin(); // Recargar la lista de productos después de guardar
                limpiarFormulario(); // Limpiar el formulario
                alert(`Producto ${productoId ? 'actualizado' : 'creado'} correctamente.`);
            } else {
                const errorJson = await respuesta.json();
                alert(`Error al ${productoId ? 'actualizar' : 'crear'} producto: ${errorJson.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error(`Error en la petición para ${productoId ? 'actualizar' : 'crear'} producto:`, error);
            alert(`Error en la petición para ${productoId ? 'actualizar' : 'crear'} producto.`);
        }
    });

    // --- Eliminar Producto ---
    const eliminarProducto = async (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                const respuesta = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
                if (respuesta.ok) {
                    cargarProductosAdmin(); // Recargar lista tras eliminar
                    alert('Producto eliminado correctamente.');
                } else {
                    const errorJson = await respuesta.json();
                    alert(`Error al eliminar producto: ${errorJson.message || 'Error desconocido'}`);
                }
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert('Error al eliminar producto.');
            }
        }
    };

    // --- Limpiar Formulario ---
    const limpiarFormulario = () => {
        inputProductoId.value = ''; // Limpiar ID oculto
        document.getElementById('producto-form').reset(); // Resetear el formulario
    };

    btnLimpiarForm.addEventListener('click', limpiarFormulario);


    // --- Inicializar: Cargar productos al cargar la página ---
    cargarProductosAdmin();
});
