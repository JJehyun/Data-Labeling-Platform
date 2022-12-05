import React from 'react';
import { Steps, Button, message, Row, Col, Card, Typography } from 'antd';

function WorkGuide({}) {
  const [current, setCurrent] = React.useState(0);
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const { Step } = Steps;
  const steps = [
    {
      title: '알림',
    },
    {
      title: '가이드 안내',
    },
    {
      title: '작업 시작',
    },
  ];
  return (
    <>
      <div style={{ marginTop: '5%' }}></div>
      <Row style={{ height: '100vh' }}>
        <Col span={10} offset={7}>
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div>{current == 0 ? <div className="cards">1번</div> : <></>}</div>
          <center>
            <div
              className="steps-action"
              style={{
                height: '100%',
                position: 'relative',
                bottom: '0px',
                marginTop: '50px',
              }}
            >
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => message.success('Processing complete!')}
                >
                  Done
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                  Previous
                </Button>
              )}
            </div>
          </center>
        </Col>
      </Row>
    </>
  );
}

export default WorkGuide;
