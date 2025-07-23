package com.e106.demolition_king.friend.service;


import com.e106.demolition_king.friend.entity.Friend;
import com.e106.demolition_king.friend.entity.InviteList;
import com.e106.demolition_king.friend.entity.InviteStatus;
import com.e106.demolition_king.friend.repository.FriendRepository;
import com.e106.demolition_king.friend.repository.InviteListRepository;
import com.e106.demolition_king.friend.vo.in.InviteInVo;
import com.e106.demolition_king.friend.vo.out.InviteOutVo;
import com.e106.demolition_king.user.entity.User;
import com.e106.demolition_king.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class InviteService {

    private final UserRepository userRepository;
    private final InviteListRepository inviteListRepository;
    private final FriendRepository friendRepository;

    /**
     * 친구 신청
     */
    public InviteOutVo sendInvite(InviteInVo vo) {
        String from = vo.getFromUserUuid();
        String to   = vo.getToUserUuid();

        if (friendRepository.existsByUserUserUuidAndFriendUserUuid(from, to)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "이미 친구입니다.");
        }
        if (inviteListRepository
                .findByFromUserUserUuidAndToUserUserUuidAndStatus(from, to, InviteStatus.PENDING)
                .isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "이미 신청된 상태입니다.");
        }

        User fromUser = userRepository.findById(from)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, from + "사용자가 존재하지 않습니다."));
        User toUser   = userRepository.findById(to)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, to + "사용자가 존재하지 않습니다."));

        InviteList inv = InviteList.builder()
                .fromUser(fromUser)
                .toUser(toUser)
                .status(InviteStatus.PENDING)
                .build();
        InviteList saved = inviteListRepository.save(inv);

        return InviteOutVo.builder()
                .id(saved.getId())
                .fromUserUuid(from)
                .toUserUuid(to)
                .status(saved.getStatus())
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }

    /**
     * 친구 신청 수락 (양방향 Friend 생성)
     */
    public void acceptInvite(Long inviteId) {
        InviteList inv = inviteListRepository.findById(inviteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, inviteId + "사용자가 존재하지 않습니다."));
        inv.setStatus(InviteStatus.ACCEPTED);

        // 양방향
        Friend f1 = Friend.builder()
                .user(inv.getFromUser())
                .friend(inv.getToUser())
                .build();
        Friend f2 = Friend.builder()
                .user(inv.getToUser())
                .friend(inv.getFromUser())
                .build();
        friendRepository.save(f1);
        friendRepository.save(f2);
    }

    /**
     * 친구 신청 거절
     */
    public void rejectInvite(Long inviteId) {
        InviteList inv = inviteListRepository.findById(inviteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, inviteId + "사용자가 존재하지 않습니다."));
        inv.setStatus(InviteStatus.REJECTED);
    }
}
