import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { NewsProp } from '../types/NewsProp';
import NewsList from '../components/NewsList';
import { Link, useParams } from 'react-router-dom';
import '../styles/NewsPage.scss';
import Loading from '../components/Loading';

function NewsPage() {
  const { group } = useParams();
  // console.log(group)

  const [news, setNews] = useState<NewsProp[]>([]);
  // const [economyNews, setEconomyNews] = useState<NewsProp[]>([]);
  // const [stockNews, setStockNews] = useState<NewsProp[]>([]);
  // const [coinNews, setCoinNews] = useState<NewsProp[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDataFromServer = useCallback(async () => {
    try {
      let url = process.env.REACT_APP_BACKSERVER + '/news';

      // // 선택된 li에 따라 url 수정
      // if(selectedGroup !== 'all') {
      //     url += `/${selectedGroup}`
      // }

      // useParams 훅을 통해 동적으로 가져온 그룹 값으로 URL 수정
      if (group && group !== 'economy') {
        url += `/${group}`;
      }

      // Axios를 사용하여 서버에 GET 요청
      await axios.get(url).then((res) => {
        console.log(res.data);
        setNews(res.data);
        // news = stockNews; // 서버에서 전송한 데이터에 따라 변경

        // const category1 = res.data.filter((singleNews:NewsProp) => singleNews.group === 1);
        // // setStockNews(category1);
        // const category2 = res.data.filter((singleNews:NewsProp) => singleNews.group === 2);
        // console.log(group);
        // // setCoinNews(category2);
        // const category3 = res.data.filter((singleNews:NewsProp) => singleNews.group === 3);
        // // setEconomyNews(category3);

        // switch(group) {
        //     case "economy":
        //         setNews(category3);
        //         break;
        //     case "stock":
        //         setNews(category1);
        //         break;
        //     case "coin":
        //         setNews(category2);
        //         break;
        //     default:
        //         setNews(res.data)
        // }
      });
    } catch (error) {
      console.error('Error fetching data from server:', error);
    }
  }, [group, setNews]);
  //   useEffect(
  //     () => {
  //       // React 컴포넌트가 마운트될 때 한 번 실행
  //       fetchDataFromServer();
  //       console.log(group);
  //     },
  //     [group]
  //     // []
  //   );
  useEffect(() => {
    const fetchData = async () => {
      // fetchDataFromServer 함수를 비동기로 호출
      await fetchDataFromServer();
      console.log(group);
    };

    fetchData(); // fetchData 함수 호출
  }, [fetchDataFromServer, group]);

  // const groupClick =  (group: string) => {
  //     setSelectedGroup(group);
  //     navigate(`/news${group !== "all" ? `/${group}` : "/all"}`);
  // }

  const refresh = async () => {
    setLoading(true);
    try {
      let url2 = process.env.REACT_APP_BACKSERVER + '/news/get';
      if (!group) {
        url2 += 'economy';
      } else {
        url2 += `${group}`;
      }
      const newData = await axios.get(url2);
      // setLoading(false);
      setNews(newData.data);

      window.location.reload();
    } catch (error) {
      console.error('refresh error:', error);
    }
  };

  return (
    <>
      <main>
        <div className="newsNav">
          {/* <li onClick={()=> groupClick('all')}>전체</li>
            <li onClick={()=> groupClick('economy')}>경제</li>
            <li onClick={()=> groupClick('stock')}>주식</li>
            <li onClick={()=> groupClick('coin')}>코인</li> */}

          <ul className="newsGroup">
            <li className="newsRoom">뉴스룸</li>
            <li>
              <Link to="/news/economy">경제</Link>
            </li>
            <li>
              <Link to="/news/stock">주식</Link>
            </li>
            <li>
              <Link to="/news/coin">코인</Link>
            </li>
          </ul>
          <ul className="refresh-tab">
            <li className="refresh-btn" onClick={refresh}>
              최신 뉴스 보기
            </li>
          </ul>
        </div>

        {loading ? (
          <Loading />
        ) : (
          news.map((data: NewsProp, index: number) => {
            return (
              <NewsList key={index} data={data} />
              // <p key={data._id}>
              //     {data.title} {data.date} <br /> {data.context} <br />
              // </p>
            );
          })
        )}
      </main>
    </>
  );
}

export default NewsPage;
