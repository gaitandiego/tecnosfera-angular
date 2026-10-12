# Tecnosfera — Angular + NgRx

Migración del sitio estático HTML/CSS al framework Angular 20 con manejo de
estado en `@ngrx/store`. El diseño visual es el mismo del prototipo original.

> Convención del proyecto: **el código va en inglés** (carpetas, archivos,
> clases, variables) y **los comentarios en español**, igual que en el
> prototipo HTML. Los textos que ve el usuario y las rutas también van en
> español.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Puesta en marcha

```bash
npm install     # instala dependencias
npm start       # servidor de desarrollo en http://localhost:4200
npm run build   # compilación de producción en dist/tecnosfera
npm test        # pruebas unitarias (Karma + Jasmine)
npm run test:ci # pruebas en Chrome headless, sin modo watch
```

Usuario de prueba para entrar a la gestión:

| Campo      | Valor                  |
| ---------- | ---------------------- |
| Usuario    | `admin@tecnosfera.co`  |
| Contraseña | `admin123`             |

## Estructura de carpetas

```
src/app/
├─ core/                      # transversal, se carga una sola vez
│  ├─ guards/                 # authGuard
│  ├─ models/                 # Article, Category, User
│  └─ services/               # backend simulado (news, auth, contact) + storage
│
├─ shared/                    # reutilizable entre pantallas
│  ├─ components/             # header, footer, article-card, image-placeholder
│  └─ pipes/                  # categoryLabel
│
├─ features/                  # una carpeta por pantalla
│  ├─ home/
│  ├─ news/                   # listado + detalle
│  ├─ favorites/
│  ├─ contact/
│  ├─ auth/
│  └─ management/
│
├─ app.component.ts           # shell: header + router-outlet + footer
├─ app.config.ts              # providers raíz (store, effects, router, locale)
└─ app.routes.ts              # rutas con lazy loading
```

Cada feature repite siempre la misma estructura interna:

```
features/<nombre>/
├─ models/                    # interfaces y tipos propios de la pantalla
├─ services/                  # acceso a datos (fachada sobre core/services)
├─ store/                     # NgRx: actions, state (reducer), selectors, effects
├─ components/                # piezas internas que solo usa esta pantalla
├─ pages/                     # componentes de ruta
└─ <nombre>.routes.ts         # rutas + provideState + provideEffects
```

## Estado con NgRx

Cada pantalla tiene su propio slice con cuatro archivos:

| Archivo               | Responsabilidad                                        |
| --------------------- | ------------------------------------------------------ |
| `*.actions.ts`        | Eventos, declarados con `createActionGroup`            |
| `*.state.ts`          | Forma del estado + `createReducer` (función pura)      |
| `*.selectors.ts`      | Lectura y cálculo derivado (filtros, paginación, etc.) |
| `*.effects.ts`        | Efectos secundarios: llamadas al servicio, navegación  |

Slices y dónde se registran:

| Slice        | Registro                                | Motivo                                              |
| ------------ | --------------------------------------- | --------------------------------------------------- |
| `auth`       | Raíz (`app.config.ts`)                  | El header y el guard lo leen fuera de su ruta        |
| `favorites`  | Raíz (`app.config.ts`)                  | El detalle de la noticia también marca favoritos     |
| `home`       | `home.routes.ts` (`provideState`)       | Solo se usa en esa pantalla                          |
| `news`       | `news.routes.ts`                        | Solo se usa en listado y detalle                     |
| `contact`    | `contact.routes.ts`                     | Solo se usa en esa pantalla                          |
| `management` | `management.routes.ts`                  | Solo se usa en esa pantalla, además protegida        |

Flujo típico de una pantalla:

```
Componente ──dispatch(Action)──► Store ──► Reducer ──► nuevo estado
     ▲                             │                        │
     │                             └──► Effect ──► Service ─┘
     └──────────selectSignal(Selector)◄──────────────────────
```

El componente nunca llama al servicio directamente: despacha una acción y lee
selectores con `selectSignal`, lo que permite `ChangeDetectionStrategy.OnPush`
en toda la aplicación.

## Rutas

| Ruta            | Pantalla                  | Protegida |
| --------------- | ------------------------- | --------- |
| `/`             | Portada                   | No        |
| `/noticias`     | Listado con filtros       | No        |
| `/noticias/:id` | Detalle de la noticia     | No        |
| `/favoritos`    | Noticias guardadas        | No        |
| `/contacto`     | Formulario de contacto    | No        |
| `/ingresar`     | Inicio de sesión          | No        |
| `/gestion`      | Crear y eliminar noticias | Sí (`authGuard`) |

Todas las rutas usan `loadChildren` / `loadComponent`, así que cada pantalla se
descarga en su propio chunk.

## Datos

No hay backend todavía. Las noticias base viven en `public/data/news.json` —
el mismo archivo del prototipo HTML, con las mismas diez noticias, categorías e
imágenes— y `core/services/news-api.service.ts` las descarga con `HttpClient`
una sola vez (`shareReplay`) y las comparte entre todas las pantallas. Cuando
exista una API real solo cambia esa clase; ni el store ni los componentes se
tocan.

Como el archivo es de solo lectura, la gestión trabaja igual que el prototipo:
las noticias creadas se guardan aparte (con ids desde 1001) y de las que vienen
del archivo solo se guarda el id cuando se eliminan.

Claves usadas en `localStorage`:

| Clave                   | Contenido                              |
| ----------------------- | -------------------------------------- |
| `tecnosfera:created`    | Noticias creadas desde gestión          |
| `tecnosfera:removed`    | Ids de noticias eliminadas              |
| `tecnosfera:favorites`  | Ids guardados como favoritos            |
| `tecnosfera:messages`   | Mensajes del formulario de contacto     |
| `tecnosfera:session`    | Sesión recordada ("Recordarme")         |

Las categorías usan los mismos valores del JSON: `technology`, `networks`,
`security` y `ai`.

## Pruebas unitarias

192 pruebas con Karma + Jasmine, organizadas junto al código que verifican:

| Capa          | Qué se prueba                                                   |
| ------------- | --------------------------------------------------------------- |
| Reducers      | Cada acción produce el estado esperado                          |
| Selectores    | Filtros, búsqueda sin acentos, paginación y conteos             |
| Effects       | Mapeo de éxito y error, con el servicio simulado (`jasmine.createSpyObj`) |
| Servicios     | Backend simulado, persistencia y ordenamientos                  |
| Componentes   | Renderizado y acciones despachadas, con `provideMockStore`       |
| Guard         | Acceso permitido y redirección con `redirectTo`                  |

Nota para quien escriba más pruebas: `overrideSelector` de `MockStore` es
global, así que cada spec que lo use debe llamar `resetSelectors()` en un
`afterEach`, o las demás pruebas heredan valores ajenos.

## Notas de la migración

| Antes (HTML)                          | Ahora (Angular)                                    |
| ------------------------------------- | -------------------------------------------------- |
| 7 archivos `.html` con header repetido| `AppComponent` + `HeaderComponent` compartidos      |
| Tarjetas escritas a mano en el HTML   | `@for` sobre los datos del store                    |
| `estilos.css` único                   | Global (tokens, botones, formularios) + CSS por componente |
| Filtros y buscador sin lógica         | Selectores del store, con paginación real           |
| Estados alternos con el atributo `hidden` | Bloques `@if` según el estado                   |
| Favoritos de ejemplo                  | Slice propio persistido en `localStorage`           |
| Gestión estática                      | Alta y baja reales con confirmación                 |
| `fetch()` sobre `data/news.json`      | `HttpClient` sobre el mismo archivo en `public/`    |
| Avisos armados con `innerHTML`        | `ToastService` + `app-toast` en el marco de la app  |
| Contador de favoritos recalculado a mano | Selector `selectFavoritesCount` en el encabezado |

Los iconos son de Font Awesome y se cargan por CDN desde `src/index.html`, igual
que en el prototipo, así que hace falta internet para verlos.

En `angular.json` la compilación de producción tiene desactivado el inlining de
fuentes (`optimization.fonts.inline: false`) para que el build no dependa de
alcanzar Google Fonts; la fuente se sigue cargando con el `<link>` de
`index.html`.
