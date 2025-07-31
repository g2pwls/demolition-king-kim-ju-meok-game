package com.e106.demolition_king.skin.service;

import com.e106.demolition_king.constructure.entity.Constructure;
import com.e106.demolition_king.constructure.entity.UserConstructure;
import com.e106.demolition_king.constructure.repository.ConstructureRepository;
import com.e106.demolition_king.constructure.repository.UserConstructureRepository;
import com.e106.demolition_king.constructure.service.ConstructureService;
import com.e106.demolition_king.constructure.vo.out.ConstructureResponseVo;
import com.e106.demolition_king.constructure.vo.out.GetConstructureResponseVo;
import com.e106.demolition_king.skin.entity.PlayerSkin;
import com.e106.demolition_king.skin.entity.PlayerSkinItem;
import com.e106.demolition_king.skin.repository.PlayerSkinItemRepository;
import com.e106.demolition_king.skin.repository.PlayerSkinRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class SkinServiceImpl implements SkinService {

    private final PlayerSkinRepository playerSkinRepository;
    private final PlayerSkinItemRepository playerSkinItemRepository;

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

}
