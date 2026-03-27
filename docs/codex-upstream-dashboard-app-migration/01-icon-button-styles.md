# 01. IconButton styles (`src/components/Buttons`)

## Contexto local a absorber

1. Fuente local: `sito-wallet/web/src/components/Buttons/styles.css`.
2. Reglas visuales que hoy existen ahí:
3. `.icon-button` con base neutral redondeada.
4. `.icon-button.error:hover` con estilo de error invertido.

## Instrucción literal para `@sito/dashboard-app`

1. **No crear** un nuevo botón. Actualiza el `IconButton` existente (`AppIconButton`) y/o su CSS existente.
2. Incorpora los estilos base del caso local en el CSS del botón compartido de `dashboard-app`.
3. Incorpora el comportamiento hover para estado `error` sin depender de CSS local del consumidor.
4. Mantén compatibilidad con props actuales (`icon`, `className`, `color`, `variant`, etc.).
5. Si el estilo actual de `dashboard-app` ya cubre parte del comportamiento, solo parchea el delta.

## Requisitos de implementación

1. Si hay conflicto entre `className` de consumidor y clase base, respeta `className` adicional.
2. No hardcodear colores.
3. No romper usos actuales como:
4. `className="error"` en botones de acciones de tarjeta.
5. botones sin `color/variant` explícitos.

## Pruebas obligatorias

1. Añadir o ajustar test/story de `IconButton` para verificar:
2. estilo base aplicado sin clases locales del consumidor.
3. hover/error state funcional.
4. compatibilidad con `className` extra del consumidor.

## Done de este caso

1. El consumidor ya no necesita `src/components/Buttons/styles.css` para que `IconButton` se vea correctamente.
