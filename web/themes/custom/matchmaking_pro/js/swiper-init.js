(function($, Drupal) {
	Drupal.behaviors.viewSlides = {
		attach: function(context, settings) {
			let node = document.querySelector('.node--type-product');
			let imagesField = $('.field--name-field-images');
			imagesField.addClass('swiper-wrapper');
			imagesField.children('.field__item').addClass('swiper-slide');
			let fieldClone = imagesField.clone(true);
			
			fieldClone.insertAfter(imagesField);
			
			imagesField.wrap('<div class="swiper swiper-main" />');
			fieldClone.wrap('<div class="swiper swiper-thumbs" />');
			/*
			let fieldImage = node.querySelector('.field--name-field-images');
			fieldImage.parentElement.classList.add('swiper');
			// fieldImage.parentElement.classList.add('carousel-field-images');
			fieldImage.classList.add('swiper-wrapper');
			fieldImage.querySelectorAll('.field__item').forEach(e => {
				e.classList.add('swiper-slide');
			});
			
			let sliderTop = fieldImage.parentElement;
			let sliderThumbs = sliderTop.cloneNode(true);
			sliderTop.insertAdjacentHTML('afterend', sliderThumbs);*/

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

