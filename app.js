const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
 const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}




document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e =>{
    addCarrito(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        // console.log(data)
    
        pintarCards(data)
    }catch(error){
        console.log(error)
    }
}

items.addEventListener('click',e =>{
    btnAccion(e)
})

const pintarCards = data => { 
    // console.log(data)
data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src",producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
})

    cards.appendChild(fragment)
    
}

const addCarrito = e =>{
    
    // console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
// console.log(objeto)
const producto = {
    id:objeto.querySelector('.btn-dark').dataset.id,
    title:objeto.querySelector('h5').textContent,
    precio:objeto.querySelector('p').textContent,
    cantidad:1
}

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()

// console.log(carrito)
}

const  pintarCarrito = () => {
//  console.log(carrito)
items.innerHTML = " "
 Object.values(carrito).forEach(producto => {
     templateCarrito.querySelector('th').textContent = producto.id
     templateCarrito.querySelectorAll('td')[0].textContent = producto.title
     templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
     templateCarrito.querySelector('.btn-primary').dataset.id = producto.id
     templateCarrito.querySelector('.btn-secondary').dataset.id = producto.id
     templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
     const clone = templateCarrito.cloneNode(true)
     fragment.appendChild(clone)
 })
 items.appendChild(fragment)

 pintarFooter()
 localStorage.setItem('carrito',JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ' '
    if(Object.keys(carrito).length === 0 ){
        
        footer.innerHTML = ' <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }
    const nCantidad = Object.values(carrito).reduce ((acc,{cantidad})=> acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio})=> acc + cantidad * precio,0)

    // console.log(nPrecio)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click',() => {
        carrito = {}
        pintarCarrito()
    })

}

const btnAccion = e =>{
    // console.log(e.target)
    if (e.target.classList.contains('btn-primary'))
    {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad ++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if (e.target.classList.contains('btn-secondary')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad --
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
       
        // carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()

    }
    e.stopPropagation()

}



function ocultar() {
    document.getElementById("MostrarOcultar").classList.toggle("d-none");
    // document.getElementById('mostrar').innerText = 'Your text here';
   
    
}

function toggleText(mostrar)
 { var text = document.getElementById('mostrar').firstChild;
     text.data = text.data == "Mostar Carrito" ? "Ocultar Carrito" : "Mostar Carrito"; } 

// function toggleText(mostar) 
// { var el = document.getElementById('mostar'); 
//     if (el.firstChild.data == "Mostar") { el.firstChild.data = "Ocultar"; }
//      else { el.firstChild.data = "Mostar"; } } 

document.getElementById("mostrar").onclick = function() {
    ocultar();
    toggleText(mostrar);

}


<!-- ////////////////////////////////////////////////////// -->
