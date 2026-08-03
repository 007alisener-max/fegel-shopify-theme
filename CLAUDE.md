# Fegel — Shopify Tema Projesi (CLAUDE.md)

Bu dosyayı her oturumda oku. Mağaza: **b1y1vw-hn.myshopify.com** — "Fegel - Innovation & Comfort".
Üzerinde çalıştığımız tema: **test** (id #145520001178) — **CANLI**.

> **GÜNCEL DURUM (2026-07-16, güncellendi): `test` (#145520001178) YAYINDA/CANLI.**
> Kullanıcı test'i canlıya aldı. **Fegel_Yeni** (#145297768602) ve **Horizon** artık *unpublished*.
> Yani `test`'e yapılan her push **doğrudan müşterinin gördüğü siteye** gider — dikkatli ol.
> Mağaza şifre korumalı ("yakında" sayfası) — dışarı paylaşım için admin'den "Önizlemeyi paylaş".

## ÇALIŞMA KURALI

> **ÖNEMLİ — dev sunucusu CANLIYA senkronluyor (kullanıcının bilinçli tercihi).**
> `shopify theme dev --theme 145520001178` çalışırken **her dosya kaydı anında canlı temaya**
> gider; push etmeye gerek yoktur, ara/yarım durumlar da canlıda görünür.
> Kullanıcı bunu 2026-07-16'da bilerek onayladı ("daha iyi oluyordu canlıdan kontrol edebilmek,
> site çok fazla trafik almıyor zaten"). Yani **tema dosyaları için "pushla" onayı sorma** —
> zaten yayında. Yine de:
> - Bir şeyi bozarsan **canlı bozulur**; büyük/riskli değişikliklerde önce ölç, sonra kaydet.
> - **GitHub commit'i otomatik DEĞİL** — iş bitince mutlaka commit + push yap.
> - Dev sunucusu kapalıyken yapılan düzenlemeler canlıya gitmez; o durumda
>   `shopify theme push --theme 145520001178 --allow-live --only <dosya>` gerekir.

- Push hedefi HER ZAMAN `test` (#145520001178). `test` canlı olduğu için `--allow-live` gerekir.
- Unpublished `Fegel_Yeni` / `Horizon`'a dokunma.
- Kullanıcı tema editöründe ayar değiştirebiliyor → JSON dosyalarını (index.json vb.)
  düzenlemeden önce **`shopify theme pull --only <dosya>`** ile çek, yoksa ezersin.
- Not: ürün görselleri mağaza-seviyesi (REST API) → tüm temaları/storefront'u anında etkiler (tema seçiminden bağımsız).
- Türkçe konuş.

## PREMIUM SECTION AİLESİ
Temadan bağımsız, self-contained premium section'lar. **DİKKAT:** Bu projede dosya adları
`test*` olarak geliştirilmiş; schema `name` ve CSS class prefix'i gerçek premium kimliğini verir.

| Dosya (sections/)        | Schema adı              | Class prefix | Premium aile            |
|--------------------------|-------------------------|--------------|-------------------------|
| headertestvol2.liquid    | Premium Header          | `.ph-`       | premium-header          |
| test2.liquid             | Premium Slider          | `.ps-`       | premium-slider          |
| test.liquid              | Premium Banner          | `.pb-`       | premium-banner          |
| test5.liquid             | Premium Tekli Banner    | `.psb-`      | premium-single-banner   |
| test3.liquid             | Premium Ürün Vitrini    | `.pp-`       | premium-products        |
| test4.liquid             | Premium Yorumlar        | `.pt-`       | premium-testimonials    |
| test7.liquid             | Premium Footer          | `.pf-`       | premium-footer          |
| test6.liquid             | (BOŞ — 0 satır)         | —            | kullanılmıyor           |
| premium-trustbar.liquid  | Premium Güven Şeridi    | `.ptb-`      | premium-trustbar (YENİ) |

## TASARIM DİLİ
- Altın vurgu **#b8860b** (schema'da `accent_color`).
- Alt başlıklar: UPPERCASE + `letter-spacing ~.25em` + ince altın çizgi.
- Animasyon eğrisi: `cubic-bezier(.19,1,.22,1)`.
- Buz camı yüzeyler: `backdrop-filter: blur(...)`.
- Ok ikonlu butonlar.
- Harici kütüphane YOK.
- Sınıflar `.xx-{{ section.id }}` ile scope'lu (uid pattern'i).
- JS'te `root.dataset.init` guard'ı var (çift init engeli).

## KURALLAR / TUZAKLAR
- (a) Shopify `range` input'unda `default`, `step` ile aynı ondalık hassasiyette olmalı;
  yoksa FileSaveError alırsın. (örn. step 0.1 ise default 5 değil 5.0 mantığında olmalı.)
- (b) Header/footer normal template'e değil, Customize'da **Header/Footer grubuna** eklenir
  (`sections/header-group.json`, `sections/footer-group.json`).
- (c) Header temadan bağımsız; sepet ikonu doğrudan **/cart**'a gider, çekmece (drawer) sepet YOK.
- (d) Arama önerisi fiyatı (`suggest.json` / predictive search) simgesiz gelebilir.

## SAHİBİN İSTEĞİ — HEADER
Klasik **sabit** header istiyor: premium-header'da **ghost/hayalet mod KAPALI** ve
**aşağı kaydırınca gizlenme KAPALI** olmalı.

> Durum (2026-07-11): Canlı `header-group.json` içinde bu tema için `ghost: false`
> ve `hide_on_scroll: false` — KAPALI.
> Ayrıca `headertestvol2.liquid` schema **default'ları da `false` yapıldı** (ghost +
> hide_on_scroll). Böylece yeni Premium Header bloğu eklenirse/sıfırlanırsa da KAPALI gelir.

## AKTİF (CANLI) DURUM — test teması
- **2026-07-16 değişiklikleri (canlıya + GitHub'a gönderildi):**
  - Ürün detay (`product-template-1.liquid` + `product-template.css`): "Sepete Ekle" +
    "Hemen Satın Al" butonları yan yana & kompakt (`.pdp-buttons`).
  - Ürün galerisi (`templates/product.json` + `product-template.css`): `image_size`
    square→portrait, `media_style` bottom→**left** (thumbnail'lar solda); galeri görseli
    kırpılmıyor (`object-fit:contain`, çerçeve `.my-gallery .product__photo-wrapper` %120).
  - Premium Ürün Vitrini (`test3.liquid`): kart flex kolon + fiyat/CTA `margin-top:auto` →
    farklı başlık uzunluklarında fiyatlar hizalı.
  - Premium Banner / "Koleksiyonları Keşfet" (`test.liquid`): `.pb-card` `max-width:420px` +
    ortalama → 2/1 sütunlu (tablet/mobil) çözünürlüklerde kart büyümüyor, her çözünürlükte sabit.
  - Ürün görselleri 1200x1800 (2:3) standardına getirildi (`C:\fegel tema\normalize`).
- **index.json** (ana sayfa) 2026-07-11'de sadeleştirildi: 25 → 7 bölüm (18 disabled eski
  bölüm kaldırıldı). Görünen sıra:
  test2 (Slider) → premium-trustbar (Güven Şeridi) → test5 (Tekli Banner) →
  test3 (Ürün Vitrini) → test (Banner) → instagram-customize → test4 (Yorumlar).
- Ana sayfa güzelleştirme (2026-07-11; tema artık canlı olduğu için bunlar da yayında):
  (1) Slider kenar kırpılması giderildi (aspect-ratio 20/9). (2) Güven şeridi eklendi.
  (3) 18 disabled bölüm silindi. (4) Soldaki Dakaas sosyal bar app embed kapatıldı
  (settings_data.json). (5) Bölüm padding'leri 60px'e normalize edildi. (6) Hero preload.
- **header-group.json**: `headertestvol2` (Premium Header) + `announcement-bar-slide`
  (duyuru barı) aktif; eski `header` ve `store-messages` blokları `disabled: true`.
  > Duyuru barı 2026-08-03'te kullanıcı tarafından tema editöründen tekrar AÇILDI.
  > 3 mesaj dönüyor: (1) "SINIRLI SÜRE BOYUNCA TÜM SİPARİŞLERDE **ÜCRETSİZ KARGO**",
  > (2) "2 yıl **resmi distribütör garantisi**", (3) "15:00'a kadar verilen siparişler
  > **aynı gün kargoda**". Metinler `sections/header-group.json` içindeki blok
  > `settings.code` alanlarında (HTML kabul ediyor).
- **footer-group.json**: sadece `test7` (Premium Footer) aktif; eski `footer` ve
  `newsletter-footer` blokları `disabled: true`.

## KARGO AYARI (2026-08-03 tespiti)
- Yurtiçi (Turkey): **0,00 TRY, AKTİF, koşulsuz** → tüm siparişlerde ücretsiz kargo.
  Duyuru barındaki iddia ile uyumlu. Profil 66 varyantın tamamını kapsıyor.
- Tarife açıklaması "14:00'a kadar aynı gün" → **15:00 olmalı** (duyuru barı 15:00 diyor).
  API ile değiştirilemedi: token'da `write_shipping` yok
  (`deliveryProfileUpdate` → ACCESS_DENIED). Panelden elle düzeltilecek.
- Uluslararası bölgede (BAE, Avusturya, Avustralya, Kanada, İsviçre, Belçika)
  **hiç tarife yok** → o ülkelerden ödeme adımı tamamlanamaz.

## TOKEN KAPSAM EKSİKLERİ
- `read_orders` yok → sipariş/iade sorgulanamıyor.
- `write_shipping` yok → kargo tarifesi değiştirilemiyor.
