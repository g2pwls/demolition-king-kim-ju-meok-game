package com.e106.demolition_king.skin.vo.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class SelectSkinRequestVo {
    private String userUuid;
    private Integer playerSkinItemSeq;
}
