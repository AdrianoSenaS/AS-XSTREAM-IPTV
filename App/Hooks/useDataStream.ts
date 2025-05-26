import { useState } from "react"


export function useStreamData(){
    const [DataCategoriesStream, SetDataCategoriesStream] = useState<[]>([])
    const [DatasStream, SetDatasStream] = useState<[]>([])
    const [FilterData, setFilterData] = useState();
    return{
        DataCategoriesStream,
        SetDataCategoriesStream,
        DatasStream,
        SetDatasStream,
        FilterData,
        setFilterData
    }
}