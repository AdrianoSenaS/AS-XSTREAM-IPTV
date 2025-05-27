import React, { useState } from "react";
import { FlatList, FlatListProps } from "react-native";

type Props = {
    data: any[],
    renderItem: FlatListProps<any>['renderItem'];
    keyExtractor?: FlatListProps<any>['keyExtractor']
}

const ListStreamVertical: React.FC<Props> = ({
    data,
    renderItem,
    keyExtractor,

}) => {
    
    const [CountStream, SetCountStream] = useState(10)

    const GetStreamList = () => {
        SetCountStream(CountStream + 10)
        console.log("Buscando filmes")
    }
    return (
        <FlatList
            data={data}
            keyExtractor={keyExtractor}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            onEndReached={GetStreamList}
            onEndReachedThreshold={0.1}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            renderItem={renderItem}
        />
    )
}
export default ListStreamVertical