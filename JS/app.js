// Clase para representar un ítem del carrito
class ItemCarrito {
    constructor(nombre, precio, cantidad) {
        // Validaciones, programación defensiva
        if (!nombre || typeof nombre !== "string") {
            throw new Error("El nombre debe ser un string válido.");
        }
        if (precio <= 0 || typeof precio !== "number") {
            throw new Error("El precio debe ser un número mayor a 0.");
        }
        if (cantidad <= 0 || !Number.isInteger(cantidad)) {
            throw new Error("La cantidad debe ser un número entero mayor a 0.");
        }
        // Asignacion de propiedades
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
    }
}

// Clase para manejar el carrito
class Carrito {
    constructor() {
        this.items = [];
    }

    // Agregar producto al carrito
    agregarProducto(nombre, precio, cantidad) {
        // Buscar si el producto ya existe
        const productoExistente = this.items.find(item => item.nombre === nombre);
        // Si el producto ya existe
        if (productoExistente) {
            productoExistente.cantidad += cantidad; // Incrementar cantidad
        // Si el producto no existe
        } else {
            this.items.push(new ItemCarrito(nombre, precio, cantidad));
        }
    }

    // Eliminar un producto del carrito
    eliminarProducto(nombre) {
        const index = this.items.findIndex(item => item.nombre === nombre);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    // Calcular el total del carrito
    calcularTotal() {
        return this.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
    }

    // Obtener el resumen del carrito
    obtenerResumen() {
        return this.items.map(item => ({
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
            subtotal: item.precio * item.cantidad,
        }));
    }
}

// Inicializar carrito
const carrito = new Carrito();

// Selección de elementos DOM
const form = document.getElementById("producto__form");
const cartaItems = document.getElementById("carta__items");
const cartaTotal = document.getElementById("carta__total");

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    // Limpiar la lista actual
    cartaItems.innerHTML = "";

    // Obtener el resumen del carrito
    const resumen = carrito.obtenerResumen();

    // Mostrar productos en el carrito
    resumen.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre}: $${item.precio.toFixed(2)} x ${item.cantidad} = $${item.subtotal.toFixed(2)}`;

        // Crear botón de eliminar
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", () => {
            carrito.eliminarProducto(item.nombre); // Eliminar producto del carrito
            actualizarCarrito(); // Actualizar la vista
        });

        // Agregar botón al elemento de la lista
        li.appendChild(deleteButton);

        // Agregar elemento a la lista
        cartaItems.appendChild(li);
    });

    // Actualizar el total del carrito
    cartaTotal.textContent = `Total: $${carrito.calcularTotal().toFixed(2)}`;
}

// Manejar el evento de formulario para añadir productos
form.addEventListener("submit", event => {
    event.preventDefault();

    const nombre = document.getElementById("producto__nombre").value.trim();
    const precio = parseFloat(document.getElementById("producto__precio").value);
    const cantidad = parseInt(document.getElementById("producto__cantidad").value, 10);

    try {
        carrito.agregarProducto(nombre, precio, cantidad);
        actualizarCarrito(); // Actualizar la vista
        form.reset(); // Limpiar el formulario
    } catch (error) {
        alert(error.message);
    }
});
