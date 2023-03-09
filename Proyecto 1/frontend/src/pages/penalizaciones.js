import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/Navbar";
import useAuth from "@/hooks/useAuth";

export default function penalizaciones() {
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth.username) {
      router.push("/login");
    }
  }, [auth]);

  return (
    <>
      <Head>
        <title>Penalizaciones</title>
      </Head>
      <Navbar />
    </>
  );
}
