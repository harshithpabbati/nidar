/*global google*/
import React from "react"
import { compose, withProps, withHandlers, withState, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps"

const Map = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCaK8qoLfQ8WW7M4XGe60O1_LpVrBE6yyk",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap,
    withState('places', 'updatePlaces', ''),
    withHandlers(() => {
        const refs = {
            map: undefined,
        };
        return {
            onMapMounted: () => ref => {
                refs.map = ref
            },
            fetchPlaces: ({ updatePlaces }) => {
                let places;
                const bounds = refs.map.getBounds();
                const service = new google.maps.places.PlacesService(refs.map.context);
                const request = {
                    bounds: bounds,
                    type: ['hotel']
                };
                service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        console.log(results);
                        updatePlaces(results);
                    }
                })
            }
        }
    }),
    lifecycle({
        componentDidMount() {
            const DirectionsService = new google.maps.DirectionsService();
            DirectionsService.route(
                {
                    origin: new google.maps.LatLng(41.85073, -87.65126),
                    destination: new google.maps.LatLng(41.85258, -87.65141),
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        this.setState({
                            directions: result
                        });
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        },
    })
)((props) => {
    return (
        <GoogleMap
            onTilesLoaded={props.fetchPlaces}
            ref={props.onMapMounted}
            onBoundsChanged={props.fetchPlaces}
            defaultZoom={8}
            defaultCenter={{ lat: 51.508530, lng: -0.076132 }}
        >
            {props.directions && <DirectionsRenderer directions={props.directions} />}
            {/*{props.places && props.places.map((place, i) =>*/}
            {/*    <Marker key={i} position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />*/}
            {/*)}*/}
        </GoogleMap>
    )
});

export default Map;

