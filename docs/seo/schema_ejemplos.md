# Ejemplos de schema JSON-LD

> Los bloques siguientes están comentados para evitar ejecución automática.

```json
// Organization
// TODO: Sustituir valores por los datos reales.
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TODO: Nombre de la organización",
  "url": "https://www.ejemplo.com",
  "logo": "https://www.ejemplo.com/assets/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/todo",
    "https://twitter.com/todo"
  ],
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+34 000 000 000",
    "contactType": "customer support"
  }]
}
```

```json
// WebSite
// TODO: Ajustar siteSearch y target.
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://www.ejemplo.com",
  "name": "TODO: Nombre del sitio",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.ejemplo.com/buscar?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

```json
// Product
// TODO: Completar datos de precio e identificación.
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "TODO: Nombre del producto",
  "image": [
    "https://www.ejemplo.com/assets/producto.jpg"
  ],
  "description": "TODO: Descripción breve del producto",
  "sku": "TODO: SKU",
  "brand": {
    "@type": "Brand",
    "name": "TODO: Marca"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": "TODO: Precio",
    "url": "https://www.ejemplo.com/plan",
    "availability": "https://schema.org/InStock"
  }
}
```
