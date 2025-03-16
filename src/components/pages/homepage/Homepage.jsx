import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link, useRouteLoaderData } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomepageLeft from '../homepage/homepageLeft/HomepageLeft'
import HomepageRight from '../homepage/homepageRight/dashboard/HomePageRight'
import Document from '../homepage/homepageRight/document/Document'
import Store from '../homepage/homepageRight/store/Store'
import styles from '../homepage/homepageStyle.scss';
import axios from 'axios';
import InformationClient from './homepageRight/information/InformationClient';


function Homepage() {

    const cx = classNames.bind(styles);

    const [selectedPage, setSelectedPage] = useState("dashboard");


    // Hàm xử lý khi click vào các mục bên trái
    const handleSelectPage = (page) => {
        setSelectedPage(page);
    };

    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null); // Lưu thông tin người dùng

    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null); // Trạng thái lỗi


    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            const response = await axios.post('http://localhost:8081/api/refresh', { refreshToken: refreshToken });
            const newToken = response.data.result.token;

            // Cập nhật token mới vào localStorage
            localStorage.setItem("token", newToken);
            return newToken;
        } catch (err) {
            console.error("Làm mới token thất bại:", err);
            setError("Token đã hết hạn. Vui lòng đăng nhập lại.");
            return null;
        }
    };

    // Hàm gọi API với token
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:8081/api/infor', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.result.fullName);
            setLoading(false);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Token hết hạn, làm mới token
                const newToken = await refreshAccessToken();
                if (newToken) {
                    // Thử lại request với token mới
                    return fetchUserData();
                }
            } else {
                setError("Có lỗi xảy ra khi lấy thông tin người dùng.");
                setLoading(false);
            }
        }
    };

    // gọi lại lấy ìnofr
    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div>
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">Chatbot manage</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="#login">{user}</a>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className={cx("wrapper-content")}>
                <HomepageLeft onSelectPage={handleSelectPage}></HomepageLeft>
                <div className={cx("right-content")}>
                    {selectedPage === 'dashboard' && <HomepageRight />}
                    {selectedPage === 'document' && <Document />}
                    {selectedPage === 'store' && <Store />}
                    {selectedPage === 'infor' && <InformationClient />}
                </div>
            </div>

        </div>

    )

}

export default Homepage