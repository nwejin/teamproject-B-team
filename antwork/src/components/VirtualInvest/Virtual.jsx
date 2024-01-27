// App.js
import '../../styles/Virtual.scss';
import React, { useState, useEffect } from 'react';
import { getConvertData } from './BybitAPI';
import Candle from './Candle';
import SellBtn from './SellOrder';
import Order from './BuyOrder';
import Detail from './showDetail';

import { useSelector } from 'react-redux';

let yearofDay = 365; //bybit api 데이터는 시간이 역순이므로 slice도 역순으로 해야함

const numberWithCommas = (numberString) => {
  if (typeof numberString !== 'string') {
    // 만약 numberString이 문자열이 아니라면 문자열로 변환합니다.
    numberString = String(numberString);
  }

  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const Virtual = () => {
  const [index, setIndex] = useState(180); //시작 캔들 개수
  const [data, setData] = useState([]); //api로 가져온 데이터
  const [currentCost, setCurrentCost] = useState(); //현재 가격
  const [prevInvest, setPrevInvest] = useState(0); // 이전 투자금액 -> profit 계산에 사용

  const account = useSelector((state) => state.account).toFixed(2); //잔고 (소수 둘째자리)
  const [formatted_account, setFormatted] = useState(numberWithCommas(account));
  const [formatted_prevInvest, setFormattedInvest] = useState(
    prevInvest.toLocaleString()
  );

  // 다음턴 버튼 클릭 시, bybit api 통신
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getConvertData(); // 데이터가 로딩될 때까지 대기
        setData(result.slice(index, yearofDay));
        setCurrentCost(data[data.length - 1].close);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [index]);

  // account 값이 변경될 때마다 formatted_account도 갱신
  useEffect(() => {
    setFormatted(numberWithCommas(account));
    setFormattedInvest(numberWithCommas(prevInvest));
  }, [account, prevInvest]);

  // 초기 부터 currentValue 설정
  useEffect(() => {
    setCurrentCost(data[data.length - 1]?.close);
  }, [data]);

  const updatePrevInvest = (prev) => {
    setPrevInvest(prev);
  };

  const nextTurn = async () => {
    setIndex(index - 1);
    const newData = data.slice(index, yearofDay);
    setData(newData);
  };

  const candleProps = {
    data: data.sort((a, b) => new Date(a.time) - new Date(b.time)),
    colors: {
      backgroundColor: 'white',
      lineColor: '#2962FF',
      textColor: 'black',
      areaTopColor: '#2962FF',
      areaBottomColor: 'rgba(41, 98, 255, 0.28)',
    },
  };

  // 모달창
  const [openSellModal, setOpenSellModal] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  //
  const showSellModal = () => {
    setOpenSellModal(true);
  };

  const closeSellModal = () => {
    setOpenSellModal(false);
  };

  const showBuyModal = () => {
    setOpenBuyModal(true);
  };

  const closeBuyModal = () => {
    setOpenBuyModal(false);
  };

  const showDetailModal = () => {
    setOpenDetailModal(true);
  };

  const closeDetailModal = () => {
    setOpenDetailModal(false);
  };

  const stock = useSelector((state) => state.stock); //보유주식 수
  const purchasePrice = useSelector((state) => state.purchasePrice); //보유주식 평단가

  return (
    <div className="invest-wrapper">
      <div className="invest-chart">
        <Candle {...candleProps} />
      </div>
      <div className="invest-input">
        <p className="smallTitle">현재 가격</p>
        <h2>{currentCost} $</h2>
        <div className="btn-wapper">
          <div className="tradingBtnBox">
            <button className="buy Btn" onClick={showBuyModal}>
              매수
            </button>
            {openBuyModal && (
              <Order
                currentVal={currentCost}
                prevInvest={prevInvest}
                updatePrevInvest={updatePrevInvest}
                close={closeBuyModal}
              />
            )}

            <button className="sell Btn" onClick={showSellModal}>
              매도
            </button>
            {openSellModal && (
              <SellBtn
                currentVal={currentCost}
                prevInvest={prevInvest}
                updatePrevInvest={updatePrevInvest}
                close={closeSellModal}
              />
            )}
          </div>
          <div className="nextBtnBox">
            <button className="next Btn" onClick={nextTurn}>
              다음턴으로 →
            </button>
          </div>
        </div>
        <div className="currentStock">
          <div>
            <p className="smallTitle">내 주식 현황</p>
            <p>
              <span>{stock}</span> 주
            </p>
          </div>
          <div>
            <p className="smallTitle"> 평단가</p>
            <p>
              <span>{purchasePrice}</span> $
            </p>
          </div>
        </div>
        <div className="totalMoney">
          <p className="smallTitle">
            잔액
            <span>{formatted_account}</span> $
          </p>
        </div>

        <div className="investMoney">
          <p className="smallTitle">현재 투자금액</p>
          <p style={{ color: 'blue' }}>{formatted_prevInvest} $</p>
        </div>
        <button
          style={{ marginTop: '20px', background: 'none', border: 'none' }}
          onClick={showDetailModal}
        >
          거래 내역 보기
        </button>
        {openDetailModal && <Detail close={closeDetailModal} />}
      </div>
    </div>
  );
};

export default Virtual;
