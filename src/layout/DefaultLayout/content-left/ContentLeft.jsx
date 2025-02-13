import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './ContentStyles.scss'






function ContentLeft({ image }) {
    const cx = classNames.bind(styles);


    return (
        <div className={cx('wrapper-left')}>

            <img src="https://lamarcabrasil.com/wp-content/uploads/2021/01/businessman-holding-chatbot-with-binary-code-message-data-scaled.jpg" alt="ảnh lỗi" />

        </div>
    )
}

export default ContentLeft
