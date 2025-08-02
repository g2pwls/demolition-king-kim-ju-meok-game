package com.e106.demolition_king.skin.controller;


import com.e106.demolition_king.common.base.BaseResponse;
import com.e106.demolition_king.constructure.service.ConstructureService;
import com.e106.demolition_king.constructure.vo.in.ConstructureSaveRequestVo;
import com.e106.demolition_king.constructure.vo.out.ConstructureResponseVo;
import com.e106.demolition_king.constructure.vo.out.GetConstructureResponseVo;
import com.e106.demolition_king.skin.service.SkinServiceImpl;
import com.e106.demolition_king.skin.vo.in.SelectSkinRequestVo;
import com.e106.demolition_king.skin.vo.out.getSkinResponseVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skins")
@Tag(name = "Skin", description = "스킨 관련 API")
@RequiredArgsConstructor
public class SkinController {

    private final SkinServiceImpl skinService;

    @Operation(summary = "스킨 선택", description = "원하는 스킨을 선택하여 플레이용 스킨 적용")
    @GetMapping("/selectSkin")
    public BaseResponse<String> generateConstructures(@ParameterObject SelectSkinRequestVo vo) {
        skinService.selectSkin(vo.getUserUuid(), vo.getPlayerSkinItemSeq());
        return BaseResponse.of("스킨 선택 완료");
    }

    @Operation(summary = "선택된 스킨 url 조회", description = "회원의 선택된 스킨 url을 가져옵니다.")
    @GetMapping("/getSkin")
    public BaseResponse<String> generateConstructures(@RequestParam String userUuid) {
        return BaseResponse.of(skinService.getSelectedSkinImageUrl(userUuid));
    }

//    uuid로 조회하여 전체 스킨정보 조회 여기다 짜줘
    @Operation(summary = "전체 스킨정보 조회", description = "uuid로 조회하여 전체 스킨정보를 조회합니다.")
    @GetMapping("/getUserSkin")
    public BaseResponse<List<getSkinResponseVo>> getUserSkins(@RequestParam String userUuid) {
        return BaseResponse.of(skinService.getUserSkinList(userUuid));
    }

    //    스킨 구매시 해금 update
    @Operation(summary = "스킨 구매", description = "회원의 골드로 스킨을 구매하여 해금합니다.")
    @PatchMapping("/unLockUserSkin")
    public BaseResponse<String> getUserSkins(@ParameterObject SelectSkinRequestVo vo) { // 스킨 해금과 vo 동일해서 재사용
        return BaseResponse.of(skinService.unlockPlayerSkin(vo));
    }

}
