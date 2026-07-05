# Cromator

App móvil-first para llevar el control de cromos Panini:

- marca cromos que ya tienes
- apunta los que faltan
- guarda repes con cantidad
- corrige países o listas mal leídas
- cruza repes contra faltantes y muestra incidencias
- exporta el listado actualizado

Todo se guarda en el navegador con `localStorage`. No necesita servidor ni base de datos.

Publicación prevista: `https://guidaitor.es/cromator/`.

Usuario inicial:

- Email: `diego@cromos.es`
- Contraseña: `mundial`

Instancia Super Mario:

- URL: `https://guidaitor.es/cromator-mario/`
- Usuario: `cromosmario`
- Contraseña: `jorge`
- Álbum: `1-180` y `M1-M44`, arranca con `224` faltantes y `0` cromos marcados como tengo.

Regla de cruce: si un número aparece como faltante y como repe, manda faltantes. La app lo quita de repes y lo deja registrado como incidencia.

Pruebas:

```bash
npm test
```
