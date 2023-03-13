import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/Navbar";

export default function penalizaciones() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Penalizaciones</title>
      </Head>
      <Navbar />
    </>
  );
}
