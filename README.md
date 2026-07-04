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

Regla de cruce: si un número aparece como faltante y como repe, manda faltantes. La app lo quita de repes y lo deja registrado como incidencia.

Pruebas:

```bash
npm test
```
