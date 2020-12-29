import React, { useState, useRef } from 'react';
import { Tooltip, Upload, Card, Divider, Image, message } from 'antd';
import { InboxOutlined, SwapOutlined, UploadOutlined, ExpandOutlined, SaveOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

import styles from './index.less';

/**
 * 图片去水印
 * @constructor
 */
const PictureWater = () => {


  /**
   * 图片url
   */
  let [imageUrl, setImageUrl] = useState<string>("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png");

  /**
   * base64
   */
  let [imageBase64, setImageBase64] = useState<string>("");

  /**
   * 控制是否显示
   */
  let [visible, setVisible] = useState<boolean>(false);



  // let [startX, setStartX] = useState<number>(0);
  // let [startY, setstartY] = useState<number>(0);
  // let [endX, setEndX] = useState<number>(0);
  // let [endY, setEndY] = useState<number>(0);

  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let context;



  /**
   * 获取图片base64
   * @param img
   * @param callback
   */
  const getBase64 = (img: Blob, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  /**
   * 预览图片获取链接
   * @param file
   */
  const getImageUrl = (file: any) => {
    const url = window.URL.createObjectURL(file);
    setImageUrl(url);
  };

  /**
   * 文件上传的自定义实现
   * @param selector
   */
  const uploadRequest = (selector: object) => {
    console.log(selector);
    getImageUrl(selector['file']);
    getBase64(selector['file'], base64 => {
      // console.log(base64);
      setImageBase64(base64);
      setVisible(true);
    });
  };

  const selectArea = () => {
    const imageBox = document.getElementById("image");
    const width = imageBox.style.width || imageBox.clientWidth || imageBox.offsetWidth || imageBox.scrollWidth;
    const height = imageBox.style.height || imageBox.clientHeight || imageBox.offsetHeight || imageBox.scrollHeight;
    console.log(width);
    console.log(height);
    let canvas = document.getElementById('canvas');
    // 设置画布宽度和高度
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.style.position = "absolute";
    canvas.style.display = "block";
    canvas.style.zIndex = 1;
    context = canvas.getContext('2d');
    // 绑定事件
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
  };

  const mouseDown = (event: MouseEvent) => {
    startX = event.offsetX;
    startY = event.offsetY;
    console.log("startX=" , startX, "startY=", startY);
  };

  const mouseUp = (event: MouseEvent) => {
    endX = event.offsetX;
    endY = event.offsetY;
    console.log("endX=" , endX, "endY=", endY);
    // 绘制矩形
    context.beginPath();
    context.globalAlpha = 0.5; // 透明度
    context.moveTo(startX, startY);
    context.lineTo(endX, startY);
    context.lineTo(endX, endY);
    context.lineTo(startX, endY);
    context.lineTo(startX, startY);
    context.fillStyle = 'white';
    context.strokeStyle = 'red';
    context.fill();
    context.stroke();
  };


  const renderTools = () => {
    return (
      <span>
        <Tooltip placement="top" title={"选择区域"}>
          <ExpandOutlined twoToneColor="#1890ff" style={{ cursor : "pointer", fontSize: '25px', color: '#1890ff' }} onClick={selectArea}/>
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip placement="top" title={"开始转换"}>
          <SwapOutlined twoToneColor="#1890ff" style={{ cursor : "pointer", fontSize: '25px', color: '#1890ff' }} />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip placement="top" title={"保存"}>
          <SaveOutlined twoToneColor="#1890ff" style={{ cursor : "pointer", fontSize: '25px', color: '#1890ff' }} />
        </Tooltip>
      </span>
    );
  };
  // icon 绑定上传事件

  return (
    <div style={{ background: "#eee" }}>

      {!visible &&
        <div className={styles['site-card-border-less-wrapper']}>
          <Card title={"文件上传"} bordered={false} style={{ width: '80%', margin: '0 auto' }}>
            <Dragger
              name={"上传文件"}
              customRequest={uploadRequest}
              showUploadList={false}
              multiple={false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或者拖拽文件到这里上传</p>
              <p className="ant-upload-hint">
                支持png,jpg,jpeg等多种图片格式
              </p>
            </Dragger>
          </Card>
        </div>
      }

      {visible &&
        <div className={styles['site-card-border-less-wrapper']}>
          <Card title={renderTools()} bordered={false} style={{ width: '80%', margin: '0 auto' }}>
            <canvas id="canvas" style={{display: 'none'}}></canvas>
            <Image
              id="image"
              style={{ margin: "0 auto"}}
              preview={false}
              src={imageUrl}
            />
          </Card>
        </div>
      }
    </div>
  );
};

export default PictureWater;
