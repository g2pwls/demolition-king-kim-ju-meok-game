package com.e106.demolition_king.skin.service;


import com.e106.demolition_king.constructure.vo.out.ConstructureResponseVo;
import com.e106.demolition_king.constructure.vo.out.GetConstructureResponseVo;
import com.e106.demolition_king.skin.vo.in.SelectSkinRequestVo;
import com.e106.demolition_king.skin.vo.out.getSkinResponseVo;

import java.util.List;

public interface SkinService {
    public void selectSkin(String userUuid, Integer playerSkinItemSeq);

    String getSelectedSkinImageUrl(String userUuid);

    public List<getSkinResponseVo> getUserSkinList(String userUuid);

    public String unlockPlayerSkin(SelectSkinRequestVo vo);
}