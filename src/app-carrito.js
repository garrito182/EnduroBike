const items = document.getElementById("items")
const orden = document.getElementById("orden")
const mostrarBicis = document.getElementById("mostrarBicis")
const templateCards = document.getElementById("template-cards").content
const templateCarrito = document.getElementById("template-carrito").content
const templateFinalizar = document.getElementById("template-finalizar").content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', e => {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
    }
    mostrarItems()
});

document.addEventListener("DOMContentLoaded", () => { fetchData() })
mostrarBicis.addEventListener("click", e => { addCarrito(e) })
items.addEventListener('click', e => { btnAumentarDisminuir(e) })

const fetchData = async () => {
    try {
        const res = await fetch("../src/api.json")
        const data = await res.json()
        crearCards(data)
    } catch (error) {
        console.log(error);
    }
}

const crearCards = data => {
    data.forEach(productos => {
        templateCards.querySelector("img").setAttribute("src", productos.imagen)
        templateCards.querySelector(".category").textContent = productos.marca
        templateCards.querySelector("h4").textContent = productos.precio
        templateCards.querySelector(".botonComprar").dataset.id = productos.id
        const clone = templateCards.cloneNode(true)
        fragment.appendChild(clone)
    })
    mostrarBicis.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains("botonComprar")) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector(".botonComprar").dataset.id,
        marca: objeto.querySelector(".category").textContent,
        precio: objeto.querySelector("h4").textContent,
        imagen: objeto.querySelector("img").setAttribute,
        cantidad: 1,
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    mostrarItems()
}

const mostrarItems = () => {
    items.innerHTML = `
    <template id="template-carrito">
        <div class="cantidad col col-1" data-label="Job Id">Finalizar Compra</div>
                                <div class="containerCompra">
                                    <ul class="responsive-table">
                                        <li class="table-row">
                                            <div class="cantidad col col-1" data-label="Job Id">Cantidad</div>
                                            <div class="marca col col-2" data-label="Customer Name">Marca</div>
                                            <div class="precio-cantidad col col-3" data-label="Amount">Precio</div>
                                            <div class="col col-3"><a><i class="sumarCantidad bi bi-cart-plus-fill"></i> - <i class="restarCantidad bi bi-cart-dash-fill"></i></a></div>
                                        </li>
                                    </ul>
                                </div>
                        </template>`
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector(".sumarCantidad").dataset.id = producto.id
        templateCarrito.querySelector(".restarCantidad").dataset.id = producto.id
        templateCarrito.querySelectorAll(".cantidad")[0].textContent = producto.cantidad
        templateCarrito.querySelector(".marca").textContent = producto.marca
        templateCarrito.querySelector(".precio-cantidad").textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    mostrarOrden()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const mostrarOrden = () => {
    orden.innerHTML = ``
    if (Object.keys(carrito).length === 0) {
        orden.innerHTML = ``
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad ,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    const nIva = Object.values(carrito).reduce((acc, {precio}) => acc + precio * 21 / 100 ,0)

    templateFinalizar.querySelector(".precioFinal").textContent = nPrecio
    templateFinalizar.querySelector(".envio").textContent = "Gratis"
    templateFinalizar.querySelector(".iva").textContent = "21%"
    templateFinalizar.querySelector(".cantidad").textContent = nCantidad
    templateFinalizar.querySelector(".total").textContent = nPrecio + nIva
    const clone = templateFinalizar.cloneNode(true)
    fragment.appendChild(clone)
    orden.appendChild(fragment)
}

const btnAumentarDisminuir = e => {
    if (e.target.classList.contains('sumarCantidad')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        mostrarItems()
    }

    if (e.target.classList.contains('restarCantidad')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        mostrarItems()
    }
    e.stopPropagation()
}
