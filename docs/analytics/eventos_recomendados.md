# Eventos recomendados

| Evento                | Descripción breve                                     | Parámetros sugeridos                                   | Ejemplo de registro |
|-----------------------|--------------------------------------------------------|--------------------------------------------------------|---------------------|
| view_hero             | Usuario visualiza el hero completo                    | `{ "section": "hero", "variant": "TODO" }`          | `view_hero - section: hero - variant: control` |
| click_cta_contacto    | Clic en CTA principal de contacto                     | `{ "cta_id": "contacto_principal", "device": "TODO" }` | `click_cta_contacto - cta_id: contacto_principal - device: desktop` |
| ver_productos         | Usuario recorre carrusel/galería de producto          | `{ "items": TODO, "duration": TODO }`                | `ver_productos - items: 3 - duration: 12s` |
| envio_formulario      | Formulario enviado correctamente                      | `{ "form_id": "TODO", "lead_type": "TODO" }`       | `envio_formulario - form_id: demo - lead_type: trial` |
| scroll_profundidad    | Se alcanza umbral de scroll relevante                  | `{ "percent": 25|50|75|100 }`                         | `scroll_profundidad - percent: 75` |
| TODO: evento_extra    | TODO: Definir evento adicional según roadmap          | `{ "TODO": "TODO" }`                                 | `TODO` |
