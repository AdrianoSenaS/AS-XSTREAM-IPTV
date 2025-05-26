import { useState } from "react";

export function useSearch(){
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState();
    const [modalVisible1, setModalVisible1] = useState(false);

    
    
    return{
        searchText,
        setSearchText,
        filteredData,
        setFilteredData,
        modalVisible1,
        setModalVisible1,
    }
        
}