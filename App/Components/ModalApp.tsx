import React from "react";
import { Modal } from "react-native";


type ModalType = {
    children: React.ReactNode,
    visible: boolean,
    requestClose: () => any
}

const ModalApp: React.FC<ModalType> = ({ children, visible, requestClose }) => {
    return (
        <Modal
            style={{ flex: 1 }}
            animationType='slide'
            transparent={true}
            visible={visible}
            onRequestClose={requestClose}>
            {children}
        </Modal>
    )
}

export default ModalApp