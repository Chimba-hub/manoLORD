document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductos = document.getElementById('contenedor-productos');
    const carruselTrack = document.querySelector('.carrusel-track');
    const botonAnterior = document.querySelector('.carrusel-boton-anterior');
    const botonSiguiente = document.querySelector('.carrusel-boton-siguiente');
    const infoIntegrantesDiv = document.getElementById('info-integrantes');
    const misionTextoP = document.getElementById('mision-texto');
    const visionTextoP = document.getElementById('vision-texto');
    const botonMenuHamburguesa = document.getElementById('boton-menu-hamburguesa');
    const menuAdminOculto = document.getElementById('menu-admin-oculto');
    const botonAdminLogin = document.getElementById('boton-admin-login');
    const claveAdminInput = document.getElementById('clave-admin');


    let productosGlobales = []; // Variable para almacenar productos globalmente para carrusel y listado
    let carruselIndex = 0; // Índice para el carrusel

    // --- Cargar Productos y Company Info al cargar la página ---
    const cargarDatosIniciales = async () => {
        try {
            const respuestaProductos = await fetch('/api/productos');
            const productos = await respuestaProductos.json();
            productosGlobales = productos; // Guardar productos globalmente
            mostrarProductosUsuario(productos);
            inicializarCarrusel(productos); // Inicializar carrusel con productos

            const respuestaInfo = await fetch('/api/company-info');
            const infoEmpresa = await respuestaInfo.json();
            mostrarInfoEmpresa(infoEmpresa);

        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            contenedorProductos.innerHTML = '<p>Error al cargar productos. Por favor, intenta de nuevo más tarde.</p>';
            carruselTrack.innerHTML = '<p>Error al cargar productos para el carrusel.</p>';
            infoIntegrantesDiv.innerHTML = '<p>Error al cargar información de la empresa.</p>';
        }
    };


    // --- Mostrar Productos en la sección de productos (boxes) ---
    const mostrarProductosUsuario = (productos) => {
        contenedorProductos.innerHTML = ''; // Limpiar contenedor
        productos.forEach(producto => {
            const productoBox = document.createElement('div');
            productoBox.classList.add('producto-box');

            productoBox.innerHTML = `
                <div class="producto-imagen-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-frontal">
                    <div class="imagen-trasera">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion}</p>
                        <p class="precio">$${producto.precio.toFixed(2)}</p>
                        ${producto.rebaja ? '<span class="rebaja-tag">¡En Rebaja!</span>' : ''}
                    </div>
                </div>
            `;
            contenedorProductos.appendChild(productoBox);
        });
    };


    // --- Inicializar Carrusel ---
    const inicializarCarrusel = (productos) => {
        carruselTrack.innerHTML = ''; // Limpiar carrusel
        if (!productos || productos.length === 0) {
            carruselTrack.innerHTML = '<p>No hay productos para mostrar en el carrusel.</p>';
            return;
        }
        productos.forEach(producto => {
            const carruselItem = document.createElement('div');
            carruselItem.classList.add('carrusel-item');
            carruselItem.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;
            carruselTrack.appendChild(carruselItem);
        });
        actualizarCarrusel(); // Posicionar el carrusel inicialmente
    };

    // --- Actualizar Posición del Carrusel ---
    const actualizarCarrusel = () => {
        const itemWidth = document.querySelector('.carrusel-item')?.offsetWidth || 0; // Ancho de un item, 0 si no hay items
        carruselTrack.style.transform = `translateX(-${carruselIndex * itemWidth}px)`;
    };

    // --- Navegación del Carrusel ---
    botonAnterior.addEventListener('click', () => {
        carruselIndex = Math.max(carruselIndex - 1, 0); // No ir a índice negativo
        actualizarCarrusel();
    });

    botonSiguiente.addEventListener('click', () => {
        const numItems = document.querySelectorAll('.carrusel-item').length;
        carruselIndex = Math.min(carruselIndex + 1, numItems - 1); // No exceder el último índice
        actualizarCarrusel();
    });


    // --- Mostrar Información de la Empresa (Acerca de) ---
    const mostrarInfoEmpresa = (info) => {
        if (info) {
            misionTextoP.textContent = info.mision || 'Misión no disponible.';
            visionTextoP.textContent = info.vision || 'Visión no disponible.';
            infoIntegrantesDiv.innerHTML = ''; // Limpiar antes de añadir
            if (info.integrantes && info.integrantes.length > 0) {
                const integrantesList = document.createElement('ul');
                info.integrantes.forEach(integrante => {
                    const li = document.createElement('li');
                    li.textContent = `${integrante.nombre} ${integrante.apellido}`;
                    integrantesList.appendChild(li);
                });
                infoIntegrantesDiv.appendChild(integrantesList);
            } else {
                infoIntegrantesDiv.innerHTML = '<p>Información de integrantes no disponible.</p>';
            }
        } else {
            misionTextoP.textContent = 'Error al cargar misión.';
            visionTextoP.textContent = 'Error al cargar visión.';
            infoIntegrantesDiv.innerHTML = '<p>Error al cargar información de integrantes.</p>';
        }
    };


    // --- Menú Hamburguesa y Login Admin ---
    botonMenuHamburguesa.addEventListener('click', () => {
        menuAdminOculto.classList.toggle('mostrar-menu'); // Toggle clase para mostrar/ocultar
    });

    botonAdminLogin.addEventListener('click', () => {
        const claveAdmin = claveAdminInput.value;
        // TODO:  Implementar validación de clave de administrador (lado cliente - muy básico, para un taller, en producción sería backend con seguridad)
        if (claveAdmin === 'admin123') { // Clave de ejemplo, ¡cambiar en un escenario real!
            window.location.href = 'admin.html'; // Redirigir a la página de admin
        } else {
            alert('Clave de administrador incorrecta.');
        }
    });


    // --- Inicializar: Cargar datos al cargar la página ---
    cargarDatosIniciales();


    // --- Opcional:  Implementar carrusel automático si se desea ---
    // setInterval(() => {
    //     botonSiguiente.click(); // Simular click en botón siguiente cada cierto tiempo
    // }, 5000); // Cambiar cada 5 segundos (ejemplo)


});
