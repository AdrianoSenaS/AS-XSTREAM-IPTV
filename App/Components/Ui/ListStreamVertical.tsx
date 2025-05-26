import React, { useState } from "react";
import { FlatList, View } from "react-native";
import ButtonImage from "../ButtonImage";
import ImageList from "../ImageList";

type Props = {
    data: any,
    navigation: any,
    urlApiStream: any,
    userApiStream: any,
    passwordApiStream: any,
}

const ListStreamVertical: React.FC<Props> = ({
    data,
    navigation,
    urlApiStream,
    userApiStream,
    passwordApiStream,
}) => {
    const [CountStream, SetCountStream] = useState(10)

    const GetStreamList = () => {
        SetCountStream(CountStream + 10)
        console.log("Buscando filmes")
    }

    const GetStreamCategorieID = (id: any) => {
        const uniqueStream = data
            .filter((Stream: any) => Stream.category_id === id).slice(0, CountStream)
        return uniqueStream;
    };

    return (
        <FlatList
            data={data}
            keyExtractor={(Stream: any) => Stream.num}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            onEndReached={GetStreamList}
            onEndReachedThreshold={0.1}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            renderItem={(Stream) => (
                <View
                    style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                    <ButtonImage OnPress={() =>
                        navigation.navigate('infoStream',
                            {
                                title: Stream.item.title,
                                image: Stream.item.stream_icon || Stream.item.cover,
                                description: Stream.item.plot,
                                urlhls: `${urlApiStream}/
                                ${Stream.item.stream_type}/
                                ${userApiStream}/
                                ${passwordApiStream}/
                                ${Stream.item.stream_id}.
                                ${Stream.item.container_extension}`,
                                year: Stream.item.release_date,
                            })}>
                        <ImageList image={Stream.item.stream_icon || Stream.item.cover} />
                    </ButtonImage>
                </View>
            )}
        />
    )
}
export default ListStreamVertical