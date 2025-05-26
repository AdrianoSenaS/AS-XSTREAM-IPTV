import { useState } from "react";


export function useModal() {
    const [modalVisible, setModalVisible] = useState(false);
    return {
        modalVisible,
        setModalVisible
    }
}