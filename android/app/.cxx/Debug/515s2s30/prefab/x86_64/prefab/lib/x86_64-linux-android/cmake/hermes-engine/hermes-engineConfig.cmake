if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/Adriano Sena/.gradle/caches/8.10.2/transforms/b54a83068d5c3d9ce86958288d020f29/transformed/hermes-android-0.76.5-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/Adriano Sena/.gradle/caches/8.10.2/transforms/b54a83068d5c3d9ce86958288d020f29/transformed/hermes-android-0.76.5-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

