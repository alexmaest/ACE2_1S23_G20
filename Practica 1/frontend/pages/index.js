import Head from 'next/head'
import Barometro from './components/Barometro'
import HumedadAbsoluta from './components/HumedadAbsoluta'
import HumedadRelativa from './components/HumedadRelativa'
import Temperatura from './components/Temperatura'
import Viento from './components/Viento'
import DireccionViento from './components/DireccionViento'
import PuntoRocio from './components/PuntoRocio'

export default function Home() {
  return (
    <>
      <Head>
        <title>Grupo 20 ACE2</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex mb-12 p-3 bg-gray-900">
          <h1 className="text-xl font-semibold text-center text-white">
            Grupo 20 ACE2
          </h1>
        </div>
        <div className="flex justify-around p-12 m-8 rounded-xl bg-slate-900 shadow-xl">
          <Temperatura />
          <HumedadRelativa />
          <Barometro />
        </div>
        <div className="flex justify-around p-12 m-8 rounded-xl bg-slate-900 shadow-xl">
          <HumedadAbsoluta />
          <Viento />
          {/* direction: 0 es norte, 1 oeste, 2 sur, 3 este. */}
          <DireccionViento direction={2} />
          {/* numbersOfDrops: 0 a 200*/}
          <PuntoRocio numbersOfDrops={100} />
        </div>
      </main>
    </>
  )
}
