import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

import building1 from '../../assets/images/building/building1.png';
import building2 from '../../assets/images/building/building2.png';
import building3 from '../../assets/images/building/building3.png';
import singleBack from '../../assets/images/singlemode/singleback.png';
import buildingDust1 from '../../assets/images/effects/building_dust_1.png';
import buildingDust2 from '../../assets/images/effects/building_dust_2.png';
import buildingDust3 from '../../assets/images/effects/building_dust_3.png';
import crackTexture from '../../assets/images/effects/building_break.png';
import karina_final_anim_01 from '../../assets/images/karina/karina_final_anim_01.png';
import karina_final_anim_02 from '../../assets/images/karina/karina_final_anim_02.png';
import karina_final_anim_03 from '../../assets/images/karina/karina_final_anim_03.png';
import karina_final_anim_04 from '../../assets/images/karina/karina_final_anim_04.png';
import karina_final_anim_05 from '../../assets/images/karina/karina_final_anim_05.png';

const karinaFrames = [
  karina_final_anim_01,
  karina_final_anim_03,
  karina_final_anim_05,
  karina_final_anim_05,
  karina_final_anim_03,
  karina_final_anim_01
];
const buildingImages = [building1, building2, building3];
const dustFrames = [buildingDust1, buildingDust2, buildingDust3, buildingDust2, buildingDust1];

const PixiCanvas = ({ action, buildingIndex, onBuildingDestroyed, kcal, setKcal }) => {
  const pixiRef = useRef(null);
  const appRef = useRef(null);
  const boxerRef = useRef(null);
  const buildingRef = useRef(null);
  const healthBarRef = useRef(null);
  const dustSpriteRef = useRef(null);
  const prevActionRef = useRef('idle');
  const crackSpritesRef = useRef([]);

  const destroyedLock = useRef(false);
  const [buildingHP, setBuildingHP] = useState(100);
  const [isBuildingFalling, setIsBuildingFalling] = useState(false);
  const [isNewBuildingDropping, setIsNewBuildingDropping] = useState(false);

  const boxerWidth = 250;
  const boxerHeight = 250;

  // PIXI 초기화
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
    app.stage.sortableChildren = true;

    loadAssets(app);

    const handleResize = () => {
      app.renderer.resize(pixiRef.current.clientWidth, pixiRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      app.destroy(true, { children: true });
      window.removeEventListener('resize', handleResize);
      appRef.current = null;
    };
  }, []);

  const safeAddChild = (sprite) => {
    if (appRef.current?.stage && !appRef.current.stage.destroyed) {
      appRef.current.stage.addChild(sprite);
    }
  };

  const loadAssets = () => {
    const containerWidth = pixiRef.current.clientWidth;
    const containerHeight = pixiRef.current.clientHeight;

    const background = PIXI.Sprite.from(singleBack);
    background.anchor.set(0.5);
    background.x = containerWidth / 2;
    background.y = containerHeight / 2 - 100;
    background.zIndex = 0;
    safeAddChild(background);

    const boxer = new PIXI.Sprite(PIXI.Texture.from(karina_final_anim_01));
    boxer.anchor.set(0.5);
    boxer.width = boxerWidth;
    boxer.height = boxerHeight;
    boxer.x = containerWidth * 0.3;
    boxer.y = containerHeight * 0.75;
    boxer.zIndex = 1;
    boxerRef.current = boxer;
    safeAddChild(boxer);

    const building = new PIXI.Sprite(PIXI.Texture.from(buildingImages[buildingIndex]));
    building.anchor.set(0.5);
    building.x = containerWidth * 0.63;
    building.y = containerHeight * 0.63;
    building.scale.set(0.5);
    building.zIndex = 1;
    buildingRef.current = building;
    safeAddChild(building);

    const dust = new PIXI.Sprite(PIXI.Texture.from(dustFrames[0]));
    dust.anchor.set(0.5);
    dust.x = building.x;
    dust.y = building.y + building.height / 3;
    dust.scale.set(0.45);
    dust.visible = false;
    dust.zIndex = 2;
    dustSpriteRef.current = dust;
    safeAddChild(dust);

    const hpBg = new PIXI.Graphics();
    hpBg.beginFill(0xaaaaaa).drawRect(0, 0, 200, 15).endFill();
    hpBg.x = building.x - 100;
    hpBg.y = building.y - building.height / 2 - 250;
    hpBg.zIndex = 2;
    safeAddChild(hpBg);

    const hpFill = new PIXI.Graphics();
    hpFill.beginFill(0xff3333).drawRect(0, 0, 200, 15).endFill();
    hpFill.x = hpBg.x;
    hpFill.y = hpBg.y;
    hpFill.zIndex = 3;
    healthBarRef.current = hpFill;
    safeAddChild(hpFill);

    const crackSprites = [];
    for (let i = 0; i < 3; i++) {
      const crack = new PIXI.Sprite(PIXI.Texture.from(crackTexture));
      crack.alpha = 0.6;
      crack.anchor.set(0.5);
      crack.scale.set(0.4 + Math.random() * 0.3);
      crack.x = building.x + (Math.random() * 100 - 50);
      crack.y = building.y + (Math.random() * 100 - 50);
      crack.visible = false;
      crack.zIndex = 3;
      crackSprites.push(crack);
      safeAddChild(crack);
    }
    crackSpritesRef.current = crackSprites;
  };

  // 펀치
  useEffect(() => {
    if (!boxerRef.current) return;
    if (action === 'punch' && prevActionRef.current !== 'punch' && !isBuildingFalling && !isNewBuildingDropping) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < karinaFrames.length) {
          boxerRef.current.texture = PIXI.Texture.from(karinaFrames[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 80);
      setBuildingHP((prev) => Math.max(prev - 25, 0));
      setKcal((prev) => prev + 1);
    }
    prevActionRef.current = action;
  }, [action, isNewBuildingDropping, isBuildingFalling]);

  // HP 변화
  useEffect(() => {
    if (healthBarRef.current) {
      const newWidth = (buildingHP / 100) * 200;
      healthBarRef.current.clear();
      healthBarRef.current.beginFill(0xff3333).drawRect(0, 0, newWidth, 15).endFill();
    }

    if (crackSpritesRef.current) {
      crackSpritesRef.current.forEach((sprite, index) => {
        if (buildingHP <= 25 && index <= 2) sprite.visible = true;
        else if (buildingHP <= 50 && index <= 1) sprite.visible = true;
        else if (buildingHP <= 75 && index === 0) sprite.visible = true;
        else sprite.visible = false;
      });
    }

    if (buildingHP <= 0 && !isBuildingFalling) {
      setIsBuildingFalling(true);
    }
  }, [buildingHP]);

  // 건물 붕괴 → 먼지
  useEffect(() => {
    const building = buildingRef.current;
    const dust = dustSpriteRef.current;
    if (!building || !dust) return;

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

          if (!destroyedLock.current) {
            destroyedLock.current = true;
            onBuildingDestroyed();
          }
        }
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBuildingFalling]);

  // 새 건물 드랍
  useEffect(() => {
    const app = appRef.current;
    const building = buildingRef.current;
    if (!app || !building) return;

    if (isNewBuildingDropping) {
      building.x = app.renderer.width * 0.63;
      building.y = -200;
      building.texture = PIXI.Texture.from(buildingImages[buildingIndex]);
      building.visible = true;
      setBuildingHP(100);

      const ticker = (delta) => {
        building.y += 15 * delta;
        if (building.y >= app.renderer.height * 0.63) {
          building.y = app.renderer.height * 0.63;
          setIsNewBuildingDropping(false);
          destroyedLock.current = false;
          app.ticker.remove(ticker);
        }
      };
      app.ticker.add(ticker);
    }
  }, [isNewBuildingDropping, buildingIndex]);

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
