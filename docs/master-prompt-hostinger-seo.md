# Master prompt · Hostinger → dentalnubix.com listo para SEO (sitio en GitHub Pages)

Pégalo completo en el asistente de Hostinger (Kodee) o en un agente con acceso al panel. Si el asistente no puede ejecutar algún paso, que lo marque como "manual" y te diga dónde hacerlo.

---

## ROL
Eres un administrador de dominios y DNS con enfoque en SEO técnico. Vas a dejar `dentalnubix.com` configurado según buenas prácticas, para que su sitio estático, alojado en **GitHub Pages** (usuario `crvz-oscar`), cargue rápido, seguro, indexable y sin contenido duplicado.

## CONTEXTO (no lo cambies)
- Dominio: `dentalnubix.com`, registrado en Hostinger. **El sitio NO se aloja en Hostinger**: solo se usa el registro del dominio y su DNS. No contrates ni actives hosting, constructor de sitios, "Hostinger Website Builder", CDN ni complementos de pago.
- Dirección canónica del sitio: **`https://dentalnubix.com`** (sin www). `www` redirige a la dirección canónica.
- **`app.dentalnubix.com`** y **`consola.dentalnubix.com`** pertenecen a la aplicación (Google Cloud). Si ya existen registros para esas direcciones, **déjalos intactos**. Si no existen, no los crees.
- Producto: Dental Nubix, expediente clínico electrónico para odontología (México). Público: clínicas dentales en México.

## ANTES DE TOCAR NADA
1. Exporta o copia la lista actual de registros DNS (tipo, nombre, valor, TTL) y muéstramela.
2. Dime qué registros vas a borrar o cambiar y por qué. Espera mi "adelante" solo si hay registros que no reconozcas (por ejemplo de correo o de otra app). Los de estacionamiento ("parked") o de Hostinger Website Builder/hosting en el apex y `www` se pueden quitar sin preguntar.

## 1 · DNS para GitHub Pages
En la zona DNS de `dentalnubix.com`:
- **Elimina** cualquier A, AAAA o CNAME del apex (`@`) y de `www` que apunte a Hostinger o a una página de estacionamiento. Un CNAME en `@` está prohibido: no lo dejes.
- **Crea 4 registros A** en `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- **Crea 4 registros AAAA** en `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
- **Crea 1 CNAME** `www` → `crvz-oscar.github.io`
- TTL: 3600 s (o el mínimo que permita el panel que no sea menor a 300).
- No uses redirecciones del panel de Hostinger (forwarding) para el apex: el redireccionamiento de `www` → apex lo hace GitHub Pages por sí solo al configurar el dominio personalizado.

## 2 · Seguridad del dominio (también ayuda al SEO: confianza y disponibilidad)
- Activa **bloqueo de transferencia** (domain lock).
- Activa **renovación automática** y revisa que el método de pago no venza antes de la próxima renovación; dime la fecha de vencimiento.
- Activa **protección de privacidad WHOIS**.
- Activa **DNSSEC** si Hostinger lo ofrece para este dominio; si no, dímelo.
- Agrega un registro **CAA**: `@  CAA  0 issue "letsencrypt.org"` (GitHub Pages emite su certificado con Let's Encrypt). No agregues otras autoridades.
- Activa verificación en dos pasos en la cuenta de Hostinger si no está activa.

## 3 · Verificaciones que me van a pedir después (déjalas listas para pegar)
Cuando yo te dé el valor, crea estos registros TXT; mientras tanto, solo confirma que sabes cómo:
- `_github-pages-challenge-crvz-oscar` TXT → valor que da GitHub (verifica el dominio y evita que otro lo secuestre).
- `@` TXT → `google-site-verification=…` (Google Search Console, propiedad de dominio).
- Bing Webmaster Tools: se importa desde Search Console, no requiere registro extra.
No borres TXT existentes.

## 4 · Correo (evita suplantación, que daña la reputación del dominio)
- Si **no** hay buzones con este dominio hoy: crea `@ TXT "v=spf1 -all"` y `_dmarc TXT "v=DMARC1; p=reject; adkim=s; aspf=s"`.
- Si **sí** hay correo en el dominio (Hostinger Email, Google Workspace u otro): conserva los MX y SPF existentes, verifica que haya DKIM y agrega `_dmarc TXT "v=DMARC1; p=none; rua=mailto:<mi correo>"` para empezar a monitorear. Dime cuál de los dos casos es.

## 5 · Lo que NO debes hacer
- No dejes contenido de Hostinger visible en `dentalnubix.com` ni en `www`.
- No crees redirecciones 302 permanentes ni cadenas de redirecciones (`http://www` → `https://www` → `https://` es una cadena; GitHub Pages ya lo resuelve en un salto).
- No agregues subdominios con wildcard (`*`).
- No cambies los nameservers a otro proveedor.

## 6 · Verificación final (hazla tú y repórtame el resultado)
Con `dig`/`nslookup` o una herramienta de DNS en línea, confirma:
1. `dentalnubix.com` resuelve a las 4 IP A y 4 AAAA de arriba.
2. `www.dentalnubix.com` es CNAME de `crvz-oscar.github.io`.
3. CAA, SPF y DMARC existen como quedaron.
4. `app.dentalnubix.com` y `consola.dentalnubix.com` siguen como estaban (si existían).
5. Dominio con bloqueo, privacidad WHOIS y renovación automática activos.
Después de que yo active "Enforce HTTPS" en GitHub, probaré: `http://dentalnubix.com`, `http://www.dentalnubix.com` y `https://www.dentalnubix.com` → todas deben terminar en `https://dentalnubix.com/` con un solo salto 301.

## 7 · Entrega
Responde con una tabla "antes / después" de los registros DNS, la lista de lo que quedó pendiente de mi parte (por ejemplo, el valor del TXT de GitHub o de Google) y cualquier paso que hayas tenido que dejar como manual.

---

### Qué hago yo (no es parte del prompt)
Ya viene en el repositorio del sitio: `CNAME`, `robots.txt`, `sitemap.xml`, `llms.txt`, etiqueta canónica, Open Graph, datos estructurados (Organization, SoftwareApplication, FAQPage), página 404, imágenes con tamaño y texto alternativo, y fuentes propias sin bloqueo de render. Falta de tu lado: dar de alta el dominio en Google Search Console y Bing, y activar **Enforce HTTPS** en GitHub Pages cuando el certificado esté listo.
