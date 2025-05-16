package com.minute.video.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Table(name = "video_likes")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoLikes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int LikesId;

    @Column(name = "created_at")
    private Date createdAt;

    // user_id, video_id 가져오기
    @ManyToOne
    @JoinColumn(name = "video_id")
    private Video video;

//    @Id
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;
}
