(function($, Drupal) {
	Drupal.behaviors.viewSlides = {
		attach: function(context, settings) {
			let node = document.querySelector('.node--type-product');

			let imagesField = $('.node--type-product.node--view-mode-product-service-presave-preview .field--name-field-images');

			imagesField.addClass('swiper-wrapper');
			imagesField.children('.field__item').addClass('swiper-slide');
			let fieldClone = imagesField.clone(true);
			
			imagesField.wrap('<div class="carrusel-thumbs-wrapper" />');
			fieldClone.insertAfter(imagesField);

			imagesField.wrap('<div class="swiper swiper-main" />');
			fieldClone.wrap('<div class="swiper swiper-thumbs" />');

			$('<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>').insertAfter('.swiper-main');

			var swiper = new Swiper(".swiper-thumbs", {
				loop: false,
				spaceBetween: 5,
				slidesPerView: 5,
				freeMode: true,
				watchSlidesProgress: true,
			});
			var swiper2 = new Swiper(".swiper-main", {
				loop: true,
				spaceBetween: 10,
				slidesPerView: 1,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
				thumbs: {
					swiper: swiper,
				},
			});
			
			/*
				Toggle button play || pause
			*/
			const buttonPlayStop = once('homeSwiper', context.querySelector('.swiper-play'));

			if (buttonPlayStop[0] != null) {
				buttonPlayStop[0].addEventListener('click', _btn => {
					let 
					btn = _btn.target;

					while (btn.tagName != 'BUTTON') {
						btn = btn.parentElement;
					}

					if (btn.dataset.play == 'true') {
						btn.dataset.play = false;
						
						homeSwiper.autoplay.stop();
					} else {
						btn.dataset.play = true;
						homeSwiper.autoplay.start();
					}
				});
			}
		}
	}
})(jQuery, Drupal);

