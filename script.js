const productos = [
    {
        id: 1,
        nombre: "Medialuna de manteca",
        categoria: "facturas",
        precio: 1200,
        emoji: "🥐",
        descripcion: "Medialuna suave y dorada."
    },
    {
        id: 2,
        nombre: "Docena de facturas",
        categoria: "facturas",
        precio: 12000,
        emoji: "🥐",
        descripcion: "Selección surtida de 12 facturas."
    },
    {
        id: 3,
        nombre: "Pan de campo",
        categoria: "panes",
        precio: 4500,
        emoji: "🍞",
        descripcion: "Pan artesanal de corteza crocante."
    },
    {
        id: 4,
        nombre: "Baguette",
        categoria: "panes",
        precio: 2800,
        emoji: "🥖",
        descripcion: "Crocante por fuera y tierna por dentro."
    },
    {
        id: 5,
        nombre: "Cookie con chocolate",
        categoria: "pasteleria",
        precio: 2500,
        emoji: "🍪",
        descripcion: "Cookie artesanal con chips de chocolate."
    },
    {
        id: 6,
        nombre: "Porción de torta",
        categoria: "pasteleria",
        precio: 6500,
        emoji: "🍰",
        descripcion: "Porción de torta del día."
    },
    {
        id: 7,
        nombre: "Alfajor artesanal",
        categoria: "pasteleria",
        precio: 3000,
        emoji: "🍫",
        descripcion: "Relleno con dulce de leche."
    },
    {
        id: 8,
        nombre: "Sándwich de jamón y queso",
        categoria: "salado",
        precio: 5500,
        emoji: "🥪",
        descripcion: "Jamón y queso en pan fresco."
    }
];

let carrito = [];

const grid = document.getElementById("productGrid");

function mostrarProductos(lista) {
    grid.innerHTML = "";

    lista.forEach(producto => {
        grid.innerHTML += `
            <article class="product-card">

                <div class="product-image">
                    ${producto.emoji}
                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${producto.categoria}
                    </span>

                    <h3>${producto.nombre}</h3>

                    <p>${producto.descripcion}</p>

                    <div class="product-bottom">
                        <strong>${formatearPrecio(producto.precio)}</strong>

                        <button
                            onclick="agregarAlCarrito(${producto.id})"
                            aria-label="Agregar ${producto.nombre} al carrito"
                        >
                            +
                        </button>
                    </div>

                </div>

            </article>
        `;
    });
}

function filtrar(categoria, boton) {
    document.querySelectorAll(".filtro").forEach(btn => {
        btn.classList.remove("activo");
    });

    boton.classList.add("activo");

    if (categoria === "todos") {
        mostrarProductos(productos);
        return;
    }

    const filtrados = productos.filter(
        producto => producto.categoria === categoria
    );

    mostrarProductos(filtrados);
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);

    const existente = carrito.find(p => p.id === id);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    actualizarCarrito();
}

function cambiarCantidad(id, cambio) {
    const producto = carrito.find(p => p.id === id);

    if (!producto) return;

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
    }

    actualizarCarrito();
}

function actualizarCarrito() {
    const contenedor = document.getElementById("carritoProductos");

    const cantidad = carrito.reduce(
        (total, producto) => total + producto.cantidad,
        0
    );

    document.getElementById("cantidadCarrito").textContent = cantidad;

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                <p>🥐</p>
                <h3>Tu carrito está vacío</h3>
                <p>Agregá algún producto para comenzar.</p>
            </div>
        `;

        document.getElementById("total").textContent = "$0";
        return;
    }

    contenedor.innerHTML = "";

    carrito.forEach(producto => {
        contenedor.innerHTML += `
            <div class="carrito-item">

                <div>
                    <strong>${producto.emoji} ${producto.nombre}</strong>
                    <p>${formatearPrecio(producto.precio)}</p>
                </div>

                <div class="carrito-controles">
                    <button onclick="cambiarCantidad(${producto.id}, -1)">−</button>

                    <span>${producto.cantidad}</span>

                    <button onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                </div>

            </div>
        `;
    });

    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );

    document.getElementById("total").textContent =
        formatearPrecio(total);
}

function abrirCarrito() {
    document.getElementById("carrito").classList.add("abierto");
    document.getElementById("overlay").classList.add("visible");
}

function cerrarCarrito() {
    document.getElementById("carrito").classList.remove("abierto");
    document.getElementById("overlay").classList.remove("visible");
}

function hacerPedido() {
    if (carrito.length === 0) {
        alert("Primero agregá productos al carrito.");
        return;
    }

    let mensaje = "Hola Miga Dorada! Quiero hacer este pedido:%0A%0A";

    carrito.forEach(producto => {
        mensaje +=
            `${producto.cantidad}x ${producto.nombre} - ` +
            `${formatearPrecio(producto.precio * producto.cantidad)}%0A`;
    });

    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );

    mensaje += `%0ATotal: ${formatearPrecio(total)}`;

    /*
      IMPORTANTE:
      Reemplazá el número de abajo por el WhatsApp real
      incluyendo código de país y área, sin + ni espacios.

      Ejemplo ficticio:
      5491100000000
    */

    const numeroWhatsApp = "5491100000000";

    window.open(
        `https://wa.me/${numeroWhatsApp}?text=${mensaje}`,
        "_blank"
    );
}

function formatearPrecio(precio) {
    return precio.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });
}

mostrarProductos(productos);
actualizarCarrito();
