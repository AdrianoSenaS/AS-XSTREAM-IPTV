import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  TextInput,
  StatusBar,
  Animated,
  Modal,
  Share
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { 
  MaterialIcons, 
  Ionicons, 
  Feather 
} from '@expo/vector-icons';


const { width: screenWidth } = Dimensions.get('window');

export default function CategoryDetailScreen() {
  const { category } =[]
  
  // Estado para dados da categoria
  const [categoryData, setCategoryData] = useState({
    id: category?.id || '1',
    name: category?.name || 'Ação e Aventura',
    icon: category?.icon || 'explosion',
    color: category?.color || '#FF6B6B',
    description: category?.description || 'Explosões, perseguições e muita adrenalina! Os melhores filmes de ação e aventura para você.',
    totalItems: 1250,
    newThisWeek: 15,
    trendingItems: 45
  });

  const [selectedFilter, setSelectedFilter] = useState('populares');
  const [layoutMode, setLayoutMode] = useState('grid');
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('recentes');
  const scrollY = useRef(new Animated.Value(0)).current;

  // Dados de exemplo para a categoria
  const categoryItems = [
    // Filmes
    {
      id: '1',
      title: 'VENOM: O ÚLTIMO CICLO',
      year: '2024',
      rating: 4.5,
      duration: '2h 18m',
      quality: '4K',
      type: 'filme',
      genre: 'Ação/Ficção',
      poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400',
      description: 'A batalha final entre Venom e Toxin decide o destino da humanidade.',
      director: 'Andy Serkis',
      actors: ['Tom Hardy', 'Michelle Williams', 'Woody Harrelson'],
      isNew: true,
      isTrending: true
    },
    {
      id: '2',
      title: 'DEADPOOL & WOLVERINE',
      year: '2024',
      rating: 4.7,
      duration: '2h 32m',
      quality: '4K',
      type: 'filme',
      genre: 'Ação/Comédia',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
      description: 'A dupla mais improvável dos X-Men se une para uma missão impossível.',
      director: 'Shawn Levy',
      actors: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin'],
      isNew: true,
      isTrending: true
    },
    {
      id: '3',
      title: 'GUERRA CIVIL',
      year: '2024',
      rating: 4.3,
      duration: '1h 49m',
      quality: '4K',
      type: 'filme',
      genre: 'Ação/Drama',
      poster: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400',
      description: 'Em um Estados Unidos fracturado, jornalistas lutam pela verdade.',
      director: 'Alex Garland',
      actors: ['Kirsten Dunst', 'Cailee Spaeny', 'Wagner Moura'],
      isNew: true,
      isTrending: false
    },
    {
      id: '4',
      title: 'JOHN WICK 4',
      year: '2023',
      rating: 4.8,
      duration: '2h 49m',
      quality: '4K',
      type: 'filme',
      genre: 'Ação/Thriller',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      description: 'John Wick descobre um caminho para derrotar a Alta Cúpula.',
      director: 'Chad Stahelski',
      actors: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsgård'],
      isNew: false,
      isTrending: true
    },
    {
      id: '5',
      title: 'MISSÃO: IMPOSSÍVEL 7',
      year: '2023',
      rating: 4.4,
      duration: '2h 43m',
      quality: '4K',
      type: 'filme',
      genre: 'Ação/Aventura',
      poster: 'https://images.unsplash.com/photo-1595769812725-4c6564f7528b?w=400',
      description: 'Ethan Hunt e sua equipe enfrentam sua missão mais perigosa até agora.',
      director: 'Christopher McQuarrie',
      actors: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames'],
      isNew: false,
      isTrending: true
    },
    // Séries
    {
      id: '6',
      title: 'THE BOYS',
      year: '2019-2024',
      rating: 4.6,
      seasons: 4,
      episodes: 32,
      type: 'serie',
      genre: 'Ação/Comédia',
      poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400',
      description: 'Vigilantes que combatem super-heróis corruptos.',
      status: 'Em andamento',
      nextEpisode: 'S4 E8 - 25/07/2024',
      isNew: true,
      isTrending: true
    },
    {
      id: '7',
      title: 'THE MANDALORIAN',
      year: '2019-2024',
      rating: 4.4,
      seasons: 4,
      episodes: 32,
      type: 'serie',
      genre: 'Ação/Ficção',
      poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
      description: 'Um caçador de recompensas no universo Star Wars.',
      status: 'Em andamento',
      nextEpisode: 'S4 E3 - 18/07/2024',
      isNew: false,
      isTrending: true
    },
    {
      id: '8',
      title: 'STRANGER THINGS',
      year: '2016-2024',
      rating: 4.7,
      seasons: 5,
      episodes: 42,
      type: 'serie',
      genre: 'Ação/Terror',
      poster: 'https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=400',
      description: 'Um grupo de crianças enfrenta forças sobrenaturais.',
      status: 'Última temporada',
      nextEpisode: 'S5 E1 - 2025',
      isNew: false,
      isTrending: true
    },
    {
      id: '9',
      title: 'PEAKY BLINDERS',
      year: '2013-2022',
      rating: 4.7,
      seasons: 6,
      episodes: 36,
      type: 'serie',
      genre: 'Ação/Drama',
      poster: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
      description: 'Uma família gangster na Inglaterra pós-Primeira Guerra.',
      status: 'Concluída',
      nextEpisode: 'Concluída',
      isNew: false,
      isTrending: false
    },
    {
      id: '10',
      title: 'BREAKING BAD',
      year: '2008-2013',
      rating: 4.9,
      seasons: 5,
      episodes: 62,
      type: 'serie',
      genre: 'Ação/Drama',
      poster: 'https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?w=400',
      description: 'Um professor de química se torna um barão das drogas.',
      status: 'Concluída',
      nextEpisode: 'Concluída',
      isNew: false,
      isTrending: false
    },
  ];

  // Filtros disponíveis
  const filters = [
    { id: 'populares', name: 'Populares', icon: 'trending-up' },
    { id: 'recentes', name: 'Recentes', icon: 'new-releases' },
    { id: 'avaliacao', name: 'Melhor Avaliação', icon: 'star' },
    { id: 'az', name: 'A-Z', icon: 'sort-by-alpha' },
  ];

  // Tipos de conteúdo
  const contentTypes = [
    { id: 'all', name: 'Todos' },
    { id: 'filme', name: 'Filmes' },
    { id: 'serie', name: 'Séries' },
  ];

  // Qualidades disponíveis
  const qualities = [
    { id: 'all', name: 'Todas' },
    { id: '4k', name: '4K' },
    { id: 'hd', name: 'HD' },
    { id: 'sd', name: 'SD' },
  ];

  // Anos disponíveis
  const years = [
    { id: 'all', name: 'Todos' },
    { id: '2024', name: '2024' },
    { id: '2023', name: '2023' },
    { id: '2022', name: '2022' },
    { id: '2021', name: '2021' },
    { id: '2020', name: '2020' },
  ];

  // Ordenação
  const sortOptions = [
    { id: 'recentes', name: 'Mais Recentes' },
    { id: 'antigos', name: 'Mais Antigos' },
    { id: 'avaliacao', name: 'Melhor Avaliação' },
    { id: 'az', name: 'A-Z' },
    { id: 'za', name: 'Z-A' },
  ];

  // Subcategorias relacionadas
  const relatedSubcategories = [
    { id: '1', name: 'Super-heróis', count: 230 },
    { id: '2', name: 'Espionagem', count: 180 },
    { id: '3', name: 'Guerra', count: 150 },
    { id: '4', name: 'Artes Marciais', count: 120 },
    { id: '5', name: 'Carros', count: 95 },
    { id: '6', name: 'Western', count: 80 },
  ];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [350, 100],
    extrapolate: 'clamp',
  });

  const shareCategory = async () => {
    try {
      await Share.share({
        message: `Confira a categoria "${categoryData.name}" no AS IPTV! ${categoryData.totalItems} conteúdos incríveis esperando por você.`,
        title: categoryData.name
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderItemGrid = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemGridCard}
      onPress={() => {
        if (item.type === 'filme') {
          //navigation.navigate('MovieDetail', { movie: item });
        } else {
         // navigation.navigate('SeriesDetail', { series: item });
        }
      }}
    >
      <View style={styles.posterContainer}>
        <Image 
          source={{ uri: item.poster }} 
          style={styles.gridPoster}
          resizeMode="cover"
        />
        {item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NOVO</Text>
          </View>
        )}
        {item.isTrending && (
          <View style={styles.trendingBadge}>
            <MaterialIcons name="trending-up" size={12} color="#fff" />
          </View>
        )}
        <View style={styles.qualityBadge}>
          <Text style={styles.qualityText}>
            {item.type === 'filme' ? item.quality : item.seasons + 'T'}
          </Text>
        </View>
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      
      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.gridYear}>{item.year}</Text>
        <View style={styles.gridMeta}>
          <Text style={styles.gridMetaText}>
            {item.type === 'filme' ? item.duration : `${item.seasons} temporadas`}
          </Text>
          <View style={styles.typeBadge}>
            <MaterialIcons 
              name={item.type === 'filme' ? 'movie' : 'tv'} 
              size={10} 
              color="#fff" 
            />
            <Text style={styles.typeText}>
              {item.type === 'filme' ? 'FILME' : 'SÉRIE'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderItemList = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemListCard}
      onPress={() => {
        if (item.type === 'filme') {
          //navigation.navigate('MovieDetail', { movie: item });
        } else {
         // navigation.navigate('SeriesDetail', { series: item });
        }
      }}
    >
      <Image 
        source={{ uri: item.poster }} 
        style={styles.listPoster}
        resizeMode="cover"
      />
      
      <View style={styles.listInfo}>
        <View style={styles.listHeader}>
          <View style={styles.listTitleContainer}>
            <Text style={styles.listTitle} numberOfLines={1}>{item.title}</Text>
            {item.isNew && (
              <View style={styles.listNewBadge}>
                <Text style={styles.listNewText}>NOVO</Text>
              </View>
            )}
          </View>
          <View style={styles.listRating}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.listRatingText}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.listYear}>{item.year}</Text>
        
        <View style={styles.listMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons 
              name={item.type === 'filme' ? 'movie' : 'tv'} 
              size={14} 
              color="#888" 
            />
            <Text style={styles.metaText}>
              {item.type === 'filme' ? 'Filme' : 'Série'}
            </Text>
          </View>
          
          {item.type === 'filme' ? (
            <>
              <Text style={styles.metaDot}>•</Text>
              <View style={styles.metaItem}>
                <MaterialIcons name="access-time" size={14} color="#888" />
                <Text style={styles.metaText}>{item.duration}</Text>
              </View>
              <Text style={styles.metaDot}>•</Text>
              <View style={styles.qualityBadgeSmall}>
                <Text style={styles.qualityTextSmall}>{item.quality}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.metaDot}>•</Text>
              <View style={styles.metaItem}>
                <MaterialIcons name="layers" size={14} color="#888" />
                <Text style={styles.metaText}>{item.seasons} temporadas</Text>
              </View>
              <Text style={styles.metaDot}>•</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </>
          )}
        </View>
        
        <Text style={styles.listDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.listFooter}>
          <TouchableOpacity style={styles.watchButton}>
            <MaterialIcons name="play-arrow" size={18} color="#fff" />
            <Text style={styles.watchText}>ASSISTIR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.infoButton}>
            <MaterialIcons name="info" size={18} color="#a70101ff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSubcategory = ({ item }) => (
    <TouchableOpacity style={styles.subcategoryCard}>
      <LinearGradient
        colors={['rgba(167,1,1,0.2)', 'rgba(167,1,1,0.05)']}
        style={styles.subcategoryGradient}
      >
        <Text style={styles.subcategoryName}>{item.name}</Text>
        <Text style={styles.subcategoryCount}>{item.count} conteúdos</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7e1a1aff" />
      
      {/* Header Fixo Reduzido */}
      <Animated.View style={[styles.fixedHeader, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={['#7e1a1aff', '#a70101ff', '#812a2aff']}
          style={styles.headerGradient}
        >
          <View style={styles.fixedHeaderContent}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Animated.Text 
              style={[
                styles.fixedHeaderTitle,
                { opacity: headerOpacity }
              ]}
              numberOfLines={1}
            >
              {categoryData.name}
            </Animated.Text>
            <View style={styles.fixedHeaderIcons}>
              <TouchableOpacity onPress={() => setLayoutMode(layoutMode === 'grid' ? 'list' : 'grid')}>
                <MaterialIcons 
                  name={layoutMode === 'grid' ? 'view-list' : 'grid-view'} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={shareCategory}>
                <Feather name="share-2" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      
        scrollEventThrottle={16}
      >
        {/* Header Principal Expandido */}
        

        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder={`Buscar em ${categoryData.name}...`}
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={styles.advancedFilterButton}
            onPress={() => setShowAdvancedFilters(true)}
          >
            <MaterialIcons name="filter-list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Filtros Rápidos */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButtonItem,
                selectedFilter === filter.id && styles.filterButtonItemActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <MaterialIcons 
                name={filter.icon} 
                size={18} 
                color={selectedFilter === filter.id ? '#a70101ff' : '#fff'} 
              />
              <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Subcategorias Relacionadas */}
        <View style={styles.subcategoriesContainer}>
          <Text style={styles.sectionTitle}>Subcategorias Relacionadas</Text>
          <FlatList
            data={relatedSubcategories}
            renderItem={renderSubcategory}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subcategoriesList}
          />
        </View>

        {/* Conteúdos da Categoria */}
        <View style={styles.contentSection}>
          <View style={styles.contentHeader}>
            <View>
              <Text style={styles.contentTitle}>Conteúdos Disponíveis</Text>
              <Text style={styles.contentSubtitle}>
                {categoryItems.length} itens encontrados
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={() => {}}
            >
              <MaterialIcons name="refresh" size={22} color="#a70101ff" />
            </TouchableOpacity>
          </View>

          {layoutMode === 'grid' ? (
            <FlatList
              data={categoryItems}
              renderItem={renderItemGrid}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContainer}
            />
          ) : (
            <FlatList
              data={categoryItems}
              renderItem={renderItemList}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          )}

          {/* Botão Carregar Mais */}
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>CARREGAR MAIS CONTEÚDOS</Text>
            <MaterialIcons name="expand-more" size={24} color="#a70101ff" />
          </TouchableOpacity>
        </View>

        {/* Destaques da Categoria */}
        <View style={styles.highlightsContainer}>
          <View style={styles.highlightsHeader}>
            <Text style={styles.highlightsTitle}>Em Destaque</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightsScroll}
          >
            {categoryItems.filter(item => item.isTrending).slice(0, 3).map(item => (
              <TouchableOpacity 
                key={item.id}
                style={styles.highlightCard}
                onPress={() => {
                  if (item.type === 'filme') {
                    navigation.navigate('MovieDetail', { movie: item });
                  } else {
                    navigation.navigate('SeriesDetail', { series: item });
                  }
                }}
              >
                <Image 
                  source={{ uri: item.poster }} 
                  style={styles.highlightImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.highlightGradient}
                >
                  <View style={styles.highlightContent}>
                    <View style={styles.highlightBadge}>
                      <MaterialIcons name="whatshot" size={14} color="#fff" />
                      <Text style={styles.highlightBadgeText}>EM ALTA</Text>
                    </View>
                    <Text style={styles.highlightTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.highlightRating}>
                      {item.rating}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recomendações */}
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>Você Também Pode Gostar</Text>
          <View style={styles.recommendationsGrid}>
            {categoryItems.slice(0, 4).map(item => (
              <TouchableOpacity 
                key={item.id}
                style={styles.recommendationCard}
                onPress={() => {
                  if (item.type === 'filme') {
                    navigation.navigate('MovieDetail', { movie: item });
                  } else {
                    navigation.navigate('SeriesDetail', { series: item });
                  }
                }}
              >
                <Image 
                  source={{ uri: item.poster }} 
                  style={styles.recommendationImage}
                  resizeMode="cover"
                />
                <Text style={styles.recommendationTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.recommendationMeta}>
                  {item.year} • {item.type === 'filme' ? 'Filme' : 'Série'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Filtros Avançados */}
      <Modal
        visible={showAdvancedFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAdvancedFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros Avançados</Text>
              <TouchableOpacity onPress={() => setShowAdvancedFilters(false)}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {/* Tipo de Conteúdo */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Tipo de Conteúdo</Text>
                <View style={styles.typesContainer}>
                  {contentTypes.map(type => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.typeButton,
                        selectedQuality === type.id && styles.typeButtonActive
                      ]}
                    >
                      <Text style={[
                        styles.typeText,
                        selectedQuality === type.id && styles.typeTextActive
                      ]}>
                        {type.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Qualidade */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Qualidade</Text>
                <View style={styles.qualitiesContainer}>
                  {qualities.map(quality => (
                    <TouchableOpacity
                      key={quality.id}
                      style={[
                        styles.qualityButton,
                        selectedQuality === quality.id && styles.qualityButtonActive
                      ]}
                      onPress={() => setSelectedQuality(quality.id)}
                    >
                      <Text style={[
                        styles.qualityButtonText,
                        selectedQuality === quality.id && styles.qualityButtonTextActive
                      ]}>
                        {quality.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Ano */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Ano de Lançamento</Text>
                <View style={styles.yearsContainer}>
                  {years.map(year => (
                    <TouchableOpacity
                      key={year.id}
                      style={[
                        styles.yearButton,
                        selectedYear === year.id && styles.yearButtonActive
                      ]}
                      onPress={() => setSelectedYear(year.id)}
                    >
                      <Text style={[
                        styles.yearButtonText,
                        selectedYear === year.id && styles.yearButtonTextActive
                      ]}>
                        {year.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Ordenação */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Ordenar Por</Text>
                <View style={styles.sortContainer}>
                  {sortOptions.map(sort => (
                    <TouchableOpacity
                      key={sort.id}
                      style={[
                        styles.sortButton,
                        selectedSort === sort.id && styles.sortButtonActive
                      ]}
                      onPress={() => setSelectedSort(sort.id)}
                    >
                      <Text style={[
                        styles.sortButtonText,
                        selectedSort === sort.id && styles.sortButtonTextActive
                      ]}>
                        {sort.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setSelectedQuality('all');
                  setSelectedYear('all');
                  setSelectedSort('recentes');
                }}
              >
                <Text style={styles.resetText}>LIMPAR FILTROS</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowAdvancedFilters(false)}
              >
                <Text style={styles.applyText}>APLICAR FILTROS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Botão Flutuante */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => {
          // Lógica para conteúdo aleatório da categoria
          const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
          if (randomItem.type === 'filme') {
            navigation.navigate('MovieDetail', { movie: randomItem });
          } else {
            navigation.navigate('SeriesDetail', { series: randomItem });
          }
        }}
      >
        <MaterialIcons name="shuffle" size={24} color="#fff" />
        <Text style={styles.floatingButtonText}>Sorteio</Text>
      </TouchableOpacity>
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
  // Header Fixo
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
  fixedHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fixedHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  fixedHeaderIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  // Header Principal
  header: {
    overflow: 'hidden',
  },
  headerGradientFull: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  layoutButton: {
    padding: 5,
  },
  shareButton: {
    padding: 5,
  },
  categoryInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryIconContainer: {
    marginBottom: 15,
  },
  categoryIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
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
  categoryName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  categoryDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  categoryStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  // Barra de Busca
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  advancedFilterButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#a70101ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Filtros
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1a1a1aff',
    marginRight: 10,
  },
  filterButtonItemActive: {
    backgroundColor: '#fff',
  },
  filterText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 5,
  },
  filterTextActive: {
    color: '#a70101ff',
  },
  // Subcategorias
  subcategoriesContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  subcategoriesList: {
    paddingHorizontal: 20,
  },
  subcategoryCard: {
    marginRight: 10,
  },
  subcategoryGradient: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  subcategoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subcategoryCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  // Conteúdos
  contentSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  refreshButton: {
    padding: 5,
  },
  // Grid View
  gridContainer: {
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  itemGridCard: {
    width: (screenWidth - 50) / 2,
  },
  posterContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  gridPoster: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  newText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trendingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF9800',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualityBadge: {
    position: 'absolute',
    bottom: 10,
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
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  gridInfo: {
    paddingHorizontal: 5,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  gridYear: {
    fontSize: 12,
    color: '#a70101ff',
    marginBottom: 6,
  },
  gridMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridMetaText: {
    fontSize: 11,
    color: '#888',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(167,1,1,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  typeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  // List View
  listContainer: {
    paddingBottom: 20,
  },
  itemListCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1aff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  listPoster: {
    width: 100,
    height: 150,
  },
  listInfo: {
    flex: 1,
    padding: 15,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  listNewBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listNewText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  listRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRatingText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  listYear: {
    fontSize: 14,
    color: '#a70101ff',
    fontWeight: '500',
    marginBottom: 10,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  metaDot: {
    fontSize: 12,
    color: '#888',
  },
  qualityBadgeSmall: {
    backgroundColor: 'rgba(167,1,1,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qualityTextSmall: {
    color: '#a70101ff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
  },
  statusText: {
    fontSize: 10,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  listDescription: {
    fontSize: 12,
    color: '#aaa',
    lineHeight: 16,
    marginBottom: 15,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a70101ff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  watchText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  infoButton: {
    padding: 8,
  },
  // Botão Carregar Mais
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1aff',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  loadMoreText: {
    color: '#a70101ff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  // Destaques
  highlightsContainer: {
    marginBottom: 30,
  },
  highlightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  highlightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllText: {
    color: '#a70101ff',
    fontWeight: '500',
  },
  highlightsScroll: {
    paddingHorizontal: 20,
  },
  highlightCard: {
    width: screenWidth * 0.7,
    height: 180,
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
  },
  highlightImage: {
    width: '100%',
    height: '100%',
  },
  highlightGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  highlightContent: {},
  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 87, 34, 0.8)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    gap: 4,
  },
  highlightBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  highlightRating: {
    fontSize: 14,
    color: '#FFD700',
  },
  // Recomendações
  recommendationsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  recommendationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recommendationCard: {
    width: (screenWidth - 50) / 2,
    marginBottom: 20,
  },
  recommendationImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: '#333',
    marginBottom: 10,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    height: 36,
  },
  recommendationMeta: {
    fontSize: 12,
    color: '#888',
  },
  // Modal de Filtros
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1aff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  typeButtonActive: {
    backgroundColor: '#a70101ff',
  },
  typeText: {
    color: '#888',
    fontSize: 14,
  },
  typeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  qualitiesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  qualityButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  qualityButtonActive: {
    backgroundColor: '#a70101ff',
  },
  qualityButtonText: {
    color: '#888',
    fontSize: 14,
  },
  qualityButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  yearsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  yearButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  yearButtonActive: {
    backgroundColor: '#a70101ff',
  },
  yearButtonText: {
    color: '#888',
    fontSize: 14,
  },
  yearButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sortContainer: {
    gap: 10,
  },
  sortButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  sortButtonActive: {
    backgroundColor: '#a70101ff',
  },
  sortButtonText: {
    color: '#888',
    fontSize: 14,
  },
  sortButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 10,
  },
  resetButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 12,
    alignItems: 'center',
  },
  resetText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#a70101ff',
    borderRadius: 12,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Botão Flutuante
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a70101ff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});