import Modal from "../UI/Modal";

const ConfirmModal = (props) => {
    
    const confirmHandle = () => {
        props.onConfirm(props.addressId);
    }
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
                    <button className="btn btn-success m-1" onClick={props.onConfirm}> Ok </button>
                    <button className="btn btn-danger m-1" onClick={props.onClose}> Close </button>
                </div>
            </div>
        </Modal>
    )
};
export default ConfirmModal;