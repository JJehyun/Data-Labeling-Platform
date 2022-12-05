import React from 'react';
import { Statistic, Card } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

function InspectTable({ history, myProjectList }) {
  return (
    <>
      <div>
        <Card>
          <span style={{ color: 'black', fontWeight: '700', fontSize: '25px' }}>
            참여중인 프로젝트(끝)
          </span>
          <center>
            <div style={{ fontSize: '12px', color: 'gray' }}>
              참여중인 프로젝트 이름
            </div>
            {myProjectList &&
              myProjectList.map((data, i) => (
                <div style={{ color: '#3f8600', fontSize: '30px' }}>
                  {myProjectList[i].companyName +
                    '<' +
                    myProjectList[i].taskTitle +
                    '>'}
                </div>
              ))}
          </center>
        </Card>
        {/* <Card>
          <span style={{ color: 'black', fontWeight: '700', fontSize: '25px' }}>
            참여중인 검수
          </span>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ marginRight: '10px' }}>
              <Statistic
                title="검수 완료"
                value={11.28}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
                suffix="회"
              />
            </Card>
            <Card>
              <Statistic
                title="검수 반려"
                value={11}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                prefix={<InfoCircleOutlined />}
                suffix="회"
              />
            </Card>
          </div>
        </Card> */}
      </div>
    </>
  );
}
export default InspectTable;
