import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

import boxerIdle from '../../assets/images/singlemode/boxer_idle.png';
import boxerPunch from '../../assets/images/singlemode/boxer_punch.png';
import buildingImg from '../../assets/images/singlemode/building.png';
import singleBack from '../../assets/images/singlemode/singleback.png';

import building1 from '../../assets/images/building/building1.png';
import building2 from '../../assets/images/building/building2.png';
import building3 from '../../assets/images/building/building3.png';

const buildingImages = [building1, building2, building3];

const PixiCanvas = ({ action, buildingIndex, onBuildingDestroyed }) => {
  const pixiRef = useRef(null);
  const appRef = useRef(null);
  const boxerRef = useRef(null);
  const buildingRef = useRef(null);
  const healthBarRef = useRef(null);
  const [buildingHP, setBuildingHP] = useState(100);
  const prevActionRef = useRef('idle');

  // 🔸 캐릭터 공통 크기 설정
  const boxerWidth = 150;
  const boxerHeight = 150;

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
      if (app.stage) {
        loadAssets(app);
      }
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
    try {
      const texture = await PIXI.Assets.load(singleBack);
      const background = new PIXI.Sprite(texture);

      const containerWidth = pixiRef.current.clientWidth;
      const containerHeight = pixiRef.current.clientHeight;
      const imageRatio = texture.width / texture.height;
      const containerRatio = containerWidth / containerHeight;

      let bgWidth, bgHeight;
      if (containerRatio > imageRatio) {
        bgHeight = containerHeight;
        bgWidth = containerHeight * imageRatio;
      } else {
        bgWidth = containerWidth;
        bgHeight = containerWidth / imageRatio;
      }

      background.width = bgWidth;
      background.height = bgHeight;
      background.anchor.set(0.5);
      background.x = containerWidth / 2;
      background.y = containerHeight / 2;
      background.zIndex = 0;
      app.stage.addChild(background);

      const boxer = new PIXI.Sprite(PIXI.Texture.from(boxerIdle));
      boxer.anchor.set(0.5);
      boxer.width = boxerWidth;
      boxer.height = boxerHeight;
      boxer.x = containerWidth * 0.3;
      boxer.y = containerHeight * 0.65;
      boxer.zIndex = 1;
      boxerRef.current = boxer;
      app.stage.addChild(boxer);

      const building = new PIXI.Sprite(PIXI.Texture.from(buildingImages[buildingIndex]));

      building.anchor.set(0.5);
      building.x = containerWidth * 0.55;
      building.y = containerHeight * 0.62;
      building.scale.set(0.25);
      building.zIndex = 1;
      buildingRef.current = building;
      app.stage.addChild(building);

      const hpBg = new PIXI.Graphics();
      hpBg.beginFill(0xaaaaaa);
      hpBg.drawRect(0, 0, 200, 15);
      hpBg.endFill();
      hpBg.x = building.x - 100;
      hpBg.y = building.y - building.height / 2 - 150;
      hpBg.zIndex = 2;
      app.stage.addChild(hpBg);

      const hpFill = new PIXI.Graphics();
      hpFill.beginFill(0xff3333);
      hpFill.drawRect(0, 0, 200, 15);
      hpFill.endFill();
      hpFill.x = hpBg.x;
      hpFill.y = hpBg.y;
      hpFill.zIndex = 3;
      healthBarRef.current = hpFill;
      app.stage.addChild(hpFill);
    } catch (err) {
      console.error('❌ loadAssets 에러:', err);
    }
  };

// 🔹 1. action에 반응하는 useEffect
useEffect(() => {
  if (!boxerRef.current || !healthBarRef.current) return;

  if (action === 'punch' && prevActionRef.current !== 'punch') {
    boxerRef.current.texture = PIXI.Texture.from(boxerPunch);
    boxerRef.current.width = boxerWidth;
    boxerRef.current.height = boxerHeight;
    boxerRef.current.x = appRef.current.renderer.width * 0.3;
    boxerRef.current.y = appRef.current.renderer.height * 0.65;
    setBuildingHP((prev) => Math.max(prev - 25, 0));
  }

  if (action !== 'punch') {
    boxerRef.current.texture = PIXI.Texture.from(boxerIdle);
    boxerRef.current.width = boxerWidth;
    boxerRef.current.height = boxerHeight;
  }

  prevActionRef.current = action;
}, [action]); // ✅ action 기준

// 🔹 2. buildingIndex에 반응하는 useEffect (별도)
useEffect(() => {
  if (buildingRef.current) {
    buildingRef.current.texture = PIXI.Texture.from(buildingImages[buildingIndex]);
  }
}, [buildingIndex]);




  useEffect(() => {
    if (healthBarRef.current) {
      const newWidth = (buildingHP / 100) * 200;
      healthBarRef.current.clear();
      healthBarRef.current.beginFill(0xff3333);
      healthBarRef.current.drawRect(0, 0, newWidth, 15);
      healthBarRef.current.endFill();
    }

    if (buildingHP <= 0) {
      setTimeout(() => {
        setBuildingHP(100); // 다음 건물 체력 리셋
        if (onBuildingDestroyed) {
          onBuildingDestroyed(); // 부모 컴포넌트로 알림
        }
      }, 1000);
    }
  }, [buildingHP]);

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
