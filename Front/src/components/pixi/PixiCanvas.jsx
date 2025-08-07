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

const karinaFrames = [karina_final_anim_01,karina_final_anim_03, karina_final_anim_05,karina_final_anim_05,karina_final_anim_03,karina_final_anim_01];
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
  const crackSpritesRef = useRef([]);

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
    const rightMargin = 10;

    const containerWidth = pixiRef.current.clientWidth;
    const containerHeight = pixiRef.current.clientHeight;

    const background = new PIXI.Sprite(await PIXI.Assets.load(singleBack));
    background.anchor.set(0.5);
    background.zIndex = 0;
    background.x = containerWidth / 2;
    background.y = containerHeight / 2 - 100;
    app.stage.addChild(background);

    const boxer = new PIXI.Sprite(PIXI.Texture.from(karina_final_anim_01));
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

    // loadAssets 함수 내부에 추가
    const crackSprites = [];

    for (let i = 0; i < 3; i++) {
      const crack = new PIXI.Sprite(PIXI.Texture.from(crackTexture));
      crack.alpha = 0.6;
      crack.anchor.set(0.5);
      crack.scale.set(0.4 + Math.random() * 0.3); // 크기 랜덤
      crack.x = building.x + (Math.random() * 100 - 50); // 건물 주변 랜덤 위치
      crack.y = building.y + (Math.random() * 100 - 50);
      crack.visible = false;
      crack.zIndex = 3;
      crackSprites.push(crack);
      app.stage.addChild(crack);
    }

    crackSpritesRef.current = crackSprites;


// KCAL 텍스트 (기존 유지)
  //   const kcalText = new PIXI.Text(${kcal} kcal, {
  //     fontFamily: 'Arial',
  //     fontSize: 24,
  //     fill: 'white',
  //     fontWeight: 'bold',
  //   });
  //   kcalText.x = containerWidth - 140;
  //   kcalText.y = 30;
  //   kcalText.zIndex = 5;
  //   kcalTextRef.current = kcalText;
  //   app.stage.addChild(kcalText);

  // // DESTROYED 텍스트 (KCAL 아래)
  //   const destroyedText = new PIXI.Text(DESTROYED: ${destroyedCount}, {
  //     fontFamily: 'Arial',
  //     fontSize: 20,
  //     fill: 'white',
  //     fontWeight: 'bold',
  //   });
  //   destroyedText.anchor.set(1, 0); // 우측 정렬
  //   destroyedText.x = containerWidth - rightMargin;
  //   destroyedText.y = kcalText.y + kcalText.height + 10;
  //   destroyedText.zIndex = 5;
  //   destroyedTextRef.current = destroyedText;
  //   app.stage.addChild(destroyedText);

  //   // COINS 텍스트 (DESTROYED 아래)
  //   // topY += 35;
  //   const coinText = new PIXI.Text(COINS: ${coinCount}, {
  //     fontFamily: 'Arial',
  //     fontSize: 20,
  //     fill: 'yellow',
  //     fontWeight: 'bold',
  //   });
  //   coinText.anchor.set(1, 0); // 우측 정렬
  //   coinText.x = containerWidth - rightMargin;
  //   coinText.y = destroyedText.y + destroyedText.height + 5;
  //   coinText.zIndex = 5;
  //   coinTextRef.current = coinText;
  //   app.stage.addChild(coinText);
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

  // 건물 이미지 업데이트
  useEffect(() => {
    if (buildingRef.current) {
      buildingRef.current.texture = PIXI.Texture.from(buildingImages[buildingIndex]);
    }
  }, [buildingIndex]);

  // 체력 변화에 따라 체력바 및 균열 상태 업데이트
  useEffect(() => {
    // 체력바 너비 조절
    if (healthBarRef.current) {
      const newWidth = (buildingHP / 100) * 200;
      healthBarRef.current.clear();
      healthBarRef.current.beginFill(0xff3333).drawRect(0, 0, newWidth, 15).endFill();
    }

    // 균열 표시 조건 (HP 상태 및 건물 전환 시 재적용)
    if (crackSpritesRef.current) {
      crackSpritesRef.current.forEach((sprite, index) => {
        if (buildingHP <= 25 && index <= 2) {
          sprite.visible = true;
        } else if (buildingHP <= 50 && index <= 1) {
          sprite.visible = true;
        } else if (buildingHP <= 75 && index === 0) {
          sprite.visible = true;
        } else {
          sprite.visible = false;
        }
      });
    }

    // 건물 붕괴 상태 트리거
    if (buildingHP <= 0 && !isBuildingFalling) {
      crackSpritesRef.current?.forEach(sprite => (sprite.visible = false)); // 죽으면 균열 제거
      setIsBuildingFalling(true);
    }
  }, [buildingHP, buildingIndex]); // ✅ buildingIndex 의존성 포함


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

      // 기존 균열 제거
      if (crackSpritesRef.current) {
        crackSpritesRef.current.forEach((sprite) => {
          app.stage.removeChild(sprite);
        });
      }

      // 새 균열 생성 (위치 임시)
      const newCracks = [];
      for (let i = 0; i < 3; i++) {
        const crack = new PIXI.Sprite(PIXI.Texture.from(crackTexture));
        crack.alpha = 0.85;
        crack.anchor.set(0.5);
        crack.scale.set(0.4 + Math.random() * 0.3);
        crack.visible = false;
        crack.zIndex = 3;
        app.stage.addChild(crack);
        newCracks.push(crack);
      }
      crackSpritesRef.current = newCracks;

      // 건물 낙하 애니메이션
      ticker = (delta) => {
        building.y += 15 * delta;
        if (building.y >= app.renderer.height * 0.63) {
          building.y = app.renderer.height * 0.63;
          setIsNewBuildingDropping(false);

          // ✅ 균열 위치 재조정 (건물이 도착한 이후!)
          crackSpritesRef.current.forEach((crack) => {
            crack.x = building.x + (Math.random() * 100 - 50);
            crack.y = building.y + (Math.random() * 100 - 50);
          });
        }
      };

      app.ticker.add(ticker);
    }

    return () => {
      if (ticker) app.ticker.remove(ticker);
    };
  }, [isNewBuildingDropping, buildingIndex]);



    // useEffect(() => {
    //   if (kcalTextRef.current) {
    //     kcalTextRef.current.text = ${kcal} kcal;
    //   }
    //   if (coinTextRef.current) {
    //     coinTextRef.current.text = COINS: ${coinCount};
    //   }
    //   if (destroyedTextRef.current) {
    //     destroyedTextRef.current.text = 부순 건물 ${destroyedCount};
    //   }
    // }, [buildingIndex]);


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