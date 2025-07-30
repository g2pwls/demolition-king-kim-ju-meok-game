package com.e106.demolition_king.constructure.service;


import com.e106.demolition_king.constructure.vo.out.ConstructureResponseVo;

import java.util.List;

public interface ConstructureService {
    public List<ConstructureResponseVo> generateConstructures(int count);
    public void insertNewConstructures(String userUuid, List<Integer> constructureSeqList);
}
