import { useState } from "react"


export function useLogin(){
    const [_Name, SetName] = useState("")
    const [_Usuario, SetUsuario] = useState("")
    const [_Senha, SetSenha] = useState("")
    const [_Url, SetUrl] = useState("")
    const [_Loanding, SetLoading] = useState(false)
    
    return{
        _Name,
        SetName,
        _Usuario,
        SetUsuario,
        _Senha,
        SetSenha,
        _Url,
        SetUrl,
        _Loanding,
        SetLoading
    }
}