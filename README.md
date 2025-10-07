# IPTV Web Player

Un reproductor IPTV moderno y responsivo para navegadores web (Chrome, Firefox, Edge, etc.)

## Características

✅ **Página de Login** - Autenticación con usuario, contraseña y URL del servidor (HTTP/HTTPS)
✅ **Carga de Contenido** - Sistema de caché para canales, películas y series
✅ **Menú Principal** - Selección entre Canales, Películas y Series
✅ **Canales en Vivo** - Interfaz de 3 columnas (categorías, lista de canales, reproductor)
✅ **Películas** - Grid responsivo con categorías y búsqueda
✅ **Detalles de Películas** - Reproductor con información completa
✅ **Series** - Grid responsivo con categorías y búsqueda
✅ **Detalles de Series** - Selección de temporadas, episodios y reproductor
✅ **Diseño Responsivo** - Adaptable a cualquier tamaño de pantalla
✅ **Grid Dinámico** - De 3 a 6 columnas según el tamaño de pantalla

## Tecnologías

- React 18
- React Router 6
- Vite
- HLS.js (para streaming HLS)
- Axios (para peticiones HTTP)
- CSS moderno con variables CSS

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

3. Construir para producción:
```bash
npm run build
```

4. Previsualizar la build de producción:
```bash
npm run preview
```

## Uso

1. **Login**: Ingresa las credenciales de tu servidor IPTV
   - URL del servidor (http:// o https://)
   - Usuario
   - Contraseña

2. **Carga**: La aplicación cargará automáticamente todo el contenido disponible

3. **Navegación**: 
   - Selecciona entre Canales, Películas o Series
   - Usa las categorías para filtrar contenido
   - Busca contenido específico con la barra de búsqueda

4. **Reproducción**:
   - Canales: Haz clic en un canal para reproducir
   - Películas: Haz clic en una película para ver detalles y reproducir
   - Series: Selecciona una serie, temporada y episodio para reproducir

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── VideoPlayer.jsx  # Reproductor de video HLS
├── pages/              # Páginas de la aplicación
│   ├── Login.jsx       # Página de login
│   ├── Loading.jsx     # Página de carga de contenido
│   ├── Menu.jsx        # Menú principal
│   ├── Channels.jsx    # Vista de canales
│   ├── Movies.jsx      # Grid de películas
│   ├── MovieDetails.jsx # Detalles de película
│   ├── Series.jsx      # Grid de series
│   └── SeriesDetails.jsx # Detalles de serie con episodios
├── services/           # Servicios
│   ├── iptvService.js  # API del servidor IPTV
│   └── cacheService.js # Gestión de caché local
├── styles/             # Estilos globales
│   └── index.css       # CSS global y variables
├── App.jsx             # Componente principal con rutas
└── main.jsx           # Punto de entrada

```

## Características Técnicas

- **Autenticación**: Sistema de credenciales con localStorage
- **Caché**: Almacenamiento local de contenido por 24 horas
- **Streaming**: Soporte HLS con hls.js y fallback nativo para Safari
- **Responsive**: Grid adaptativo de 3 a 6 columnas
- **Rutas Protegidas**: Navegación segura con validación de sesión

## Compatibilidad

- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Opera
- ✅ Navegadores móviles

## Licencia

MIT