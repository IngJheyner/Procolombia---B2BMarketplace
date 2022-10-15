(function($, Drupal) {
	Drupal.behaviors.viewSlides = {
		attach: function(context, settings) {
			let node = document.querySelector('.node--type-product');

			let imagesField = $('.node--type-product.node--view-mode-product-service-presave-preview .field--name-field-images');
			let prFullImgField = $('.node--type-product.node--view-mode-full .field--name-field-images');
			
			$(context).find('.node--view-mode-full').once('.node--type-product').each(function () {
				addSwipper(prFullImgField);
			});
			$(context).find('.node--type-product').once('.node--type-product').each(function () {

				addSwipper(imagesField);
				
			});
			function addSwipper(image){
				image.addClass('swiper-wrapper');
				image.children('.field__item').addClass('swiper-slide');
				let fieldClone = image.clone(true);
				
				image.wrap('<div class="carrusel-thumbs-wrapper" />');
				fieldClone.insertAfter(image);
	
				image.wrap('<div class="swiper swiper-main" />');
				fieldClone.wrap('<div class="swiper swiper-thumbs" />');
	
				$('<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>').insertAfter('.swiper-main');
			}
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

