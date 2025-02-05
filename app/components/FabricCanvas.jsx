"use client";
import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(null);

  useEffect(() => {
    async function fetchDrawing() {
      const response = await fetch("/api/drawings");
      const data = await response.json();
      console.log("📥 Datos recibidos en el frontend:", data);
      setDrawing(data);
    }
    fetchDrawing();
  }, []);

  useEffect(() => {
    if (!drawing || !drawing.strokes || !canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current);
    let index = 0;

    const drawNextStroke = () => {
      if (index >= drawing.strokes.length) return;

      const stroke = drawing.strokes[index];
      const path = new fabric.Path(stroke.path, {
        ...stroke,
        strokeDashArray: [0, stroke.path.length],
      });

      canvas.add(path);
      canvas.renderAll();

      let progress = 0;
      const totalLength = stroke.path.length * 10;

      const animateStroke = () => {
        if (progress >= totalLength) {
          path.set({ strokeDashArray: null });
          canvas.renderAll();
          index++;
          setTimeout(drawNextStroke, 500);
          return;
        }
        progress += Math.random() * 8 + 4; // Variación en la velocidad para mayor realismo
        path.set({ strokeDashArray: [progress, totalLength - progress] });
        canvas.renderAll();
        requestAnimationFrame(animateStroke);
      };

      animateStroke();
    };

    drawNextStroke();
  }, [drawing]);

  return <canvas ref={canvasRef} width={500} height={500} />;
};

export default CanvasComponent;
