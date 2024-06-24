import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './ContentRightSignup.scss';
import { MdOutgoingMail } from "react-icons/md";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let valueId = '';

function ContentRightSignup() {
    const cx = classNames.bind(styles)




    const [isCheck, setIsCheck] = useState(false);

    const [idCard, setIdCard] = useState('');

    const handleCheckBox = () => {
        setIsCheck(!isCheck);
    }

    const handleIdCard = (event) => {
        valueId = event.target.value;
    }


    const [duy, setduy] = useState('');



    const handleRegister = () => {
        if (isCheck) {
            toast.success('approve success !')
            console.log(valueId);
            setIdCard(valueId);
        } else {
            toast.error('You not accept plicy !')
        }
    }


    return (
        <div className={cx('wrapper-right')}>
            <div className={cx('form-login')}>
                <img className={cx('logo')} src="https://workdone.myxteam.com/img/logo-01.0958782f.png" alt="ảnh lỗi" />
                <h1>Đăng ký tài khoản teamWork </h1>

                {/* <button className={cx('bt-eamil')}> <p>Xác Thực bằng email</p>  <MdOutgoingMail className={cx('icon-email')} /></button> */}

                <div className={cx('input-item')}>
                    <input className={cx(
                        (idCard.length < 5 || idCard === '' ? 'input-control-signup' : 'const-input')

                    )}
                        type="email"
                        id="" onChange={handleIdCard}
                        placeholder='Nhập ID CARD'
                        readOnly={idCard.length > 5}

                    />
                </div>


                {idCard.length > 5 ?
                    <div>
                        <div className={cx('input-item')}>
                            <input className={cx('input-control-signup')} type="email" id="" placeholder='Nhập mật khẩu' />

                        </div>

                        <div className={cx('input-item')}>
                            <input className={cx('input-control-signup')} type="email" id="" placeholder=' Họ tên ' />
                        </div>

                        <div className={cx('input-item')}>
                            <input className={cx('input-control-signup')} type="email" id="" placeholder=' Mã sinh viên ' />
                        </div>
                    </div>

                    : null}







                <div className={cx('contaner-policy')}>

                    <input type="checkbox" id='input-checkPolicy' checked={isCheck} onChange={handleCheckBox} className={cx('cl-input-checkPolicy')} />
                    <label htmlFor='input-checkPolicy' className={cx('label-policy')} >Bạn đồng ý với các <a className={cx('title-service')} href="/">Điều khoản dịch vụ</a> và bạn đã đọc <a className={cx('title-service')} href="/">Chính sách bảo mật</a> của chúng tôi !</label>

                </div>

                <div className={cx('button-login')}>
                    <button className={cx('button-form')} onClick={handleRegister}>Xác nhận</button>
                </div>


                <div className={cx('policy-box')}>
                    <ul className={cx('policy-item')}>
                        <li>Đã có tài khoản? <Link className={cx('title-login')} to={'/'}>Đăng nhập</Link></li>
                    </ul>
                </div>


            </div>
            <ToastContainer />
        </div>
    )
}

export default ContentRightSignup

