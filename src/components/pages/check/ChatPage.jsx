import React, { useEffect, useState } from 'react';
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import classNames from 'classnames';

import styles from './styles.scss';

import axios from 'axios';


let stompClient = null;
function ChatPage() {

    const cx = classNames.bind(styles);

    const [publicChats, setPublicChats] = useState([]);
    const [userData, setUserData] = useState({
        userName: "",
        receiverName: "",
        message: "",
        connected: false,
    });

    const registerUser = () => {
        const socket = new SockJS('http://localhost:8080/api/spring-boot-tutorial');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, () => {
            console.log("Connect is false !");
        });

    }


    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/topic/public', onMessageReceived);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.userName,
            status: "JOIN"
        }

        stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
    }


    const onMessageReceived = (payload) => {

        const payloadData = JSON.parse(payload.body);
        // console.log(payloadData);

        switch (payloadData.status) {
            case "JOIN":
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;

        }

    }



    // useEffect(() => {
    //     stompClient.connect({}, function (frame) {
    //         console.log("Connected " + frame);
    //         stompClient.subscribe('http://localhost:8080/api/topic/public', function (messaageDTO) {
    //             console.log("hi" + JSON.parse(messaageDTO.body).content);
    //         });
    //     });
    // }, [])



    const handleUsername = (event) => {
        const name = event.target.value;
        setUserData({ ...userData, "userName": name });
    }


    const handleMessage = (event) => {
        const message = event.target.value;
        setUserData({ ...userData, "message": message });
    }

    const sendPublicValue = () => {
        const chatMessage = {
            senderName: userData.userName,
            message: userData.message,
            status: "MESSAGE",

        }
        console.log(chatMessage);
        console.log(publicChats);

        stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, "message": "" });
    }



    return (
        <div className={cx('Container')}>
            {userData.connected ?

                <div className={cx('chat-box')}>
                    <div className={cx('content-name')} >
                        {publicChats.map((chat, index) => (
                            <div className={cx('content-message')} key={index}>
                                {
                                    userData.userName === chat.senderName ?
                                        <div className={cx('name-user')} style={{ color: 'green' }}>
                                            {'me-' + chat.senderName + " : "}
                                        </div>
                                        :

                                        <div className={cx('name-user')} style={{ color: 'red' }} >
                                            {chat.senderName + " : "}
                                        </div>
                                }

                                <div className={cx('message')} >
                                    <p>
                                        {chat.message}
                                    </p>
                                </div>

                            </div>




                        ))}
                    </div>

                    <div className={cx('input-send')}>
                        <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                        <button type="button" className="send-button" onClick={sendPublicValue}>send</button>
                    </div>
                </div>



                :
                <div className="register">
                    <input
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        value={userData.userName}
                        onChange={handleUsername}
                        margin="normal"
                    />
                    <button type="button" onClick={registerUser}>
                        connect
                    </button>
                </div>
            }



        
        </div>

    )
};

export default ChatPage
