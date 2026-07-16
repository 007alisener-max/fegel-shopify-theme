/**
 * Varyanta gore urun galerisi filtresi (alt metin yontemi).
 *
 * Bir gorselin alt metninde urunun secenek degerlerinden biri geciyorsa
 * (orn. "Pembe titresimli fitness platformu"), o gorsel yalnizca o secenek
 * secildiginde gosterilir. Alt metninde hicbir secenek degeri gecmeyen
 * gorseller (lifestyle, detay cekimi vb.) her zaman gorunur.
 *
 * Eslesme etiketi Liquid tarafinda hesaplanip data-media-color olarak basilir.
 * Burada sadece filtreleme yapilir.
 */
(function () {
  if (window.VariantMediaFilter) return;

  // Bu script jQuery'den once yuklenebiliyor; hazir olana kadar bekle.
  var tries = 0;
  (function waitForJquery() {
    if (window.jQuery) return boot(window.jQuery);
    if (++tries > 200) return; // ~10sn sonra vazgec
    setTimeout(waitForJquery, 50);
  })();

  function boot($) {
  function norm(value) {
    return (value == null ? '' : String(value)).toLowerCase().trim();
  }

  function VariantMediaFilter(root) {
    this.$root = $(root);
    this.sectionId = this.$root.attr('data-vmf-section');
    this.$main = $('.gallery-wrap' + this.sectionId);
    this.$thumbs = $('.product-single__thumbnails-' + this.sectionId);
    this.selected = norm(this.$root.attr('data-vmf-selected'))
      .split('|')
      .filter(Boolean);
    // Ilk yuklemede secili renge ait ilk gorsele gideriz; sonraki gecislerde
    // variantChange bize varyantin one cikan medyasini verir.
    this.featuredMediaId = null;
    this._syncTimers = [];

    this.bindEvents();
    this.apply();
  }

  VariantMediaFilter.prototype.bindEvents = function () {
    var self = this;

    // Tema variantChange'i section container'inda tetikliyor; document'a
    // bubble ettigi icin theme.js'e dokunmadan yakaliyoruz.
    $(document).on('variantChange', function (evt) {
      var variant = evt.variant;
      if (!variant) return;
      self.selected = (variant.options || []).map(norm).filter(Boolean);
      self.featuredMediaId = variant.featured_media ? variant.featured_media.id : null;
      self.apply();
    });

    // Slick bizden sonra kurulursa filtreyi tekrar uygula.
    this.$main.add(this.$thumbs).on('init', function () {
      self.apply();
    });
  };

  VariantMediaFilter.prototype.matches = function ($el) {
    var color = norm($el.attr('data-media-color'));
    if (!color) return true; // etiketsiz => ortak gorsel
    if (!this.selected.length) return true;
    return this.selected.indexOf(color) !== -1;
  };

  /**
   * Bir slick sarmalayicisini (veya duz listeyi) filtreler.
   * Hicbiri eslesmiyorsa filtre uygulanmaz - galeriyi bos birakmaktansa
   * her seyi gostermek daha guvenli.
   */
  VariantMediaFilter.prototype.filterWrapper = function ($wrapper, itemSelector) {
    var self = this;
    var isSlick = $wrapper.hasClass('slick-initialized');

    if (isSlick) $wrapper.slick('slickUnfilter');

    var $items = $wrapper.find(itemSelector);
    if (!$items.length) return;

    // Globo swatch uygulamasi galeriyi SIRAYA gore grupluyor (bir varyanta atali
    // gorselden sonraki tum gorseller, bir sonraki atali gorsele kadar o varyanta
    // ait sayiliyor). Tek baglayici alt metin olsun diye sinifini temizliyoruz;
    // CSS override'i da yedek olarak duruyor.
    $items.removeClass('globo-sw-media--hide');

    var matched = $items.filter(function () {
      return self.matches($(this));
    }).length;

    if (matched === 0 || matched === $items.length) {
      if (!isSlick) $items.css('display', '');
      return; // filtrelenecek bir sey yok
    }

    if (isSlick) {
      $wrapper.slick('slickFilter', function () {
        return self.matches($(this));
      });
      $wrapper.slick('setPosition');
    } else {
      $items.each(function () {
        $(this).css('display', self.matches($(this)) ? '' : 'none');
      });
    }
  };

  VariantMediaFilter.prototype.apply = function () {
    this.filterWrapper(this.$main, '.product-single__photo');
    this.filterWrapper(this.$thumbs, '.product-single__thumbnail-item');
    this.syncActive();

    // Tema variantChange'de kendi gorsel gecisini yapiyor ve bu bizim
    // hizalamamizdan SONRA bitebiliyor (slick init + ~600ms gecis animasyonu).
    // Ana gorselin etiketsiz bir slaytta kalmamasi icin sonradan tekrar hizala.
    var self = this;
    this._syncTimers.forEach(clearTimeout);
    this._syncTimers = [250, 700].map(function (ms) {
      return setTimeout(function () {
        self.syncActive();
      }, ms);
    });
  };

  /**
   * Filtre sonrasi indeksler degistigi icin aktif slayti yeniden hizala.
   *
   * Baglayici tek kaynak alt metin oldugu icin, Shopify'in varyanta atadigi
   * one cikan gorsel ancak alt metni de secili renkle eslesiyorsa dikkate
   * alinir. Uyusmuyorsa (orn. varyanta etiketsiz bir gorsel atanmissa) o rengin
   * ilk gorseline gideriz.
   */
  VariantMediaFilter.prototype.syncActive = function () {
    var self = this;
    var target = this.featuredMediaId;
    var index = -1;
    var $visible = this.$main.find('.product-single__photo');

    if (target != null) {
      $visible.each(function (i) {
        if (String($(this).attr('data-image-id')) !== String(target)) return;
        var color = norm($(this).attr('data-media-color'));
        if (color && self.selected.indexOf(color) !== -1) index = i;
      });
    }

    if (index === -1) {
      $visible.each(function (i) {
        if (index !== -1) return;
        var color = norm($(this).attr('data-media-color'));
        if (color && self.selected.indexOf(color) !== -1) index = i;
      });
    }

    if (index === -1) index = 0;

    if (this.$main.hasClass('slick-initialized')) {
      this.$main.slick('slickGoTo', index, true);
    }
    if (this.$thumbs.hasClass('slick-initialized')) {
      this.$thumbs.slick('slickGoTo', index, true);
    }

    var $thumbItems = this.$thumbs.find('.product-single__thumbnail-item');
    $thumbItems.removeClass('is-active');
    $thumbItems.eq(index).addClass('is-active');
  };

  window.VariantMediaFilter = VariantMediaFilter;

  $(function () {
    $('.photos[data-vmf-section]').each(function () {
      if ($(this).data('vmfBound')) return;
      $(this).data('vmfBound', true);
      new VariantMediaFilter(this);
    });
  });
  } // boot
})();
