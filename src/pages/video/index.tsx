import React, {useState, useRef, useEffect} from 'react';
import { Tooltip, Upload, Button, Card, Divider, Image, message, notification } from 'antd';
import { InboxOutlined, SwapOutlined, UploadOutlined, ExpandOutlined, SaveOutlined, YoutubeOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

import styles from './index.less';
import {deLogoPictureWater} from "@/services/video";
import {accDiv, DeLogo, DeLogoPictureWaterParamsType, openNotificationWithIcon, guid} from "@/pages/video/entity";

/**
 * 视频去水印
 * @constructor
 */
const VideoWater = () => {


  /**
   * 图片url
   */
  let [imageUrl, setImageUrl] = useState<string>("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png");

  /**
   * base64
   */
  let [imageBase64, setImageBase64] = useState<string>("");

  let [fileType, setFileType] = useState<string>("jpg");

  /**
   * 控制是否显示
   */
  let [visible, setVisible] = useState<boolean>(false);


  let [selectVisible, setSelectVisible] = useState<boolean>(false);

  let [transferVisible, setTransferVisible] = useState<boolean>(false);

  let [saveVisible, setSaveVisible] = useState<boolean>(false);


  let [waitSaveImageBase64, setWaitSaveImageBase64] = useState<string>("");

  /**
   * 画框
   */
  let [divRectList, setDivRectList] = useState<Array<object>>([]);

  let [actualWidth, setActualWidth] = useState<number>(0);

  let [actualHeight, setActualHeight] = useState<number>(0);

  let [widthRate, setWidthRate] = useState<number>(0);

  let [heightRate, setHeightRate] = useState<number>(0);

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

  /**
   * 鼠标移动过程中
   * @param event
   */
  const mouseMove = (event: MouseEvent) => {
    // TODO 实现拖动过程中的动态样式, 应该绑定在鼠标按下之后
    event.stopPropagation();
    /*const currentX = event.offsetX;
    const currentY = event.offsetY;
    console.log(currentX, currentY);*/
  };

  const selectArea = () => {
    const imageBox = document.getElementById("image");
    if(imageBox == null) {
      openNotificationWithIcon('warning', '通知', "图片加载异常, 请刷新浏览器或者更换浏览器后重试");
      return;
    }
    const width = imageBox.style.width || imageBox.clientWidth || imageBox.offsetWidth || imageBox.scrollWidth;
    const height = imageBox.style.height || imageBox.clientHeight || imageBox.offsetHeight || imageBox.scrollHeight;
    console.log(`图片显示宽度=${  width}, 高度=${  height}`);
    console.log(`图片真实宽度=${actualWidth  }，高度=${  actualHeight}`);
    const xRate = accDiv(width, actualWidth);
    setWidthRate(xRate);
    const yRate = accDiv(height, actualHeight);
    setHeightRate(yRate);
    console.log(`xRate=${xRate}`);
    console.log(`yRate=${yRate}`);

    const drawPaper = document.getElementById("drawPaper");
    if(drawPaper == null) {
      openNotificationWithIcon('warning', '通知', "画布渲染异常, 请刷新浏览器或者更换浏览器后重试");
      return;
    }
    const canvas = document.getElementById('canvas');
    if(canvas == null) {
      openNotificationWithIcon('warning', '通知', "画布渲染异常, 请刷新浏览器或者更换浏览器后重试");
      return;
    }

    // 设置画布宽度和高度
    drawPaper.style.width = `${width}px`;
    drawPaper.style.height = `${height}px`;
    drawPaper.style.position = "absolute";
    drawPaper.style.display = "block";
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.position = "absolute";
    canvas.style.display = "block";
    canvas.style.zIndex = "2";
    // 绑定事件
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    canvas.onmousemove= mouseMove;
    setSelectVisible(false);
    setTransferVisible(true);
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
      console.log(selector);
      const arr: string[] = selector['file'].type.split("/");
      setFileType(arr[1]);
      setVisible(true);
      setSelectVisible(true);
      // 加载图片获取图片真实宽度和高度
      const image = document.createElement("img");
      image.src = base64;
      image.onload = () => {
        const {width} = image;
        const {height} = image;
        setActualWidth(width);
        setActualHeight(height);
      };
    });
  };

  // a/b=c  === a/c=b

  /**
   * 去水印
   */
  const doDeLogo = () => {
    if(divRectList.length === 0) {
      openNotificationWithIcon('warning', '通知', "没有选择要去水印的区域....");
      return;
    }
    const arrays: DeLogo[] = divRectList.map((item, index) => {
      const obj: DeLogo = {x: 0, y: 0, width: 0, height: 0};
      obj.x = accDiv(item['left'], widthRate);
      obj.y = accDiv(item['top'], heightRate);
      obj.width = accDiv(item['width'], widthRate);
      obj.height = accDiv(item['height'], heightRate);
      return obj;
    });
    const params: DeLogoPictureWaterParamsType = {base64: imageBase64.replace(/^data:image\/\w+;base64,/, ""), type: fileType, list: arrays};
    console.log(params);
    deLogoPictureWater(params).then(res => {
      console.log(res);
      if(res === undefined || res === null || res === '') {
        openNotificationWithIcon('error', '通知', "系统异常");
        return;
      }
      if(!res.success) {
        openNotificationWithIcon('warning', '通知', "转换异常");
        return;
      }
      openNotificationWithIcon('success', '通知', "转换成功， 可保存到本地");
      setSaveVisible(true);
      setWaitSaveImageBase64(res.base64);
    });
  };

  /**
   * 保存图片
   */
  const doSave = () => {
    if(waitSaveImageBase64 === undefined || waitSaveImageBase64 === null || waitSaveImageBase64 === '') {
      openNotificationWithIcon('warning', '通知', "没有待保存的文件");
      return;
    }
    const byteString = atob(waitSaveImageBase64);
    let n: number = byteString.length;
    const unit8Array = new Uint8Array(n);
    while (n--) {
      unit8Array[n] = byteString.charCodeAt(n);
    }
    const blob = new Blob([unit8Array], { type: fileType });

    const url = URL.createObjectURL(blob);
    //
    const element = document.createElement("a");
    element.setAttribute("href", url);
    element.setAttribute("download", `${guid()}.${ fileType}`);
    element.setAttribute("target","_blank");
    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    element.dispatchEvent(clickEvent);
  };



  const renderRect = () => {
    const res = divRectList.map((item, index) => {
      return (<div key={index} style={{position: "absolute",display: "block !important", zIndex: 3, border: "1px red solid", marginLeft: `${item['left']}px`, marginTop: `${item['top']}px`, width: `${item['width']}px`, height: `${item['height']}px`}}></div>);
    });
    return res;
  };

  const renderTools = () => {
    return (
      <span>
        <VideoCameraOutlined />
        {selectVisible &&
        <Tooltip placement="top" title={"选择区域"}>
          <Button type="primary" shape="round" style={{ cursor : "pointer" }} icon={<ExpandOutlined />} size="default"  onClick={selectArea}>选择区域</Button>
        </Tooltip>
        }
        {
          transferVisible &&
          <Tooltip placement="top" title={"开始去水印"}>
          <Button type="primary" shape="round" style={{ cursor : "pointer" }} icon={<SwapOutlined />} size="default"  onClick={doDeLogo}>开始去水印</Button>
          </Tooltip>
        }
        {
          saveVisible &&
            <span>
              <Divider type="vertical" />
              <Tooltip placement="top" title={"保存到本地"}>
                <Button type="primary" shape="round" style={{ cursor : "pointer" }} icon={<SaveOutlined />} size="default"  onClick={doSave}>保存到本地</Button>
              </Tooltip>
            </span>
        }
      </span>
    );
  };
  // icon 绑定上传事件

  return (
    <div style={{ background: "#eee" }}>

      {!visible &&
        <div className={styles['site-card-border-less-wrapper']}>
          <Card title={"视频上传"} bordered={false} style={{ width: '80%', margin: '0 auto' }}>
            <Dragger
              name={"上传视频"}
              customRequest={uploadRequest}
              showUploadList={false}
              multiple={false}
              accept="video/*"
            >
              <p className="ant-upload-drag-icon">
                <YoutubeOutlined />
              </p>
              <p className="ant-upload-text">点击或者拖拽视频到这里上传</p>
              <p className="ant-upload-hint">
                支持 mp4,flv,rmvb,avi,mkv 等多种视频格式
              </p>
            </Dragger>
          </Card>
        </div>
      }

      {visible &&
        <div className={styles['site-card-border-less-wrapper']}>
          <Card title={renderTools()} bordered={false} style={{ width: '80%', margin: '0 auto' }}>
            <div id="parent" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div id="drawPaper" style={{display: 'none' }}>
                <canvas id="canvas" style={{display: 'none'}}></canvas>
                {renderRect()}
              </div>
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

export default VideoWater;
