import React, { useEffect, useState } from 'react';
import styles from "../information/styles.scss";
import classNames from 'classnames';
import axios from 'axios';
import { FaFileExport } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';

function InformationClient() {
    const cx = classNames.bind(styles);
    const [selectedUser, setSelectedUser] = useState(false);
    const [question, setQuestion] = useState([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);


    const getColor = (questions) => {
        if (questions > 10) return "green";
        if (questions >= 5 && questions <= 10) return "#FFCC00";
        return "red";
    };

    const [clients, setClients] = useState([]);

    // Lấy danh sách tài liệu từ API
    const fetchDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/clients');
            setClients(response.data.result);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tài liệu:', error);
        }
    };

    // Gọi API khi component được render lần đầu
    useEffect(() => {
        fetchDocuments();
    }, []);


    const toggleOverlay = async (id) => {
        setSelectedUser(true);

        try {
            const questionData = await axios.get(`http://localhost:8081/api/questions?id=${encodeURIComponent(id)}`);

            console.log(questionData.data.result)

            setQuestion(questionData.data.result);
        } catch (error) {
            console.log(error);
        }

    };


    const handleExport = async () => {
        setProgress(0);
        setLoading(true);

        try {
            let fakeProgress = 0;
            const interval = setInterval(() => {
                fakeProgress += 10; // Mỗi 500ms tăng 10%
                setProgress(fakeProgress);
                if (fakeProgress >= 90) clearInterval(interval);
            }, 100);

            await axios.get('http://localhost:8081/api/export/questions');

            setProgress(100); // Hoàn thành
            toast.success("In thông tin thành công!");
            clearInterval(interval);



        } catch (error) {
            console.log(error);
            toast.error("lỗi !");
        } finally {
            setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 1000);
        }
    };

    return (
        <div className="container1">

            <h2 className="title">Statistics information</h2>
            {loading && (
                <div style={{ width: "100%", background: "#ddd", borderRadius: "5px", marginTop: "10px" }}>
                    <div style={{
                        width: `${progress}%`,
                        background: "#4caf50",
                        height: "8px",
                        borderRadius: "5px",
                        transition: "width 0.3s ease"
                    }}></div>
                    <p style={{ textAlign: "center", marginTop: "5px" }}>{progress}%</p>
                </div>
            )}

            <button onClick={handleExport} className={cx('export')}><FaFileExport /> In danh sach câu hỏi</button>
            <div className="table-container1">
                <table>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>PHONE</th>
                            <th className={cx('question')} >QUESTION NUMBER</th>
                            <th>SHOW DETAIL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>0{user.phone}</td>
                                <td className={cx('question')} >
                                    <button style={{ backgroundColor: getColor(user.numberQuestion), fontWeight: "bold", fontSize: "18px", width: "50px", color: "white", border: "none" }}>
                                        {user.numberQuestion}</button>
                                </td>
                                <td>
                                    <button value={user.id} className="detail-question" onClick={() => toggleOverlay(user.id)}>
                                        Xem Chi Tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <div className="overlay" onClick={() => setSelectedUser(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Chi Tiết Câu Hỏi</h3>
                        <table className="question-table">
                            <thead>
                                <tr>
                                    <th>Ngày gửi câu hỏi</th>
                                    <th>Thời gian</th>
                                    <th>Câu Hỏi</th>
                                    <th>Chatbot trả Lời</th>
                                </tr>
                            </thead>
                            <tbody>
                                {question.map((data) => (
                                    <tr key={data.id}>
                                        <td>{data.date}</td>
                                        <td>{data.time}</td>
                                        <td>{data.question}</td>
                                        <td>{data.answer}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="close-button" onClick={() => setSelectedUser(false)}>Đóng</button>
                    </div>

                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default InformationClient;
