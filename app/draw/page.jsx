"use client";
import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

export default function PaintPage() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [shadowBlur, setShadowBlur] = useState(0);
  const [brushType, setBrushType] = useState("Pencil");
  const [strokes, setStrokes] = useState([]);

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", { isDrawingMode: true });
    canvasRef.current = canvas;

    canvas.on("path:created", (event) => {
      const path = event.path;
      setStrokes((prev) => [...prev, path.toObject()]);
    });

    // Configuración inicial del pincel
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    updateBrush();

    return () => {
      canvas.dispose();
    };
  }, []);

  const saveDrawing = async () => {
    if (!canvasRef.current) return;

    // Extrae solo los objetos del canvas
    const json = canvasRef.current.toJSON();
    const strokes = json.objects;

    console.log("📤 JSON a guardar:", strokes);

    await fetch("/api/drawings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strokes }),
    });
  };

  const loadDrawing = async () => {
    const res = await fetch("/api/drawings");
    const drawing = await res.json();

    if (drawing && drawing.strokes) {
      console.log("📥 Dibujo cargado:", drawing);

      canvasRef.current?.clear();
      canvasRef.current?.loadFromJSON({ objects: drawing.strokes }, () => {
        canvasRef.current?.renderAll();
      });
    }
  };

  const updateBrush = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let brush;
    if (brushType === "hline") {
      brush = new fabric.PatternBrush(canvas);
      brush.getPatternSrc = function () {
        const patternCanvas = document.createElement("canvas");
        patternCanvas.width = patternCanvas.height = 10;
        const ctx = patternCanvas.getContext("2d");
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(10, 5);
        ctx.closePath();
        ctx.stroke();
        return patternCanvas;
      };
    } else {
      brush = new fabric[`${brushType}Brush`](canvas); // Aserción de tipo eliminada
    }

    brush.color = color;
    brush.width = lineWidth;
    brush.shadow = new fabric.Shadow({
      blur: shadowBlur,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: color,
    });

    canvas.freeDrawingBrush = brush;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas id="canvas" width={500} height={500} className="border" />
      <div className="flex gap-2">
        <label>
          🎨 Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} onBlur={updateBrush} />
        </label>
        <label>
          ✏️ Grosor:
          <input type="number" value={lineWidth} min="1" max="50" onChange={(e) => setLineWidth(Number(e.target.value))} onBlur={updateBrush} />
        </label>
        <label>
          🌟 Sombra:
          <input type="number" value={shadowBlur} min="0" max="50" onChange={(e) => setShadowBlur(Number(e.target.value))} onBlur={updateBrush} />
        </label>
        <select value={brushType} onChange={(e) => setBrushType(e.target.value)} onBlur={updateBrush}>
          <option value="Pencil">Lápiz</option>
          <option value="Spray">Spray</option>
          <option value="hline">Línea Horizontal</option>
        </select>
        <button onClick={() => canvasRef.current?.clear()} className="p-2 bg-red-500 text-white">🗑 Borrar</button>
        <button onClick={saveDrawing} className="p-2 bg-blue-500 text-white">💾 Guardar</button>
        <button onClick={loadDrawing} className="p-2 bg-green-500 text-white">🔄 Cargar</button>
      </div>

      {/* Renderizar las líneas guardadas */}
      <div>
        <h2>Strokes:</h2>
        {strokes.map((stroke, index) => (
          <div key={index}>
            <p>Stroke {index + 1}: {stroke.path}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
