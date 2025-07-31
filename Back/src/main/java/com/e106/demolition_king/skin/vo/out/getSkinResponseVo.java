package com.e106.demolition_king.skin.vo.out;

import com.e106.demolition_king.skin.entity.PlayerSkin;
import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class getSkinResponseVo {
    private Integer playerskinSeq;
    private Integer playerSkinItemSeq;
    private Integer isSelect;
    private String image;
    private Integer isUnlock;

    public static getSkinResponseVo from(PlayerSkin ps, String image) {
        return getSkinResponseVo.builder()
                .playerskinSeq(ps.getPlayerskinSeq())
                .playerSkinItemSeq(ps.getPlayerSkinItemSeq())
                .isSelect(ps.getIsSelect())
                .image(image)
                .isUnlock(ps.getIsUnlock())
                .build();
    }
}