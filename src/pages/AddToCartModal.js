import Modal from "../UI/Modal";

const AddtoCartModal = (props) => {
    
    return (
        <Modal onClose={props.onClose}>
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">{props.modalTitle}</h4>
                </div>
                
                <div className="modal-body">
                    <span>{props.modalBody}</span>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-danger" onClick={props.onClose}>Close</button>
                </div>
            </div>
        </Modal>
    )
};
export default AddtoCartModal;