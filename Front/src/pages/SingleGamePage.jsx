// src/pages/SingleGame.jsx
import React, { useEffect, useRef, useState } from "react";
import { Application } from "pixi.js";
import CharacterSprite from "../components/pixi/CharacterSprite";

function SingleGame() {
  const canvasRef = useRef(null);
  const [app, setApp] = useState(null);

  useEffect(() => {
    const pixiApp = new Application({
      width: 1024,
      height: 864,
      backgroundColor: 0x87ceeb,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    if (canvasRef.current) {
      canvasRef.current.appendChild(pixiApp.view);
      setApp(pixiApp);
    }

    return () => {
      pixiApp.destroy(true, true);
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {app && <CharacterSprite app={app} />}
    </div>
  );
}

export default SingleGame;
