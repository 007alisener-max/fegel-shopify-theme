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
  };

  /**
   * Filtre sonrasi indeksler degistigi icin aktif slayti yeniden hizala.
   * Varyantin kendi one cikan gorseli filtrelenmis listede varsa ona,
   * yoksa ilk gorsele git.
   */
  VariantMediaFilter.prototype.syncActive = function () {
    var target = this.featuredMediaId;
    var index = 0;

    if (target != null) {
      var $visible = this.$main.find('.product-single__photo');
      $visible.each(function (i) {
        if (String($(this).attr('data-image-id')) === String(target)) index = i;
      });
    }

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
