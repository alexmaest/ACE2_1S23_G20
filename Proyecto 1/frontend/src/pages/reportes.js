import ChooserReport from '@/components/ChooserReport'
import NavBar from '@/components/Navbar'

export default function Reportes () {
  return (
    <section className='md:h-full lg:h-screen bg-gray-900'>
      <NavBar />
      <div className="container mx-auto p-4 rounded-lg">
        <h1 className="text-xl font-bold mb-4 text-white">Reportes de Penalizaciones</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ChooserReport title='Reporte 1' path='/reporte1'/>
          <ChooserReport title='Reporte 2' path='/reporte2'/>
          <ChooserReport title='Reporte 3' path='/reporte3'/>
          <ChooserReport title='Reporte 4' path='/reporte4'/>
          <ChooserReport title='Reporte 5' path='/reporte5'/>
          <ChooserReport title='Reporte 6' path='/reporte6'/>
        </div>
      </div>
    </section>
  )
}
