import { LoadingOutlined } from '@ant-design/icons';
import {
  Spin,
  Modal,
  Typography,
  Col,
  Divider,
  QRCode,
  Row,
  Space,
  message,
} from 'antd';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LotteriaLogo from '@/assets/lotteria_logo.svg';
import MomoImage from '@/assets/Logo MoMo.svg';
import DomesticCardImage from '@/assets/Logo VietinBank .svg';
import ZaloPayImage from '@/assets/Logo ZaloPay.svg';
import ShopeePayImage from '@/assets/Logo ShopeePay.svg';
import { useAppSelector } from '@/store';
import axiosInstance from '@/axios/axios';
import { handleMoney } from '@/shared/Utils';
// import ticketApi from '../../../api/ticketApi';

const leftStyle = {
  padding: '0 1rem',
  display: 'flex',
  flexDirection: 'column',
};

const imageStyle = {
  height: '40px',
  width: '40px',
};

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const sucessfulPaidNavigateContent = (
  <>
    <Typography.Text>
      Bạn đã thanh toán thành công. Đang chuyển hướng về trang danh sách hóa đơn
      của bạn
    </Typography.Text>
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <Spin indicator={antIcon} />
    </div>
  </>
);
const failedPaidNavigateContent = (
  <>
    <Typography.Text>Mã QR đã hết hạn. Hóa đơn đã bị hủy</Typography.Text>
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <Spin indicator={antIcon} />
    </div>
  </>
);

let invalid = false;

type Bill = {
  billId: number;
  paymentMethod: 'VietinBank' | 'MoMo' | 'ZaloPay' | 'ShopeePay';
  totalPrice: number;
  status: 'Đã Thanh Toán' | 'Chờ Thanh Toán' | 'Đã Hủy';
};

const QRScan = () => {
  const afterFiveMinutesFromNow = new Date().getTime() + 300000;
  const [isPaid, setIsPaid] = useState(false);
  const [minutes, setMinutes] = useState('01');
  const [seconds, setSeconds] = useState('00');
  const [invalidateTime, setInvalidateTime] = useState(false);
  const [bill, setBill] = useState<Bill | null>(null);
  const { billId } = useParams();
  const qrStatus = invalid || !isPaid ? 'active' : 'expired';

  useEffect(() => {
    async function fetchBillStatus(billId: number) {
      const response = await axiosInstance.get(`/bills/${billId}`);
      const data = response.data as Bill;
      setBill(data);
    }

    if (billId) {
      void fetchBillStatus(parseInt(billId));
    }
  }, [billId]);

  const paymentMethod = bill?.paymentMethod;

  const cardObj = { cardImage: '', cardText: '', cardColor: '' };
  switch (paymentMethod) {
    case 'VietinBank':
      cardObj.cardImage = DomesticCardImage;
      cardObj.cardText = 'ATM ngân hàng nội địa';
      cardObj.cardColor = '#13c2c2';
      break;
    case 'MoMo':
      cardObj.cardImage = MomoImage;
      cardObj.cardText = 'MoMo';
      cardObj.cardColor = '#c41d7f';
      break;
    case 'ZaloPay':
      cardObj.cardImage = ZaloPayImage;
      cardObj.cardText = 'ZaloPay';
      cardObj.cardColor = '#1677ff';
      break;
    case 'ShopeePay':
      cardObj.cardImage = ShopeePayImage;
      cardObj.cardText = 'Shopee Pay';
      cardObj.cardColor = '#d4380d';
      break;
    default:
      break;
  }

  const countDown = useCallback(() => {
    if (isPaid) {
      return;
    }
    if (invalidateTime) {
      return;
    }
    const now = new Date().getTime();
    const second = 1000;
    const minute = second * 60;
    const gap = afterFiveMinutesFromNow - now;
    let textMinute = Math.floor(gap / minute);
    textMinute = textMinute >= 10 ? textMinute : '0' + textMinute;

    let textSecond = Math.floor((gap % minute) / second);
    textSecond = textSecond >= 10 ? textSecond : '0' + textSecond;
    if (Number(textMinute) < 0 && Number(textSecond) < 0) return;
    setMinutes(textMinute.toString());
    setSeconds(textSecond.toString());
  }, [isPaid, invalidateTime]);

  useEffect(() => {
    const timeInterval = setInterval(countDown, 1000, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [countDown]);

  const fetchBillStatus = async (id: number) => {
    const response = await axiosInstance.get(`/bills/${id}`);
    const data = response.data as Bill;
    console.log('new data: ', data);

    const status = data.status;
    if (status === 'Đang Chờ Duyệt') setIsPaid(true);
  };

  useEffect(() => {
    if (!isPaid) {
      if (billId) {
        const intervalId = setInterval(
          fetchBillStatus.bind(null, parseInt(billId)),
          3000,
        );
        return () => clearInterval(intervalId);
      }
    }
  }, [isPaid, billId]);

  let temp;
  if (parseInt(minutes) <= 0 && parseInt(seconds) <= 0) {
    temp = '00:00';
    invalid = true;
  } else {
    temp = `${minutes}:${seconds}`;
  }

  // Thông báo
  const navigate = useNavigate();

  if (isPaid) {
    invalid = false;
    void message.success(sucessfulPaidNavigateContent, 4, () => {
      navigate('/account/history', { replace: true });
    });
  }

  useEffect(() => {
    if (invalid) {
      setInvalidateTime(true);
      void message.error(failedPaidNavigateContent, 3, () => {
        invalid = false;

        axiosInstance
          .get('/bills/cancel', { params: { billId: billId } })
          .then((res) => {
            console.log('res navigate: ', res);

            navigate(`/`, { replace: true });
          })
          .catch((error) => console.log('error: ', error));
      });
    }
  }, [invalid, navigate, bill]);

  // khi user ấn nút quay lại, hoặc chuyển đi trang khác khi mà chưa thanh toán xong :
  const onOkHandler = () => {
    // setInvalidateTime(true);
    // your logic
    invalid = false;
    axiosInstance
      .get('/bills/cancel', { params: { billId: billId } })
      .then((res) => {
        console.log('res navigate: ', res);
        navigate(`/`, { replace: true });
      })
      .catch((error) => console.log('error: ', error));
  };
  const onCancelHandler = () => {
    window.history.pushState(null, null, window.location.pathname);

    invalid = false;
    // setInvalidateTime(false);
  };
  const onBackButtonEvent = (e) => {
    e.preventDefault();
    if (!invalidateTime) {
      Modal.warning({
        title: 'Bạn có chắc là muốn rồi đi ? ',
        content:
          'Sau khi rời đi thì hóa đơn sẽ lập tức bị hủy. Bạn có chắc chắn ?',
        onOk: onOkHandler,
        onCancel: onCancelHandler,
        okCancel: true,
        okButtonProps: { className: 'blue-button' },
      });
    }
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fffcfe]">
      <Row
        style={{
          margin: '2rem auto 0',
          border: '1px solid #ddd',
          borderRadius: '10px',
          maxWidth: '750px',
        }}
        className="shadow"
      >
        <Col span={8} flex={'auto'}>
          <Row>
            <Col span={24} flex={'auto'}>
              <Space
                direction="vertical"
                style={{
                  display: 'flex',
                  background: cardObj.cardColor,
                  color: '#fff',
                  borderTopLeftRadius: '10px',
                  borderBottomLeftRadius: '10px',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    ...leftStyle,
                    padding: '1.5rem 0 1rem .7rem',
                    borderBottom: '1px solid #aaa',
                  }}
                  className="grow"
                >
                  <Typography.Text
                    type="secondary"
                    style={{ color: '#fff', fontSize: '1.1rem' }}
                  >
                    Đơn hàng hết hạn sau
                  </Typography.Text>
                  <Typography.Text
                    style={{ fontSize: '1.5rem', color: '#fff' }}
                  >
                    {temp}
                  </Typography.Text>
                </div>
                <div style={{ ...leftStyle, padding: '2rem 0 2rem .7rem' }}>
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: '0.8rem',
                      color: '#ddd',
                    }}
                  >
                    Nhà cung cấp
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      color: '#fff',
                      fontSize: '1.2rem',
                    }}
                  >
                    Lotteria
                  </Typography.Text>
                </div>
                <hr />
                <div style={{ ...leftStyle, padding: '2rem 0 2rem .7rem' }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: '0.8rem', color: '#ddd' }}
                  >
                    Số tiền
                  </Typography.Text>
                  <Typography.Text
                    style={{ color: '#fff', fontSize: '1.2rem' }}
                  >
                    {bill && handleMoney(bill.totalPrice)} VND
                  </Typography.Text>
                </div>
                <hr />
                <div
                  style={{
                    ...leftStyle,
                    padding: '2.5rem 0 3rem .7rem',
                    color: '#fff',
                    fontSize: '0.8rem',
                  }}
                >
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: '0.8rem', color: '#ddd' }}
                  >
                    Đơn hàng
                  </Typography.Text>
                  <Typography.Text
                    style={{ color: '#fff', fontSize: '1.2rem' }}
                  >
                    {billId}
                  </Typography.Text>
                </div>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={16} flex={'auto'} style={{ padding: '1rem' }}>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <img src={LotteriaLogo} className="h-10" alt="CGV Icon" />
              </div>
              <div>
                <img src={cardObj.cardImage} className="w-20" alt="MoMo Icon" />
              </div>
            </div>
            <Divider />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography.Title level={3} style={{ marginBottom: '2rem' }}>
                Quét mã để thanh toán
              </Typography.Title>
              {bill && (
                <QRCode
                  value={`http://192.168.1.11:8080/api/bills/paid/${bill.billId}?qr_path=http://192.168.1.11:8080/api/bills/paid/${bill.billId}`}
                  status={qrStatus ? 'active' : 'expired'}
                />
              )}
              <div
                className="mb-2"
                style={{ width: '130px', marginTop: '35px' }}
              >
                <Spin tip="Đang đợi quét mã">
                  <div className="content" />
                </Spin>
              </div>
              <Typography.Paragraph style={{ marginTop: '1.5rem' }}>
                Sử dụng App{' '}
                <Typography.Text strong>{cardObj.cardText}</Typography.Text>{' '}
                hoặc <br />
                ứng dụng Camera hỗ trợ QR code để quét mã
              </Typography.Paragraph>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default QRScan;
