import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Dewi-1.0.0/assets/css/main.css";
import "../Dewi-1.0.0/assets/vendor/aos/aos.css";
import "../Dewi-1.0.0/assets/vendor/glightbox/css/glightbox.min.css";
import "../Dewi-1.0.0/assets/vendor/swiper/swiper-bundle.min.css";
import heroBg from "../Dewi-1.0.0/assets/img/b1.jpg";
import { RiRobot2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { RiChatSmile3Fill } from "react-icons/ri"; // Icon chat
import { IoClose } from "react-icons/io5"; // Icon đóng
import ChatPage from "../chat/ChatPage.jsx"; // Import trang chat
import { FaChevronDown } from "react-icons/fa";

const HomepageClient = () => {
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate(); // Hook để điều hướng

  const [isclose, setisclose] = useState("");


  const handleComplete = (e) => {
    // e.preventDefault(); // Ngăn chặn reload trang
    // navigate("/chat");
    setShowForm(!showForm);

  };

  const [isChatOpen, setIsChatOpen] = useState(false); // Trạng thái mở/đóng chat

  const handleClose = () => {
    setShowForm(!showForm);
  }
  return (
    <>
      <header id="header" className="header d-flex align-items-center fixed-top">
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <a href="index.html" className="logo d-flex align-items-center me-auto">
            <img src="https://static.vecteezy.com/system/resources/previews/010/927/083/original/chatbot-icon-on-white-background-online-support-service-bot-sign-chat-bot-sign-for-support-service-concept-flat-style-vector.jpg" alt="" />
            <h1 className="sitename">Chatbot</h1>
          </a>

          <a className="cta-btn" href="index.html#about">Get Started</a>
        </div>
      </header>
      <main className="main">
        <section id="hero" className="hero section dark-background">
          <img src={heroBg} alt="ảnh lỗi " />
          <div className="container d-flex flex-column align-items-center">
            <h2 data-aos-delay="100">HỆ THỐNG TRẢ LỜI CÂU HỎI TUYỂN SINH</h2>
            <p data-aos-delay="200">Chatbot trả lời tự động về các nội dung tuyển sinh của trường Đại học Sư phạm Hà Nội</p>
            <div className="d-flex mt-4" data-aos-delay="300">
              <a href="#!" className="q-chatbot btn-get-started" onClick={handleComplete}>
                <RiRobot2Fill className="robot-icon" />
                Hỏi thông tin
              </a>
              <a href="https://www.youtube.com/watch?v=j4EKGLK55k0" className="glightbox btn-watch-video d-flex align-items-center">
                <i className="bi bi-play-circle"></i><span>Xem thông tin</span>
              </a>
            </div>
          </div>
        </section>

        {/* Nút mở chat */}
        <div className="chat-button" onClick={() => setIsChatOpen(!isChatOpen)}>
          {isChatOpen ? <IoClose size={28} /> : <RiChatSmile3Fill size={28} />}
        </div>

        {/* Khung chat */}
        {isChatOpen && (
          <div className="chat-container-home">
            <ChatPage />
          </div>
        )}


        {showForm && (
          <div className={`chat-container-home ${showForm ? "show" : ""}`}>
            <div className="chat-content">
              <button className="bt-icon" title="Thu nhỏ"><FaChevronDown className="down-icon" onClick={handleClose}

                onMouseEnter={() => setisclose("Đóng")}
                onMouseLeave={() => setisclose("")}
              /></button>
              {isclose && <div className="hover-text-close">{isclose}</div>}
              <ChatPage />
            </div>
          </div>
        )}


      </main>
    </>
  );
};

export default HomepageClient;
