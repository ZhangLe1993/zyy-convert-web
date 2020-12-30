import React, {useState, useRef, useEffect} from 'react';
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

  /**
   * 画框
   */
  let [divRectList, setDivRectList] = useState<Array<object>>([]);

  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let temp: any[] = [];


  const mouseDown = (event: MouseEvent) => {
    event.stopPropagation();
    startX = event.offsetX;
    startY = event.offsetY;
    // console.log("startX=" , startX, "startY=", startY);
  };

  const mouseUp = (event: MouseEvent) => {
    event.stopPropagation();
    endX = event.offsetX;
    endY = event.offsetY;
    // console.log("endX=" , endX, "endY=", endY);
    // 绘制矩形
    const left = startX;
    const top = startY;
    const width = endX - startX;
    const height = endY - startY;

    const list = [...temp];
    list.push({"left": left, "top": top, "width" : width, "height": height});
    temp = list;
    setDivRectList(temp);
  };

  const selectArea = () => {
    const imageBox = document.getElementById("image");
    if(imageBox == null) {
      message.warn("图片加载异常, 请刷新浏览器或者更换浏览器后重试");
      return;
    }
    const width = imageBox.style.width || imageBox.clientWidth || imageBox.offsetWidth || imageBox.scrollWidth;
    const height = imageBox.style.height || imageBox.clientHeight || imageBox.offsetHeight || imageBox.scrollHeight;
    console.log(width);
    console.log(height);
    const canvas = document.getElementById('canvas');
    if(canvas == null) {
      message.warn("画布渲染异常, 请刷新浏览器或者更换浏览器后重试");
      return;
    }
    // 设置画布宽度和高度
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.position = "absolute";
    canvas.style.display = "block";
    canvas.style.zIndex = "2";
    // 绑定事件
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
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
   * 获取图片base64
   * @param img
   * @param callback
   */
  const getBase64 = (img: Blob, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
    getImageUrl(img);
  };

  /**
   * 文件上传的自定义实现
   * @param selector
   */
  const uploadRequest = (selector: object) => {
    getBase64(selector['file'], base64 => {
      setImageBase64(base64);
      setVisible(true);
    });
  };

  const renderRect = () => {
    const res = divRectList.map((item, index) => {
      return (<div key={index} style={{position: "absolute",display: "block", zIndex: 3, border: "1px red solid", marginLeft: `${item['left']}px`, marginTop: `${item['top']}px`, width: `${item['width']}px`, height: `${item['height']}px`}}></div>);
    });
    return res;
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
            <div id="parent">
              <canvas id="canvas" style={{display: 'none'}}></canvas>
              {renderRect()}
              <Image
                id="image"
                style={{ margin: "0 auto", border: '1px #E8E8E8 solid'}}
                preview={false}
                src={imageUrl}
              />
            </div>
          </Card>
        </div>
      }
    </div>
  );
};

export default PictureWater;
