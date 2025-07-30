package com.e106.demolition_king.constructure.vo.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class ConstructureSaveRequestVo {
    private final String userUuid;
    private final List<Integer> constructureSeqList;
}
