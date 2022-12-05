import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import axios from 'axios';
import Header from '../../components/Header/Header';
import MyPageNav from '../../components/MyPage/MyPageNav';
import QnACreate from './QnACreate';
import { Table, Empty, Space, Button, Modal } from 'antd';
import {
  myPageContainer,
  myPageContainer_article,
  myPageContainer_top__h1,
  myPageContainer_bottom,
  myPageContainer_bottom_fixedBottom,
  fixedBottom_div,
  fixedBottom_button,
  fixedBottom_button__last,
  fixedBottom_button_button,
} from './style';

const HistoryQnA = () => {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const [QnAs, setQnAs] = useState([]); // 문의내역 list
  const [QnACreateMode, setQnACreateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [QnAForm, setQnAForm] = useState({
    categoryId: '',
    projectId: '',
    companyIdx: '',
    questionTitle: '',
    question: '',
  });
  const [images, setImages] = useState([]); // 서버로 upload할 file list

  useEffect(() => {
    axios
      .post('/api/ReadMyQuestions', {
        userIndex: userInfo.idx,
      })
      .then((res) => {
        if (res.data.Find) {
          setQnAs(res.data.MyQuestion);
        } else {
          console.log(res, 'fail');
        }
      });
  }, []);

  const columns = [
    {
      title: '번호',
      dataIndex: 'key',
      align: 'center',
      width: '5%',
    },
    {
      title: '구분',
      dataIndex: 'type',
      align: 'center',
      width: '11%',
    },
    {
      title: '제목',
      dataIndex: 'title',
      width: '65%',
      render: (text) => (
        <b>{text}</b>
      ),
    },
    {
      title: '등록일',
      dataIndex: 'registrationDate',
      align: 'center',
      width: '10%',
      defaultSortOrder: 'descend',
      showSorterTooltip: false,
      sorter: (a, b) =>
        new Date(a.registrationDate) - new Date(b.registrationDate),
      render: (text) => text.substring(0, 10),
    },
    {
      title: '진행상태',
      dataIndex: 'state',
      align: 'center',
      width: '9%',
    },
  ];

  const QnAsData = () => {
    const QnAsData = []; // 문의내역 data

    QnAs.map((qna, key) => {
      QnAsData.push({
        qIdx: qna.idx, // 문의 고유번호
        key: key + 1,
        type:
          qna.QuestionType === 1
            ? '사이트 이용'
            : qna.QuestionType === 2
            ? '포인트 관련'
            : qna.QuestionType === 3
            ? '프로젝트 문의'
            : '기타 문의',
        title: qna.QuestionTitle,
        registrationDate: qna.QuestionDate,
        state: qna.QuestionState === 0 ? '접수완료' : '답변완료',
        question: qna.QuestionContents,
        answer: qna.QuestionState === 0 ? '' : qna.Answer,
        answerAdmin: qna.QuestionState === 0 ? '' : qna.Respondent,
        answerRegistrationDate: qna.QuestionState === 0 ? '' : qna.AnswerDate,
      });
    });

    return QnAsData;
  };

  const handleQnAMode = () => {
    setQnACreateMode(!QnACreateMode);
  };

  const onHandleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleDeleteQnA = (e, id) => {
    axios
      .post('/api/DeleteMyQuestions', {
        QuestionIdx: id,
      })
      .then((res) => {
        if (res.data.Delete) {
          // 정말 삭제하시겠습니까 모달
          alert('해당 문의가 삭제되었습니다.');
        } else {
          console.log(res, 'fail');
        }
      });
  };

  const handleSubmitQnA = () => {
    if (
      QnAForm.categoryId !== '' &&
      QnAForm.questionTitle !== '' &&
      QnAForm.question !== ''
    ) {
      axios
        .post('/api/QnA', {
          params: {
            userIndex: userInfo.idx,
            CompanyIdx: QnAForm.categoryId === 0 ? 0 : QnAForm.companyIdx,
            QType: QnAForm.categoryId,
            taskTitle: QnAForm.projectId, // 프로젝트명(project idx)
            QTitle: QnAForm.questionTitle,
            QContents: QnAForm.question,
            QState: 0,
          },
        })
        .then((res) => {
          if (res.data.QuestionIdx) {
            const Qidx = res.data.QuestionIdx;
            const formData = convertImageToFormData(images); // 서버에 전송가능한 formData 형태로 변환

            axios.post(`/api/QnAApi/${Qidx}`, formData).then((res) => {
              if (res.data.Change) {
                alert('문의가 등록되었습니다.');
                setQnACreateMode(false);
                setImages([]);
              } else {
                alert('문의 등록에 실패했습니다.');
              }
            });
          }
        });
    } else {
      setAlertVisible(true);
    }
  };

  const handleChangeImages = (images) => {
    setImages(images);
  };

  const convertImageToFormData = (files) => {
    const formData = new FormData();
    for (const file of files) {
      if (!file.error) {
        formData.append('images', file.originFileObj);
      }
    }
    return formData;
  };

  return (
    <>
      <Header />
      <section className="myPageContainer" style={myPageContainer}>
        <MyPageNav mainMenu="history" subMenu="historyQnA" />
        <article style={myPageContainer_article}>
          <div className="historyQnA">
            <ul style={{ listStyle: 'none', padding: '0px' }}>
              <li className="top" style={{ width: '100%' }}>
                {!QnACreateMode ? (
                  <>
                    <h1 style={myPageContainer_top__h1}>나의 문의내역</h1>
                    <Table
                      columns={columns}
                      dataSource={QnAsData()}
                      size="middle"
                      locale={{
                        emptyText: (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={'문의 내역이 없습니다'}
                          />
                        ),
                      }}
                      expandable={{
                        expandIconColumnIndex: -1,
                        expandRowByClick: true,
                        expandedRowRender: (record) => (
                          <>
                            <div
                              className="question"
                              style={{
                                padding: '20px 50px 20px 50px',
                              }}
                            >
                              <p
                                style={{
                                  fontSize: '16px',
                                  textAlign: 'left',
                                  lineHeight: '28px',
                                  color: 'coral',
                                }}
                              >
                                Q.
                              </p>
                              <div className="questionContents">
                                {record.question}
                              </div>
                              <div
                                className="button"
                                style={{
                                  marginTop: '10px',
                                  display: 'flex',
                                  justifyContent: 'end',
                                }}
                              >
                                <Space>
                                  <Button
                                    htmlType="button"
                                    onClick={onHandleModal}
                                  >
                                    삭제
                                  </Button>
                                </Space>
                              </div>
                            </div>

                            {record.state === '답변완료' && (
                              <div
                                className="answerContainer"
                                style={{
                                  backgroundColor: '#fafafa',
                                  padding: '20px 50px 20px 50px',
                                  borderTop: '1px solid rgb(235, 236, 238)',
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: '16px',
                                    textAlign: 'left',
                                    lineHeight: '28px',
                                    color: '#5388ff',
                                  }}
                                >
                                  A.
                                </p>
                                <div className="answer">{record.answer}</div>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'end',
                                  }}
                                >
                                  <ul
                                    className="answerInfo"
                                    style={{
                                      listStyle: 'none',
                                      marginTop: '10px',
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <li
                                      className="answerer"
                                      style={{
                                        borderRight: '1px solid',
                                        paddingRight: '10px',
                                      }}
                                    >
                                      답변자: {record.answerAdmin}
                                    </li>
                                    <li
                                      className="answerDate"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      답변일:{' '}
                                      {record.answerRegistrationDate.substring(
                                        0,
                                        10
                                      )}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            )}

                            <Modal
                              title="문의내역 삭제"
                              visible={modalVisible}
                              onOk={(e) => handleDeleteQnA(e, record.qIdx)}
                              okText="삭제"
                              onCancel={onHandleModal}
                              cancelText="취소"
                              maskStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.095)',
                              }}
                            >
                              <p>해당 문의를 삭제하시겠습니까?</p>
                            </Modal>
                          </>
                        ),
                      }}
                      style={{ marginTop: '30px' }}
                    />
                  </>
                ) : (
                  <QnACreate
                    QnAForm={QnAForm}
                    setQnAForm={setQnAForm}
                    images={images}
                    setImages={handleChangeImages}
                    alertVisible={alertVisible}
                    setAlertVisible={setAlertVisible}
                  />
                )}
              </li>
              <li className="bottom" style={myPageContainer_bottom}>
                <div
                  className="fixedBottom"
                  style={myPageContainer_bottom_fixedBottom}
                >
                  <div style={fixedBottom_div}>
                    {!QnACreateMode ? (
                      <div className="button" style={fixedBottom_button}>
                        <button
                          type="button"
                          onClick={handleQnAMode}
                          style={fixedBottom_button_button}
                        >
                          문의하기
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="button" style={fixedBottom_button}>
                          <button
                            type="button"
                            onClick={handleQnAMode}
                            style={fixedBottom_button_button}
                          >
                            목록
                          </button>
                        </div>
                        <div
                          className="button"
                          style={fixedBottom_button__last}
                        >
                          <button
                            type="button"
                            onClick={handleSubmitQnA}
                            style={fixedBottom_button_button}
                          >
                            저장
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </article>
      </section>
    </>
  );
};

export default HistoryQnA;
