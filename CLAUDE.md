# Fegel — Shopify Tema Projesi (CLAUDE.md)

Bu dosyayı her oturumda oku. Mağaza: **b1y1vw-hn.myshopify.com** — "Fegel - Innovation & Comfort".
Üzerinde çalıştığımız tema: **test** (id #145520001178, *unpublished*). Canlı tema **Fegel_Yeni**'ye DOKUNMA.

## ÇALIŞMA KURALI
- `shopify theme push` YAPMA. Hiçbir değişikliği yayınlamadan önce ne değiştiğini özetle ve
  kullanıcının onayını bekle.
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

> Durum tespiti (2026-07-11): Canlı `header-group.json` içinde bu tema için `ghost: false`
> ve `hide_on_scroll: false` — yani şu an KAPALI, istek karşılanıyor.
> ANCAK `headertestvol2.liquid` schema **default'ları `true`** (ghost + hide_on_scroll).
> Yani yeni bir Premium Header bloğu eklenirse/sıfırlanırsa AÇIK gelir. Sahibin isteğine
> tam uyum için schema default'larını `false` yapmak önerilir (onay bekliyor).

## AKTİF (CANLI) DURUM — test teması
- **index.json** (ana sayfa) içinde aktif premium'lar: test2 (Slider), test5 (Tekli Banner),
  test3 (Ürün Vitrini), test (Banner), test4 (Yorumlar).
- **header-group.json**: sadece `headertestvol2` (Premium Header) aktif; eski `header`,
  `announcement-bar-slide`, `store-messages` blokları `disabled: true`.
- **footer-group.json**: sadece `test7` (Premium Footer) aktif; eski `footer` ve
  `newsletter-footer` blokları `disabled: true`.
