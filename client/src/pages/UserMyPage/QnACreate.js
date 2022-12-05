import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';
import { Select, Upload, Form, Input, Alert } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { myPageContainer_top__h1 } from './style';

const qnaCreate_form_fieldMessageDefault = {
  color: 'rgb(165, 173, 186)',
  display: 'block',
  marginBottom: '20px',
  padding: '5px',
  boxSizing: 'border-box',
  fontSize: '13px',
  lineHeight: '1.31',
  wordBreak: 'break-word',
};

const QnACreate = ({
  QnAForm,
  setQnAForm,
  images,
  setImages,
  alertVisible,
  setAlertVisible,
}) => {
  const { Option } = Select;
  const { Dragger } = Upload;
  const { TextArea } = Input;

  const userInfo = useRecoilValue(getUserInfoSelector);
  const [works, setWorks] = useState([]); // 참여중인 작업 list

  const layout = {
    labelCol: {
      span: 3,
    },
    labelAlign: 'left',
  };

  useEffect(() => {
    axios
      .post('/api/MyProjectApi', {
        userIndex: userInfo.idx,
      })
      .then((res) => {
        if (res.data.Find) {
          setWorks(res.data.MyProject);
        } else {
          console.log(res, 'fail');
        }
      });
  }, []);

  const uploadChangeHandler = (e) => {
    if (e.fileList[0]) {
      setImages(e.fileList);
    }
  };

  const uploadRemoveHandler = (file) => {
    const copyImages = [...images];
    const index = copyImages.indexOf(file);
    copyImages.splice(index, 1);
    setImages(copyImages);
  };

  const beforeUploadHandler = (file) => {
    const acceptType = ['image/png', 'image/jpeg'];

    if (acceptType.includes(file.type)) {
      return false;
    } else {
      return true;
    }
  };

  const handleQnAForm = (field) => {
    const name = field[0].name[0];
    const value = field[0].value;

    switch (name) {
      case 'categoryId':
        setQnAForm({ ...QnAForm, [name]: value });
        break;
      case 'projectId':
        works.map((work) => {
          if (work.idx === value) {
            return setQnAForm({
              ...QnAForm,
              [name]: value,
              companyIdx: work.companyIdx,
            });
          }
        });
        break;
      case 'questionTitle':
        setQnAForm({ ...QnAForm, [name]: value });
        break;
      case 'question':
        setQnAForm({ ...QnAForm, [name]: value });
        break;
    }
  };

  const onCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
    <>
      <div className="qnaCreate">
        <h1 style={myPageContainer_top__h1}>문의하기</h1>
        <div
          style={{
            width: '100%',
            margin: '20px 0px 0px',
            paddingTop: '20px',
            borderTop: '1px solid rgb(223, 225, 230)',
            borderCollapse: 'collapse',
          }}
        >
          {alertVisible && (
            <Alert
              message="문의사항 등록 실패"
              description="질문유형, 제목, 내용을 반드시 기재해주세요."
              type="error"
              showIcon
              style={{ marginBottom: '20px' }}
              closable
              onClose={onCloseAlert}
            />
          )}
          <Form
            {...layout}
            name="qnaCreateForm"
            wrapperCol={{ span: 25 }}
            size="large"
            onFieldsChange={handleQnAForm}
          >
            <Form.Item
              name="categoryId"
              label="질문유형"
              rules={[{ required: true, message: '질문유형을 선택해주세요.' }]}
            >
              <Select placeholder="선택" style={{ width: '350px' }}>
                <Option value="" disabled={true}>
                  선택
                </Option>
                <Option value={1}>사이트 이용</Option>
                <Option value={2}>포인트 관련</Option>
                <Option value={3}>프로젝트 문의</Option>
                <Option value={4}>기타 문의</Option>
              </Select>
            </Form.Item>
            <Form.Item name="projectId" label="프로젝트명">
              <Select placeholder="선택" style={{ width: '350px' }}>
                <Option value="선택" disabled={true}>
                  선택
                </Option>
                {works.map((work) => {
                  return <Option value={work.idx}>{work.taskTitle}</Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item label="이메일 주소" style={{ marginBottom: '0px' }}>
              <Input defaultValue={userInfo.id} disabled={true} />
            </Form.Item>
            <div
              className="fieldMessageDefault"
              style={qnaCreate_form_fieldMessageDefault}
            >
              문의하신 내용에 대한 답변이 이메일로 발송됩니다.
              <br />
              이메일 주소가 잘못되었다면{' '}
              <em
                style={{
                  color: 'rgb(46, 125, 255)',
                  paddingLeft: '4px',
                  fontWeight: 'bold',
                  fontStyle: 'normal',
                }}
              >
                마이페이지&gt;회원정보
              </em>{' '}
              에서 이메일 주소를 변경해 주세요.
            </div>
            <Form.Item
              name="questionTitle"
              label="제목"
              rules={[{ required: true, message: '제목을 입력해주세요.' }]}
            >
              <Input placeholder="제목을 입력해주세요." />
            </Form.Item>
            <Form.Item
              name="question"
              rules={[{ required: true, message: '문의 내용을 입력해주세요.' }]}
            >
              <TextArea
                rows={10}
                maxLength={5000}
                defaultValue="내용을 입력해주세요."
              />
            </Form.Item>
            <Form.Item name="attatchFile">
              <Dragger
                fileList={images}
                multiple
                maxCount={10}
                onChange={uploadChangeHandler}
                beforeUpload={beforeUploadHandler}
                onRemove={uploadRemoveHandler}
              >
                <p
                  className="ant-upload-drag-icon"
                  style={{ margin: '20px 0px 0px 0px' }}
                >
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text" style={{ marginBottom: '20px' }}>
                  드래그하거나 클릭하여 파일을 업로드해주세요
                </p>
              </Dragger>
              <div
                className="fieldMessageDefault"
                style={qnaCreate_form_fieldMessageDefault}
              >
                최대 10개(1개 당 최대 10MB 이하)
                <br />
                파일 확장자는 jpg, jpeg, png 만 첨부 가능
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default QnACreate;
