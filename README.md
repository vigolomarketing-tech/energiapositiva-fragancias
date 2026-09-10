# Energía Positiva — Fragancias que inspiran

Demo web para **Energía Positiva**, marca argentina de perfumes y aromatizadores (José Mármol, Buenos Aires).

Sitio estático (HTML + CSS + JS vanilla, sin frameworks ni build) pensado mobile-first para tráfico de Instagram.

## Estructura

```
index.html          Marcado principal (hero, catálogo, carrito, checkout, footer)
css/style.css        Estilos (paleta negro / hueso / dorado, mobile-first)
js/products.js       Catálogo de productos — editar acá para sumar/sacar/modificar productos
js/app.js            Lógica: filtros, carrito (en memoria), checkout y armado del mensaje de WhatsApp
assets/              Logo, favicon y mandala decorativa (SVG)
```

## Editar el catálogo

Todo el catálogo vive en `js/products.js`. Cada producto es un objeto:

```js
{
  id: 16,
  name: "Nombre de la fragancia",
  category: "arabes", // arabes | for-him | for-her | body-splash | home-spray | difusor-varillas | difusor-auto
  family: "Descripción corta de la familia olfativa",
  price: 30000,
  volume: "100cc",
  variant: "negro",   // opcional, solo se usa en árabes (negro/blanco)
  tag: "Más vendido",  // opcional
}
```

## WhatsApp

El número de contacto (`5491165582626`) está definido en `js/app.js` (`WHATSAPP_NUMBER`) y en los enlaces del botón flotante / footer de `index.html`.

## Publicar en GitHub Pages

1. Subí el contenido a la rama que vayas a servir (por ejemplo `main`).
2. En el repo: **Settings → Pages → Source**, elegí la rama y la carpeta raíz (`/`).
3. Guardá — GitHub Pages publica `index.html` automáticamente, no requiere build.

No hay dependencias ni pasos de compilación: es HTML/CSS/JS plano.
