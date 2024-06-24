import React from 'react';
import classNames from 'classnames';
import styles from './DefaultLayout.scss';
import ContentLeft from './content-left/ContentLeft';


function DefaultLayout({ children }) {
    const cx = classNames.bind(styles)


    const image = [
        'https://img4.thuthuatphanmem.vn/uploads/2020/12/26/anh-lam-viec-nhom-hoat-hinh_034515233.jpg',
        'https://thuthuatnhanh.com/wp-content/uploads/2021/06/Hinh-anh-lam-viec-nhom-hieu-qua-nhat.jpg',
        'https://thuthuatnhanh.com/wp-content/uploads/2021/06/hinh-anh-lam-viec-nhom.jpg'

    ]

    return (

        <div className={cx('wrapper')}>

            <ContentLeft image={image} />
           
            {children}

        </div>

    )
}

export default DefaultLayout
