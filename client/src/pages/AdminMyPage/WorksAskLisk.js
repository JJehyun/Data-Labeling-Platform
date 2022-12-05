import React, { useEffect, useState } from 'react';
import UserMyPageNav from '../../components/MyPage/MyPageNav';
import QuestionTable from '../../components/AdminMyPageTable/questionTable';
import axios from 'axios';
import Header from '../../components/Header/Header';

function WorksAskList({ history }) {
  const [QuestionList, setQuesionList] = useState({});
  //Works들이 질문한 내용 db에서 가져오는 함수 = getQuestionList
  useEffect(() => {
    getQuestionList();
  }, []);

  async function getQuestionList() {
    let result = await axios
      .post('/api/QuestionList', { useridx: 1 })
      .then((date) => {
        console.log(date);
        return date.data.QuestionList;
      });
    await setQuesionList(result);
  }

  return (
    <>
      <Header />
      <div
        style={{
          display: 'flex',
          padding: '40px 80px',
          margin: 'auto',
          maxWidth: 1380,
        }}
      >
        <UserMyPageNav />
        {/*관리자 마이페이지 nav bar*/}
        <div>
          <QuestionTable List={QuestionList} history={history} />
          {/*작업자가 질문한 내용들을 볼 수 있는 테이블nav bar*/}
        </div>
      </div>
    </>
  );
}
export default WorksAskList;
