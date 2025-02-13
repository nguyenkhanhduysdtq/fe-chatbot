import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link, useNavigate } from "react-router-dom";
import styles from './ContentRightStyle.scss';
import { FaUser, FaEye, FaFacebook, FaGoogle } from "react-icons/fa";
import { GoEyeClosed } from "react-icons/go";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContentRight() {
    const cx = classNames.bind(styles)

    const navigate = useNavigate();


    const [eyeShowPassWord, setEyeShowPassword] = useState(false);

    const [userAccount, setUserAccount] = useState({
        userName: '',
        password: ''
    })

    const [disabled, setDisabled] = useState(true);

    useEffect(() => {

        if (userAccount.userName !== '' && userAccount.password !== '') {
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


    const handleLogin = async () => {


        try {
            const response = await fetch('http://localhost:8081/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userAccount.userName,
                    password: userAccount.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Đăng nhập thành công!');

                // Chuyển hướng sang trang admin
                localStorage.setItem('token', data.result.token);
                localStorage.setItem('refreshToken', data.result.refreshToken);

                window.location.href = '/admin';
                // navigate("/admin");
            } else {
                toast.error('Đăng nhập thất bại!');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
        }
    }


    const eyeIcon = eyeShowPassWord ? <GoEyeClosed className={cx('icon-2')} /> : <FaEye className={cx('icon-2')} />;






    return (
        <div className={cx('wrapper-right')}>
            <div className={cx('form-login')}>
                <img className={cx('logo')} src="https://tse1.mm.bing.net/th?id=OIP.bK_Xs3Gt5Roh0xbfIumJHAHaFj&pid=Api&P=0&h=220" alt="ảnh lỗi" />
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
                    <button className={cx('bt-i')} onClick={hanldeShowPassword}>{eyeIcon}</button>
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


            </div>
            <ToastContainer />
        </div >
    )
}

export default ContentRight

