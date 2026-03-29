# Plan Legal y de Cumplimiento - Sito Wallet

Fecha: 2026-03-29  
Estado: Pendiente de ejecucion

## Objetivo

Cerrar los huecos detectados en `about`, `terms and conditions`, `cookies policy` y `privacy policy`, alineando contenido legal y comportamiento real de la app (web + almacenamiento local + sync offline).

## Alcance

- App `wallet` (frontend).
- Textos legales ES/EN.
- Navegacion/rutas relacionadas con paginas legales.
- Mecanismo de consentimiento de cookies (si aplica cookies no exentas).

## Problemas a resolver (resumen)

- `CookiesPolicy` y `PrivacyPolicy` vacias.
- Terminos incompletos (falta identificacion legal y canales formales).
- Inconsistencias de rutas/keys i18n en paginas legales.
- Falta transparencia sobre almacenamiento local e IndexedDB.
- Falta mecanismo operativo de consentimiento/revocacion de cookies.

## Plan por fases

## Fase 0 - Correcciones criticas de visibilidad

- [x] Corregir typo de ruta en sitemap:
  - [x] `src/views/sitemap.tsx` cambiar `"/termns-and-conditions"` por `"/terms-and-conditions"`.
- [x] Unificar claves i18n de paginas legales entre ES y EN:
  - [x] `src/lang/es/_pages.json` y `src/lang/en/_pages.json` alineados con keys de `PageId` (`terms-and-conditions`, `cookies-policy`, `privacy-policy`).
- [x] Evitar paginas vacias:
  - [x] Implementar contenido renderizable en `src/views/Info/CookiesPolicy.tsx`.
  - [x] Implementar contenido renderizable en `src/views/Info/PrivacyPolicy.tsx`.

## Fase 1 - Redaccion legal completa (ES/EN)

- [x] `Terms and Conditions`:
  - [x] Incluir identificacion del prestador (titular, domicilio, email legal, NIF si aplica).
  - [x] Definir alcance del servicio, licencia de uso, limitaciones y responsabilidad.
  - [x] Definir modificaciones de terminos (fecha y entrada en vigor).
  - [x] Incluir jurisdiccion/ley aplicable y via de contacto.
- [x] `Privacy Policy`:
  - [x] Responsable del tratamiento y contacto.
  - [x] Finalidades concretas por tratamiento.
  - [x] Base juridica por finalidad.
  - [x] Categorias de datos tratadas.
  - [x] Destinatarios/encargados y transferencias internacionales.
  - [x] Plazos de conservacion o criterios.
  - [x] Derechos RGPD y como ejercerlos.
  - [x] Derecho a reclamar ante AEPD.
  - [x] Medidas de seguridad (alto nivel, sin revelar detalles sensibles).
- [x] `Cookies Policy`:
  - [x] Inventario real de cookies y tecnologias similares.
  - [x] Finalidad, titular, duracion y tipo por cada una.
  - [x] Distinguir tecnicas (exentas) vs no exentas.
  - [x] Explicar como retirar/reconfigurar consentimiento.
  - [x] Añadir fecha de ultima actualizacion.
- [x] `About`:
  - [x] Mantener contenido de producto, pero enlazar claramente a terminos/privacidad/cookies.
  - [x] Añadir fecha de revision legal.

## Fase 2 - Implementacion tecnica de consentimiento

- [ ] Diseñar flujo de consentimiento:
  - [ ] Banner/capa 1 con botones `Aceptar`, `Rechazar`, `Configurar` al mismo nivel.
  - [ ] Capa 2 con detalle por categorias.
- [ ] Persistencia de decision del usuario:
  - [ ] Guardar estado de consentimiento por categoria y fecha.
  - [ ] Permitir revocacion tan facil como aceptar.
- [ ] Bloqueo preventivo:
  - [ ] No activar cookies/tecnologias no exentas antes del consentimiento.
- [ ] Punto de reconfiguracion permanente:
  - [ ] Link visible "Gestionar cookies" en footer o perfil.
- [ ] Si solo hay cookies tecnicas:
  - [ ] Documentar formalmente por que son exentas y mantener politica igualmente publicada.

## Fase 3 - Coherencia legal-tecnica y evidencia

- [ ] Crear matriz de tratamientos (interna):
  - [ ] Dato -> finalidad -> base juridica -> retencion -> destinatarios.
- [ ] Inventario tecnico:
  - [ ] `localStorage`, `sessionStorage`, `IndexedDB`, cookies, endpoints, websockets.
- [ ] Versionado:
  - [ ] Añadir `lastUpdated` en textos legales.
  - [ ] Mantener changelog legal interno.
- [ ] Revisión de seguridad y privacidad:
  - [ ] Revisar minimizacion de datos guardados localmente.
  - [ ] Revisar tiempos de retencion de metadatos/snapshots.

## Checklist de implementacion por archivos

- [ ] `src/views/Info/CookiesPolicy.tsx`
- [ ] `src/views/Info/PrivacyPolicy.tsx`
- [ ] `src/views/Info/TermsAndConditions.tsx` (render + estructura)
- [ ] `src/views/Info/About.tsx` (enlaces legales + revision)
- [ ] `src/lang/es/_pages.json` (contenido legal completo ES)
- [ ] `src/lang/en/_pages.json` (contenido legal completo EN)
- [ ] `src/views/sitemap.tsx` (ruta terminos)
- [ ] `src/views/menuMap.tsx` (validar rutas y etiquetas)
- [ ] `src/Routes.tsx` (confirmar rutas definitivas)
- [ ] `src/layouts/View/Footer.tsx` (opcional: acceso directo a gestionar cookies)

## Checklist de validacion final

- [ ] No existe ninguna pagina legal vacia.
- [ ] Todas las rutas legales responden y coinciden con menu/sitemap/search.
- [ ] ES y EN muestran el mismo alcance legal (sin huecos).
- [ ] Politica de privacidad describe exactamente los datos que la app trata.
- [ ] Politica de cookies coincide con inventario tecnico real.
- [ ] Se puede rechazar cookies no necesarias desde la primera capa.
- [ ] Se puede revocar consentimiento facilmente en cualquier momento.
- [ ] Se muestra fecha de ultima actualizacion en las 4 paginas legales.
- [ ] QA funcional y accesibilidad basica del banner/paginas legales.
- [ ] Revision final por asesoria legal antes de publicar en produccion.

## Nota operativa

Este plan reduce riesgo de cumplimiento, pero no sustituye una revision de abogado especializado en privacidad/TIC en Espana/UE antes de release.
