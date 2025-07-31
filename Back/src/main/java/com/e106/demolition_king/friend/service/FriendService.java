package com.e106.demolition_king.friend.service;

import com.e106.demolition_king.friend.dto.FriendDto;
import com.e106.demolition_king.friend.dto.FriendRequestDto;
import com.e106.demolition_king.friend.vo.out.FriendStatusVo;

import java.util.List;

public interface FriendService {
    List<FriendStatusVo> getInvitableFriends(String userUuid);
    List<FriendStatusVo> getFriendListWithStatus(String userUuid);
    // 받은 친구 요청 목록 (PENDING 상태)
    List<FriendStatusVo> getPendingRequestList(String userUuid);
    void sendFriendRequest(String senderUuid, FriendRequestDto requestDto);
    void acceptFriendRequest(String receiverUuid, String requesterUuid);
    void rejectFriendRequest(String receiverUuid, String requesterUuid);
    void deleteFriend(String userUuid, String friendUuid);

}
