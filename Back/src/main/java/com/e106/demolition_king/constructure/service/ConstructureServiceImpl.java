package com.e106.demolition_king.constructure.service;

import com.e106.demolition_king.constructure.entity.Constructure;
import com.e106.demolition_king.constructure.entity.UserConstructure;
import com.e106.demolition_king.constructure.repository.ConstructureRepository;
import com.e106.demolition_king.constructure.repository.UserConstructureRepository;
import com.e106.demolition_king.constructure.vo.out.ConstructureResponseVo;
import com.e106.demolition_king.constructure.vo.out.GetConstructureResponseVo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Transactional
@Service
@Slf4j
@RequiredArgsConstructor
public class ConstructureServiceImpl implements ConstructureService {

    private final ConstructureRepository constructureRepository;
    private final UserConstructureRepository userConstructureRepository;

    @Override
    public List<ConstructureResponseVo> generateConstructures(int count) {
        List<Constructure> all = constructureRepository.findAll();
        List<ConstructureResponseVo> result = new ArrayList<>();

        // 총 확률 (BigDecimal로 계산)
        BigDecimal totalWeight = all.stream()
                .map(Constructure::getRate)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Random random = new Random();

        for (int i = 0; i < count; i++) {
            BigDecimal rand = totalWeight.multiply(BigDecimal.valueOf(random.nextDouble()));
            BigDecimal cumulative = BigDecimal.ZERO;

            for (Constructure c : all) {
                cumulative = cumulative.add(c.getRate());
                if (rand.compareTo(cumulative) <= 0) {
                    result.add(ConstructureResponseVo.fromEntity(c));
                    break;
                }
            }
        }
        return result;
    }

    public void insertNewConstructures(String userUuid, List<Integer> constructureSeqList) {

        // 1. 해당 유저가 이미 보유한 건물 목록 조회
        List<UserConstructure> existingList = userConstructureRepository.findByUserUuid(userUuid);
        Set<Integer> existingSeqSet = existingList.stream()
                .map(UserConstructure::getConstructureSeq)
                .collect(Collectors.toSet());

        // 2. 새로 받은 리스트에서 이미 보유한 건물 제거
        List<Integer> newConstructures = constructureSeqList.stream()
                .filter(seq -> !existingSeqSet.contains(seq))
                .toList();

        // 3. 중복되지 않은 건물만 insert
        List<UserConstructure> toSave = newConstructures.stream()
                .map(seq -> UserConstructure.builder()
                        .userUuid(userUuid)
                        .constructureSeq(seq)
                        .build())
                .toList();

        userConstructureRepository.saveAll(toSave);
    }

    public List<GetConstructureResponseVo> getUserConstructures(String userUuid) {
        // 1. 보유한 건물 SEQ 조회
        Set<Integer> ownedSeqSet = userConstructureRepository.findByUserUuid(userUuid).stream()
                .map(UserConstructure::getConstructureSeq)
                .collect(Collectors.toSet());


        System.out.println("ownedSeqSet : " + ownedSeqSet);
        // 2. 전체 건물 목록 조회
        List<Constructure> allConstructures = constructureRepository.findAll();

        System.out.println("allConstructures : " + allConstructures);
        // 3. 전체 목록 순회하며 lock 여부 태깅
        return allConstructures.stream()
                .map(constructure -> GetConstructureResponseVo.fromEntityWithOpen(
                        constructure,
                        ownedSeqSet.contains(constructure.getConstructureSeq()) // 보유한 경우만 lock: true
                ))
                .toList();
    }
}