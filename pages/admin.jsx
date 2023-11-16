import useSWR from 'swr'
import axios from 'axios'
import AdminLayout from "@/layout/AdminLayout"
import Orden from '@/components/Orden'

const admin = () => {

  const fetcher = () => axios("/api/ordenes").then(datos => datos.data)
  const { data, error, isLoading } = useSWR('/api/ordenes', fetcher, {refreshInterval: 50})

  console.log(data)
  console.log(error)
  console.log(isLoading)

  return (
    <AdminLayout pagina={"Admin"}>
        <h1 className="text-4xl font-black">Panel de Administración</h1>
        <p className="text-2xl my-10">Administra las órdenes</p> 

        {data && data.length ? data.map(orden => 
            <Orden 
              key={orden.id}
              orden={orden}
            />
        ) : <p>No hay Órdenes Pendientes</p>}     
    </AdminLayout>
  )
}

export default admin