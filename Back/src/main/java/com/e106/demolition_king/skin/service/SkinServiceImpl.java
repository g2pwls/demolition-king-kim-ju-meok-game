package com.e106.demolition_king.skin.service;

import com.e106.demolition_king.constructure.entity.Constructure;
import com.e106.demolition_king.constructure.entity.UserConstructure;
import com.e106.demolition_king.constructure.repository.ConstructureRepository;
import com.e106.demolition_king.constructure.repository.UserConstructureRepository;
import com.e106.demolition_king.constructure.service.ConstructureService;
import com.e106.demolition_king.constructure.vo.out.ConstructureResponseVo;
import com.e106.demolition_king.constructure.vo.out.GetConstructureResponseVo;
import com.e106.demolition_king.game.service.GameService;
import com.e106.demolition_king.skin.entity.PlayerSkin;
import com.e106.demolition_king.skin.entity.PlayerSkinItem;
import com.e106.demolition_king.skin.repository.PlayerSkinItemRepository;
import com.e106.demolition_king.skin.repository.PlayerSkinRepository;
import com.e106.demolition_king.skin.vo.in.SelectSkinRequestVo;
import com.e106.demolition_king.skin.vo.out.getSkinResponseVo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class SkinServiceImpl implements SkinService {

    private final PlayerSkinRepository playerSkinRepository;
    private final PlayerSkinItemRepository playerSkinItemRepository;
    private final GameService gameService;


    @Override
    public void selectSkin(String userUuid, Integer playerSkinItemSeq) {

        // 1. 기존에 선택된 스킨이 있다면 선택 해제
        playerSkinRepository.findByUserUuidAndIsSelect(userUuid, 1)
                .ifPresent(oldSkin -> {
                    oldSkin.setIsSelect(0);
                    playerSkinRepository.save(oldSkin);
                });

        // 2. 새로 선택한 스킨을 가져와서 is_select = 1 로 변경
        playerSkinRepository.findByUserUuidAndPlayerSkinItemSeq(userUuid, playerSkinItemSeq)
                .ifPresentOrElse(newSkin -> {
                    newSkin.setIsSelect(1);
                    playerSkinRepository.save(newSkin);
                }, () -> {
                    // 기존에 없던 경우 새로 추가
                    PlayerSkin newSkin = PlayerSkin.builder()
                            .userUuid(userUuid)
                            .playerSkinItemSeq(playerSkinItemSeq)
                            .isSelect(1)
                            .build();
                    playerSkinRepository.save(newSkin);
                });
    }

    @Override
    public String getSelectedSkinImageUrl(String userUuid) {
        return playerSkinRepository.findByUserUuidAndIsSelect(userUuid, 1)
                .flatMap(selectedSkin ->
                        playerSkinItemRepository.findById(selectedSkin.getPlayerSkinItemSeq()))
                .map(PlayerSkinItem::getImage)
                .orElse(null);
    }

    @Override
    public List<getSkinResponseVo> getUserSkinList(String userUuid) {
        List<PlayerSkin> skins = playerSkinRepository.findAllByUserUuid(userUuid);
        return skins.stream()
                .map(skin -> {
                    String image = playerSkinItemRepository.findById(skin.getPlayerSkinItemSeq())
                            .map(PlayerSkinItem::getImage)
                            .orElse(null);
                    return getSkinResponseVo.from(skin, image);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public String unlockPlayerSkin(SelectSkinRequestVo vo) {
        String userUuid = vo.getUserUuid();
        Integer itemSeq = vo.getPlayerSkinItemSeq();

        // 이미 해당 스킨을 보유 중인지 확인
        boolean alreadyUnlocked = playerSkinRepository
                .findByUserUuidAndPlayerSkinItemSeq(userUuid, itemSeq)
                .filter(skin -> skin.getIsUnlock() == 1)
                .isPresent();

        if (alreadyUnlocked) {
            return "이미 보유 중인 스킨입니다.";
        }

        // 1. 스킨 아이템 가격 가져오기
        PlayerSkinItem skinItem = playerSkinItemRepository.findById(itemSeq)
                .orElseThrow(() -> new IllegalArgumentException("해당 스킨 아이템이 존재하지 않습니다."));

        int price = skinItem.getPrice();  // price 필드 있다고 가정

        // 2. 골드 차감 처리 (GameService 호출 또는 GoldRepository 직접 사용 가능)
        String result = gameService.payGold(userUuid, price);
        if (!"정상처리 되었습니다.".equals(result)) {
            return result;
        }
        Optional<PlayerSkin> existing = playerSkinRepository.findByUserUuidAndPlayerSkinItemSeq(userUuid, itemSeq);

        PlayerSkin skin = existing.get();
        skin.setIsUnlock(1);  // 언락 처리
        playerSkinRepository.save(skin); // -> PK인 playerskin_seq로 update 됨
        // 3. 스킨 언락 (PlayerSkin insert)
//        PlayerSkin newSkin = PlayerSkin.builder()
//                .userUuid(userUuid)
//                .playerSkinItemSeq(itemSeq)
//                .isSelect(0) // 기본은 선택 안 된 상태
//                .isUnlock(1) // 언락시키기
//                .build();

//        playerSkinRepository.save(newSkin);
        return "정상처리 되었습니다.";
    }


}
