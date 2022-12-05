import React, { useCallback, useState } from 'react';
import { Image, PageHeader, Input, Button } from 'antd';
import Header from '../../components/Header/Header';
import { useHistory } from 'react-router-dom';
import fallbackImage from './fallbackImage.png';
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const InspectionPage = () => {
  const history = useHistory();

  const [inspectionImage, setInspectionImage] = useState([
    'data:image/jpeg;base64,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',
    'data:image/jpeg;base64,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',
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'http://mimg.segye.com/content/image/2017/07/24/ori/20170724511046.jpg',
  ]);
  const [selectedImage, setSelectedImage] = useState(0);

  const imageCardClickHandler = useCallback((e, imageIndex) => {
    setSelectedImage(imageIndex);
  }, []);

  const nextClickHandler = useCallback(() => {
    setSelectedImage(selectedImage + 1);
  }, [selectedImage]);

  const prevClickHandler = useCallback(() => {
    setSelectedImage(selectedImage - 1);
  }, [selectedImage]);

  const ImageCard = useCallback(
    ({ imageSrc, isDone, index }) => {
      return (
        <div
          onClick={(e) => imageCardClickHandler(e, index)}
          className="ant-card-hoverable"
          style={
            selectedImage === index
              ? {
                  position: 'relative',
                  maxHeight: 160,
                  width: '50%',
                  border: '2px solid #1890ff',
                }
              : {
                  position: 'relative',
                  maxHeight: 160,
                  width: '50%',
                }
          }
        >
          <img
            width="100%"
            height="100%"
            style={{ padding: '0.25rem' }}
            src={imageSrc}
          />

          {isDone && (
            <CheckCircleOutlined
              style={{
                right: 0,
                left: 0,
                bottom: '50%',
                position: 'absolute',
                zIndex: 10,
                fontSize: 40,
                color: '#40a9ff',
              }}
            />
          )}
        </div>
      );
    },
    [inspectionImage, selectedImage]
  );

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <Header />

        <PageHeader
          className="site-page-header"
          onBack={() => history.push('/')}
          title="에어컨 Bounding Box 작업"
          subTitle="lexky82"
        />
      </div>

      <div
        style={{
          position: 'relative',
          maxWidth: 1364,
          margin: '20px auto',
          padding: '2rem',
        }}
      >
        <div style={{ position: 'absolute', right: 40, top: 0 }}>
          <span style={{ marginRight: 30, fontSize: 18, fontWeight: 700 }}>
            통과 작업 량 : 1
          </span>
          <span style={{ fontSize: 18, fontWeight: 700 }}>
            반려 작업 량 : 0
          </span>
        </div>

        <div
          style={{
            display: 'flex',
          }}
        >
          <div
            style={{
              marginRight: '3rem',
            }}
          >
            <Image
              width={980}
              height={700}
              fallback={fallbackImage}
              src={
                inspectionImage[selectedImage] && inspectionImage[selectedImage]
              }
            />
          </div>

          <div
            style={{
              display: 'flex',
              width: '100%',
              flexWrap: 'wrap',
              padding: '0.625rem',
              backgroundColor: '#C4C4C4',
              maxHeight: 700,
              margin: 'auto',
              overflow: 'auto',
              boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.2)',
            }}
          >
            {inspectionImage.map((imageSrc, index) => (
              <ImageCard imageSrc={imageSrc} index={index} key={index} />
            ))}
          </div>
        </div>

        <div
          style={{
            width: 900,
            marginTop: '0.625rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            shape="circle"
            size="large"
            icon={<LeftOutlined />}
            onClick={prevClickHandler}
            disabled={!inspectionImage[selectedImage - 1]}
            style={{ marginRight: 20 }}
          />

          <Button
            shape="circle"
            size="large"
            icon={<RightOutlined />}
            onClick={nextClickHandler}
            disabled={!inspectionImage[selectedImage + 1]}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Input
            style={{ width: 780, marginRight: '1rem', borderRadius: '15px' }}
            size="large"
            placeholder="반려사유를 입력해주세요."
          />

          <Button size="large" style={{ borderRadius: '10px' }}>
            반려
          </Button>

          <Button
            size="large"
            style={{ marginLeft: '2rem', width: 100, borderRadius: '15px' }}
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
