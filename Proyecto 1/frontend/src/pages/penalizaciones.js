import Head from 'next/head'
import Navbar from '../components/Navbar'
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../graphics/graphic1-2/script'),
  { ssr: false }
)

export default function Penalizaciones () {
  return (
    <>
      <Head>
        <title>Penalizaciones</title>
      </Head>
      <Navbar />

    <section className="home">
        <div className="in-flex">

            <canvas id="myCanvas">
            </canvas>
            <legend htmlFor="myCanvas"></legend>
        </div>
        <DynamicComponentWithNoSSR />
    </section>
    </>
  )
}
