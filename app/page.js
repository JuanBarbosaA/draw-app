import Link from "next/link";

export default function Home(){
  return(
    <div>
      Link a pagina dibujar
      <Link href={"/draw"}>Dibujar</Link>
    </div>
  )
}