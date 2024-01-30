import '../../styles/Community.scss';
import React, { useState, useEffect } from 'react';
import {
  getCommunityPosts,
  addLike,
  getComment,
} from '../../services/apiService';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Community() {
  const [posts, setPosts] = useState([]);
  // db에서 데이터 불러오기위해 useState
  console.log('post', posts);

  useEffect(() => {
    // 서버에서 데이터를 불러와서 posts 상태 업데이트
    const fetchData = async () => {
      try {
        const communityPosts = await getCommunityPosts();
        setPosts(communityPosts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const [pagination, setPagination] = useState(1);
  const defaultPage = 5;

  // 마지막 페이지 (1*5)
  const lastPage = pagination * defaultPage;
  console.log('lastPage', lastPage);
  // 첫 페이지 ((1*5)- 5)
  const firstPage = lastPage - defaultPage;
  console.log('firstPage', firstPage);
  // 현재 페이지 데이터 나누기
  const currentPage = posts.slice(firstPage, lastPage);

  // console.log('currentPage', currentPage);

  // 페이지 번호대로 클릭하면 스테이트 값 업데이트
  const paginate = (pageNumber: any) => {
    setPagination(pageNumber);
  };

  return (
    <>
      {/* 콘텐츠 박스*/}
      {currentPage.map((post: any) => {
        // console.log(minutesAgo)

        // 시간 계산 (~분전)
        const formatTimeDifference = (dateString: any) => {
          // 분계산
          const postDate = new Date(dateString);
          const currentTime = new Date();
          const timeDifference = currentTime.getTime() - postDate.getTime();
          const minutesAgo = Math.floor(timeDifference / (1000 * 60));

          // console.log(minutesAgo);
          if (minutesAgo < 1) {
            return '방금 전';
          } else if (minutesAgo < 60) {
            return `${minutesAgo}분 전`;
          } else if (minutesAgo < 1440) {
            const hoursAgo = Math.floor(minutesAgo / 60);
            return `${hoursAgo}시간 전`;
          } else {
            // 한국 시간으로 표시
            const formattedDate = postDate.toLocaleString('ko-KR', {
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              timeZone: 'Asia/Seoul',
            });

            return formattedDate;
          }
        };

        // 카테고리 분류 value값에 맞춰 데이터 생성
        const getSubject = () => {
          const subject = post.subject;
          let subjectname;
          if (subject === 'free') {
            subjectname = '자유';
          } else if (subject === 'economy') {
            subjectname = '경제';
          } else if (subject === 'coin') {
            subjectname = '코인';
          } else if (subject === 'stock') {
            subjectname = '주식';
          }
          return subjectname;
        };

        // 좋아요 누르기
        const plusLike = async () => {
          try {
            const like: Number = 1;
            const postId = post._id;

            const likeData = { like, postId };
            const response = await addLike(likeData);
            console.log(response);
            window.location.reload();
          } catch (err) {
            console.log(err);
          }
        };

        return (
          <Link to={`/community/${post._id}`} state={{ post }}>
            <div className="post" key={post._id}>
              <div className="postContents">
                {/* 유저 정보*/}
                <div className="userProfile">
                  <span>
                    <img
                      src="https://teamproject-3-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%91%E1%85%B5%E1%86%AF.png"
                      alt="기본 이미지"
                    />
                  </span>
                  <p style={{ marginRight: '5px' }}>{post.userNickName}</p>
                  <span style={{ fontSize: '10px' }}>•</span>
                  <span>{formatTimeDifference(post.date)}</span>
                </div>

                {/* 게시글 */}

                <div className="contentBox">
                  <div className="textContent">
                    <p className="title">{post.title}</p>
                    <p className="text">{post.content}</p>
                  </div>

                  <div className="imgBox">
                    <Link to={`/community/${post._id}`} state={{ post }}>
                      <img src={post.image} alt="" />
                    </Link>
                  </div>
                </div>

                {/* 아이콘 리스트 */}
                <div className="statusBox">
                  <div>
                    <span>
                      {/* 이 버튼이 눌리면 DB Like에 1씩 증가 */}
                      <button onClick={plusLike}>
                        {/* <span
                        className=
                          
                        'material-symbols-outlined'
                      >
                        favorite
                      </span> */}
                        <span>좋아요</span>
                      </button>
                      <span>{post.like}</span>
                    </span>

                    <span>
                      <button>
                        <span className="material-symbols-outlined">
                          maps_ugc
                        </span>
                      </button>
                      <span>0</span>
                    </span>
                  </div>
                  <span className="category">{getSubject()}</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}

      <div>
        {Array.from({ length: Math.ceil(posts.length / defaultPage) }).map(
          (_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          )
        )}
      </div>
    </>
  );
}

export default Community;
