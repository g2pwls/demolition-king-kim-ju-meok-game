package io.openvidu.basic.java;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import io.livekit.server.RoomServiceClient;
import io.livekit.server.WebhookReceiver;

import livekit.LivekitWebhook.WebhookEvent; // webhook protobuf

import retrofit2.HttpException; // 409 처리용

@CrossOrigin(origins = "*")
@RestController
public class Controller {

	@Value("${livekit.api.key}")
	private String LIVEKIT_API_KEY;

	@Value("${livekit.api.secret}")
	private String LIVEKIT_API_SECRET;

	// ws가 아니라 http/https 엔드포인트 (기본값 로컬)
	@Value("${livekit.url:http://localhost:7880}")
	private String LIVEKIT_URL_HTTP;

	/** 필요할 때마다 클라이언트 생성 */
	private RoomServiceClient rsc() {
		return RoomServiceClient.createClient(
				LIVEKIT_URL_HTTP, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
		);
	}

	/** 방이 없으면 만들기(이미 있으면 409 무시) */
	private void ensureRoom(String roomName) throws Exception {
		try {
			rsc().createRoom(roomName).execute(); // 간단 생성
		} catch (HttpException e) {
			if (e.code() != 409) throw e; // 이미 있으면 OK, 그 외 에러만 전파
		}
	}

	/**
	 * 토큰 발급 (+ 방 자동 생성)
	 * body: { roomName?: string, nickName?: string, userUuid: string }
	 * 항상 { token, roomName } 반환
	 */
	@PostMapping("/token")
	public ResponseEntity<Map<String, String>> createToken(@RequestBody Map<String, Object> params) {
		try {
			String nickName = Optional.ofNullable((String) params.get("nickName")).orElse("player");
			String userUuid = (String) params.get("userUuid");
			if (userUuid == null || userUuid.isBlank()) {
				return ResponseEntity.badRequest().body(Map.of("errorMessage", "userUuid is required"));
			}

			String roomName = (String) params.get("roomName");
			if (roomName == null || roomName.isBlank()) {
				roomName = UUID.randomUUID().toString(); // 방 이름 자동 생성
			}

			// 방이 없으면 생성 (중복은 409 무시)
			ensureRoom(roomName);

			// 토큰 발급
			AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
			token.setName(nickName);
			token.setIdentity(userUuid);
			token.addGrants(new RoomJoin(true), new RoomName(roomName));

			return ResponseEntity.ok(Map.of(
					"token", token.toJwt(),
					"roomName", roomName
			));
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(Map.of("errorMessage", e.getMessage()));
		}
	}

	/** LiveKit Webhook 수신 */
	@PostMapping(value = "/livekit/webhook", consumes = "application/webhook+json")
	public ResponseEntity<String> receiveWebhook(@RequestHeader("Authorization") String authHeader,
												 @RequestBody String body) {
		WebhookReceiver webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
		try {
			WebhookEvent event = webhookReceiver.receive(body, authHeader);
			System.out.println("LiveKit Webhook: " + event);
		} catch (Exception e) {
			System.err.println("Error validating webhook event: " + e.getMessage());
		}
		return ResponseEntity.ok("ok");
	}
}
