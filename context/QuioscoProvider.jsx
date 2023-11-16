import { useState,useEffect,createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const QuioscoContext = createContext()

const QuioscoProvider = ({children}) => {
    /* --- STATES --- */
    const [categorias,setCategorias] = useState([])
    const [categoriaActual,setCategoriaActual] = useState({})
    //State para cuando agreguemos un producto y queramos seleccionar la cantidad en el modal
    const [producto,setProducto] = useState({})
    const [modal,setModal] = useState(false)
    //State para guardar el pedido
    const [pedido,setPedido] = useState([])
    const [nombre,setNombre] = useState("")
    const [total,setTotal] = useState(0)
    

    /* --- ROUTER --- */
    const router = useRouter()

    /* --- FUNCIONES --- */
    
    const obtenerCategorias = async () => {
        const {data} = await axios("/api/categorias")
        setCategorias(data)
    }
    useEffect(() => {
        obtenerCategorias()
    },[])
    //useEffect que resalte categoría inicial. (recordar que se ejecuta en orden, despues del anterior)
    useEffect(() => {
        setCategoriaActual(categorias[0])
    }, [categorias])
    //useEffect que calcula el total del pedido cuando hayan cambios en el mismo
    useEffect(() => {
      const nuevoTotal = pedido.reduce((total,producto) => (producto.precio * producto.cantidad) + total, 0)
      setTotal(nuevoTotal)
    }, [pedido])
    

    //Identifica la categoria a la que se le hace click
    const handleClickCategoria = id => {
       const categoria = categorias.filter( cat => cat.id === id )
       setCategoriaActual(categoria[0])
       router.push("/")
    }
    //Guarda el producto agregado en un State
    const handleSetProducto = producto => {
        setProducto(producto)
    }
    //Abre y cierra el modal
    const handleChangeModal = () => {
        setModal(!modal)
    }
    //Almacena productos y cantidades a un state, como un carrito
        //De manera contraria, si antes del spread ponemos las propiedades categoriaId e imagen, primero las "destructura", las saca del objeto y hace una copia del resto
    const handleAgregarPedido = ({categoriaId, ...producto}) => {
        if (pedido.some(productoAgregadoState => productoAgregadoState.id === producto.id)) {
            //Actualizar cantidad
            const pedidoActualizado = pedido.map(productoAgregadoState => productoAgregadoState.id === producto.id ? producto : productoAgregadoState)
            setPedido(pedidoActualizado)
            toast.success("Guardado Correctamente")
        } else {
            //Añadir nuevo
            setPedido([...pedido,producto])
            toast.success("Agregado al Pedido")
        }
        setModal(false)
    }
    //Edita las cantidades del producto desde el Resumen
    const handleEditarCantidades = id => {
        const productoActualizar = pedido.filter( producto => producto.id === id)
        setProducto(productoActualizar[0])
        setModal(!modal)
    }
    //Elimina un producto del pedido
    const handleEliminarProducto = id => {
        const pedidoActualizado = pedido.filter( producto => producto.id !== id)
        setPedido(pedidoActualizado)
    }
    //Coloca la orden final del cliente
    const colocarOrden = async (e) => {
        e.preventDefault()

        try {
            await axios.post("/api/ordenes", {pedido,nombre,total,fecha: Date.now().toString()})
            //Resetear App
            setCategoriaActual(categorias[0])
            setPedido([])
            setNombre("")
            setTotal(0)  
            
            toast.success("Pedido Realizado Correctamente",{autoClose: 2250})
            setTimeout(() => {
                router.push("/")
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <QuioscoContext.Provider
        value={{
            categorias,
            handleClickCategoria,
            categoriaActual,
            producto,
            handleSetProducto,
            handleChangeModal,
            modal,
            handleAgregarPedido,
            pedido,
            handleEditarCantidades,
            handleEliminarProducto,
            nombre,
            setNombre,
            colocarOrden,
            total
        }}
    >
        {children}
    </QuioscoContext.Provider>
  )
}

export {
    QuioscoProvider
}
export default QuioscoContext