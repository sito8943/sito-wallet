# Guía de estilos — sito-wallet

Breve: esta guía describe cómo se organizan los estilos en el proyecto, las convenciones actuales y cómo añadir/editar CSS para mantener coherencia.

## Resumen rápido
- Stack de CSS: Tailwind (utilidades), hojas CSS co-locadas por componente y reglas globales.
- Variables y tokens: `src/styles/variables.css` define variables de color / breakpoints.
- Estilos globales: `src/index.css` importa `variables.css`, `dashboard.css` y `components.css` y declara reglas globales y animaciones.
- Convención: cada componente que necesita estilos tiene un `styles.css` en su carpeta y normalmente importa `../../styles/variables.css`.
- Tipografías: Poppins y Roboto se importan en `src/main.tsx` con `@fontsource`.

## Estructura del proyecto (árbol visual)

```
sito-wallet/
├── 📄 package.json                    # Dependencias y scripts
├── 📄 vite.config.ts                  # Configuración Vite
├── 📄 tsconfig.json                   # Configuración TypeScript
├── 📄 eslint.config.js                # Configuración ESLint
├── 📄 index.html                      # HTML principal
├── 📄 README.md
├── 📄 STYLE_GUIDE.md                  # Esta guía
├── 📁 public/
│   └── 📄 vite.svg
└── 📁 src/                            # Código fuente principal
    ├── 📄 main.tsx                    # Punto de entrada (fuentes, estilos, providers)
    ├── 📄 App.tsx                     # Componente principal (onboarding, rutas)
    ├── 📄 Routes.tsx                  # Definición de rutas
    ├── 📄 index.css                   # Estilos globales (importa styles/*)
    ├── 📄 config.ts                   # Configuración de la app (proviente del .env)
    ├── 📄 i18.ts                      # Configuración i18n
    ├── 📄 globals.d.ts                # Definiciones TypeScript globales (Requerido para solucionar Issue con Fontsource)
    ├── 📄 vite-env.d.ts               # Tipos de Vite (Requerido en Vite con TypeScript)
    │
    ├── 📁 assets/                     # Recursos estáticos (Imágenes, Audios, etc.)
    │   └── 📄 react.svg
    │
    ├── 📁 styles/                     # Estilos centralizados
    │   ├── 📄 variables.css           # Tokens CSS (colores, breakpoints)
    │   ├── 📄 components.css          # Utilidades de componentes (.button, .input, etc.)
    │   └── 📄 dashboard.css           # Estilos de para @sito/dashboard
    │
    ├── 📁 components/                 # Componentes UI reutilizables
    │   ├── 📄 index.ts                # Barrel exports
    │   ├── 📁 Actions/                # Botones de acción
    │   │   ├── 📄 Action.tsx
    │   │   ├── 📄 Actions.tsx
    │   │   ├── 📄 ActionsDropdown.tsx
    │   │   ├── 📄 styles.css          # Estilos específicos del componente
    │   │   ├── 📄 types.ts
    │   │   └── 📄 index.ts
    │   ├── 📁 Card/                   # Tarjetas
    │   │   ├── 📄 ItemCard.tsx
    │   │   ├── 📄 ItemCardTitle.tsx
    │   │   ├── 📄 styles.css
    │   │   ├── 📄 types.ts
    │   │   └── 📄 index.ts
    │   ├── 📁 Dialog/                 # Diálogos y modales
    │   │   ├── 📄 Dialog.tsx
    │   │   ├── 📄 ConfirmationDialog.tsx
    │   │   ├── 📄 FormDialog.tsx
    │   │   ├── 📄 styles.css
    │   │   ├── 📄 types.ts
    │   │   └── 📄 index.ts
    │   ├── 📁 Form/                   # Componentes de formulario
    │   │   ├── 📄 FormContainer.tsx
    │   │   ├── 📄 ParagraphInput.tsx
    │   │   ├── 📄 PasswordInput.tsx
    │   │   ├── 📄 styles.css
    │   │   ├── 📄 types.ts
    │   │   └── 📄 index.ts
    │   ├── 📁 Navbar/                 # Barra de navegación
    │   │   ├── 📄 Navbar.tsx
    │   │   ├── 📄 Clock.tsx
    │   │   ├── 📄 styles.css
    │   │   ├── 📄 types.ts
    │   │   └── 📄 index.ts
    │   ├── 📁 Loading/                # Estados de carga
    │   │   ├── 📄 Loading.tsx
    │   │   ├── 📄 SplashScreen.tsx
    │   │   ├── 📄 types.ts
    │   │   └── 📄 index.ts
    │   └── 📁 ... (otros componentes)
    │       ├── Chip/
    │       ├── Drawer/
    │       ├── Dropdown/
    │       ├── Error/
    │       ├── Notification/
    │       ├── Onboarding/
    │       ├── Page/
    │       ├── PrettyGrid/
    │       ├── TabsLayout/
    │       └── WalletTable/
    │
    ├── 📁 hooks/                      # Custom hooks
    │   ├── 📄 index.ts
    │   ├── 📄 useScrollTrigger.tsx
    │   ├── 📄 useTimeAge.tsx
    │   ├── 📁 actions/
    │   ├── 📁 dialogs/
    │   ├── 📁 forms/
    │   ├── 📁 mutate/
    │   └── 📁 queries/
    │
    ├── 📁 providers/                  # Context providers
    │   ├── 📄 index.ts
    │   ├── 📄 AuthProvider.tsx        # Autenticación
    │   ├── 📄 LocalCacheProvider.tsx  # Cache local
    │   ├── 📄 ManagerProvider.tsx     # Gestión estado global
    │   ├── 📄 NotificationProvider.tsx # Notificaciones
    │   └── 📄 types.ts
    │
    ├── 📁 views/                      # Pantallas/vistas principales
    │   ├── 📄 index.ts
    │   ├── 📄 menuMap.tsx             # Mapa de menús
    │   ├── 📄 sitemap.tsx             # Mapa del sitio
    │   ├── 📄 NotFound.tsx            # 404
    │   ├── 📄 types.ts
    │   ├── 📁 Accounts/               # Gestión de cuentas
    │   ├── 📁 Auth/                   # Autenticación (login, signup)
    │   ├── 📁 Currencies/             # Monedas
    │   ├── 📁 Home/                   # Pantalla principal
    │   ├── 📁 Info/                   # Información
    │   ├── 📁 TransactionCategories/  # Categorías de transacciones
    │   └── 📁 Transactions/           # Transacciones
    │
    ├── 📁 layouts/                    # Layouts de página (Componentes que no cambian en una vista)
    │   ├── 📄 index.ts
    │   ├── 📁 Auth/                   # Layout para autenticación
    │   └── 📁 View/                   # Layout principal de vistas
    │
    ├── 📁 lib/                        # Utilidades y helpers
    │   ├── 📄 index.ts
    │   ├── 📄 Notification.ts         # Sistema de notificaciones
    │   ├── 📄 ServiceError.ts         # Manejo de errores de servicio
    │   ├── 📄 ValidationError.ts      # Errores de validación
    │   ├── 📁 api/                    # Wrappers de API
    │   ├── 📁 entities/               # Entidades/modelos
    │   └── 📁 utils/                  # Utilidades generales
    │
    └── 📁 lang/                       # Internacionalización
        ├── 📄 nameSpaces.ts           # Definición de namespaces i18n
        ├── 📁 en/                     # Traducciones en inglés
        └── 📁 es/                     # Traducciones en español
```

## Cómo se usan Tailwind y CSS juntos

- Tailwind está instalado y se utiliza principalmente mediante `@apply` dentro de hojas CSS. Ejemplo en `src/styles/components.css`:
  - `.button { @apply text-text bg-base hover:bg-base-light ... }`
- Además de `@apply`, hay clases CSS propias (p. ej. `.dialog`, `.chip`) que combinan utilidades y reglas personalizadas.
- `variables.css` importa `tailwindcss` y define una sección `@theme { --color-... }` con tokens. El proyecto usa clases semánticas como `bg-base`, `text-text`, `bg-bg-primary` que probablemente están mapeadas en la configuración de Tailwind (busca `tailwind.config.*` si necesitas cambiar utilidades).

## Convenciones de estilos (recomendadas y observadas)

- Co-locación: cada componente que necesita CSS tiene `styles.css` en su carpeta y el componente importa sólo la clase raíz.
- Importar tokens: en la cabecera de cada `styles.css` se hace `@import "../../styles/variables.css";`.
- Nombres de clase: se usan nombres cortos y semánticos (p. ej. `.button`, `.chip`, `.dialog`) y modificadores con clases adicionales (p. ej. `.chip.primary`, `.input.error`). Mantener esa forma evita reglas muy específicas.
- Uso de Tailwind: preferir `@apply` para componer utilidades en reglas reutilizables; en el JSX usar clases semánticas en vez de mezclar muchas utilidades inline.
- Responsividad: se observan utilidades como `min-xs:` y `max-xs:` en los CSS; mantenerlas en las hojas de estilos cuando la modificación afecta al componente.

## Patrón para añadir un nuevo componente con CSS

1. Crear carpeta del componente en `src/components/MyComponent/`.
2. Añadir `MyComponent.tsx` y `styles.css`.
3. En `styles.css` empezar por importar tokens: `@import "../../styles/variables.css";`.
4. Declarar una clase raíz, p. ej. `.my-component { @apply flex gap-2 p-4 bg-base; }`.
5. Añadir modificadores si se requiere: `.my-component.primary { @apply bg-bg-primary text-base; }`.
6. En el `tsx` usar sólo la clase raíz y los modificadores: `<div className="my-component primary">...</div>`.

Ejemplo mínimo de `styles.css`:

```css
@import "../../styles/variables.css";

.my-component {
  @apply flex items-center gap-2 bg-base p-3 rounded-2xl;
}

.my-component.primary {
  @apply bg-bg-primary text-base;
}
```

## Tokens y cómo tematizar

- Cambiar paleta: editar `src/styles/variables.css` (ahí están `--color-...`).
- Si necesitas exponer nuevos utilitarios semánticos (`bg-base`, `text-text`, etc.), revisa `tailwind.config.js` (si existe) para mapear variables o extender theme.
- Para modo oscuro, recomendamos añadir un bloque `:root[data-theme='dark'] { ... }` en `variables.css` y aprovechar las mismas clases semánticas.

## Tipos de reglas vistas en el repo

- Reglas globales (en `index.css`): tipografías por elemento, animaciones (apparition, appear, disappear), utilidades genéricas (`.chip`, `.elevated`).
- Componentes: reglas co-locadas que combinan `@apply` con selectores simples y clases `opened/closed` para estados.

## Recomendaciones y buenas prácticas

- Mantener la co-locación: evita un `styles` global con reglas específicas de componente.
- Mantener clases pequeñas y semánticas; evita reglas CSS profundamente anidadas.
- Evitar mezclar demasiadas utilidades Tailwind en JSX; centraliza estilos reusables con `@apply`.
- Documentar cualquier nuevo token en `variables.css` con un comentario y ejemplo de uso.
- Añadir pruebas visuales mínimas (sandbox story o snapshot) para componentes con estilos complejos.

## Dónde tocar para cambiar cosas comunes

- Colores y tokens: `src/styles/variables.css`
- Reglas base / animaciones: `src/index.css`
- Componentes reutilizables (botones, inputs): `src/styles/components.css`
- Estilo de un componente concreto: `src/components/<Nombre>/styles.css`

## Siguientes pasos sugeridos

- (Opcional) Buscar `tailwind.config.*` si quieres mapear utilidades nuevas o cambiar breakpoints.
- (Opcional) Añadir `CONTRIBUTING.md` con un pequeño apartado de `styles` para el equipo.

---
Guía generada a partir de los archivos leídos: `package.json`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/styles/variables.css`, `src/styles/components.css` y muestras de `styles.css` de componentes.
