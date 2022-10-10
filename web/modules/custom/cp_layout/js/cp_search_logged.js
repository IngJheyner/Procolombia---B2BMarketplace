(function ($, Drupal) {
    let showErr = false;
    let lang = window.location.pathname.split('/')[1];
    const getSuggestions = (value) => {
        //show loader
        $('#loader-suggest').show();
        $('#list-search-suggest').hide();
        $('#search-recommendations').hide();
        fetch(`https://app-back-co1020-dev-search.azurewebsites.net/autocomplete/${lang}/${value}`)
            .then(response => response.json())
            .then(data => {
                renderSuggestions(data);
                $('#loader-suggest').hide();
                $('#list-search-suggest').show();
            })
            .catch(error => {
                console.error(error);
            });
    };

    const renderSuggestions = (data) => {
        //render suggestions
        let html = '';
        if (data.length > 0) {
            data.forEach(element => {
                console.log(element);
                html += `
            <div onclick="goUrlSearch('${element}')" class="item">
                <input type="radio" class="btn-check" name="options" id="option1" autocomplete="off">
                <label class="btn item-select" for="option1">${element}</label>
            </div>`;
            });
        } else {
            html = `<div class="item">
                        <input type="radio" class="btn-check" name="options" id="option1" autocomplete="off">
                        <label class="btn item-select" for="option1">No hay sugerencias</label>
                    </div>`;
        }
        $('#list-search-suggest').html(html);
    };

    const redirectToSearch = (value) => {
        //redirect to search page
        //get value of uid-input
        const userId = $('#uid-input').val();
        //get value of country-input
        const origin = $('#country-input').val();
        window.location.href = `/search/products?words=${value}&userId=${userId}&origin=${origin}`;
    };

    Drupal.behaviors.cp_search_logged = {
        attach: function (context, settings) {
            //on hover input search show suggestions
            $('#search-input', context).on('focus', function () {
                console.log('focus');
                if (!showErr) {
                    $('#search-recommendations').show();
                }
            });
            //if click outside input search and suggestions hide suggestions
            $(document, context).on('click', function (e) {
                console.log('exit2');
                if (!$(e.target).closest('#search-input').length && !$(e.target).closest('#search-recommendations').length) {
                    console.log('exit');
                    $('#search-recommendations').hide();
                }

                if (!$(e.target).closest('#search-input').length && !$(e.target).closest('#search-suggestions').length) {
                    console.log('exit');
                    $('#search-suggestions').hide();
                }
            });

            //detect when change input search
            $('#search-input', context).on('input', function () {
                console.log('input');
                var value = $(this).val();
                if (value.length > 2) {
                    showErr = true;
                    $('#search-recommendations').hide();
                    $('#search-suggestions').show();
                    //get suggestions
                    setTimeout(function () {
                        getSuggestions(value);
                    }, 250);
                } else {
                    $('#search-suggestions').hide();
                    showErr = false;
                }
            });

            window.goUrlSearch = function (value) {
                redirectToSearch(value);
            }

            //detect click in search button
            $('#search-button', context).on('click', function () {
                var value = $('#search-input').val();
                if (value.length !== 0) {
                    redirectToSearch(value);
                }
            });

            //detect enter in input search
            $('#search-input', context).on('keypress', function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    var value = $(this).val();
                    if (value.length !== 0) {
                        redirectToSearch(value);
                    }
                }
            });
        }
    };
})(jQuery, Drupal);