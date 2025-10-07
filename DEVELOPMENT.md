# IPTV Web Player - Guía de Desarrollo

## Estructura del Proyecto

### Configuración Base
- **vite.config.js**: Configuración de Vite con React plugin
- **package.json**: Dependencias del proyecto
- **index.html**: HTML base de la aplicación

### Componentes (`src/components/`)
- **VideoPlayer.jsx**: Reproductor de video con soporte HLS
  - Usa hls.js para navegadores que no soportan HLS nativamente
  - Soporte nativo para Safari
  - Manejo de errores y recuperación automática

### Servicios (`src/services/`)

#### iptvService.js
Servicio principal para comunicación con el servidor IPTV:
- `setCredentials(url, username, password)`: Configura credenciales
- `authenticate()`: Valida credenciales con el servidor
- `getLiveCategories()`: Obtiene categorías de canales
- `getLiveStreams(categoryId)`: Obtiene lista de canales
- `getVODCategories()`: Obtiene categorías de películas
- `getVODStreams(categoryId)`: Obtiene lista de películas
- `getVODInfo(vodId)`: Obtiene detalles de una película
- `getSeriesCategories()`: Obtiene categorías de series
- `getSeries(categoryId)`: Obtiene lista de series
- `getSeriesInfo(seriesId)`: Obtiene detalles de una serie con episodios
- `getStreamUrl(streamId, extension)`: Genera URL para canal en vivo
- `getMovieUrl(streamId, extension)`: Genera URL para película
- `getSeriesUrl(streamId, extension)`: Genera URL para episodio

#### cacheService.js
Gestión de caché local con localStorage:
- `setItem(key, value)`: Guarda datos con timestamp
- `getItem(key)`: Obtiene datos si no han expirado (24h)
- `removeItem(key)`: Elimina un item
- `clear()`: Limpia todo el caché
- `isValid(key)`: Verifica si un item es válido

### Páginas (`src/pages/`)

#### Login.jsx
- Formulario de autenticación
- Validación de URL (http/https)
- Guarda credenciales en caché
- Redirección a página de carga

#### Loading.jsx
- Carga progresiva de contenido
- Muestra progreso visual (0-100%)
- Cachea todos los datos:
  - Categorías de canales
  - Lista de canales
  - Categorías de películas
  - Lista de películas
  - Categorías de series
  - Lista de series
- Manejo de errores con opciones de reintentar

#### Menu.jsx
- Menú principal con 3 opciones
- Navegación a Canales, Películas o Series
- Botón de cerrar sesión

#### Channels.jsx
- Layout de 3 columnas:
  1. **Categorías**: Lista de categorías con contador
  2. **Canales**: Lista con logo y nombre (máx 3 líneas)
  3. **Reproductor**: Video player con info del canal
- Filtrado por categoría
- Reproducción automática al seleccionar canal

#### Movies.jsx
- Layout de 2 columnas:
  1. **Sidebar**: Categorías
  2. **Grid**: Películas en cuadrícula responsiva
- Búsqueda en tiempo real
- Grid adaptativo (3-6 columnas)
- Click en película navega a detalles

#### MovieDetails.jsx
- Reproductor de video
- Información completa:
  - Título
  - Poster
  - Rating
  - Fecha de lanzamiento
  - Duración
  - Géneros
  - Sinopsis
  - Director
  - Reparto
  - Link a trailer en YouTube

#### Series.jsx
- Similar a Movies.jsx
- Layout de 2 columnas con grid responsivo
- Búsqueda y filtrado por categorías
- Click en serie navega a detalles

#### SeriesDetails.jsx
- Reproductor de video
- Información de la serie
- Selector de temporadas
- Lista de episodios con:
  - Thumbnail
  - Número de episodio
  - Título
  - Sinopsis
  - Duración
- Click en episodio para reproducir

### Rutas (`src/App.jsx`)

Todas las rutas excepto login están protegidas con `ProtectedRoute`:

```
/ -> Login
/loading -> Loading (protegida)
/menu -> Menu (protegida)
/channels -> Channels (protegida)
/movies -> Movies (protegida)
/movies/:id -> MovieDetails (protegida)
/series -> Series (protegida)
/series/:id -> SeriesDetails (protegida)
```

## Características Técnicas

### Responsive Design
- **Grid de películas/series**: 
  - Móvil: 3 columnas (min 120px)
  - Tablet: 4-5 columnas (min 160px)
  - Desktop: 5-6 columnas (min 180-200px)
  
- **Layout de canales**:
  - Desktop: 3 columnas fijas
  - Tablet/Móvil: Stack vertical

### Caché
- Duración: 24 horas
- Almacenamiento: localStorage
- Keys:
  - `iptv_credentials`
  - `iptv_live_categories`
  - `iptv_live_streams`
  - `iptv_vod_categories`
  - `iptv_vod_streams`
  - `iptv_series_categories`
  - `iptv_series`

### Video Player
- Soporte HLS con hls.js
- Fallback nativo para Safari
- Controles nativos del navegador
- Poster image
- Auto-play configurable
- Recuperación automática de errores

### Tema
- Colores principales:
  - Primary: #e50914 (rojo estilo Netflix)
  - Background: #141414
  - Surface: #1f1f1f
  - Text: #ffffff / #b3b3b3
- Transiciones suaves
- Hover effects
- Sombras y profundidad

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

## API del Servidor IPTV

La aplicación espera un servidor IPTV compatible con Xtream Codes API:

**Endpoint base**: `{url}/player_api.php`

**Parámetros comunes**:
- `username`: Usuario
- `password`: Contraseña
- `action`: Acción a realizar

**Acciones soportadas**:
- `get_live_categories`: Categorías de canales
- `get_live_streams`: Canales en vivo
- `get_vod_categories`: Categorías de películas
- `get_vod_streams`: Lista de películas
- `get_vod_info`: Detalles de película
- `get_series_categories`: Categorías de series
- `get_series`: Lista de series
- `get_series_info`: Detalles de serie con episodios

## Compatibilidad

✅ Chrome
✅ Firefox
✅ Edge
✅ Safari
✅ Opera
✅ Navegadores móviles (iOS/Android)

## Notas de Implementación

1. **HLS Support**: Se usa hls.js para navegadores que no soportan HLS nativamente
2. **Protected Routes**: Todas las rutas verifican credenciales antes de permitir acceso
3. **Error Handling**: Manejo de errores en todas las llamadas a API
4. **Loading States**: Spinners y mensajes de carga en todas las páginas
5. **Responsive**: Diseño mobile-first con breakpoints para tablet y desktop
