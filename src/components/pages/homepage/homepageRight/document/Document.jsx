import styles from "../document/styles.scss"
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { FaPlus } from "react-icons/fa6";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function Document() {


    const cx = classNames.bind(styles);

    // State để kiểm soát hiển thị form overlay
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileUpload, setFileUpload] = useState('');
    const [file, setFile] = useState(null);
    const [id, setId] = useState(0);
    const [idFile, setIdFile] = useState(0);
    const [fileDataToggle, setFileDataToggle] = useState({ id: 0, fileName: "" });
    let inforFile = {
        fileName: "",
        inforId: 0
    };





    // Hàm toggle hiển thị form
    const toggleForm = () => {
        setIsFormVisible(!isFormVisible);

    };

    // State để kiểm soát hiển thị form overlay
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    // Hàm toggle hiển thị form
    const toggleOverlay = async (id) => {
        setIsOverlayVisible(!isOverlayVisible);
        setId(id);

        try {
            const fileData = await axios.get(`http://localhost:8081/api/getFile?id=${encodeURIComponent(id)}`);

            setFileUpload(fileData.data.result.fileName);
            setIdFile(fileData.data.result.id);

            setFileDataToggle({ id: fileData.data.result.id, fileName: fileData.data.result.fileName });

        } catch (error) {
            setFileUpload('');
        }

    };

    const deletefile = async (idFile) => {

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa file này không?");

        // không đồng ý dừng xóa
        if (!confirmDelete) {
            return;
        }

        try {
            // Gửi request DELETE đến API với data là fileName
            const response = await axios.delete('http://localhost:8081/api/delete/file', {
                headers: { 'Content-Type': 'application/json' }, // Cấu hình header cho body dạng JSON
                data: fileDataToggle, // Dữ liệu trong body
            });


            setFileUpload('');
            setIsOverlayVisible(!isOverlayVisible);
            fetchDocuments();

        } catch (error) {
            console.error('Lỗi khi xóa tệp:', error.response?.data || error.message);
            // Ví dụ: đặt lại trạng thái upload

        }
    };

    const toggledelete = async (id) => {

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?");

        // không đồng ý dừng xóa
        if (!confirmDelete) {
            return;
        }

        try {
            // Gửi request DELETE đến API với data là fileName
            const response = await axios.delete('http://localhost:8081/api/delete/document', {
                headers: { 'Content-Type': 'application/json' }, // Cấu hình header cho body dạng JSON
                params: { id },
            });

            fetchDocuments();
            toast.success("Xóa thành công");

        } catch (error) {
            // alert("Vui lòng xóa file trong document trước khi xóa document !")
            toast.error("Vui lòng xóa file trong document trước khi xóa document !");

        }
    };

    const toggleOverlayClose = async (e) => {
        setIsOverlayVisible(!isOverlayVisible);
    };



    // Hàm xử lý khi chọn file
    const handleFileChange = (e) => {
        setFileName(e.target.files[0] ? e.target.files[0].name : '');
        setFile(e.target.files[0]);
    };


    const [documents, setDocuments] = useState([]); // Lưu danh sách tài liệu
    const [newDocument, setNewDocument] = useState({ nameDocument: '', description: '' }); // Lưu dữ liệu form


    // Lấy danh sách tài liệu từ API
    const fetchDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/documents');
            setDocuments(response.data.result);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tài liệu:', error);
        }
    };

    // Gọi API khi component được render lần đầu
    useEffect(() => {
        fetchDocuments();
    }, []);


    // Hàm xử lý khi thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDocument((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    // Hàm xử lý khi submit form
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (newDocument.nameDocument === '' || newDocument.description === '') {
            alert("Không được để trống thông tin !");
            return;
        }

        try {

            await axios.post('http://localhost:8081/api/document', newDocument); // Gọi API thêm tài liệu

            setNewDocument("", "");
            toggleForm(); // Đóng form
            fetchDocuments(); // Cập nhật lại danh sách tài liệu
        } catch (error) {
            console.error('Lỗi khi thêm tài liệu:', error);
        }
    };

    const handleUpload = async () => {

        setFileUpload(fileName);
        setFileName("");

        inforFile.fileName = fileName;
        inforFile.inforId = id;

        if (!file || file === '') {
            alert("Vui lòng chọn file.");
            return;
        }


        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8081/api/uploads", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const message = await response.text();
                alert("Success: " + message);




                console.log(JSON.stringify(inforFile));
                const saveFile = await fetch(`http://localhost:8081/api/file`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inforFile)
                });

                if (saveFile.ok) {

                    // Gọi API update nếu upload thành công
                    const updateResponse = await fetch(`http://localhost:8081/api/infor/update?id=${encodeURIComponent(id)}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });


                } else {
                    // alert("Error: " + "Không thể thêm file");

                    toast.error("Không thể thêm file");
                }

                fetchDocuments();
                setIsOverlayVisible(!isOverlayVisible);


            } else {
                const errorMessage = await response.text();
                alert("Error: " + errorMessage);
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }

    };



    return (

        <div className={cx('content')}>
            <h3>Document</h3>


            <div className={cx('table-container')}>
                <div className={cx('table-header')}>

                    <button className={cx('btn-create')} onClick={toggleForm}><FaPlus /> Create</button>
                </div>
                <table className={cx('custom-table')}>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>DESCRIPTION</th>
                            <th>CREATE BY</th>
                            <th>DATE</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.length > 0 ? (
                            documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td><strong>{doc.nameDocument}</strong></td>
                                    <td>{doc.description}</td>
                                    <td>Nguyễn Khánh Duy</td>
                                    <td>{doc.date || 'N/A'}</td>
                                    <td style={{ color: doc.status == 0 ? 'red' : 'green', fontWeight: 'bold' }}>{doc.status == 0 ? "EMPTY" : "DOCUMENTED"}</td>
                                    <td>
                                        <button value={doc.id} className={cx('btn-action', 'btn-edit')} onClick={() => toggleOverlay(doc.id)}  ><IoDocumentsOutline /> Item</button>
                                        <button value={doc.id} className={cx('btn-action', 'btn-delete')} onClick={() => toggledelete(doc.id)}><MdDeleteForever /> Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (

                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '12px' }}>Không có dữ liệu</td>
                            </tr>

                        )
                        }

                    </tbody>
                </table>
                <ToastContainer></ToastContainer>
            </div>

            {/* Form Overlay */}
            {isFormVisible && (
                <div className={cx('form-overlay')}>
                    <div className={cx('form-container')}>
                        <h3>Create Document</h3>
                        <form onSubmit={handleFormSubmit} >
                            <div className={cx('form-group')}>
                                <label>Name:</label>
                                <input type="text" placeholder="Enter name"
                                    name="nameDocument"
                                    value={newDocument.nameDocument}
                                    onChange={handleInputChange} />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Description:</label>
                                <textarea placeholder="Enter description"
                                    name="description"
                                    onChange={handleInputChange}
                                    value={newDocument.description}

                                ></textarea>
                            </div>
                            <div className={cx('form-buttons')}>
                                <button type="button" onClick={toggleForm} className={cx('btn-cancel')}>
                                    Cancel
                                </button>
                                <button type="submit" className={cx('btn-submit')}>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* UPLOAD FILE */}
            {isOverlayVisible && (
                <div className={cx('form-overlay')}>
                    <div className={cx('custom-form-container')}>
                        <div className={cx('custom-form-header')}>
                            <h3>Document Item</h3>
                            <button className={cx('btn-close')} onClick={toggleOverlayClose}>

                            </button>
                        </div>
                        <form>
                            <div className={cx('form-content')}>
                                {/* Bên trái */}
                                <div className={cx('form-left')}>
                                    <div className={cx('form-group')}>

                                        <label htmlFor="fileUpload">File Uploads</label>
                                    </div>

                                    <div className={cx('form-group')}>
                                        <input type="file" onChange={handleFileChange} disabled={fileUpload != ''} />
                                    </div>
                                    {fileName && (
                                        <div className={cx('file-info')}>
                                            <strong>Uploaded File:</strong> {fileName}
                                        </div>
                                    )}
                                </div>

                                {/* Bên phải */}
                                <div className={cx('form-right')}>

                                    {fileUpload && (
                                        <div className={cx('file-result')}>
                                            <strong>Uploaded File:</strong> {fileUpload}
                                        </div>
                                    )}

                                </div>
                            </div>

                            <div className={cx('form-buttons')}>

                                {
                                    fileUpload == '' && (
                                        <button
                                            type="button"
                                            className={cx('btn-upload')}
                                            onClick={handleUpload}
                                            disabled={fileUpload != ''}>
                                            <IoCloudUploadOutline /> Upload</button>)
                                }


                                {
                                    fileUpload != '' && (
                                        <button
                                            type="button"
                                            className={cx('btn-delete-file')}
                                            onClick={() => deletefile(idFile)}
                                        >
                                            Delete
                                        </button>)
                                }

                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>



    )

}

export default Document