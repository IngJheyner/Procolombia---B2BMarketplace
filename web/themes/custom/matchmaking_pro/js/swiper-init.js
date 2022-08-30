(function($, Drupal) {
	Drupal.behaviors.viewSlides = {
		attach: function(context, settings) {
			let node = document.querySelector('.node--type-product');
<<<<<<< HEAD
			
			let imagesField = $('.node--type-product.node--view-mode-product-service-presave-preview .field--name-field-images');
=======
			let imagesField = $('.field--name-field-images');
>>>>>>> 786eead6dc7b1c7a50ba7e48e73e8594f4384dde
			imagesField.addClass('swiper-wrapper');
			imagesField.children('.field__item').addClass('swiper-slide');
			let fieldClone = imagesField.clone(true);
			
			fieldClone.insertAfter(imagesField);
			
			imagesField.wrap('<div class="swiper swiper-main" />');
			fieldClone.wrap('<div class="swiper swiper-thumbs" />');


			var swiper = new Swiper(".swiper-thumbs", {
				loop: true,
				spaceBetween: 10,
				slidesPerView: 4,
				freeMode: true,
				watchSlidesProgress: true,
			});
			var swiper2 = new Swiper(".swiper-main", {
				loop: true,
				spaceBetween: 10,
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

