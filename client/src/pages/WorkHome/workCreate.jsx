import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { getUserInfoSelector } from '../../states/index';
import { Layout, Input, Form, Upload, Button, Checkbox, Modal } from 'antd';
import {
  UploadOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;

const WorkCreate = ({ modifyToWorkInfo }) => {
  const userInfo = useRecoilValue(getUserInfoSelector);
  const [fileRoot, setFileRoot] = useState('');
  const [projectName, setProjectName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [point, setPoint] = useState(0);
  const [rejectImage, setRejectImage] = useState();
  const [guideImage, setGuideImage] = useState();
  const [boundingBox, setBoundingBox] = useState(false);
  const [polygon, setPolygon] = useState(false);
  const [images, setImages] = useState([]);

  const { confirm } = Modal;

  useEffect(() => {
    if (modifyToWorkInfo) {
      setProjectName(modifyToWorkInfo.taskTitle);
      setCategoryName(modifyToWorkInfo.taskCategory);
      setPoint(modifyToWorkInfo.taskPointA);
      setBoundingBox(modifyToWorkInfo.BoundingBox === 1 ? true : false);
      setPolygon(modifyToWorkInfo.Polygon === 1 ? true : false);
    } else {
      setProjectName();
      setCategoryName();
      setPoint();
      setRejectImage();
      setGuideImage();
      setBoundingBox();
      setPolygon();
    }
  }, [modifyToWorkInfo]);

  const uploadChangeHandler = (e) => {
    if (e.fileList[0]) {
      setFileRoot(e.fileList[0].originFileObj.webkitRelativePath.split('/')[0]);
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

  const projectNameChangeHandler = (e) => {
    setProjectName(e.target.value);
  };

  const categoryNameChangeHandler = (e) => {
    setCategoryName(e.target.value);
  };

  const pointChangeHandler = (e) => {
    setPoint(parseInt(e.target.value));
  };

  const anotationCheckHandler = (e, tool) => {
    if (tool === 'boundingBox') {
      setBoundingBox(e.target.checked);
    } else {
      setPolygon(e.target.checked);
    }
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

  const singleUploadChangeHandler = (info, type) => {
    if (type === 'reject') {
      setRejectImage(info.file);
    } else if (type === 'guide') {
      setGuideImage(info.file);
    }
  };

  const createShowPromiseConfirm = () => {
    confirm({
      title: '????????? ?????????????????????????',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        return new Promise((resolve, reject) => {
          const projectInfo = {
            userIndex: userInfo.idx,
            companyIdx: userInfo.companyIdx,
            projectName,
            categoryName,
            point,
            boundingBox,
            polygon,
          };

          const res = axios.post('/api/CreateTaskGroup', projectInfo);

          res.then((res) => {
            const formData = images && convertImageToFormData(images);
            rejectImage && formData.append('rejects', rejectImage);
            guideImage && formData.append('guides', guideImage);

            axios
              .post(`/api/UploadApi/${res.data.taskGroupIdx}`, formData)
              .then((response) => {
                if (response.data.success) {
                  Modal.success({
                    title: '?????? ????????? ?????????????????????.',
                  });
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch((err) => {
                reject(err);
              });
          });
          res.catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          Modal.error({
            title: '?????? ????????? ??????????????????.',
          });
        });
      },
      onCancel() {},
    });
  };

  const modifyShowPromiseConfirm = () => {
    confirm({
      title: '????????? ?????????????????????????',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        return new Promise(async (resolve, reject) => {
          const projectInfo = {
            taskGroupIdx: modifyToWorkInfo.idx,
            projectName,
            categoryName,
            point,
            boundingBox,
            polygon,
          };

          const res = await axios.post('/api/UpdateTaskGroup', projectInfo);

          if (res.data.success === true) {
            const formData = images && convertImageToFormData(images);
            rejectImage && formData.append('rejects', rejectImage);
            guideImage && formData.append('guides', guideImage);

            axios
              .post(`/api/UploadApi/${modifyToWorkInfo.idx}`, formData)
              .then((response) => {
                if (response.data.success) {
                  Modal.success({
                    title: '?????? ????????? ?????????????????????.',
                  });
                  resolve(response.data);
                } else {
                  reject(response.data);
                }
              })
              .catch((err) => {
                reject(err);
              });
          }
        }).catch((err) => {
          Modal.error({
            title: '?????? ????????? ??????????????????.',
          });
        });
      },
      onCancel() {},
    });
  };

  const createWorkButtonHandler = () => {
    if (!projectName || !categoryName || !point || !images) {
      return Modal.warning({
        title: '????????? ???????????? ???????????????.',
      });
    }

    if (!modifyToWorkInfo) {
      createShowPromiseConfirm();
    } else {
      modifyShowPromiseConfirm();
    }
  };

  return (
    <div>
      <Content>
        <Form
          onSubmitCapture={createWorkButtonHandler}
          layout="vertical"
          style={{ display: 'flex', flexWrap: 'wrap', position: 'relative' }}
        >
          <div style={{ width: 700, marginRight: 70 }}>
            <Form.Item label="???????????? ??????" required>
              <Input
                value={projectName}
                size="large"
                onChange={projectNameChangeHandler}
                placeholder="???????????? ????????? ??????????????????."
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            <Form.Item label="???????????? ??????" required>
              <Input
                value={categoryName}
                size="large"
                onChange={categoryNameChangeHandler}
                placeholder="???????????? ????????? ??????????????????."
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            <Form.Item label="????????? ???????????? ?????? ?????? ?????????" required>
              <Input
                value={point}
                onChange={pointChangeHandler}
                placeholder="????????? ???????????? ?????? ?????? ????????? ??????"
                addonAfter="Point"
                type="number"
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            <Form.Item
              label="???????????? ???????????? ?????? ?????? ??????"
              required={!modifyToWorkInfo ? true : false}
              tooltip={
                modifyToWorkInfo && {
                  title: '??????????????? ????????? ???????????? ?????? ???????????????!',
                  icon: <InfoCircleOutlined />,
                }
              }
            >
              <Upload
                showUploadList={false}
                beforeUpload={beforeUploadHandler}
                onChange={(e) => singleUploadChangeHandler(e, 'reject')}
              >
                <Button
                  type="primary"
                  size="large"
                  style={rejectImage && { backgroundColor: 'green' }}
                  icon={
                    rejectImage ? <CheckCircleOutlined /> : <UploadOutlined />
                  }
                >
                  ???????????? ????????? ?????????
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="???????????? ????????? ??????"
              required={!modifyToWorkInfo ? true : false}
              tooltip={
                modifyToWorkInfo && {
                  title: '??????????????? ????????? ???????????? ?????? ???????????????!',
                  icon: <InfoCircleOutlined />,
                }
              }
            >
              <Upload
                showUploadList={false}
                beforeUpload={beforeUploadHandler}
                onChange={(e) => singleUploadChangeHandler(e, 'guide')}
              >
                <Button
                  type="primary"
                  size="large"
                  style={guideImage && { backgroundColor: 'green' }}
                  icon={
                    guideImage ? <CheckCircleOutlined /> : <UploadOutlined />
                  }
                >
                  ????????? ????????? ?????????
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Anotation Tool" required>
              <Checkbox
                checked={boundingBox}
                onChange={(e) => anotationCheckHandler(e, 'boundingBox')}
              >
                Bounding Box
              </Checkbox>
              <br />
              <Checkbox
                checked={polygon}
                onChange={(e) => anotationCheckHandler(e, 'polygon')}
              >
                Polygon Segmentation
              </Checkbox>
            </Form.Item>
          </div>

          <div style={{ width: 700 }}>
            <Form.Item
              label="????????? ?????????"
              tooltip={
                modifyToWorkInfo && {
                  title: '????????? ????????? ????????? ???????????????!',
                  icon: <InfoCircleOutlined />,
                }
              }
              required={!modifyToWorkInfo ? true : false}
            >
              <Input
                size="large"
                placeholder="??????????????? ????????? ????????????."
                value={fileRoot}
                style={{ width: 500, borderRadius: 10, marginRight: 10 }}
              />

              <Upload
                fileList={images}
                directory
                onChange={uploadChangeHandler}
                beforeUpload={beforeUploadHandler}
                onRemove={uploadRemoveHandler}
              >
                <Button
                  style={{ height: 41.5, borderRadius: 10 }}
                  icon={<UploadOutlined />}
                >
                  ??????
                </Button>
              </Upload>
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: 150,
              height: 40,
              fontSize: 20,
              position: 'absolute',
              borderRadius: '1rem',
              bottom: 0,
              right: 80,
            }}
          >
            {!modifyToWorkInfo ? '??????' : '??????'}
          </Button>
        </Form>
      </Content>
    </div>
  );
};

export default WorkCreate;
