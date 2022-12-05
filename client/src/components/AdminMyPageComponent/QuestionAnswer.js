import React from 'react';
import { Form, Card, Input, Button, Typography } from 'antd';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states';

function QuestionAnswer({
  name,
  day,
  title,
  content,
  Answer,
  Key,
  project,
}) {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const { Text, Title } = Typography;
  const submitAnswer = (values) => {
    alert('답변을 전송했습니다.');
    window.location.replace('/WorksAskList');
    axios
      .post('/api/QuestionAnswer', {
        params: { values, Key },
        Respondent: userInfo.userName,
      })
      .then((data) => {});
  };
  return (
    <>
      <span style={{ fontWeight: 900, fontSize: '25px' }}>질의 응답</span>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={3}>{title}</Title>
          <div>
            <Text code style={{ fontSize: '15px' }}>
              작성자
            </Text>
            <Text type="success">{name}</Text>
            <Text code style={{ fontSize: '15px', marginLeft: '15px' }}>
              작성일
            </Text>
            <Text type="success">{day}</Text>
            <Text code style={{ fontSize: '15px', marginLeft: '15px' }}>
              프로젝트
            </Text>
            <Text type="danger">{project}</Text>
          </div>
        </div>
      </Card>
      <Card style={{ height: '400px' }}>{content}</Card>
      <Card>
        <Title level={3}>답변</Title>
        <Form
          onFinish={submitAnswer}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
        >
          {Answer ? (
            <>{Answer}</>
          ) : (
            <>
              {' '}
              <Form.Item name="Answer">
                <Input
                  size="middle"
                  width="500px"
                  placeholder="답변을 입력해주세요"
                />
              </Form.Item>
              <Button
                onClick={() => {}}
                type="primary"
                htmlType="submit"
                style={{ float: 'right' }}
              >
                답변 전송
              </Button>
            </>
          )}
        </Form>
      </Card>
    </>
  );
}
export default QuestionAnswer;
