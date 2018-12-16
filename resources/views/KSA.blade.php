<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Waritex KSA</title>
    <link rel="icon" type="image/x-icon" href="assets/icon/favicon.ico">
    <style>
        #map {
            height: 100%;
        }
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
    <script type="application/javascript">
        let customers = {!! $ksaData !!};
        const mapOptions = {
            zoom: 17,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
        };
        let activeInfoWindowMarker = null;
        let activeInfoWindow = null;
    </script>
</head>
<body>
<div id="map"></div>
<script>
    let map;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        putOnMap();
    }

    function putOnMap() {
        let bounds = new google.maps.LatLngBounds();
        for(let i=0 ; i<customers.length ; i++){
            let positiono = new google.maps.LatLng(Number(customers[i].Latitude), Number(customers[i].Longitude));
            let marker = new google.maps.Marker({
                map: map,
                position: positiono,
                title: customers[i].CustomerNameA,
            });
            bounds.extend(positiono);
            attachInfo(marker, customers[i]);
        }
        map.fitBounds(bounds);       // auto-zoom
        map.panToBounds(bounds);     // auto-center
    }


    function attachInfo(marker, customer) {
        var infowindow = new google.maps.InfoWindow({
            content: '' +
            '<h4>اسم الزبون: ' + customer.CustomerNameA + '</h4>' +
            '<h5>رصيده: ' + Math.round(customer.Balance) + '</h5>' +
            '<h5>عدد فواتيره: ' + customer.numbero + '</h5>' +
            '<h5>قيمة تعاملاته: ' + Math.round(customer.total) + '</h5>'
        });
        let flag = this;
        infowindow.addListener('closeclick' , function () {
            flag.activeInfoWindowMarker = null;
            flag.activeInfoWindow = null;
        });
        marker.addListener('click', function () {
            if (flag.activeInfoWindow) {
                flag.activeInfoWindow.close();
                flag.activeInfoWindowMarker = null;
                flag.activeInfoWindow = null;
            }
            infowindow.open(marker.get('map'), marker);
            flag.activeInfoWindow = infowindow;
            flag.activeInfoWindowMarker = marker
        });
    }
</script>

<script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCsY5zoDVH3drpV_vvJnD2y-ZiWQbXlNxw&libraries=geometry&callback=initMap"
        async defer></script>
</body>
</html>
