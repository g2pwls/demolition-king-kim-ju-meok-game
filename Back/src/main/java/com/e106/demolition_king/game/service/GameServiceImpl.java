package com.e106.demolition_king.game.service;

import com.e106.demolition_king.game.dto.ReportDto;
import com.e106.demolition_king.game.dto.ReportPerDateRequestDto;
import com.e106.demolition_king.game.entity.Report;
import com.e106.demolition_king.game.entity.ReportPerDate;
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
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {
    private final RedisTemplate<String, String> redisTemplate; // 토큰 저장요 레디스 템플릿

    private final ReportRepository reportRepository;
    private final ReportPerDateRepository reportPerDateRepository;

    @Override
    @Transactional
    public List<ReportDto> getUserReport(String uuid) {
        return reportRepository.findReportDtoByUserUuid(uuid);
    }

    @Transactional
    public void updateUserReport(ReportDto newData) {
        Report report = reportRepository.findByUserUuid(newData.getUserUuid())
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


        reportRepository.save(report);
    }

    @Override
    public void upsertReport(ReportPerDateRequestDto dto) {
        reportPerDateRepository.findByUserUuidAndPlayDate(dto.getUserUuid(), dto.getPlayDate())
                .ifPresentOrElse(
                        existing -> {
                            existing.update(dto.getKcal(), dto.getPlayTimeDate());
                            reportPerDateRepository.save(existing);
                        },
                        () -> {
                            ReportPerDate newReport = ReportPerDate.builder()
                                    .userUuid(dto.getUserUuid())
                                    .playDate(dto.getPlayDate())
                                    .kcal(dto.getKcal())
                                    .playTimeDate(dto.getPlayTimeDate())
                                    .createdAt(LocalDateTime.now())
                                    .build();
                            reportPerDateRepository.save(newReport);
                        }
                );
    }
}
