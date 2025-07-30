package com.e106.demolition_king.user.vo.out;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Getter
@Builder
public class ResetPasswordResponseVo {
    private final boolean available;
    private final String message;
}
