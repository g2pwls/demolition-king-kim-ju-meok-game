package com.e106.demolition_king.skin.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "playerskin")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerSkin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer playerskinSeq;

    private Integer isSelect;

    private String userUuid;

    @Column(name = "playerskin_item_seq")
    private Integer playerSkinItemSeq;

    private Integer isUnlock;

//    @CreationTimestamp
//    private Timestamp createdAt;
//
//    @UpdateTimestamp
//    private Timestamp updatedAt;
}
