'strict mode';


// upc apikey and link
const apiKey = '42099e0e2065bb1b3d98';
const searchUrl = 'https://api.barcodespider.com/v1/lookup';

// youtube apikey and link
const youtubeApiKey = 'AIzaSyD_bOP7TEZYfHVBa8-ZG0OOVlHvewQXEWg'
const youtubeURL = 'https://www.googleapis.com/youtube/v3/search';

// QueryParameter 
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
};

// upc api
function getProduct(integer) {
    const params = {
        upc: integer,
    };
    const queryString = formatQueryParams(params)
    const url = "https://cors-anywhere.herokuapp.com/" + searchUrl + '?' + queryString;
    console.log(url);

    fetch(url, {
            headers: {
                token: `${apiKey}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }

        })
        .then(responseJson => {
            displayResults(responseJson)
            getYoutubeVideo(responseJson.Stores[0].title)
                .then((results) => {
                    console.log(results)
                    if (results.items.length > 0) {
                        $('#youtube-result').empty();
                        $('#error-result').empty();
                        $('#youtube-result').append(


                            `  
              <h1 id="youtube-sneaker-title"> ${results.items[0].snippet.title}</h1>
              <iframe  type="text/html" src="https://www.youtube.com/embed/${results.items[0].id.videoId}" id="youtube-video"
                frameborder="1"><iframe>
              <h1 id="youtube-response"> Cool video</h1>
                `
                        )

                    }


                })


        })
        .catch(err => {
            $("#error-results").text(`Something went wrong. Double check your UPC code. If the problem persists, we may not have the UPC in our library.`)
            console.log(err);
        });
};
// UPC Results
function displayResults(responseJson) {
    $('#upc-result').empty();
    $("#error-results").empty();
    $("#youtube-result").empty();

    let productArray = Object.keys(responseJson);

    for (let i = 0; i < responseJson.Stores.length; i++) {
        $('#upc-result').append(

            `
      <h1 id="upc-sneaker-title"> ${responseJson.Stores[i].title}</h1>
      <img src=${responseJson.Stores[i].image} alt='Sneaker picture' id ="sneaker-image">
      <h1 id="upc-response"> Those are a nice pair of kicks... now let's see them in action!</h1>

      `
        )

        $('#upc-result').removeClass('hidden');

    };
}

// youtube api

function getYoutubeVideo(sneakerName) {
    const parameters = {
        part: 'snippet',
        maxResults: 1,
        q: sneakerName,
        key: youtubeApiKey,
    };

    const queryString = formatQueryParams(parameters)
    const url = youtubeURL + '?' + queryString;

    // // // youtube results
    return fetch(url)
        .then(response => response.json())
};

// effects and scroll feature
$(document).ready(function () {
    $('#logo').fadeIn(2500);
    $('body').removeClass('hidden');
    $('#direction').removeClass('hidden');
    $('#arrow').removeClass('hidden');
    $("#submit-button").click(function () {
        $('html, body').animate({
            scrollTop: $("#main-container").offset().top
        }, 1500);
    });
});

// eventListener
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        let upc = $('#search-term').val();
        getProduct(upc);


    });
}

$(watchForm);