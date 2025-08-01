package com.e106.demolition_king.skin.vo.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class SelectSkinRequestVo {
    private final String userUuid;
    private final Integer playerSkinItemSeq;
}
