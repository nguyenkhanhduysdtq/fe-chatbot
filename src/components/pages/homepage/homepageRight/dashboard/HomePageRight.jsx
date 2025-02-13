import styles from "../dashboard/styles.scss"
import React from 'react';
import classNames from 'classnames';

function HomepageRight() {


    const cx = classNames.bind(styles);


    return (

        <div className={cx('content')}>
            <h3>Dashboard</h3>
            <p>Xin chào admin: <strong>Nguyễn Khánh Duy</strong></p>
            <p>Chào mừng đến với giao diện admin, quản lý sử lý Document cho hệ thống chatbot ! </p>
        </div>


    )

}

export default HomepageRight