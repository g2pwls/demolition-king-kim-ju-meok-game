import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

import building1 from '../../assets/images/building/building1.png';
import singleBack from '../../assets/images/singlemode/singleback.png';
import buildingDust1 from '../../assets/images/effects/building_dust_1.png';
import buildingDust2 from '../../assets/images/effects/building_dust_2.png';
import buildingDust3 from '../../assets/images/effects/building_dust_3.png';
import crackTexture from '../../assets/images/effects/punch_effect.png';

// 카리나
import karina_final_anim_01 from '../../assets/images/karina/karina_final_anim_01.png';
import karina_final_anim_03 from '../../assets/images/karina/karina_final_anim_03.png';
import karina_final_anim_05 from '../../assets/images/karina/karina_final_anim_05.png';
// ✅ 어퍼컷 전용 프레임 추가
import karina_upper from '../../assets/images/karina/karina_upper.png';


//복서
import boxer_01 from '../../assets/images/karina/boxer_01.png';
import boxer_02 from '../../assets/images/karina/boxer_02.png';
import boxer_03 from '../../assets/images/karina/boxer_03.png';
// ✅ 어퍼컷 전용 프레임 추가
import boxer_upper from '../../assets/images/karina/boxer_upper.png';


// 로니
import ronnie_01 from '../../assets/images/karina/ronnie_01.png';
import ronnie_02 from '../../assets/images/karina/ronnie_02.png';
import ronnie_03 from '../../assets/images/karina/ronnie_03.png';
// ✅ 어퍼컷 전용 프레임 추가
import ronnie_upper from '../../assets/images/karina/ronnie_upper.png';
// ========= 애니메이션 프레임 =========

//카리나
const karinaFrames = [
  karina_final_anim_01,
  karina_final_anim_03,
  karina_final_anim_05,
  karina_final_anim_05,
  karina_final_anim_03,
  karina_final_anim_01,
];

// ✅ 어퍼컷 프레임 시퀀스
const uppercutFrames = [
  karina_final_anim_01,
  karina_final_anim_03,
  karina_upper,
  karina_upper,
  karina_final_anim_03,
  karina_final_anim_01,
];
//복서
// const karinaFrames = [
//   boxer_01,
//   boxer_02,
//   boxer_03,
//   boxer_03,  
//   boxer_02,
//   boxer_01,
// ];

// ✅ 어퍼컷 프레임 시퀀스
// const uppercutFrames = [
//   boxer_01,  
//   boxer_02,
//   boxer_upper,
//   boxer_upper,
//   boxer_02,            
//   boxer_01,  
// ];

// 로니
// const karinaFrames = [
//   ronnie_01,
//   ronnie_02,
//   ronnie_03,
//   ronnie_03, 
//   ronnie_02,
//   ronnie_01,
// ];

// // ✅ 어퍼컷 프레임 시퀀스
// const uppercutFrames = [
//   ronnie_01, 
//   ronnie_02,   
//   ronnie_upper,
//   ronnie_upper,
//   ronnie_02,
//   ronnie_01,
// ];

const dustFrames = [buildingDust1, buildingDust2, buildingDust3, buildingDust2, buildingDust1];

// ========= 상수 =========
const HP_BAR_WIDTH = 180;
const HP_BAR_HEIGHT = 12;
const HP_BAR_OFFSET_Y = 18;

// 건물 들어갈 고정 박스(비율 유지) — “박스 바닥”에 건물 바닥을 붙임
const BOX_W_RATIO = 0.33;
const BOX_H_RATIO = 0.55;
const BOX_POS_X_RATIO = 0.63;
const BOX_POS_Y_RATIO = 0.63;

const computeBox = (app) => {
  const w = app.renderer.width * BOX_W_RATIO;
  const h = app.renderer.height * BOX_H_RATIO;
  const cx = app.renderer.width * BOX_POS_X_RATIO;
  const cy = app.renderer.height * BOX_POS_Y_RATIO;
  const bottomY = cy + h / 2; // 박스 바닥 라인
  return { w, h, cx, cy, bottomY };
};

// 비율 유지 스케일
const fitSpriteToBox = (sprite, boxW, boxH, mode = 'fit') => {
  const doResize = () => {
    const texW = sprite.texture.width || 1;
    const texH = sprite.texture.height || 1;
    const sx = boxW / texW;
    const sy = boxH / texH;
    const s = mode === 'cover' ? Math.max(sx, sy) : Math.min(sx, sy);
    sprite.scale.set(s);
  };
  if (sprite.texture.valid) doResize();
  else sprite.texture.once('update', doResize);
};

// HP/먼지 위치: anchorY = 1(바닥 기준)
const placeHpAndDust = (buildingSprite, hpBg, hpFill, dust) => {
  if (!buildingSprite) return;
  const topY = buildingSprite.y - buildingSprite.height; // 바닥기준이라 top = y - height
  if (hpBg) {
    hpBg.x = buildingSprite.x - HP_BAR_WIDTH / 2;
    hpBg.y = topY - HP_BAR_OFFSET_Y;
  }
  if (hpFill) {
    hpFill.x = buildingSprite.x - HP_BAR_WIDTH / 2;
    hpFill.y = topY - HP_BAR_OFFSET_Y;
  }
  if (dust) {
    dust.x = buildingSprite.x;
    dust.y = buildingSprite.y - 10; // 건물 바닥 바로 위
  }
};

// 금(크랙) 위치를 건물 내부에 무작위로
const randomCrackPosition = (b) => {
  const topY = b.y - b.height;
  const x = b.x + (Math.random() - 0.5) * b.width * 0.6;
  const y = topY + b.height * (0.15 + Math.random() * 0.7); // 위/아래 여백 조금
  return { x, y };
};

const PixiCanvas = ({
  action,
  playerSkin,
  onBuildingDestroyed,
  kcal,
  setKcal,
  showBuildingHp,
  building, // { constructureSeq, hp, imageUrl, name }
}) => {
  const pixiRef = useRef(null);
  const appRef = useRef(null);

  const boxerRef = useRef(null);
  const buildingRef = useRef(null);
  const hpBgRef = useRef(null);
  const healthBarRef = useRef(null);
  const dustSpriteRef = useRef(null);
  const crackSpritesRef = useRef([]); // 기존 HP 단계별 크랙

  // ✅ 타격 순간 임팩트 크랙(1장) 추가용
  const impactCrackRef = useRef(null);
  const crackTimeoutRef = useRef(null);
  const crackFadeTickerRef = useRef(null);
  const crackActiveRef = useRef(false);

  const prevActionRef = useRef('idle');
  const destroyedLock = useRef(false);

  const [buildingHP, setBuildingHP] = useState(building?.hp ?? 100);
  const maxHPRef = useRef(building?.hp ?? 100);

  const [isBuildingFalling, setIsBuildingFalling] = useState(false);
  const [isNewBuildingDropping, setIsNewBuildingDropping] = useState(false);

  const boxerWidth = 250;
  const boxerHeight = 250;

  // ========== PIXI 초기화 ==========
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

    loadAssets();

    const handleResize = () => {
      if (!appRef.current) return;
      const app = appRef.current;
      app.renderer.resize(pixiRef.current.clientWidth, pixiRef.current.clientHeight);

      // 리사이즈 시 하단 정렬 유지
      const b = buildingRef.current;
      if (b) {
        const { w: boxW, h: boxH, cx, bottomY } = computeBox(app);
        b.x = cx;
        fitSpriteToBox(b, boxW, boxH, 'fit');
        b.y = bottomY; // 바닥 붙임
        placeHpAndDust(b, hpBgRef.current, healthBarRef.current, dustSpriteRef.current);

        // 크랙 위치도 보정
        crackSpritesRef.current.forEach((cr) => {
          const p = randomCrackPosition(b);
          cr.x = p.x; cr.y = p.y;
        });

        // 임팩트 크랙 위치도 보정(가운데로)
        if (impactCrackRef.current) {
          impactCrackRef.current.x = b.x;
          impactCrackRef.current.y = b.y - b.height * 0.2;
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // 타이머/티커 정리
      if (crackTimeoutRef.current) clearTimeout(crackTimeoutRef.current);
      if (crackFadeTickerRef.current) app.ticker.remove(crackFadeTickerRef.current);
      app.destroy(true, { children: true });
      appRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeAddChild = (sprite) => {
    const app = appRef.current;
    if (app?.stage && !app.stage.destroyed) {
      app.stage.addChild(sprite);
    }
  };

  const loadAssets = () => {
    const app = appRef.current;
    if (!app) return;
    const { cx, cy, w: boxW, h: boxH, bottomY } = computeBox(app);

    // 배경
    const background = PIXI.Sprite.from(singleBack);
    background.anchor.set(0.5);
    background.x = app.renderer.width / 2;
    background.y = app.renderer.height / 2 - 100;
    background.zIndex = 0;
    safeAddChild(background);

    // 복서
    const boxer = new PIXI.Sprite(PIXI.Texture.from(karina_final_anim_01));
    boxer.anchor.set(0.5);
    boxer.width = boxerWidth;
    boxer.height = boxerHeight;
    boxer.x = app.renderer.width * 0.3;
    boxer.y = app.renderer.height * 0.75;
    boxer.zIndex = 1;
    boxerRef.current = boxer;
    safeAddChild(boxer);

    // 건물 (바닥 기준 정렬)
    const bld = new PIXI.Sprite(PIXI.Texture.from(building?.imageUrl || building1));
    bld.anchor.set(0.5, 1); // ⬅️ 바닥 기준
    bld.x = cx;
    fitSpriteToBox(bld, boxW, boxH, 'fit');
    bld.y = bottomY;        // ⬅️ 박스 바닥에 붙임
    bld.zIndex = 1;
    buildingRef.current = bld;
    safeAddChild(bld);

    // 먼지 (바닥 근처)
    const dust = new PIXI.Sprite(PIXI.Texture.from(dustFrames[0]));
    dust.anchor.set(0.5);
    dust.visible = false;
    dust.zIndex = 2;
    dustSpriteRef.current = dust;
    safeAddChild(dust);

    // HP 바
    if (showBuildingHp) {
      const hpBg = new PIXI.Graphics();
      hpBg.beginFill(0xaaaaaa).drawRect(0, 0, HP_BAR_WIDTH, HP_BAR_HEIGHT).endFill();
      hpBg.zIndex = 3;
      hpBgRef.current = hpBg;
      safeAddChild(hpBg);

      const hpFill = new PIXI.Graphics();
      hpFill.beginFill(0xff3333).drawRect(0, 0, HP_BAR_WIDTH, HP_BAR_HEIGHT).endFill();
      hpFill.zIndex = 4;
      healthBarRef.current = hpFill;
      safeAddChild(hpFill);
    } else {
      hpBgRef.current = null;
      healthBarRef.current = null;
    }

    placeHpAndDust(bld, hpBgRef.current, healthBarRef.current, dustSpriteRef.current);

    // 기존: HP 비율 단계 크랙 3장 (퍼시스턴트)
    const cracks = [];
    for (let i = 0; i < 3; i++) {
      const crack = new PIXI.Sprite(PIXI.Texture.from(crackTexture));
      crack.alpha = 0.6;
      crack.anchor.set(0.5);
      crack.scale.set(0.5);
      const p = randomCrackPosition(bld);
      crack.x = p.x; crack.y = p.y;
      crack.visible = false;
      crack.zIndex = 3;
      cracks.push(crack);
      safeAddChild(crack);
    }
    crackSpritesRef.current = cracks;

    // ✅ 타격 순간 임팩트 크랙 1장 (잠깐 보였다 사라짐)
    const impact = new PIXI.Sprite(PIXI.Texture.from(crackTexture));
    impact.alpha = 0.9;
    impact.anchor.set(0.5);
    impact.scale.set(0.5);
    impact.visible = false;
    impact.zIndex = 4;
    impact.x = bld.x;             // 최초 위치: 중앙
    impact.y = bld.y - bld.height * 0.2;
    impactCrackRef.current = impact;
    safeAddChild(impact);
  };

  // ========= building 변경 시 (텍스처/HP/정렬 갱신) =========
  useEffect(() => {
    const app = appRef.current;
    const b = buildingRef.current;
    if (!app || !b || !building) return;

    maxHPRef.current = building.hp ?? 100;
    setBuildingHP(maxHPRef.current);

    b.texture = PIXI.Texture.from(building.imageUrl || building1);

    const { w: boxW, h: boxH, cx, bottomY } = computeBox(app);
    b.anchor.set(0.5, 1);
    b.x = cx;
    fitSpriteToBox(b, boxW, boxH, 'fit');
    b.y = bottomY;

    if (crackSpritesRef.current?.length) {
      crackSpritesRef.current.forEach((cr) => {
        const p = randomCrackPosition(b);
        cr.x = p.x; cr.y = p.y;
        cr.visible = false;
      });
    }

    // 임팩트 크랙 초기 위치/숨김
    if (impactCrackRef.current) {
      impactCrackRef.current.x = b.x;
      impactCrackRef.current.y = b.y - b.height * 0.2;
      impactCrackRef.current.visible = false;
      impactCrackRef.current.alpha = 0.9;
    }

    placeHpAndDust(b, hpBgRef.current, healthBarRef.current, dustSpriteRef.current);
  }, [building]);

  // ✅ 타격 순간 임팩트 크랙 표시/사라짐 함수
  const showCrackOnce = (duration = 1000, withFade = false) => {
    const app = appRef.current;
    const building = buildingRef.current;
    const crack = impactCrackRef.current;
    if (!app || !building || !crack) return;

    // 이전 예약/티커 정리
    if (crackTimeoutRef.current) { clearTimeout(crackTimeoutRef.current); crackTimeoutRef.current = null; }
    if (crackFadeTickerRef.current) { app.ticker.remove(crackFadeTickerRef.current); crackFadeTickerRef.current = null; }

    // 위치 및 초기화(건물 내부 랜덤)
    const p = randomCrackPosition(building);
    crack.x = p.x;
    crack.y = p.y;
    crack.alpha = 0.9;
    crack.visible = true;
    crackActiveRef.current = true;

    if (withFade) {
      let elapsed = 0;
      const total = duration;
      const ticker = (delta) => {
        if (!appRef.current || !impactCrackRef.current) {
          app?.ticker.remove(ticker);
          crackFadeTickerRef.current = null;
          return;
        }
        elapsed += (1000 / 60) * delta;
        const t = Math.min(elapsed / total, 1);
        crack.alpha = 0.9 * (1 - t);
        if (t >= 1) {
          crack.visible = false;
          app.ticker.remove(ticker);
          crackFadeTickerRef.current = null;
          crackActiveRef.current = false;
        }
      };
      crackFadeTickerRef.current = ticker;
      app.ticker.add(ticker);
    } else {
      crackTimeoutRef.current = setTimeout(() => {
        if (impactCrackRef.current) impactCrackRef.current.visible = false;
        crackTimeoutRef.current = null;
        crackActiveRef.current = false;
      }, duration);
    }
  };

  // ========= 펀치 / 어퍼컷 =========
  useEffect(() => {
    if (!boxerRef.current) return;

    // 'punch' 또는 *_jab → 잽 / 'uppercut' 또는 *_uppercut → 어퍼컷
    const isJab =
      action === 'punch' ||
      (typeof action === 'string' && action.endsWith('_jab'));
    const isUppercut =
      action === 'uppercut' ||
      (typeof action === 'string' && action.endsWith('_uppercut'));

    if ((isJab || isUppercut) &&
        prevActionRef.current !== action &&
        !isBuildingFalling &&
        !isNewBuildingDropping) {

      const frames = isUppercut ? uppercutFrames : karinaFrames;

      let i = 0;
      const interval = setInterval(() => {
        if (i < frames.length && boxerRef.current) {
          boxerRef.current.texture = PIXI.Texture.from(frames[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 80);

      // ✅ 기존 로직 유지: HP -20, kcal +0.1(반올림)
      setBuildingHP((prev) => Math.max(prev - 20, 0));
      if (typeof setKcal === 'function') {
        setKcal((prev) => Math.round((prev + 0.1) * 10) / 10);
      }

      // ✅ 타격 순간 임팩트 크랙 표시 (1초 유지)
      showCrackOnce(1000, false);
    }

    prevActionRef.current = action;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, isNewBuildingDropping, isBuildingFalling]);

  // ========= HP 변화 =========
  useEffect(() => {
    if (healthBarRef.current) {
      const pct = Math.max(0, Math.min(1, buildingHP / (maxHPRef.current || 100)));
      const newWidth = pct * HP_BAR_WIDTH;
      healthBarRef.current.clear();
      healthBarRef.current.beginFill(0xff3333).drawRect(0, 0, newWidth, HP_BAR_HEIGHT).endFill();
      placeHpAndDust(buildingRef.current, hpBgRef.current, healthBarRef.current, dustSpriteRef.current);
    }

    // 기존 단계 크랙 표시 로직 유지
    if (crackSpritesRef.current) {
      crackSpritesRef.current.forEach((sprite, index) => {
        const pct = buildingHP / (maxHPRef.current || 100);
        if (pct <= 0.25 && index <= 2) sprite.visible = true;
        else if (pct <= 0.5 && index <= 1) sprite.visible = true;
        else if (pct <= 0.75 && index === 0) sprite.visible = true;
        else sprite.visible = false;
      });
    }

    if (buildingHP <= 0 && !isBuildingFalling) {
      setIsBuildingFalling(true);
    }
  }, [buildingHP]);

  // ========= 붕괴 → 먼지 =========
  useEffect(() => {
    const app = appRef.current;
    const b = buildingRef.current;
    const dust = dustSpriteRef.current;
    if (!b || !dust) return;

    // ✅ 붕괴 시작되면 임팩트 크랙 정리/숨김
    if (isBuildingFalling) {
      if (crackTimeoutRef.current) { clearTimeout(crackTimeoutRef.current); crackTimeoutRef.current = null; }
      if (crackFadeTickerRef.current) { app?.ticker.remove(crackFadeTickerRef.current); crackFadeTickerRef.current = null; }
      if (impactCrackRef.current) impactCrackRef.current.visible = false;
    }

    let frameIndex = 0;
    let interval;

    if (isBuildingFalling) {
      dust.visible = true;
      b.visible = false;

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
            onBuildingDestroyed?.(building?.constructureSeq);
          }
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBuildingFalling, building, onBuildingDestroyed]);

  // ========= 새 건물 드랍 (바닥 정렬) =========
  useEffect(() => {
    const app = appRef.current;
    const b = buildingRef.current;
    if (!app || !b) return;

    if (isNewBuildingDropping && building) {
      const { w: boxW, h: boxH, cx, bottomY } = computeBox(app);

      // 임팩트 크랙 안전정리
      if (crackTimeoutRef.current) { clearTimeout(crackTimeoutRef.current); crackTimeoutRef.current = null; }
      if (crackFadeTickerRef.current) { app.ticker.remove(crackFadeTickerRef.current); crackFadeTickerRef.current = null; }
      if (impactCrackRef.current) impactCrackRef.current.visible = false;

      b.anchor.set(0.5, 1);
      b.x = cx;
      b.y = -50; // 화면 위에서 시작(바닥 기준이니까 -50이면 완전 위)
      b.texture = PIXI.Texture.from(building.imageUrl || building1);
      b.visible = true;

      maxHPRef.current = building.hp ?? 100;
      setBuildingHP(maxHPRef.current);

      fitSpriteToBox(b, boxW, boxH, 'fit');
      placeHpAndDust(b, hpBgRef.current, healthBarRef.current, dustSpriteRef.current);

      const ticker = (delta) => {
        b.y += 15 * delta;
        if (b.y >= bottomY) {
          b.y = bottomY;
          setIsNewBuildingDropping(false);
          destroyedLock.current = false;
          app.ticker.remove(ticker);
          placeHpAndDust(b, hpBgRef.current, healthBarRef.current, dustSpriteRef.current);
        }
      };
      app.ticker.add(ticker);
    }
  }, [isNewBuildingDropping, building]);

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
