import Head from "next/head"
import Sidebar from "@/components/Sidebar"
import Pasos from "@/components/Pasos";
import ModalProducto from "@/components/ModalProducto";
import Modal from 'react-modal';
//Toast Container siempre en el Layout ya que lo queremos mandar a llamar en todos lados
import { ToastContainer } from "react-toastify";
import useQuiosco from "@/hooks/useQuiosco";
//Importamos estilos de toastify
import "react-toastify/dist/ReactToastify.css"

//El Modal se implementa en el Layout pq si se implementara en el producto habría un modal por cada producto
//Estilos del Modal
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
//Para el caso de Next. Si fuera con Vite sería #root
Modal.setAppElement('#__next');

export default function Layout({children,pagina}) {

    const { modal } = useQuiosco()
    return (
   <>
    <Head>
        <title>Café - {pagina}</title>
        <meta name="description" content="Quiosco Cafetería"/>
    </Head>

    <div className="md:flex">
        <aside className="md:w-4/12 xl:w-1/4 2xl:w-1/5">
            <Sidebar />
        </aside>

        <main className="md:w-8/12 xl:w-3/4 2xl:w-4/5 h-screen overflow-y-scroll">
            <div className="p-10 mt-10">
                <Pasos />
                {children}
            </div>
        </main>
    </div>
    {modal && (
        <Modal
            isOpen={modal}
            style={customStyles}
        >
            <ModalProducto />
        </Modal>
    )}

    <ToastContainer />
   </> 
    )
  }
  