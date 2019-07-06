/*global google*/
import React from "react"
import {compose, withProps, withHandlers, withState, lifecycle} from "recompose"
import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer, Marker} from "react-google-maps"

class MyMapComponent extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        let from = this.props.from;
        let to = this.props.to;
        let request = {
            query: 'Police Station',
            fields: ['name', 'geometry'],
        };
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
                    fetchPolice: ({ updatePlaces }) => {
                        let places;
                        const bounds = refs.map.getBounds();
                        const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                        const request = {
                            bounds: bounds,
                            type: ['police']
                        };
                        service.nearbySearch(request, (results, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                console.log(results);
                                updatePlaces(results);
                            }
                        })
                    },
                }
            }),

            lifecycle({
                componentDidMount() {
                    const DirectionsService = new google.maps.DirectionsService();
                    const directionsRequest = {
                        origin: from,
                        destination: to,
                        travelMode: google.maps.DirectionsTravelMode.WALKING,
                        waypoints: [
                            {
                                location: "Cafe CoffeeDay Mill, Mamangalam"
                            },
                            {
                                location: "Sparkles Car Wash, BTS Road"
                            },
                            {
                                location: "Bhavan's Vidya Mandir"
                            },
                            {
                                location: "Punnakkel Temple"
                            },
                        ]
                    };
                    DirectionsService.route(
                        directionsRequest,
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
                    onTilesLoaded={props.fetchPolice}
                    ref={props.onMapMounted}
                    onBoundsChanged={props.fetchPolice}
                    defaultZoom={8}
                    defaultCenter={{ lat: 51.508530, lng: -0.076132 }}
                >
                    {props.places && props.places.map((place, i) =>
                        <Marker key={i} icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png" position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />
                    )}
                    {props.directions && <DirectionsRenderer directions={props.directions} />}
                </GoogleMap>
            )
        })
        return <Map/>
    }
}

export default MyMapComponent;

