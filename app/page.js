import Link from "next/link";

export default function Home(){
  return(
    <div>
      Link a pagina dibujar
      <Link className="bg-blue-500 hover:bg-blue-600 cursor-pointer py-1 px-2 rounded-md text-white" href={"/draw"}>Dibujar</Link>
    </div>
  )
}