# 02. ImportDialog y `useImportDialog`

## Contexto local a absorber

1. Fork local de componente:
2. `sito-wallet/web/src/components/Dialog/ImportDialog.tsx`
3. `sito-wallet/web/src/components/Dialog/ImportDialog/Error.tsx`
4. `sito-wallet/web/src/components/Dialog/ImportDialog/Loading.tsx`
5. `sito-wallet/web/src/components/Dialog/ImportDialog/Preview.tsx`
6. Fork local de hook:
7. `sito-wallet/web/src/hooks/useImportDialog.tsx`
8. Delta funcional clave que necesitamos upstream:
9. `renderCustomPreview` para reemplazar preview JSON por preview custom.

## Instrucción literal para `@sito/dashboard-app`

1. **No crear** nuevo dialog ni nuevo hook.
2. Actualiza `ImportDialog` existente.
3. Actualiza `useImportDialog` existente.
4. Agrega soporte oficial a `renderCustomPreview` de forma opcional y retrocompatible.

## Cambios exactos

1. En tipos de `ImportDialog`, agrega:
2. `renderCustomPreview?: (items?: EntityDto[] | null) => ReactNode`.
3. En el componente `ImportDialog`, renderiza preview así:
4. si `renderCustomPreview` existe, usarlo con `previewItems`.
5. si no existe, mantener preview por defecto actual.
6. Mantener intacto lo que ya funciona:
7. `fileProcessor`.
8. `onFileProcessed`.
9. `onOverrideChange`.
10. re-procesado al cambiar `override`.
11. guardas de submit (`no file/no preview`).
12. En tipos de hook (`UseImportDialogPropsType`), agrega `renderCustomPreview` opcional.
13. En `useImportDialog`, propagar `renderCustomPreview` en el retorno para que `ImportDialog` la reciba.
14. No eliminar ni degradar `onError` existente del hook.

## Compatibilidad obligatoria

1. Todo uso actual sin `renderCustomPreview` debe seguir funcionando igual.
2. Todo uso actual con `fileProcessor` y `override` debe seguir igual.
3. No romper exports públicos (`ImportDialog`, `useImportDialog`, tipos asociados).

## Pruebas obligatorias

1. Añadir test para `ImportDialog` con `renderCustomPreview` y `previewItems` no vacíos.
2. Añadir test para `ImportDialog` con `renderCustomPreview` y `previewItems` vacíos/null.
3. Añadir test para `useImportDialog` validando passthrough de `renderCustomPreview`.
4. Mantener tests actuales de flujo de import.

## Done de este caso

1. En consumidor se puede borrar fork local de dialog/hook y usar solo `@sito/dashboard-app`.
