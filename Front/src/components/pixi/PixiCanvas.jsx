import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

import building1 from '../../assets/images/building/building1.png';
import singleBack from '../../assets/images/singlemode/singleback.png';
import eventgameback from '../../assets/images/eventmode/eventgameback.png';
import buildingDust1 from '../../assets/images/effects/building_dust_1.png';
import buildingDust2 from '../../assets/images/effects/building_dust_2.png';
import buildingDust3 from '../../assets/images/effects/building_dust_3.png';
import crackTexture from '../../assets/images/effects/punch_effect.png';

// 기본(카리나) 프레임
import karina_final_anim_01 from '../../assets/images/karina/karina_final_anim_01.png';
import karina_final_anim_03 from '../../assets/images/karina/karina_final_anim_03.png';
import karina_final_anim_05 from '../../assets/images/karina/karina_final_anim_05.png';
// 어퍼컷 전용 프레임
import karina_upper from '../../assets/images/karina/karina_upper.png';
import army from '../../assets/images/character/army.png';
import jennie from '../../assets/images/character/jennie.png';
import police from '../../assets/images/character/police.png';
import student from '../../assets/images/character/student.png';
import son from '../../assets/images/character/son.png';
import worker from '../../assets/images/character/worker.png';
import winter from '../../assets/images/character/winter.png';
import ufc from '../../assets/images/character/ufc.png';
import character from '../../assets/images/character/character.png';

// ========= 애니메이션 프레임 =========
const jabFrames = [
  karina_final_anim_01,
  karina_final_anim_03,
  karina_final_anim_05,
  karina_final_anim_05,
  karina_final_anim_03,
  karina_final_anim_01,
];

const uppercutFrames = [
  karina_final_anim_01,
  karina_final_anim_03,
  karina_upper,
  karina_upper,
  karina_final_anim_03,
  karina_final_anim_01,
];

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
  const buildingSpriteRef = useRef(null);
  const hpBgRef = useRef(null);
  const healthBarRef = useRef(null);
  const dustSpriteRef = useRef(null);

  // // HP 단계용 크랙(원본 유지) — 필요하면 계속 사용 가능
  // const crackSpritesRef = useRef([]);

  // ★ 타격 순간 임팩트 크랙(딱 1장만 사용)
  const impactCrackRef = useRef(null);
  const impactHideTimerRef = useRef(null);
  const impactFadeTickerRef = useRef(null);

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
      const b = buildingSpriteRef.current;
      if (b) {
        const { w: boxW, h: boxH, cx, bottomY } = computeBox(app);
        b.x = cx;
        fitSpriteToBox(b, boxW, boxH, 'fit');
        b.y = bottomY; // 바닥 붙임
        placeHpAndDust(b, hpBgRef.current, healthBarRef.current, dustSpriteRef.current);

        // HP 단계 크랙은 위치만 재배치
        // crackSpritesRef.current.forEach((cr) => {
        //   const p = randomCrackPosition(b);
        //   cr.x = p.x;
        //   cr.y = p.y;
        // });

        // 임팩트 크랙도 중앙 근처로 보정 (안보일 때도 위치만 업데이트)
        if (impactCrackRef.current) {
          impactCrackRef.current.x = b.x;
          impactCrackRef.current.y = b.y - b.height * 0.2;
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // 임팩트 타이머/티커 정리
      if (impactHideTimerRef.current) clearTimeout(impactHideTimerRef.current);
      if (impactFadeTickerRef.current) app.ticker.remove(impactFadeTickerRef.current);
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
    const background = PIXI.Sprite.from(eventgameback);
    background.anchor.set(0.5);
    background.x = app.renderer.width / 2;
    background.y = app.renderer.height / 2;
    background.zIndex = 0;
    // 이미지 크기 조정 (비율 무시하고 화면 꽉 차게 설정)
    background.width = app.renderer.width;  // 화면 너비에 맞게 조정
    background.height = app.renderer.height; // 화면 높이에 맞게 조정
    safeAddChild(background);
    
    // 선택한 캐릭터 이미지 로드 (로컬 스토리지에서 불러오기)
    const selectedCharacter = localStorage.getItem('selectedCharacter');
    const selectedCharacterNum = localStorage.getItem('selectedCharacternum');

    let jabFrames, uppercutFrames, boxerImage;

// 카리나가 선택되었을 때만 애니메이션 프레임 적용
if (selectedCharacterNum === '6') { // 카리나 번호가 6번
  jabFrames = [
    karina_final_anim_01,
    karina_final_anim_03,
    karina_final_anim_05,
    karina_final_anim_05,
    karina_final_anim_03,
    karina_final_anim_01,
  ];

  uppercutFrames = [
    karina_final_anim_01,
    karina_final_anim_03,
    karina_upper,
    karina_upper,
    karina_final_anim_03,
    karina_final_anim_01,
  ];

  // 카리나 기본 이미지
  boxerImage = karina_final_anim_01;
} else {
  // 카리나가 아닐 경우 다른 캐릭터 설정 (예시로 군인 이미지 사용)
  jabFrames = [selectedCharacter, // 선택된 캐릭터 이미지로 설정
    selectedCharacter, 
    selectedCharacter,
    selectedCharacter,
    selectedCharacter,
    selectedCharacter]; // 다른 캐릭터 애니메이션 예시
  uppercutFrames = [selectedCharacter, // 선택된 캐릭터 이미지로 설정
    selectedCharacter, 
    selectedCharacter,
    selectedCharacter,
    selectedCharacter,
    selectedCharacter];
  boxerImage = selectedCharacter; // 다른 캐릭터의 이미지 사용
}
    if (selectedCharacter) {
      const boxer = new PIXI.Sprite(PIXI.Texture.from(boxerImage));
      boxer.anchor.set(0.5);
      boxer.width = boxerWidth;
      boxer.height = boxerHeight;
      boxer.x = app.renderer.width * 0.3;
      boxer.y = app.renderer.height * 0.75;
      boxer.zIndex = 1;
      safeAddChild(boxer);
    } else {
      console.error('선택된 캐릭터 이미지가 없습니다.');
    }
  
    // 복서
    const boxer = new PIXI.Sprite(PIXI.Texture.from(boxerImage));
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
    bld.y = bottomY; // ⬅️ 박스 바닥에 붙임
    bld.zIndex = 1;
    buildingSpriteRef.current = bld;
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

    // HP 단계 크랙(3장) — 기본은 숨김
    // const cracks = [];
    // for (let i = 0; i < 3; i++) {
    //   const crack = new PIXI.Sprite(PIXI.Texture.from(crackTexture));
    //   crack.alpha = 0.6;
    //   crack.anchor.set(0.5);
    //   crack.scale.set(0.5);
    //   const p = randomCrackPosition(bld);
    //   crack.x = p.x;
    //   crack.y = p.y;
    //   crack.visible = false;
    //   crack.zIndex = 3;
    //   cracks.push(crack);
    //   safeAddChild(crack);
    // }
    // crackSpritesRef.current = cracks;

    // ★ 임팩트 크랙 1장 (히트 순간만 잠깐 보였다 사라짐)
    const impact = new PIXI.Sprite(PIXI.Texture.from(crackTexture));
    impact.alpha = 0.9;
    impact.anchor.set(0.5);
    impact.scale.set(0.5);
    impact.visible = false;
    impact.zIndex = 4;
    impact.x = bld.x;
    impact.y = bld.y - bld.height * 0.2;
    impactCrackRef.current = impact;
    safeAddChild(impact);
  };

  // ========= building 변경 시 (텍스처/HP/정렬 갱신) =========
  useEffect(() => {
    const app = appRef.current;
    const b = buildingSpriteRef.current;
    if (!app || !b || !building) return;

    maxHPRef.current = building.hp ?? 100;
    setBuildingHP(maxHPRef.current);

    b.texture = PIXI.Texture.from(building.imageUrl || building1);

    const { w: boxW, h: boxH, cx, bottomY } = computeBox(app);
    b.anchor.set(0.5, 1);
    b.x = cx;
    fitSpriteToBox(b, boxW, boxH, 'fit');
    b.y = bottomY;

    // if (crackSpritesRef.current?.length) {
    //   crackSpritesRef.current.forEach((cr) => {
    //     const p = randomCrackPosition(b);
    //     cr.x = p.x;
    //     cr.y = p.y;
    //     cr.visible = false;
    //   });
    // }

    if (impactCrackRef.current) {
      impactCrackRef.current.x = b.x;
      impactCrackRef.current.y = b.y - b.height * 0.2;
      impactCrackRef.current.visible = false;
      impactCrackRef.current.alpha = 0.9;
    }

    placeHpAndDust(b, hpBgRef.current, healthBarRef.current, dustSpriteRef.current);
  }, [building]);

  // ★ 타격 순간 임팩트 크랙 표시/사라짐 — 중첩 방지, 200ms만 노출
  const showCrackOnce = (duration = 200, fadeOut = false) => {
    const app = appRef.current;
    const b = buildingSpriteRef.current;
    const crack = impactCrackRef.current;
    if (!app || !b || !crack) return;

    // 이전 예약/티커 정리
    if (impactHideTimerRef.current) {
      clearTimeout(impactHideTimerRef.current);
      impactHideTimerRef.current = null;
    }
    if (impactFadeTickerRef.current) {
      app.ticker.remove(impactFadeTickerRef.current);
      impactFadeTickerRef.current = null;
    }

    // 랜덤 위치 재설정
    const p = randomCrackPosition(b);
    crack.x = p.x;
    crack.y = p.y;
    crack.alpha = 0.9;
    crack.visible = true;

    if (!fadeOut) {
      impactHideTimerRef.current = setTimeout(() => {
        if (impactCrackRef.current) impactCrackRef.current.visible = false;
        impactHideTimerRef.current = null;
      }, duration);
    } else {
      // (옵션) 페이드 아웃 쓰고 싶을 때
      let elapsed = 0;
      const total = duration;
      const ticker = (delta) => {
        elapsed += (1000 / 60) * delta;
        const t = Math.min(elapsed / total, 1);
        crack.alpha = 0.9 * (1 - t);
        if (t >= 1) {
          crack.visible = false;
          app.ticker.remove(ticker);
          impactFadeTickerRef.current = null;
        }
      };
      impactFadeTickerRef.current = ticker;
      app.ticker.add(ticker);
    }
  };

  // ========= 펀치 / 어퍼컷 =========
  useEffect(() => {
    if (!boxerRef.current) return;

    const isJab =
      action === 'punch' || (typeof action === 'string' && action.endsWith('_jab'));
    const isUpper =
      action === 'uppercut' || (typeof action === 'string' && action.endsWith('_uppercut'));

    if ((isJab || isUpper) &&
        prevActionRef.current !== action &&
        !isBuildingFalling &&
        !isNewBuildingDropping) {

      const frames = isUpper ? uppercutFrames : jabFrames;

      let i = 0;
      const interval = setInterval(() => {
        if (i < frames.length && boxerRef.current) {
          boxerRef.current.texture = PIXI.Texture.from(frames[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 80);

      // 데미지/칼로리
      setBuildingHP((prev) => Math.max(prev - 20, 0));
      if (typeof setKcal === 'function') {
        setKcal((prev) => Math.round((prev + 0.1) * 10) / 10);
      }

      // 임팩트 크랙 (200ms만)
      showCrackOnce(200, false);
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
      placeHpAndDust(buildingSpriteRef.current, hpBgRef.current, healthBarRef.current, dustSpriteRef.current);
    }

    // HP 단계 크랙(원래 로직 유지 – 필요 없으면 모두 false로 두면 됨)
    // if (crackSpritesRef.current) {
    //   crackSpritesRef.current.forEach((sprite, index) => {
    //     const pct = buildingHP / (maxHPRef.current || 100);
    //     if (pct <= 0.25 && index <= 2) sprite.visible = true;
    //     else if (pct <= 0.5 && index <= 1) sprite.visible = true;
    //     else if (pct <= 0.75 && index === 0) sprite.visible = true;
    //     else sprite.visible = false;
    //   });
    // }

    if (buildingHP <= 0 && !isBuildingFalling) {
      setIsBuildingFalling(true);
    }
  }, [buildingHP]);

  // ========= 붕괴 → 먼지 =========
  useEffect(() => {
    const app = appRef.current;
    const b = buildingSpriteRef.current;
    const dust = dustSpriteRef.current;
    if (!b || !dust) return;

    // 붕괴 시작되면 임팩트 크랙 정리
    if (isBuildingFalling) {
      if (impactHideTimerRef.current) { clearTimeout(impactHideTimerRef.current); impactHideTimerRef.current = null; }
      if (impactFadeTickerRef.current) { app?.ticker.remove(impactFadeTickerRef.current); impactFadeTickerRef.current = null; }
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
    const b = buildingSpriteRef.current;
    if (!app || !b) return;

    if (isNewBuildingDropping && building) {
      const { w: boxW, h: boxH, cx, bottomY } = computeBox(app);

      // 임팩트 크랙 안전정리
      if (impactHideTimerRef.current) { clearTimeout(impactHideTimerRef.current); impactHideTimerRef.current = null; }
      if (impactFadeTickerRef.current) { app.ticker.remove(impactFadeTickerRef.current); impactFadeTickerRef.current = null; }
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
