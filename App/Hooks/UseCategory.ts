import { useState } from "react"


export function useCategory() {
    const [categoriaSelected, SetcategoriaSelected] = useState(false)
    const [categoriaModalID, SetcategoriaModalID] = useState('')
    const [categoriaModalName, SetcategoriaModalName] = useState('')
    return{
        categoriaModalID,
        SetcategoriaModalID,
        categoriaSelected,
        SetcategoriaSelected,
        categoriaModalName,
        SetcategoriaModalName
    }
}