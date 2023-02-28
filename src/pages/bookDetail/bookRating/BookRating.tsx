import instance from "api/instance";
import request from "api/request";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "reducer/store";
import BookRatingCss from "./BookRatingCss";

export interface IProps {
  ISBN: number;
}

interface IRating {
  content: string;
  nickName: string;
  score: number;
  onecommentSeq: number;
  regDt: string;
}

const BookRating = (props: IProps) => {
  const uiSeq = useSelector((state: RootState) => state.user.uiSeq);
  const [content, setContent] = useState<IRating[]>([]);
  const commentList = async () => {
    const params = {
      page: 0,
    };
    await instance
      .get(`api/onecomment/${props.ISBN}/list`, { params: params })
      .then((res) => {
        setContent(res.data.content);
      });
  };

  useEffect(() => {
    commentList();
  }, []);

  console.log(content);

  // 날짜 변경 함수
  const datePrefix = (Day: string) => {
    const Date = Day.substring(0, 10);
    const [year, month, day] = Date.split("-");
    return `${year}년${month}월${day}일`;
  };

  return (
    <BookRatingCss>
      <div>
        {content.length === 0 ? (
          <div>
            <p>
              등록된 평점이 없습니다. 이 책을 완독하고 첫 평점을 등록해보세요!
            </p>
          </div>
        ) : (
          content.map((ele) => {
            return (
              <div className="rating" key={ele.onecommentSeq}>
                <span>{ele.score}</span>
                <p className="ratingContent">{ele.content}</p>
                <p className="ratingND">
                  <span>{ele.nickName}님</span>
                  <span>{datePrefix(ele.regDt)}</span>
                </p>
              </div>
            );
          })
        )}
      </div>
    </BookRatingCss>
  );
};

export default BookRating;
