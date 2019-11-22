document.addEventListener("DOMContentLoaded", function (event){
    if ('geolocation' in navigator){
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(position => {
            var lat = position.coords.latitude
            var lon = position.coords.longitude

            console.log(lat);
            console.log(lon);


            const data = { lat, lon};
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            fetch('/', options);

        });
    }else{
        console.log("geolocation not available");
    }
});

