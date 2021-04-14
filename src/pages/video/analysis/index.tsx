import React, {useState, useRef, useEffect} from 'react';
import {Input, Upload, Select, Card, Divider, Image, message, notification, Tooltip, Button} from 'antd';
import { InboxOutlined, SwapOutlined, YoutubeOutlined, ExpandOutlined, SaveOutlined } from '@ant-design/icons';

import {  Player,
          ControlBar,
          PlayToggle, // PlayToggle 播放/暂停按钮 若需禁止加 disabled
          ReplayControl, // 后退按钮
          ForwardControl,  // 前进按钮
          CurrentTimeDisplay,
          TimeDivider,
          PlaybackRateMenuButton,  // 倍速播放选项
          VolumeMenuButton } from 'video-react';
import "../../../../node_modules/video-react/dist/video-react.css";

const { Option } = Select;

const { Search } = Input;

import { videoAnalysis } from "@/services/video";
import { AnalysisParam, openNotificationWithIcon } from "@/pages/video/analysis/entity";


/**
 * 视频二次解析接口
 * @constructor
 */
const VideoAnalysis = () => {

  let [path, setPath] = useState<string>("");

  let [cover, setCover] = useState<string>("");

  let player = useRef(null);

  let [visible, setVisible] = useState<boolean>(false);

  const analysis = (input: string) => {
    // "5.1 GV:/ 一出场就给人一种江南的感觉%刘亦菲 %精彩片段 %歌曲红马  https://v.douyin.com/e614JkV/ 腹制佌lian接，打开Dou音搜索，直接观kan视頻！"
    const params: AnalysisParam = { text: input, code: "douYin" };
    videoAnalysis(params).then(res => {
      if(res === undefined || res === null || res === '' || res.vid === undefined || res.vid === null || res.vid === '') {
        openNotificationWithIcon('error', '通知', "系统异常");
        return;
      }
      openNotificationWithIcon('success', '通知', "解析成功");
      // eslint-disable-next-line no-restricted-globals
      setPath(`${ location.origin  }/api/video/play/${res.vid}`);
      setCover(res.cover);
      setVisible(true);
    });
  };

  const onSearch = (value: any) => {
    if(value === undefined || value === null || value === "" || value.length === 0) {
      openNotificationWithIcon('warning', '通知', "请输入提取码或链接");
      return;
    }
    setVisible(false);
    setPath("");
    setCover("");
    analysis(value);
  };

  const renderTools = () => {
    return (
      <Input.Group compact>
        <Select size="large" defaultValue="douYin" style={{ width: '100px' }}>
          <Option value="douYin">抖音</Option>
        </Select>
        <Search placeholder="请输入提取码或链接" onSearch={onSearch} size="large" enterButton style={{ width: '500px' }}/>
      </Input.Group>
    );
  };

  return (
    <div style={{ background: "#eee" }}>
      <Card title={renderTools()} bordered={false} style={{ width: '80%', minHeight: '600px',margin: '0 auto' }}>
        {visible &&
          <Player
            ref={player}
            poster={cover}
          >
            <source
              src={path}
            />
            <ControlBar autoHide={false} disableDefaultControls={false}>
              <ReplayControl seconds={10} order={1.1} />
              <ForwardControl seconds={30} order={1.2} />
              <PlayToggle />
              <CurrentTimeDisplay order={4.1} />
              <TimeDivider order={4.2} />
              <PlaybackRateMenuButton rates={[5, 2, 1.5, 1, 0.5]} order={7.1} />
              <VolumeMenuButton />
            </ControlBar>
          </Player>
        }
      </Card>
    </div>
  );
};

export default VideoAnalysis;
