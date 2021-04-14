import { Tooltip, Button, Modal, Image, Row, Col, Tag } from 'antd';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, {useState} from 'react';
import type { ConnectProps } from 'umi';
import { connect, SelectLang } from 'umi';
import type { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  theme?: ProSettings['navTheme'] | 'realDark';
} & Partial<ConnectProps> &
  Partial<ProSettings>;

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  let [visible, setVisible] = useState<boolean>(false);

  const onClick = () => {
    setVisible(true);
  };

  return (
    <div className={className}>
      <span style={{padding: '8px 12px'}}>
        <Button type="primary" shape="round" onClick={onClick}>
          捐助
        </Button>
        <Modal
          title="捐助"
          centered
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          width={1000}
        >
           <Row>
            <Col span={12}>
              <Image
                id="alipay"
                style={{ margin: "0 auto", border: '1px #E8E8E8 solid'}}
                preview={false}
                src={"../alipay.jpg"}
              />
            </Col>
            <Col span={12}>
              <Image
                id="weixin"
                style={{ margin: "0 auto", border: '1px #E8E8E8 solid'}}
                preview={false}
                src={'../weixin.png'}
              />
            </Col>
          </Row>
      </Modal>
      </span>
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
