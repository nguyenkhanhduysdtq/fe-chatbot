import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import "./stylesChat.scss"; // Import file CSS
import logo from "../Dewi-1.0.0/assets/img/logo.png";
import chatbot from "../Dewi-1.0.0/assets/img/chatbot.avif";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaBars } from "react-icons/fa"; // Import icon ba gạch
import { IoArrowForwardOutline } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";
import axios from "axios";


export default function ChatPage() {
    const [messages, setMessages] = useState([
        { id: 1, type: "form", sender: "bot" } // Tin nhắn đầu tiên là form
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "", phone: "", email: "" });
    const [hoverText, setHoverText] = useState("");
    const [hoverTextutill, setHoverTextutill] = useState("");


    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const newMessage = {
            id: messages.length + 1,
            text: input,
            sender: "user",
            timestamp: new Date(),
        };
        setMessages([...messages, newMessage]);

        setIsLoading(true);

        let botReplyText = "";

        let inputUser = input

        const data = {
            question: inputUser,
            status: 1
        };

        setInput("");





        try {
            const response = await axios.post('http://localhost:8081/api/chat',
                data,
                {
                    headers: { "Content-Type": "application/json" }
                }


            );

            // call back to store total
            if (response.data.result.answer == "Xin lỗi thông tin liên quan không có trong tài liệu.") {

                const dataLoad = {
                    question: inputUser,
                    status: 0
                };

                const responseLoad = await axios.post('http://localhost:8081/api/chat',
                    dataLoad,
                    {
                        headers: { "Content-Type": "application/json" }
                    }


                );

                botReplyText = responseLoad.data.result.answer;
            } else {
                botReplyText = response.data.result.answer;
            }


            console.log("data api response :" + response)

        } catch (error) {
            console.error('answer lỗi:', error);
        }





        let currentText = "";
        let index = 0;

        const botReply = {
            id: messages.length + 2,
            text: "",
            sender: "bot",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botReply]);

        const interval = setInterval(() => {
            if (index < botReplyText.length) {
                currentText += botReplyText[index];
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === botReply.id ? { ...msg, text: currentText } : msg
                    )
                );
                setIsLoading(false);
                index++;

            } else {
                clearInterval(interval);

            }
        }, 20); // Điều chỉnh tốc độ hiển thị từng chữ
        // Độ trễ trước khi bot bắt đầu phản hồi
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!userInfo.name || !userInfo.phone || !userInfo.email) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/create/client', userInfo);
            localStorage.setItem("user", JSON.stringify(userInfo));

        } catch (error) {
            console.error('Lỗi khi thêm user:', error);
        }

        const ClientName = JSON.parse(localStorage.getItem("user"));
        setMessages((prev) => [
            ...prev.filter((msg) => msg.type !== "form"), // Xóa form khỏi danh sách tin nhắn
            {
                id: prev.length + 1,
                text: `👋 Xin chào ${ClientName.name}! Cảm ơn bạn đã cung cấp thông tin. Bạn cần hỗ trợ gì?`,
                sender: "bot",
                timestamp: new Date(),
            },
        ]);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const navigate = useNavigate(); // Hook để điều hướng
    const handleClose = () => {
        // e.preventDefault(); // Ngăn chặn reload trang
        navigate("/"); // Chuyển hướng đến trang chat
    }

    const [isMenuOpen, setIsMenuOpen] = useState(false); // State để quản lý menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Đảo trạng thái menu khi bấm vào icon
    };



    return (
        <div className="chat-wrapper">
            <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
                <p className="title-navbar"> <IoArrowForwardOutline className="icon-title" />
                    Câu hỏi gợi ý</p>
                <div>
                    <ul className="question-common">
                        <li>Thông tin tuyển sinh của trường là như nào ?</li>
                        <li>Thông tin tuyển sinh của trường là như nào ?</li>
                        <li>Thông tin tuyển sinh của trường là như nào ?</li>
                        <li>Thông tin tuyển sinh của trường là như nào ?</li>
                    </ul>
                </div>

            </div>
            <div className="chat-container">
                <div className="chat-header">
                    {/* Nút menu ba gạch */}
                    <FaBars className={`${isMenuOpen ? "open1" : "menu-icon"}`} onClick={toggleMenu}

                        onMouseEnter={() => setHoverTextutill("Tiện ích ")}
                        onMouseLeave={() => setHoverTextutill("")}
                    />
                    <IoAddCircleOutline className={`${isMenuOpen ? "open1-add" : "menu-icon-add"}`}

                        onMouseEnter={() => setHoverText("Đoạn chat mới")}
                        onMouseLeave={() => setHoverText("")}
                    />
                    <div className="icon-header">
                        <img src={chatbot} alt="Chat Logo" className="chat-logo" />
                        <h2 className="chat-title">Tuyển sinh - HNUE</h2>
                    </div>

                </div>
                {hoverText && <div className="hover-text">{hoverText}</div>}
                {hoverTextutill && <div className="hover-text-utill">{hoverTextutill}</div>}

                <div className="chat-messages" ref={chatContainerRef}>
                    {messages.map((msg) =>
                        msg.type === "form" ? (
                            <div key={msg.id} className="message bot-message">
                                <div className="message-content">
                                    <img src={logo} alt="Bot Logo" className="bot-logo" />
                                    <form onSubmit={handleFormSubmit} className="chat-form">
                                        <h3>Vui lòng nhập thông tin:</h3>
                                        <input
                                            type="text"
                                            placeholder="Họ và tên"
                                            value={userInfo.name}
                                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Số điện thoại"
                                            value={userInfo.phone}
                                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={userInfo.email}
                                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                            required
                                        />
                                        <button type="submit">Xác nhận</button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div key={msg.id} className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
                                <div className="message-content">
                                    {msg.sender === "bot" && <img src={logo} alt="Bot Logo" className="bot-logo" />}
                                    {msg.text}
                                    {/* <span className={`${msg.sender === "user" ? "message-time-user" : "message-time"}`}>
                                        {formatTime(msg.timestamp)}
                                    </span> */}
                                </div>
                                <span className={`${msg.sender === "user" ? "message-time-user" : "message-time"}`}>
                                    {formatTime(msg.timestamp)}
                                </span>

                            </div>


                        )
                    )}

                    {isLoading && (
                        <div className="message bot-message">
                            <div className="message-content">
                                <img src={logo} alt="Bot Logo" className="bot-logo1" />
                                <div className="typing-indicator">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {messages.some((msg) => msg.type !== "form") && (
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button className={`send-button ${input.trim() ? "active" : ""}`} onClick={sendMessage} disabled={!input.trim()}>
                            <Send size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
