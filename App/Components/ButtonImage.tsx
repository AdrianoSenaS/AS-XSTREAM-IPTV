import React from "react";
import { Pressable } from "react-native";

type Props = {
    OnPress: () => void,
    children: React.ReactNode,
}

const ButtonImage: React.FC<Props> = ({ OnPress, children,  }) => {
    return (
        <Pressable
            style={{ margin: 10 }}
            onPress={OnPress}>
            {children}
        </Pressable>
    )
}

export default  ButtonImage