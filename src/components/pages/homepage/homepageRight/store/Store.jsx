import styles from "../store/styles.scss"
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { FaPlus } from "react-icons/fa6";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineReload } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { IoChevronDownCircle } from "react-icons/io5";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
function Store() {


    const cx = classNames.bind(styles);

    // State để kiểm soát hiển thị form overlay
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [docDetails, setDocDetails] = useState('');
    const [confirmedDoc, setConfirmedDoc] = useState('');
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [newDocumentSync, setNewDocumentSync] = useState({ nameDocument: '', description: '' });
    const [documentSync, setDocumentSync] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [idDocument, setIdDocument] = useState(0);
    const [idSync, setIdSync] = useState(0);
    const [loading, setLoading] = useState(false); // Thêm state loading


    // Hàm gọi API để lấy danh sách tài liệu
    const fetchDocuments = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/v1/documents'); // URL của API
            const data = await response.json();
            setDocuments(data.result);
            console.log(data);
            setIsLoaded(true);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };




    const handleSelectClick = () => {

        fetchDocuments(); // Chỉ gọi API nếu danh sách chưa được tải

    };

    // xử lý lấy toàn bộ row trong documet trong select 
    const handleSelectChange = (e) => {
        const selectedValue = JSON.parse(e.target.value); // Parse JSON từ value
        setSelectedDoc(selectedValue.name);
        setIdDocument(selectedValue.id);
        console.log(selectedValue);
        console.log("ID" + idSync);
        const info = selectedValue ? `Details about ${selectedValue.name}` : '';
        setDocDetails(info);
    };

    const toggleOverlayCancel = () => {
        setIsOverlayVisible(!isOverlayVisible);
    }

    const toggleOverlay = async (id) => {
        setIdSync(id);

        try {
            const documentData = await axios.get(`http://localhost:8081/api/documentSync?id=${encodeURIComponent(id)}`);

            const inforId = documentData.data.result.inforId;

            if (inforId == 0) {
                setDocDetails('');
                setSelectedDoc('');
                setConfirmedDoc('');

            } else {

                const detailData = await axios.get(`http://localhost:8081/api/v1/document?id=${encodeURIComponent(inforId)}`);

                setDocDetails('');
                setSelectedDoc('');
                setConfirmedDoc(detailData.data.result.nameDocument);
            }
            setIsOverlayVisible(!isOverlayVisible);
        } catch (error) {
            console.log("lỗi")
        }

    };

    const syncDocument = async (id) => {

        setLoading(true); // Hiển thị hiệu ứng loading
        try {
            const documentData = await axios.post(`http://localhost:8081/api/ingest?id=${encodeURIComponent(id)}`);
            const result = documentData.data.result;
            console.log(result);
            toast.success("Sync thành công!");
        } catch (error) {
            console.error("Lỗi khi đồng bộ tài liệu:", error);
            toast.error("Sync thất bại!");
        } finally {
            const response = await axios.put('http://localhost:8081/api/update/sync', null, {
                headers: { 'Content-Type': 'application/json' }, // Cấu hình header cho body dạng JSON
                params: { idSync: id, idInfor: -1, status: 2 },
            });

            fetchSyncDocuments();
            setLoading(false); // Tắt hiệu ứng loading sau khi API hoàn thành
        }

    }

    const deleteSync = async (id) => {

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa file này không?");

        if (!confirmDelete) {
            return;
        }

        const documentData = await axios.delete(`http://localhost:8081/api/delete/sync?id=${encodeURIComponent(id)}`);

        const result = documentData.data.result;



        if (result === false) {
            toast.error("Bộ dữ liệu đã không còn trong db !");
        } else {
            toast.success("Xóa thành công");
        }

        fetchSyncDocuments();


    }



    const handleConfirm = async () => {

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn thêm tài liệu này không?");

        // không đồng ý dừng xóa
        if (!confirmDelete) {
            return;
        }

        console.log(idSync, idDocument);

        try {
            // Gửi request DELETE đến API với data là fileName
            const response = await axios.put('http://localhost:8081/api/update/sync', null, {
                headers: { 'Content-Type': 'application/json' }, // Cấu hình header cho body dạng JSON
                params: { idSync: idSync, idInfor: idDocument, status: 1 },
            });

            fetchSyncDocuments();
            toast.success("Thêm thành công");

        } catch (error) {
            console.log("data after");
            console.log(idSync, idDocument);
            // alert("Vui lòng xóa file trong document trước khi xóa document !")
            toast.error("Thêm không thành công !");

        }

        setConfirmedDoc(selectedDoc);
    };

    // Hàm toggle hiển thị form
    const toggleForm = async () => {

        setIsFormVisible(!isFormVisible);

    };


    // Hàm xử lý khi thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDocumentSync((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Hàm xử lý khi submit form (Sửa lại API)
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (newDocumentSync.nameDocument === '' || newDocumentSync.description === '') {
            alert("Không được để trống thông tin !");
            return;
        }

        try {

            const response = await axios.post('http://localhost:8081/api/sync/document', newDocumentSync); // Gọi API thêm tài liệu

            console.log(response);

            //API create index
            const result = await axios.post('http://localhost:8081/api/create', null, {
                params: {
                    name: response.data.result.collectionDB
                }

            });


            const descriptionDTO = {
                id: "",
                description: newDocumentSync.description,
                store: response.data.result.collectionDB,
                embedding: null

            }

            const descriptionData = await axios.post('http://localhost:8081/api/ingest/description',
                descriptionDTO,
                {
                    headers: { "Content-Type": "application/json" }
                }


            );



            setNewDocumentSync("", "");
            toggleForm(); // Đóng form
            fetchSyncDocuments(); // Cập nhật lại danh sách tài liệu
        } catch (error) {
            console.error('Lỗi khi thêm tài liệu:', error);
        }
    };

    // Lấy danh sách tài liệu từ API
    const fetchSyncDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/sync/documents');
            setDocumentSync(response.data.result);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tài liệu:', error);
        }
    };

    // Gọi API khi component được render lần đầu 
    useEffect(() => {
        fetchSyncDocuments();
    }, []);

    const getStatusStyle = (doc) => {
        if (doc.status === 0) {
            return { color: 'red', fontWeight: 'bold' };
        } else if (doc.status === 1) {
            return { color: 'rgb(160, 160, 4)', fontWeight: 'bold' };
        }
        return { color: 'green', fontWeight: 'bold' };
    };

    const getStatusText = (doc) => {
        if (doc.status === 0) {
            return "EMPTY";
        } else if (doc.status === 1) {
            return "CHANGED";
        }
        return "SYNCED";
    };

    return (



        <div className={cx('content')}>
            <h3>Knowledge store</h3>

            <div className={cx('table-container')}>
                <div className={cx('table-header')}>

                    <button className={cx('btn-create')} onClick={toggleForm}><FaPlus /> Create</button>
                </div>
                <table className={cx('custom-table')}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Create By</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {documentSync.length > 0 ? (
                            documentSync.map((doc) => (
                                <tr key={doc.id}>
                                    <td className="table-name"><strong>{doc.nameDocument}</strong></td>
                                    <td className="table-description">{doc.description}</td>
                                    <td>Nguyễn Khánh Duy</td>
                                    <td>{doc.date || 'N/A'}</td>
                                    <td className="textStatus">
                                        <button className="textStatus" style={getStatusStyle(doc)}>{getStatusText(doc)}</button>
                                    </td>
                                    <td>
                                        <button className={cx('btn-action', 'btn-edit')} onClick={() => toggleOverlay(doc.id)}>
                                            <IoDocumentsOutline /> Document
                                        </button>
                                        <button className={cx('btn-action', 'btn-sync', { 'disabled-btn': doc.status === 2 })}
                                            disabled={doc.status === 2}
                                            onClick={() => syncDocument(doc.id)}>
                                            <AiOutlineReload /> Sync
                                        </button>
                                        <button className={cx('btn-action', 'btn-delete')} onClick={() => deleteSync(doc.id)}>
                                            <MdDeleteForever /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '12px' }}>Không có dữ liệu</td>
                            </tr>
                        )}



                    </tbody>
                </table>

                <ToastContainer></ToastContainer>
            </div>

            {/* Form Overlay */}
            {isFormVisible && (
                <div className={cx('form-overlay')}>
                    <div className={cx('form-container')}>
                        <h3>Create store</h3>
                        <form>
                            <div className={cx('form-group')}>
                                <label>Name:</label>
                                <input type="text" placeholder="Enter name"

                                    name="nameDocument"
                                    value={newDocumentSync.nameDocument}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Description:</label>
                                <textarea placeholder="Enter description"
                                    name="description"
                                    value={newDocumentSync.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className={cx('form-buttons')}>
                                <button type="button" onClick={toggleForm} className={cx('btn-cancel')}>
                                    Cancel
                                </button>
                                <button type="submit" className={cx('btn-submit')} onClick={handleFormSubmit}>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Overlay Form */}
            {isOverlayVisible && (
                <div className={cx('overlay-container')}>
                    <div className={cx('overlay-content')}>
                        <div className={cx('overlay-header')}>
                            <h3>Document Form</h3>
                            <button className={cx('overlay-btn-close')} onClick={toggleOverlayCancel}><IoClose /></button>
                        </div>
                        <div className={cx('overlay-body')}>

                            {/* Left Side */}
                            {confirmedDoc === '' && (
                                <div className={cx('overlay-left')}>
                                    <label>Select Document:</label>
                                    <select onChange={handleSelectChange} onClick={handleSelectClick} value={selectedDoc}>
                                        <option value="">-- Choose Document --</option>
                                        {documents.map((doc) => (
                                            <option key={doc.id} value={JSON.stringify({ id: doc.id, name: doc.nameDocument })}>
                                                {doc.nameDocument}
                                            </option>

                                        ))}
                                    </select>
                                    {docDetails && (
                                        <div className={cx('overlay-doc-info')}>
                                            <p>{docDetails}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Right Side */}
                            <div className={cx('overlay-right')}>
                                <h4>Selected Document:</h4>
                                <p> {confirmedDoc || "No document selected"} <IoChevronDownCircle /></p>

                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={cx('overlay-actions')}>
                            <button type="button" onClick={toggleOverlayCancel} className={cx('overlay-btn-cancel')}>
                                Cancel
                            </button>
                            {confirmedDoc === '' && (
                                <button type="submit" className={cx('overlay-btn-submit')} onClick={handleConfirm}>
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className={cx('loading-overlay')}>
                    <div className={cx('loading-spinner')}></div>
                </div>
            )}
        </div>


    )

}

export default Store