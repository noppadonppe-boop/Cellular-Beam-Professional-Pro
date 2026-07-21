"use client";

import { useEffect, useRef } from "react";

function BeamCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
      const c = canvas.getContext("2d"); if (!c) return; c.scale(dpr, dpr);
      const w = rect.width, h = rect.height, y = h * .46;
      c.strokeStyle = "#d9e2ff"; c.lineWidth = 1;
      for(let x=0;x<w;x+=24){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke()}
      for(let gy=0;gy<h;gy+=24){c.beginPath();c.moveTo(0,gy);c.lineTo(w,gy);c.stroke()}
      c.fillStyle="#094cb2"; c.fillRect(54,y-52,w-108,104);
      c.fillStyle="#fbf9f8";
      const count=Math.max(7,Math.floor((w-180)/64)), gap=(w-220)/(count-1);
      for(let i=0;i<count;i++){c.beginPath();c.arc(110+i*gap,y,22,0,Math.PI*2);c.fill()}
      c.fillStyle="#1a1a1b"; c.beginPath(); c.moveTo(60,y+70);c.lineTo(45,y+94);c.lineTo(75,y+94);c.closePath();c.fill();
      c.beginPath(); c.moveTo(w-60,y+70);c.lineTo(w-75,y+94);c.lineTo(w-45,y+94);c.closePath();c.fill();
      c.strokeStyle="#737784";c.lineWidth=1;c.beginPath();c.moveTo(54,y-76);c.lineTo(w-54,y-76);c.stroke();
      c.fillStyle="#434653";c.font="12px JetBrains Mono";c.textAlign="center";c.fillText("12 000 mm",w/2,y-84);
      c.textAlign="left";c.fillText("Ø 450 · PITCH 600",60,h-18);
    };
    draw(); window.addEventListener("resize",draw); return()=>window.removeEventListener("resize",draw);
  }, []);
  return <canvas ref={ref} className="beam-canvas" aria-label="Cellular beam elevation diagram" />;
}

export function BeamWorkspace() {
  return (
    <section className="beam-panel card">
      <div className="card-heading"><div><span className="eyebrow">MODEL OVERVIEW</span><h2>Cellular beam geometry</h2></div><div className="segmented"><button className="selected">Elevation</button><button>Section</button></div></div>
      <div className="canvas-toolbar"><span className="demo-tag">DEMO DATA</span><span>H 600 × 200 × 11 × 17</span><span>24 openings</span><span>Grade SM490</span><div><button aria-label="Zoom out">−</button><button aria-label="Reset view">⌂</button><button aria-label="Zoom in">+</button></div></div>
      <BeamCanvas />
      <div className="beam-footer"><span><i className="legend opening" /> Opening</span><span><i className="legend solid" /> Solid end zone</span><span><i className="legend support" /> Support</span><button>Open geometry editor →</button></div>
    </section>
  );
}
