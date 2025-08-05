import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

import building1 from '../../assets/images/building/building1.png';
import building2 from '../../assets/images/building/building2.png';
import building3 from '../../assets/images/building/building3.png';
import singleBack from '../../assets/images/singlemode/singleback.png';
import buildingDust1 from '../../assets/images/effects/building_dust_1.png';
import buildingDust2 from '../../assets/images/effects/building_dust_2.png';
import buildingDust3 from '../../assets/images/effects/building_dust_3.png';
import karina1 from '../../assets/images/karina/karina_1.png';
import karina3 from '../../assets/images/karina/karina_3.png';

const karinaFrames = [karina1, karina3, karina1];
const buildingImages = [building1, building2, building3];
const dustFrames = [buildingDust1, buildingDust2, buildingDust3, buildingDust2, buildingDust1];

const PixiCanvas = ({ action, buildingIndex, onBuildingDestroyed, kcal, setKcal }) => {
  const pixiRef = useRef(null);
  const appRef = useRef(null);
  const boxerRef = useRef(null);
  const buildingRef = useRef(null);
  const healthBarRef = useRef(null);
  const dustSpriteRef = useRef(null);
  const kcalTextRef = useRef(null);
  const prevActionRef = useRef('idle');
  const [buildingHP, setBuildingHP] = useState(100);
  const [isBuildingFalling, setIsBuildingFalling] = useState(false);
  const [isNewBuildingDropping, setIsNewBuildingDropping] = useState(false);

  const boxerWidth = 250;
  const boxerHeight = 250;
  const coinTextRef = useRef(null);  // 🔥 이 줄을 추가해줘!
  const destroyedTextRef = useRef(null);


  useEffect(() => {
    if (!pixiRef.current) return;

    const app = new PIXI.Application({
      width: pixiRef.current.clientWidth,
      height: pixiRef.current.clientHeight,
      backgroundAlpha: 0,
      resizeTo: pixiRef.current,
    });

    appRef.current = app;
    pixiRef.current.appendChild(app.view);

    setTimeout(() => {
      if (app.stage) loadAssets(app);
    }, 0);

    app.stage.sortableChildren = true;

    const handleResize = () => {
      if (pixiRef.current) {
        app.renderer.resize(pixiRef.current.clientWidth, pixiRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      app.destroy(true, { children: true });
      window.removeEventListener('resize', handleResize);
      appRef.current = null;
    };
  }, []);

  const loadAssets = async (app) => {
    const rightMargin = 10; // ← 이 줄이 없어서 에러났음
    let topY = 30;
    const containerWidth = pixiRef.current.clientWidth;
    const containerHeight = pixiRef.current.clientHeight;

    const background = new PIXI.Sprite(await PIXI.Assets.load(singleBack));
    background.anchor.set(0.5);
    background.zIndex = 0;
    background.x = containerWidth / 2;
    background.y = containerHeight / 2 - 100;
    app.stage.addChild(background);

    const boxer = new PIXI.Sprite(PIXI.Texture.from(karina1));
    boxer.anchor.set(0.5);
    boxer.width = boxerWidth;
    boxer.height = boxerHeight;
    boxer.x = containerWidth * 0.3;
    boxer.y = containerHeight * 0.75;
    boxer.zIndex = 1;
    boxerRef.current = boxer;
    app.stage.addChild(boxer);

    const building = new PIXI.Sprite(PIXI.Texture.from(buildingImages[buildingIndex]));
    building.anchor.set(0.5);
    building.x = containerWidth * 0.63;
    building.y = containerHeight * 0.63;
    building.scale.set(0.5);
    building.zIndex = 1;
    buildingRef.current = building;
    app.stage.addChild(building);

    const dust = new PIXI.Sprite(PIXI.Texture.from(dustFrames[0]));
    dust.anchor.set(0.5);
    dust.x = building.x;
    dust.y = building.y + building.height / 3;
    dust.scale.set(0.45);
    dust.visible = false;
    dust.zIndex = 2;
    dustSpriteRef.current = dust;
    app.stage.addChild(dust);

    const hpBg = new PIXI.Graphics();
    hpBg.beginFill(0xaaaaaa).drawRect(0, 0, 200, 15).endFill();
    hpBg.x = building.x - 100;
    hpBg.y = building.y - building.height / 2 - 250;
    hpBg.zIndex = 2;
    app.stage.addChild(hpBg);

    const hpFill = new PIXI.Graphics();
    hpFill.beginFill(0xff3333).drawRect(0, 0, 200, 15).endFill();
    hpFill.x = hpBg.x;
    hpFill.y = hpBg.y;
    hpFill.zIndex = 3;
    healthBarRef.current = hpFill;
    app.stage.addChild(hpFill);

// KCAL 텍스트 (기존 유지)
    const kcalText = new PIXI.Text(`${kcal} kcal`, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 'white',
      fontWeight: 'bold',
    });
    kcalText.x = containerWidth - 140;
    kcalText.y = 30;
    kcalText.zIndex = 5;
    kcalTextRef.current = kcalText;
    app.stage.addChild(kcalText);

  // DESTROYED 텍스트 (KCAL 아래)
    const destroyedText = new PIXI.Text(`DESTROYED: ${buildingIndex}`, {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 'white',
      fontWeight: 'bold',
    });
    destroyedText.anchor.set(1, 0); // 우측 정렬
    destroyedText.x = containerWidth - rightMargin;
    destroyedText.y = topY;
    destroyedText.zIndex = 5;
    destroyedTextRef.current = destroyedText;
    app.stage.addChild(destroyedText);

    // COINS 텍스트 (DESTROYED 아래)
    topY += 35;
    const coinText = new PIXI.Text(`COINS: ${buildingIndex}`, {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 'yellow',
      fontWeight: 'bold',
    });
    coinText.anchor.set(1, 0); // 우측 정렬
    coinText.x = containerWidth - rightMargin;
    coinText.y = topY;
    coinText.zIndex = 5;
    coinTextRef.current = coinText;
    app.stage.addChild(coinText);
  };

  useEffect(() => {
    if (!boxerRef.current || !healthBarRef.current) return;

    if (action === 'punch' && prevActionRef.current !== 'punch' && !isBuildingFalling && !isNewBuildingDropping) {
      const boxer = boxerRef.current;
      let i = 0;
      const interval = setInterval(() => {
        if (i < karinaFrames.length) {
          boxer.texture = PIXI.Texture.from(karinaFrames[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 80);
      setBuildingHP((prev) => Math.max(prev - 25, 0));
      setKcal((prev) => prev + 1);
    }

    prevActionRef.current = action;
  }, [action]);

  useEffect(() => {
    if (buildingRef.current) {
      buildingRef.current.texture = PIXI.Texture.from(buildingImages[buildingIndex]);
    }
  }, [buildingIndex]);

  useEffect(() => {
    if (healthBarRef.current) {
      const newWidth = (buildingHP / 100) * 200;
      healthBarRef.current.clear();
      healthBarRef.current.beginFill(0xff3333).drawRect(0, 0, newWidth, 15).endFill();
    }

    if (buildingHP <= 0 && !isBuildingFalling) {
      setIsBuildingFalling(true);
    }
  }, [buildingHP]);

  useEffect(() => {
    const app = appRef.current;
    const building = buildingRef.current;
    const dust = dustSpriteRef.current;
    if (!app || !building || !dust) return;

    let frameIndex = 0;
    let interval;

    if (isBuildingFalling) {
      dust.visible = true;
      building.visible = false;

      interval = setInterval(() => {
        if (frameIndex < dustFrames.length) {
          dust.texture = PIXI.Texture.from(dustFrames[frameIndex]);
          frameIndex++;
        } else {
          clearInterval(interval);
          dust.visible = false;
          setIsBuildingFalling(false);
          setIsNewBuildingDropping(true);
          onBuildingDestroyed();
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBuildingFalling]);

  useEffect(() => {
    const app = appRef.current;
    const building = buildingRef.current;
    if (!app || !building) return;

    let ticker;

    if (isNewBuildingDropping) {
      building.x = app.renderer.width * 0.63;
      building.y = -200;
      building.texture = PIXI.Texture.from(buildingImages[buildingIndex]);
      building.visible = true;
      setBuildingHP(100);

      ticker = (delta) => {
        building.y += 15 * delta;
        if (building.y >= app.renderer.height * 0.63) {
          building.y = app.renderer.height * 0.63;
          setIsNewBuildingDropping(false);
        }
      };

      app.ticker.add(ticker);
    }

    return () => {
      if (ticker) app.ticker.remove(ticker);
    };
  }, [isNewBuildingDropping, buildingIndex]);


  useEffect(() => {
  if (kcalTextRef.current) {
    kcalTextRef.current.text = `${kcal} kcal`;
  }
  if (coinTextRef.current) {
    coinTextRef.current.text = `COINS: ${buildingIndex}`;
  }
  if (destroyedTextRef.current) {
    destroyedTextRef.current.text = `부순 건물 ${buildingIndex}`;
  }
}, [buildingIndex]);


  return (
    <div
      ref={pixiRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  );
};

export default PixiCanvas;
