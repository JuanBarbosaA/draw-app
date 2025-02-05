import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🖌 Guardar un nuevo dibujo
export async function POST(req) {
  try {
    const { strokes } = await req.json();

    // Validar que strokes sea un array
    if (!Array.isArray(strokes)) {
      return NextResponse.json({ error: "Invalid strokes format" }, { status: 400 });
    }

    const drawing = await prisma.drawing.create({
      data: { strokes },
    });

    return NextResponse.json(drawing);
  } catch (error) {
    console.error("❌ Error al guardar el dibujo:", error);
    return NextResponse.json({ error: "Error saving drawing" }, { status: 500 });
  }
}

// 🎨 Obtener un dibujo
export async function GET() {
  try {
    const drawing = await prisma.drawing.findFirst({
        orderBy: {
            id: "desc"
        }
    });

    if (!drawing) {
      console.log("⚠️ No se encontraron dibujos en la BD");
      return NextResponse.json({ error: "No drawings found" }, { status: 404 });
    }

    const strokesArray = Array.isArray(drawing.strokes) ? drawing.strokes : [];

    const serializedDrawing = {
      ...drawing,
      strokes: strokesArray.map(stroke =>
        typeof stroke === "object" && stroke !== null
          ? {
              ...stroke,
              shadow: stroke.shadow ? JSON.parse(JSON.stringify(stroke.shadow)) : null,
              path: stroke.path ? JSON.parse(JSON.stringify(stroke.path)) : null,
            }
          : {}
      ),
    };

    console.log("📦 Dibujo enviado al frontend:", serializedDrawing);

    return NextResponse.json(serializedDrawing);
  } catch (error) {
    console.error("❌ Error al obtener el dibujo:", error);
    return NextResponse.json({ error: "Error fetching drawing" }, { status: 500 });
  }
}
