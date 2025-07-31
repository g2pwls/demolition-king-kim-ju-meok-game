package com.e106.demolition_king.constructure.controller;


import com.e106.demolition_king.common.base.BaseResponse;
import com.e106.demolition_king.constructure.service.ConstructureService;
import com.e106.demolition_king.constructure.vo.in.ConstructureSaveRequestVo;
import com.e106.demolition_king.constructure.vo.out.ConstructureResponseVo;
import com.e106.demolition_king.constructure.vo.out.GetConstructureResponseVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/constructures")
@Tag(name = "Game", description = "게임 동작 API")
@RequiredArgsConstructor
public class ConstructureController {

    private final ConstructureService constructureService;

    @Operation(summary = "건물 생성 요청", description = "입력 개수에 맞춰 확률적으로 건물 생성")
    @GetMapping("/generate")
    public BaseResponse<List<ConstructureResponseVo>> generateConstructures(@RequestParam int count) {
        List<ConstructureResponseVo> generated = constructureService.generateConstructures(count);
        return BaseResponse.of(generated);
    }

    @Operation(summary = "파괴된 건물 사용자 건물 테이블에 Insert", description = "파괴된 건물 테이블 리스트 받아서 밀어 넣기")
    @PostMapping("/save")
    public BaseResponse<Void> saveConstructures(
            @RequestBody ConstructureSaveRequestVo request) {

        constructureService.insertNewConstructures(request.getUserUuid(), request.getConstructureSeqList());
        return BaseResponse.ok();
    }

    @Operation(summary = "사용자 건물 조회", description = "사용자가 해금한 건물 조회")
    @GetMapping("/getConstructure")
    public BaseResponse<List<GetConstructureResponseVo>> generateConstructures(@RequestParam String userUuid) {
        List<GetConstructureResponseVo> generated = constructureService.getUserConstructures(userUuid);
        return BaseResponse.of(generated);
    }

}
