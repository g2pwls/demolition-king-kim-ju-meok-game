package com.e106.demolition_king.user.service;

import com.e106.demolition_king.common.exception.BaseException;
import com.e106.demolition_king.common.base.BaseResponseStatus;
import com.e106.demolition_king.user.repository.EmailRedisRepository;
import com.e106.demolition_king.user.repository.EmailVerificationRepository;
import com.e106.demolition_king.user.vo.in.EmailVerificationReRequestVo;
import com.e106.demolition_king.user.vo.in.EmailVerificationRequestVo;
import com.e106.demolition_king.user.vo.out.EmailVerificationReResponseVo;
import com.e106.demolition_king.user.vo.out.EmailVerificationResponseVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EmailVerificationServiceImpl implements EmailVerificationService {
    private final EmailVerificationRepository dao;
    private final EmailRedisRepository      redisRepo;
    private final JavaMailSender            mailSender;

    @Override
    public EmailVerificationResponseVo sendCode(EmailVerificationRequestVo req) {
        String email = req.getEmail();
        log.info("이메일 인증 요청 받음 → {}", email);

        // 1) DB 중복 체크
        if (!dao.existsByEmail(email)) {
            log.warn("이미 가입된 이메일로 요청: {}", email);
            return EmailVerificationResponseVo.builder()
                    .available(false)
                    .message("가입되지 않은 이메일입니다.")
                    .build();
        }

        // 2) 인증 코드 생성 (6자리, 대문자+숫자)
        String code = UUID.randomUUID()
                .toString()
                .replaceAll("-", "")
                .substring(0, 6)
                .toUpperCase();
        log.debug("생성된 인증 코드 [{}] → {}", code, email);

        // 3) Redis에 10분간 저장
        redisRepo.saveCode(email, code);
        log.debug("Redis에 인증 코드 저장 완료 (10분 TTL)");

        // 4) 메일 발송
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("[권투왕 김주먹] 이메일 인증 코드 발송");
            msg.setText( "안녕하세요,\n" +
                    "권투왕 김주먹입니다.\n\n" +
                    "고객님의 인증 코드는 아래와 같습니다.\n\n" +
                    "🔒 인증 코드: " + code + "\n" +
                    "⏰ 유효 기간: 발송 후 10분\n\n" +
                    "안전한 서비스 이용을 위해 유효 시간 내에 인증 절차를 완료해주시기 바랍니다.\n\n" +
                    "감사합니다.");
            mailSender.send(msg);
            log.info("이메일 전송 성공 → {}", email);
        } catch (Exception e) {
            log.error("이메일 전송 중 오류 발생", e);
            throw new BaseException(BaseResponseStatus.EMAIL_SEND_FAIL);
        }

        // 5) 성공 응답
        return EmailVerificationResponseVo.builder()
                .available(true)
                .message("인증 코드가 메일로 발송되었습니다.")
                .build();
    }

    @Override
    public EmailVerificationReResponseVo checkCode(EmailVerificationReRequestVo req) {
        boolean status;
        String message;

        // 1) 이메일 가져온다
        String email = req.getEmail();
        log.info("사용자 입력 이메일 → {}", email);

        // 2) 이메일로 레디스에 조회한다
        String code = redisRepo.getCode(email);
        log.info("DB 저장 코드 → {}", email);

        // 3) requestvo 객체와 비교한다.
        if (req.getCode().equals(code)){
            // 같으면
            status = BaseResponseStatus.EMAIL_RECIEVE_SUCCESS.isSuccess();
            message = BaseResponseStatus.EMAIL_RECIEVE_SUCCESS.getMessage();
        }else{
            status = BaseResponseStatus.EMAIL_RECIEVE_FAIL.isSuccess();
            message = BaseResponseStatus.EMAIL_RECIEVE_FAIL.getMessage();
        }

        // 4) 일치하면 true : false
        return EmailVerificationReResponseVo.builder()
                .available(status)
                .message(message)
                .build();
    }
}
