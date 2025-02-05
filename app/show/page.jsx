import FabricCanvas from "../components/FabricCanvas";


export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold mb-2">Dibujo desde la base de datos</h2>
      <FabricCanvas/>
    </div>
  );
}
