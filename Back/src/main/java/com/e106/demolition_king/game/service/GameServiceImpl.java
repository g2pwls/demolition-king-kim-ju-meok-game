package com.e106.demolition_king.game.service;

import com.e106.demolition_king.common.base.BaseResponseStatus;
import com.e106.demolition_king.common.exception.BaseException;
import com.e106.demolition_king.game.dto.GoldDto;
import com.e106.demolition_king.game.dto.ReportDto;
import com.e106.demolition_king.game.dto.ReportPerDateRequestDto;
import com.e106.demolition_king.game.entity.Gold;
import com.e106.demolition_king.game.entity.Report;
import com.e106.demolition_king.game.entity.ReportPerDate;
import com.e106.demolition_king.game.repository.GoldRepository;
import com.e106.demolition_king.game.repository.ReportPerDateRepository;
import com.e106.demolition_king.game.repository.ReportRepository;
import com.e106.demolition_king.game.vo.out.ReportUpdateResponseVo;
import com.e106.demolition_king.user.dto.SignupRequestDto;
import com.e106.demolition_king.user.entity.User;
import com.e106.demolition_king.user.repository.UserRepository;
import com.e106.demolition_king.user.service.UserService;
import com.e106.demolition_king.user.vo.in.LoginRequestVo;
import com.e106.demolition_king.user.vo.out.TokenResponseVo;
import com.e106.demolition_king.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {
    private final RedisTemplate<String, String> redisTemplate; // 토큰 저장요 레디스 템플릿

    private final ReportRepository reportRepository;
    private final ReportPerDateRepository reportPerDateRepository;
    private final GoldRepository goldRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public List<ReportDto> getUserReport(String uuid) {
        return reportRepository.findReportDtoByUserUuid(uuid);
    }

    @Override
    @Transactional
    public void updateUserReport(ReportDto newData) {
        Report report = reportRepository.findByUser_UserUuid(newData.getUserUuid())
                .orElseThrow(() -> new RuntimeException("해당 사용자의 리포트가 존재하지 않습니다."));
        // 2) 갱신 전 상태 로깅
        log.debug(">>> Before Update - reportSeq={}, playCnt={}, singleTopBuilding={}, multiTopBuilding={}, gold={}, silver={}, bronze={}",
                report.getReportSeq(),
                report.getPlayCnt(),
                report.getSingleTopBuilding(),
                report.getMultiTopBuilding(),
                report.getGoldMedal(),
                report.getSilverMedal(),
                report.getBronzeMedal()
        );

        log.debug(">>> newData Update - reportSeq={}, playCnt={}, singleTopBuilding={}, multiTopBuilding={}, gold={}, silver={}, bronze={}",
                newData.getReportSeq(),
                newData.getPlayCnt(),
                newData.getSingleTopBuilding(),
                newData.getMultiTopBuilding(),
                newData.getGoldMedal(),
                newData.getSilverMedal(),
                newData.getBronzeMedal()
        );

        // 기존 값에 새 값을 더해서 누적
        report.setPlayCnt(report.getPlayCnt() + newData.getPlayCnt());
        report.setSingleTopBuilding(report.getSingleTopBuilding() + newData.getSingleTopBuilding());
        report.setMultiTopBuilding(report.getMultiTopBuilding() + newData.getMultiTopBuilding());
        report.setGoldMedal(report.getGoldMedal() + newData.getGoldMedal());
        report.setSilverMedal(report.getSilverMedal() + newData.getSilverMedal());
        report.setBronzeMedal(report.getBronzeMedal() + newData.getBronzeMedal());
        BigDecimal updatedPlayTime = report.getPlayTime().add(newData.getPlayTime());
        report.setPlayTime(updatedPlayTime);
        // updatedAt은 @PreUpdate로 자동 갱신

        // 4) 갱신 후 상태 로깅
        log.debug(">>> After Update  - reportSeq={}, playCnt={}, singleTopBuilding={}, multiTopBuilding={}, gold={}, silver={}, bronze={}",
                report.getReportSeq(),
                report.getPlayCnt(),
                report.getSingleTopBuilding(),
                report.getMultiTopBuilding(),
                report.getGoldMedal(),
                report.getSilverMedal(),
                report.getBronzeMedal()
        );
    }

    @Override
    @Transactional
    public void upsertReport(ReportPerDateRequestDto dto) {
        reportPerDateRepository
                .findByUser_UserUuidAndPlayDate(dto.getUserUuid(), dto.getPlayDate())
                .ifPresentOrElse(
                        existing -> existing.update(dto.getKcal(), dto.getPlayTimeDate()),
                        () -> {
                            User user = userRepository
                                    .findByUserUuid(dto.getUserUuid())
                                    .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));
                            reportPerDateRepository.save(ReportPerDate.builder()
                                    .user(user)
                                    .playDate(dto.getPlayDate())
                                    .kcal(dto.getKcal())
                                    .playTimeDate(dto.getPlayTimeDate())
                                    .build());
                        }
                );
    }

    @Override
    @Transactional
    public void updateGold(GoldDto dto) {
        Gold gold = goldRepository.findByUser_UserUuid(dto.getUserUuid())
                .orElseThrow(() -> new IllegalArgumentException("해당 유저의 골드 정보가 존재하지 않습니다: " + dto.getUserUuid()));

        int updatedGold = (gold.getGoldCnt() != null ? gold.getGoldCnt() : 0) + dto.getGoldCnt();
        gold.setGoldCnt(updatedGold);
    }
    @Override
    public int getGold(String userUuid) {
        Gold gold = goldRepository.findByUser_UserUuid(userUuid)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저의 골드 정보가 존재하지 않습니다: " + userUuid));

       return gold.getGoldCnt();
    }

    @Override
    @Transactional
    public String payGold(String userUuid, Integer spendGold) {
        // 1. 현재 골드 가져오기
        Gold gold = goldRepository.findByUser_UserUuid(userUuid)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저의 골드 정보가 존재하지 않습니다: " + userUuid));

        int currentGold = (gold.getGoldCnt() != null ? gold.getGoldCnt() : 0);

        // 2. 보유 골드 부족 시 예외 발생
        if (currentGold < spendGold) {
           return "보유 골드가 부족합니다. 현재 골드: " + currentGold + ", 사용 요청: " + spendGold;
        }

        // 3. 골드 차감 및 저장
        gold.setGoldCnt(currentGold - spendGold);
        goldRepository.save(gold);
        return "정상처리 되었습니다.";
    }
}
