package com.whiskeep.api.whisky.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecordListResponseDto {
	private List<RecordResponseDto> records;
	private PageInfo pageInfo;


	@Getter
	@Builder
	public static class RecordResponseDto {

		private Long recordId;
		private String nickname;
		private String profileImage;
		private String content;
		private String recordImg;
		private Integer rating;
		private LocalDateTime createdAt;
		private Boolean isPublic;
	}

	@Getter
	@Builder
	public static class PageInfo {
		private Integer page;
		private Integer size;
		private Integer totalPages;


	}
}
