(function ($, Drupal) {

    let lottieIndex = 0;
    const init = () => {
        new TomSelect('#industria', {
            plugins: ['remove_button'],
            onItemAdd: function () {
                this.setTextboxValue('');
                this.refreshOptions();
            },
            render: {
                option: function (data, escape) {
                    return `
                    <div>
                    <svg class="me-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 10.6 15.9" style="enable-background:new 0 0 10.6 15.9;" xml:space="preserve" width="10.631" height="15.939">
                        <style type="text/css">
                            .st0{fill-rule:evenodd;clip-rule:evenodd;fill:url(#Trazado_11_1_);}
                            .st1{fill-rule:evenodd;clip-rule:evenodd;fill:#BA0C2F;}
                        </style>
                        <linearGradient id="bombillo" gradientUnits="userSpaceOnUse" x1="-4.577637e-05" y1="7.9793" x2="10.631" y2="7.9793">
                            <stop offset="0" style="stop-color:#D88D00"/>
                            <stop offset="1" style="stop-color:#EDC500"/>
                        </linearGradient>
                        <path id="Trazado_11" class="st0" style="fill: url(#bombillo) !important;" d="M2.7,5.5C2.4,5.5,2.1,5.3,2.1,5c0,0,0,0,0,0c0.1-1.7,1.5-3,3.2-3c0.3,0,0.5,0.2,0.5,0.5  S5.6,3,5.3,3C4.2,3,3.2,3.8,3.2,5C3.2,5.3,2.9,5.5,2.7,5.5C2.7,5.5,2.7,5.5,2.7,5.5 M8.7,8.8C8.7,8.8,8.7,8.8,8.7,8.8  C8.6,8.9,8.5,9.1,8.5,9.2V10c0,1.1-1,2-2.1,2H3.7c-0.3,0-0.5,0.2-0.5,0.5S3.4,13,3.7,13h2.1c0.3,0,0.5,0.2,0.5,0.5S6.1,14,5.8,14  H4.5c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0H3.7c-0.8,0.1-1.6-0.5-1.6-1.4C2,11.8,2.6,11,3.5,11c0.1,0,0.2,0,0.3,0h2.7  c0.6,0,1-0.4,1.1-1c0,0,0,0,0,0V9.2c0-0.4,0.2-0.9,0.6-1.1c0,0-0.1,0.1-0.1,0.1C8.9,7.5,9.6,6.3,9.6,5C9.4,2.6,7.4,0.9,5,1  c-2.1,0.1-3.8,1.8-4,4c0,1.3,0.7,2.5,1.7,3.2c-0.1,0-0.1-0.1-0.1-0.1C3,8.4,3.2,8.8,3.2,9.2v0.2c0,0.3-0.3,0.5-0.6,0.5  c-0.3,0-0.5-0.2-0.5-0.5V9.2c0-0.2-0.1-0.3-0.2-0.4c0,0,0,0,0,0C0.7,7.9,0,6.5,0,5c0.2-2.9,2.7-5.2,5.7-5c2.7,0.2,4.8,2.3,5,5  C10.6,6.5,9.9,7.9,8.7,8.8 M4.8,14.9h1.1c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5H4.8c-0.3,0-0.5-0.2-0.5-0.5S4.5,14.9,4.8,14.9"/>
                       <path id="Trazado_122" class="st1" d="M7.2,12.9c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5c-0.3,0-0.5-0.2-0.5-0.5v0  C6.7,13.1,6.9,12.9,7.2,12.9"/>
                    </svg>   
                     ${data.text}
                    </div>`;
                },
                item: function (item, escape) {
                    return `
                    <div>
                    <svg class="me-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 10.6 15.9" style="enable-background:new 0 0 10.6 15.9;" xml:space="preserve" width="10.631" height="15.939">
                        <style type="text/css">
                            .st0{fill-rule:evenodd;clip-rule:evenodd;fill:url(#Trazado_11_1_);}
                            .st1{fill-rule:evenodd;clip-rule:evenodd;fill:#BA0C2F;}
                        </style>
                        <linearGradient id="bombillo" gradientUnits="userSpaceOnUse" x1="-4.577637e-05" y1="7.9793" x2="10.631" y2="7.9793">
                            <stop offset="0" style="stop-color:#D88D00"/>
                            <stop offset="1" style="stop-color:#EDC500"/>
                        </linearGradient>
                        <path id="Trazado_11" class="st0" style="fill: url(#bombillo) !important;" d="M2.7,5.5C2.4,5.5,2.1,5.3,2.1,5c0,0,0,0,0,0c0.1-1.7,1.5-3,3.2-3c0.3,0,0.5,0.2,0.5,0.5  S5.6,3,5.3,3C4.2,3,3.2,3.8,3.2,5C3.2,5.3,2.9,5.5,2.7,5.5C2.7,5.5,2.7,5.5,2.7,5.5 M8.7,8.8C8.7,8.8,8.7,8.8,8.7,8.8  C8.6,8.9,8.5,9.1,8.5,9.2V10c0,1.1-1,2-2.1,2H3.7c-0.3,0-0.5,0.2-0.5,0.5S3.4,13,3.7,13h2.1c0.3,0,0.5,0.2,0.5,0.5S6.1,14,5.8,14  H4.5c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0H3.7c-0.8,0.1-1.6-0.5-1.6-1.4C2,11.8,2.6,11,3.5,11c0.1,0,0.2,0,0.3,0h2.7  c0.6,0,1-0.4,1.1-1c0,0,0,0,0,0V9.2c0-0.4,0.2-0.9,0.6-1.1c0,0-0.1,0.1-0.1,0.1C8.9,7.5,9.6,6.3,9.6,5C9.4,2.6,7.4,0.9,5,1  c-2.1,0.1-3.8,1.8-4,4c0,1.3,0.7,2.5,1.7,3.2c-0.1,0-0.1-0.1-0.1-0.1C3,8.4,3.2,8.8,3.2,9.2v0.2c0,0.3-0.3,0.5-0.6,0.5  c-0.3,0-0.5-0.2-0.5-0.5V9.2c0-0.2-0.1-0.3-0.2-0.4c0,0,0,0,0,0C0.7,7.9,0,6.5,0,5c0.2-2.9,2.7-5.2,5.7-5c2.7,0.2,4.8,2.3,5,5  C10.6,6.5,9.9,7.9,8.7,8.8 M4.8,14.9h1.1c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5H4.8c-0.3,0-0.5-0.2-0.5-0.5S4.5,14.9,4.8,14.9"/>
                       <path id="Trazado_122" class="st1" d="M7.2,12.9c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5c-0.3,0-0.5-0.2-0.5-0.5v0  C6.7,13.1,6.9,12.9,7.2,12.9"/>
                    </svg> 
                     ${item.text}
                    </div>
                    `;
                }
            }
        });
        new TomSelect('#intereses', {
            plugins: ['remove_button'],
            onItemAdd: function () {
                this.setTextboxValue('');
                this.refreshOptions();
            },
            render: {
                option: function (data, escape) {
                    return `
                    <div>
                    <svg class="me-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 10.6 15.9" style="enable-background:new 0 0 10.6 15.9;" xml:space="preserve" width="10.631" height="15.939">
                        <style type="text/css">
                            .st0{fill-rule:evenodd;clip-rule:evenodd;fill:url(#Trazado_11_1_);}
                            .st1{fill-rule:evenodd;clip-rule:evenodd;fill:#BA0C2F;}
                        </style>
                        <linearGradient id="bombillo" gradientUnits="userSpaceOnUse" x1="-4.577637e-05" y1="7.9793" x2="10.631" y2="7.9793">
                            <stop offset="0" style="stop-color:#D88D00"/>
                            <stop offset="1" style="stop-color:#EDC500"/>
                        </linearGradient>
                        <path id="Trazado_11" class="st0" style="fill: url(#bombillo) !important;" d="M2.7,5.5C2.4,5.5,2.1,5.3,2.1,5c0,0,0,0,0,0c0.1-1.7,1.5-3,3.2-3c0.3,0,0.5,0.2,0.5,0.5  S5.6,3,5.3,3C4.2,3,3.2,3.8,3.2,5C3.2,5.3,2.9,5.5,2.7,5.5C2.7,5.5,2.7,5.5,2.7,5.5 M8.7,8.8C8.7,8.8,8.7,8.8,8.7,8.8  C8.6,8.9,8.5,9.1,8.5,9.2V10c0,1.1-1,2-2.1,2H3.7c-0.3,0-0.5,0.2-0.5,0.5S3.4,13,3.7,13h2.1c0.3,0,0.5,0.2,0.5,0.5S6.1,14,5.8,14  H4.5c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0H3.7c-0.8,0.1-1.6-0.5-1.6-1.4C2,11.8,2.6,11,3.5,11c0.1,0,0.2,0,0.3,0h2.7  c0.6,0,1-0.4,1.1-1c0,0,0,0,0,0V9.2c0-0.4,0.2-0.9,0.6-1.1c0,0-0.1,0.1-0.1,0.1C8.9,7.5,9.6,6.3,9.6,5C9.4,2.6,7.4,0.9,5,1  c-2.1,0.1-3.8,1.8-4,4c0,1.3,0.7,2.5,1.7,3.2c-0.1,0-0.1-0.1-0.1-0.1C3,8.4,3.2,8.8,3.2,9.2v0.2c0,0.3-0.3,0.5-0.6,0.5  c-0.3,0-0.5-0.2-0.5-0.5V9.2c0-0.2-0.1-0.3-0.2-0.4c0,0,0,0,0,0C0.7,7.9,0,6.5,0,5c0.2-2.9,2.7-5.2,5.7-5c2.7,0.2,4.8,2.3,5,5  C10.6,6.5,9.9,7.9,8.7,8.8 M4.8,14.9h1.1c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5H4.8c-0.3,0-0.5-0.2-0.5-0.5S4.5,14.9,4.8,14.9"/>
                       <path id="Trazado_122" class="st1" d="M7.2,12.9c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5c-0.3,0-0.5-0.2-0.5-0.5v0  C6.7,13.1,6.9,12.9,7.2,12.9"/>
                    </svg>   
                     ${data.text}
                    </div>`;
                },
                item: function (item, escape) {
                    return `
                    <div>
                    <svg class="me-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 10.6 15.9" style="enable-background:new 0 0 10.6 15.9;" xml:space="preserve" width="10.631" height="15.939">
                        <style type="text/css">
                            .st0{fill-rule:evenodd;clip-rule:evenodd;fill:url(#Trazado_11_1_);}
                            .st1{fill-rule:evenodd;clip-rule:evenodd;fill:#BA0C2F;}
                        </style>
                        <linearGradient id="bombillo" gradientUnits="userSpaceOnUse" x1="-4.577637e-05" y1="7.9793" x2="10.631" y2="7.9793">
                            <stop offset="0" style="stop-color:#D88D00"/>
                            <stop offset="1" style="stop-color:#EDC500"/>
                        </linearGradient>
                        <path id="Trazado_11" class="st0" style="fill: url(#bombillo) !important;" d="M2.7,5.5C2.4,5.5,2.1,5.3,2.1,5c0,0,0,0,0,0c0.1-1.7,1.5-3,3.2-3c0.3,0,0.5,0.2,0.5,0.5  S5.6,3,5.3,3C4.2,3,3.2,3.8,3.2,5C3.2,5.3,2.9,5.5,2.7,5.5C2.7,5.5,2.7,5.5,2.7,5.5 M8.7,8.8C8.7,8.8,8.7,8.8,8.7,8.8  C8.6,8.9,8.5,9.1,8.5,9.2V10c0,1.1-1,2-2.1,2H3.7c-0.3,0-0.5,0.2-0.5,0.5S3.4,13,3.7,13h2.1c0.3,0,0.5,0.2,0.5,0.5S6.1,14,5.8,14  H4.5c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0H3.7c-0.8,0.1-1.6-0.5-1.6-1.4C2,11.8,2.6,11,3.5,11c0.1,0,0.2,0,0.3,0h2.7  c0.6,0,1-0.4,1.1-1c0,0,0,0,0,0V9.2c0-0.4,0.2-0.9,0.6-1.1c0,0-0.1,0.1-0.1,0.1C8.9,7.5,9.6,6.3,9.6,5C9.4,2.6,7.4,0.9,5,1  c-2.1,0.1-3.8,1.8-4,4c0,1.3,0.7,2.5,1.7,3.2c-0.1,0-0.1-0.1-0.1-0.1C3,8.4,3.2,8.8,3.2,9.2v0.2c0,0.3-0.3,0.5-0.6,0.5  c-0.3,0-0.5-0.2-0.5-0.5V9.2c0-0.2-0.1-0.3-0.2-0.4c0,0,0,0,0,0C0.7,7.9,0,6.5,0,5c0.2-2.9,2.7-5.2,5.7-5c2.7,0.2,4.8,2.3,5,5  C10.6,6.5,9.9,7.9,8.7,8.8 M4.8,14.9h1.1c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5H4.8c-0.3,0-0.5-0.2-0.5-0.5S4.5,14.9,4.8,14.9"/>
                       <path id="Trazado_122" class="st1" d="M7.2,12.9c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5c-0.3,0-0.5-0.2-0.5-0.5v0  C6.7,13.1,6.9,12.9,7.2,12.9"/>
                    </svg> 
                     ${item.text}
                    </div>
                    `;
                }
            }
        });
        new TomSelect("#search-product", {
            allowEmptyOption: true,
            create: true
        });
        new TomSelect("#search-product-dos", {
            allowEmptyOption: true,
            create: true
        });
        const swiper = new Swiper('.swiper', {
            // Optional parameters
            slidesPerView: 6,
            spaceBetween: 30,
            loop: true,
        });

        var swiper_new = new Swiper(".listcat", {
            slidesPerView: "auto",
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });
        var swiper_noti = new Swiper(".slider-noti", {
            slidesPerView: 4,
            spaceBetween: 30,
            loop: true,
           
        });
        var swiper_noti = new Swiper(".slider-tab", {
            spaceBetween: 15,
            loop: true,
           
        });
        //swipp
        initLotties();
    };

    const initLotties = () => {
        $('#lottie-' + lottieIndex).show();
        //start lottie
        let lottie = document.getElementById('lottie-' + lottieIndex);
        //reset lottie
        lottie.stop();
        lottie.play();
    }

    Drupal.behaviors.cp_home = {
        attach: function (context, settings) {

            if (context == document) {
                init();
            }

            //next lotties when click button-next
            $('#next-lottie').click(function () {
                console.log('click');
                if (lottieIndex < 8 - 1) {
                    lottieIndex++;
                } else {
                    lottieIndex = 0;
                }
                //hide all lotties
                for (var i = 0; i < 8; i++) {
                    $('#lottie-' + i).hide();
                }
                //fade in lottie
                console.log('lottie-' + lottieIndex);
                $('#lottie-' + lottieIndex).fadeIn();
                //start lottie
                let lottie = document.getElementById('lottie-' + lottieIndex);
                //reset lottie
                lottie.stop();
                lottie.play();
            });

            //prev lotties when click button-prev
            $('#prev-lottie').click(function () {
                console.log('click');
                if (lottieIndex > 0) {
                    lottieIndex--;
                } else {
                    lottieIndex = 8 - 1;
                }
                //hide all lotties
                for (var i = 0; i < 8; i++) {
                    $('#lottie-' + i).hide();
                }
                $('#lottie-' + lottieIndex).fadeIn();
                //start lottie
                let lottie = document.getElementById('lottie-' + lottieIndex);
                //reset lottie
                lottie.stop();
                lottie.play();
            });

            //change lotties after 5s
            setInterval(function () {
                if (lottieIndex < 8 - 1) {
                    lottieIndex++;
                } else {
                    lottieIndex = 0;
                }
                //hide all lotties
                for (var i = 0; i < 8; i++) {
                    $('#lottie-' + i).hide();
                }
                $('#lottie-' + lottieIndex).fadeIn();
                //start lottie
                let lottie = document.getElementById('lottie-' + lottieIndex);
                //reset lottie
                lottie.stop();
                lottie.play();
            }, 8000);
        }
    };
}(jQuery, Drupal));