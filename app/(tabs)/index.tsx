import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Image } from 'expo-image';

import {
  MaterialIcons
} from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView, } from 'react-native-safe-area-context';


const { width: screenWidth } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 220;
const POSTER_WIDTH = 120;
const POSTER_HEIGHT = 180;

export default function MainScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [user, SetUser] = useState('')
  const [CountStream, SetCountStream] = useState(10)

  const router = useRouter();

  // Filmes populares
  const [popularMovies, setPopularMovies] = useState([]);
  // Destaques (carrossel)
  const [featuredContent, setFeaturedContent] = useState([]);

  // Canais ao vivo
  const [liveChannels, setLiveChannels] = useState([]);

  // Séries em destaque
  const [featuredSeries, setFeaturedSeries] = useState([])
  const GetUserNameLabel = async () => {
    const user = await AsyncStorage.getItem('name')
    user != null ? SetUser(`Para ${user}`) : null

  }

  const Login = async () => {
    const userDb = await AsyncStorage.getItem('username')
    if (userDb === null) {
      router.replace('/login')
      console.log(userDb)
    } else {
      GetUserNameLabel()
      onRefresh()

    }
  }

  const getFileUri = (fileName: string) => `${FileSystem.documentDirectory}${fileName}`;
  const readDataStream = async (fileName: string) => {
    try {
      const fileUri = getFileUri(fileName);
      const dataString = await FileSystem.readAsStringAsync(fileUri);
      const dataObject = JSON.parse(dataString);
      return dataObject
    } catch (error) {
      return null
    }
  };

  const apiTmdb = async () => {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=pt-Br&page=1';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWEzMzM5Yjg1MGE0ZDI4NDNiMjU5ZmI5ZWJiYTNmZiIsIm5iZiI6MTcyNzIxNjM0NC42OCwic3ViIjoiNjZmMzNhZDg1MDUxMzI4MzBlMjE2NDFhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.ymyuM-JNxbypJmoe1ByMoONM24elHMV_053-HYEQxl0'
      }
    };

    const result = (await fetch(url, options)).json();

    return result

  }

  const getData = async () => {
    const iptv_vodStreams = await readDataStream('iptv_vodStreams.json')
    const iptv_liveCategories = await readDataStream('iptv_liveCategories.json')
    const iptv_get_series = await readDataStream('iptv_series.json')
    if (iptv_liveCategories !== null && iptv_vodStreams !== null && iptv_get_series !== null) {
      let movieTMDBList: any = []
      let m: any = []
      let c: any = []
      let l: any = []
      let s: any = []

      const movieTmbd = await apiTmdb()



      iptv_vodStreams.map(movie => {
        // c.push(movie)
        //console.log(movie.stream_id)
        movieTmbd.results.map(e => {

          if (`https://image.tmdb.org/t/p/w300${e.poster_path}` == movie.stream_icon) {
            console.log(movie)
            c.push(movie)
          }else{
            
          }
        })
      })
      iptv_vodStreams.slice(5, 100).map(movie => {
        m.push(movie)
      })
      iptv_liveCategories.slice(0, 100).map(tv => {
        l.push(tv)
        //console.log(tv)
      })
      iptv_get_series.slice(0, 100).map(series => {
        s.push(series)
        // console.log(series)
      })

      setFeaturedContent(c)
      setPopularMovies(m)
      setLiveChannels(l)
      setFeaturedSeries(s)
      setRefreshing(false)
    } else {
      router.replace('/loading')
    }
  }



  // Continue assistindo
  const continueWatching = [

  ];



  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };

  useEffect(() => {
    Login()
  }, [])


  const GetStreamList = () => {
    SetCountStream(CountStream + 10)
    console.log("Buscando filmes")
  }

  const renderFeaturedItem = ({ item, index }: any) => (
    < TouchableOpacity
      style={styles.featuredCard}
      activeOpacity={0.9}
      onPress={() => router.navigate('/categoria')
      }
    >
      <Image
        source={{ uri: item.stream_icon }}
        style={styles.featuredImage}
        cachePolicy={"disk"}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
        style={styles.featuredGradient}
      >
        <View style={styles.featuredInfo}>
          <View style={styles.ratingBadge}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.featuredTitle}>{item.title}</Text>
          <Text style={styles.featuredDesc}>{item.plot.length > 30 ? item.plot.substring(0, 30) + '...' : item.plot}</Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.metaText}>{item.release_date}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{item.duration}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{item.genre}</Text>
          </View>
          <TouchableOpacity style={styles.playButton}>
            <MaterialIcons name="play-arrow" size={28} color="#fff" />
            <Text style={styles.playText}>Assistir</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity >
  );

  const renderMovieCard = ({ item }: any) => (


    <TouchableOpacity
      style={styles.movieCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Details', { movie: item })}
    >
      <Image
        source={{ uri: item.stream_icon || item.cover }}
        style={styles.posterImage}
        cachePolicy='disk'
      />
      <View style={styles.qualityBadge}>
        <Text style={styles.qualityText}>{item.quality || "hd"}</Text>
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.movieMeta}>
          <Text style={styles.movieYear}>{item.release_date}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.movieRating}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.movieDuration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSeriesCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.seriesCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Series', { series: item })}
    >
      <Image
        source={{ uri: item.cover }}
        style={styles.seriesPoster}
        cachePolicy='disk'
      />
      <View style={styles.seriesInfo}>
        <View style={styles.seriesRating}>
          <MaterialIcons name="star" size={14} color="#FFD700" />
          <Text style={styles.seriesRatingText}>{item.rating_5based}</Text>
        </View>
        <Text style={styles.seriesTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.seriesSeason}>{item.num} Temporada</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContinueCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.continueCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Continue', { item })}
    >
      <View style={styles.continuePoster}>
        <Image
          source={{ uri: item.poster }}
          style={styles.continueImage}
          cachePolicy={'disk'}
        />
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
        </View>
      </View>
      <View style={styles.continueInfo}>
        <Text style={styles.continueTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.continueSeason}>{item.season}</Text>
        <Text style={styles.continueTime}>{item.timeLeft}</Text>
        <TouchableOpacity style={styles.resumeButton}>
          <MaterialIcons name="play-arrow" size={20} color="#fff" />
          <Text style={styles.resumeText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderChannelCard = ({ item }: any) => (
    <TouchableOpacity style={styles.channelCard}>
      <View style={styles.channelLogo}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />

          <Text style={styles.liveText}>AO VIVO</Text>
        </View>

      </View>
      <Text style={styles.channelName}>{item.category_name}</Text>
      <Text style={styles.channelCategory}>{item.category}</Text>
      <View style={styles.viewersContainer}>
        <MaterialIcons name="visibility" size={12} color="#888" />
        <Text style={styles.viewersText}>{item.viewers}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7e1a1aff" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}

        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#a70101ff']}
            tintColor="#a70101ff"
          />
        }
      >
        {/* Header Principal */}
        <LinearGradient
          colors={['#490202ff', '#2c0101ff', '#000000ff']}
          style={styles.mainHeader}
        >
          <View style={styles.topBar}>
            <TouchableOpacity >
            </TouchableOpacity>
            <View style={styles.profileSection}>
              <TouchableOpacity style={styles.profileButton}>
                <MaterialIcons name="search" size={24} color="#ffffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.notificationButton}>
                <MaterialIcons name="notifications" size={22} color="#fff" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Bem-vindo</Text>
            <Text style={styles.userName}>{user}</Text>
          </View>


        </LinearGradient>

        {/* Destaques (Carrossel) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Em Destaque</Text>
            <TouchableOpacity>

            </TouchableOpacity>
          </View>

          <FlatList
            data={featuredContent}
            renderItem={renderFeaturedItem}
            keyExtractor={item => item.stream_id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={screenWidth}
            decelerationRate="fast"
            contentContainerStyle={styles.featuredContainer}
          />
        </View>

        {/* Continue Assistindo 
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Assistindo</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Histórico</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={continueWatching}
            renderItem={renderContinueCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.continueContainer}
          />
        </View>
        */}

        {/* Filmes Populares */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Filmes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={popularMovies}
            renderItem={renderMovieCard}
            keyExtractor={item => item.stream_id}
            horizontal
            showsHorizontalScrollIndicator={false}
            onEndReached={GetStreamList}
            onEndReachedThreshold={0.1}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            contentContainerStyle={styles.moviesContainer}
          />
        </View>

        {/* Séries em Destaque */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Séries</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={featuredSeries}
            renderItem={renderSeriesCard}
            keyExtractor={item => item.series_id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.seriesContainer}
          />
        </View>

        {/* Canais ao Vivo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Canais ao Vivo</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Grade completa</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={liveChannels}
            renderItem={renderChannelCard}
            keyExtractor={item => item.category_id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.channelsContainer}
          />
        </View>

        {/* Recomendados para Você */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recomendados para Você</Text>
          </View>

          <View style={styles.recommendedGrid}>
            {popularMovies.slice(50, 54).map((movie: any) => (
              <TouchableOpacity
                key={movie.stream_id}
                style={styles.recommendedCard}
              >
                <Image
                  source={{ uri: movie.stream_icon || movie.cover }}
                  style={styles.recommendedImage}
                  cachePolicy='disk'
                />
                <Text style={styles.recommendedTitle} numberOfLines={1}>
                  {movie.title}
                </Text>
                <Text style={styles.recommendedMeta}>
                  {movie.release_date} • {movie.duration}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>AS IPTV Premium</Text>
          <Text style={styles.footerText}>
            Tenha recursos de download e muito mais
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeText}>FAZER UPGRADE</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Player Flutuante (se algo estiver em reprodução)
            <TouchableOpacity style={styles.floatingPlayer}>
              <View style={styles.playerInfo}>
                <MaterialIcons name="play-arrow" size={20} color="#fff" />
                <View style={styles.playerDetails}>
                  <Text style={styles.playerTitle} numberOfLines={1}>Venom: O Último Ciclo</Text>
                  <Text style={styles.playerSubtitle}>45:20 / 2:18:00</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closePlayer}>
                <MaterialIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 20,
  },
  mainHeader: {
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4757',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  seeAllText: {
    color: '#a70101ff',
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1aff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#a70101ff',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  featuredContainer: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: screenWidth - 40,
    height: CAROUSEL_HEIGHT,
    borderRadius: 15,
    marginRight: 20,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredInfo: {
    marginTop: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  ratingText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  featuredDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  metaDot: {
    color: 'rgba(255,255,255,0.7)',
    marginHorizontal: 8,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a70101ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  playText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  moviesContainer: {
    paddingHorizontal: 20,
  },
  movieCard: {
    width: POSTER_WIDTH,
    marginRight: 15,
  },
  posterImage: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  qualityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#a70101ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  qualityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  movieInfo: {
    marginTop: 10,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  movieYear: {
    fontSize: 12,
    color: '#888',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movieRating: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 3,
  },
  movieDuration: {
    fontSize: 12,
    color: '#888',
  },
  continueContainer: {
    paddingHorizontal: 20,
  },
  continueCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#1a1a1aff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  continuePoster: {
    width: '100%',
    height: 100,
    position: 'relative',
  },
  continueImage: {
    width: '100%',
    height: '100%',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a70101ff',
  },
  continueInfo: {
    padding: 12,
  },
  continueTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  continueSeason: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  continueTime: {
    fontSize: 11,
    color: '#a70101ff',
    marginBottom: 10,
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a70101ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  resumeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  seriesContainer: {
    paddingHorizontal: 20,
  },
  seriesCard: {
    width: 140,
    marginRight: 15,
  },
  seriesPoster: {
    width: 140,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  seriesInfo: {
    marginTop: 10,
  },
  seriesRating: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  seriesRatingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  seriesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  seriesSeason: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  seriesEpisodes: {
    fontSize: 11,
    color: '#a70101ff',
  },
  channelsContainer: {
    paddingHorizontal: 20,
  },
  channelCard: {
    width: 120,
    height: 150,
    backgroundColor: '#1a1a1aff',
    borderRadius: 15,
    alignItems: 'center',
    padding: 20,
    marginRight: 15,
  },
  channelLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#a70101ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  liveBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4757',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginRight: 3,
  },
  liveText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  channelName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  channelCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  viewersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewersText: {
    fontSize: 11,
    color: '#888',
    marginLeft: 3,
  },
  recommendedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  recommendedCard: {
    width: (screenWidth - 50) / 2,
    marginBottom: 20,
  },
  recommendedImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: '#333',
    marginBottom: 10,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  recommendedMeta: {
    fontSize: 12,
    color: '#888',
  },
  footer: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: '#1a1a1aff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a70101ff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  upgradeText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  floatingPlayer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(167, 1, 1, 0.9)',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerDetails: {
    marginLeft: 10,
    flex: 1,
  },
  playerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  playerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  closePlayer: {
    padding: 5,
  },
});