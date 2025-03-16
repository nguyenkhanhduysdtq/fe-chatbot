import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './pageLeft.scss';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoDocuments } from "react-icons/io5";
import { SiAmazondocumentdb } from "react-icons/si";
import { MdDashboard } from "react-icons/md";
import { FaRegAddressBook } from "react-icons/fa6";

function HomepageLeft({ onSelectPage }) {

    const cx = classNames.bind(styles);

    const [selectDasboard, setSelectedDasboard] = useState(true);
    const [selectDocument, setSelectedDocument] = useState(false);
    const [selectStore, setSelectedStore] = useState(false);
    const [selectInfor, setSelectedInfor] = useState(false);

    const handleDasboard = () => {


        setSelectedDasboard(!selectDasboard);

        if (selectStore) {
            setSelectedStore(false);
        }

        if (selectDocument) {
            setSelectedDocument(false);
        }

        if (selectInfor) {
            setSelectedInfor(false);
        }

    }
    const handleDocument = () => {

        setSelectedDocument(!selectDocument);

        if (selectDasboard) {
            setSelectedDasboard(false);
        }

        if (selectStore) {
            setSelectedStore(false);
        }
        if (selectInfor) {
            setSelectedInfor(false);
        }


    }
    const handleStore = () => {

        setSelectedStore(!selectStore);

        if (selectDasboard) {
            setSelectedDasboard(false);
        }

        if (selectDocument) {
            setSelectedDocument(false);
        }
        if (selectInfor) {
            setSelectedInfor(false);
        }


    }

    const handleInfor = () => {

        setSelectedInfor(!selectInfor);

        if (selectDasboard) {
            setSelectedDasboard(false);
        }

        if (selectDocument) {
            setSelectedDocument(false);
        }


        if (selectStore) {
            setSelectedStore(false);
        }

    }



    return (

        <div className={cx('bt-item')}>
            <h3>THAO TÁC</h3>
            <ul >
                <li onClick={() => onSelectPage('dashboard')}><MdDashboard /><button onClick={handleDasboard} className={cx((selectDasboard ? 'bt-dashbord' : ""), 'bt')}>DashBoard</button></li>
                <li onClick={() => onSelectPage('document')}><IoDocuments /><button onClick={handleDocument} className={cx((selectDocument ? 'bt-document' : ""), 'bt')}>Document</button></li>
                <li onClick={() => onSelectPage('store')}><SiAmazondocumentdb />
                    <button onClick={handleStore} className={cx((selectStore ? 'bt-store' : ""), 'bt')}>Knowledge store</button></li>
                <li onClick={() => onSelectPage('infor')}><FaRegAddressBook />
                    <button onClick={handleInfor} className={cx((selectInfor ? 'bt-infor' : ""), 'bt')}>Statistics information</button></li>
            </ul>

        </div>


    )

}

export default HomepageLeft