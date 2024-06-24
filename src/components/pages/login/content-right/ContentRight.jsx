import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from "react-router-dom";
import styles from './ContentRightStyle.scss';
import { FaUser, FaEye, FaFacebook, FaGoogle } from "react-icons/fa";
import { GoEyeClosed } from "react-icons/go";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContentRight() {
    const cx = classNames.bind(styles)


    const [eyeShowPassWord, setEyeShowPassword] = useState(false);

    const [userAccount, setUserAccount] = useState({
        userName: '',
        password: ''
    })

    const [disabled, setDisabled] = useState(true);

    useEffect(() => {

        if (userAccount.userName != '' && userAccount.password != '') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [userAccount])



    const hanldeShowPassword = () => {

        setEyeShowPassword(!eyeShowPassWord);

    }

    const handleUserName = (event) => {
        const valueUserName = event.target.value;
        setUserAccount({ ...userAccount, "userName": valueUserName });
    }


    const handlePassword = (event) => {
        const valuePassword = event.target.value;
        setUserAccount({ ...userAccount, "password": valuePassword });
    }


    const handleLogin = () => {
        if (userAccount.userName === '' || userAccount.password === '') {
            toast.error('codeStudent/passsword not emty !')
        } else {

            toast.info("Welcome my website !");
        }

    }


    const eyeIcon = eyeShowPassWord ? <GoEyeClosed className={cx('icon-2')} /> : <FaEye className={cx('icon-2')} />;







    return (
        <div className={cx('wrapper-right')}>
            <div className={cx('form-login')}>
                <img className={cx('logo')} src="https://workdone.myxteam.com/img/logo-01.0958782f.png" alt="ảnh lỗi" />
                <h1>Đăng nhập</h1>

                <div className={cx('input-item')}>
                    <input className={cx('input-control')} onChange={handleUserName} type="text" name="" id="" placeholder='Mã sinh viên' />
                    <FaUser className={cx('icon-1')} />
                </div>
                <div className={cx('input-item')}>
                    <input
                        className={cx('input-control')}
                        type={eyeShowPassWord ? 'text' : 'password'}
                        placeholder='Mật khẩu'
                        onChange={handlePassword}

                    />
                    <button onClick={hanldeShowPassword} >{eyeIcon}</button>
                </div>

                <div className={cx('button-login')}>
                    <button
                        className={cx(

                            (disabled ? 'disabled-button' : 'button-form')

                        )}
                        onClick={handleLogin}
                        disabled={disabled}

                    >Đăng nhập</button>

                </div>

                <div className={cx('support-box')}>
                    <ul className={cx('support-item')}>
                        <li>Quên mật khẩu ?</li>
                        <li><Link className={cx('sign-in')} to="/signup">Đăng ký</Link></li>
                    </ul>
                </div>

                <div className={cx('policy-box')}>
                    <ul className={cx('policy-item')}>
                        <li>Điền khoản dịch vụ</li>
                        <li>Chính sách bảo mật</li>
                    </ul>
                </div>

                <div className={cx('button-boxes')}>
                    <div className={cx('button-login-social')}>
                        <button className={cx('facebook')}><FaFacebook className={cx('logo-facebook')} /> <p className={cx('name-item')} >Facebook</p></button>
                    </div>
                    <div className={cx('button-login-social')}>
                        <button className={cx('google')}><FaGoogle className={cx('logo-google')} /> <p className={cx('name-item')}>Google</p></button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default ContentRight

