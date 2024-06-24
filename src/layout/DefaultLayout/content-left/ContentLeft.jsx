import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './ContentStyles.scss'


import PropTypes from 'prop-types'


ContentLeft.propTypes = {
    image: PropTypes.array,
}

ContentLeft.defaultProps = {
    image: [],
}



function ContentLeft({ image }) {
    const cx = classNames.bind(styles);

    const [currentIndex, setcurrentIndex] = useState(0);

    console.log(currentIndex);

    // useEffect(() => {
    //     setInterval(() => {
    //         if (currentIndex <= image.length) {
    //             setcurrentIndex(prevIndex => prevIndex + 1)
    //         } else {
    //             setcurrentIndex(0);
    //         }
    //     }, 2500)

    // }, [])






    return (
        <div className={cx('wrapper-left')}>

            <img src={image[0]} alt="ảnh lỗi" />

        </div>
    )
}

export default ContentLeft
