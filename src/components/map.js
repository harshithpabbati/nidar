/*global google*/
import React from "react"
import {compose, withProps, withHandlers, withState, lifecycle} from "recompose"
import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer, Marker} from "react-google-maps"
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";

class MyMapComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            latitude: '',
            longitude: '',
        };
        this.getMyLocation = this.getMyLocation.bind(this)
    }

    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation;
        if (location) {
            location.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            }, (error) => {
                this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
            })
        }
    }
    displaygeolocation = () => {
        return (
            <Marker key={this.state} position={{
                lat: this.state.latitude,
                lng: this.state.longitude,
            }}
            icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
        )
    };
    componentDidMount(){
        this.getMyLocation();
    }
    render() {
        let from = this.props.from;
        let to = this.props.to;
        const Map = compose(
            withProps({
                googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places,visualization&key=AIzaSyCaK8qoLfQ8WW7M4XGe60O1_LpVrBE6yyk",
                loadingElement: <div style={{ height: `100%` }} />,
                containerElement: <div style={{ height: `100vh` }} />,
                mapElement: <div style={{ height: `100%` }} />,
            }),
            withScriptjs,
            withGoogleMap,
            withState('places', 'updatePlaces', ''),
            withState('bars', 'updateBars', ''),
            withHandlers(() => {
                const refs = {
                    map: undefined,
                };
                return {
                    onMapMounted: () => ref => {
                        refs.map = ref
                    },
                    fetchPolice: ({ updatePlaces, updateBars }) => {
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
                        });
                        let bars;
                        const servicebar = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                        const requestbar = {
                            bounds: bounds,
                            type: ['bar']
                        };
                        servicebar.nearbySearch(requestbar, (results, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                console.log(results);
                                updateBars(results);
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
            const data = [];
            props.bars && props.bars.map((bar) => {
                data.push(new window.google.maps.LatLng(bar.geometry.location.lat(), bar.geometry.location.lng()))
            });
            let options = {
                mapTypeControl: false,
                streetViewControl: false
            };
            return (
                <GoogleMap
                    onTilesLoaded={props.fetchPolice}
                    ref={props.onMapMounted}
                    onBoundsChanged={props.fetchPolice}
                    defaultZoom={11}
                    defaultCenter={{ lat: 51.508530, lng: -0.076132 }}
                    options={options}
                >
                    <HeatmapLayer data={data} options={{radius: '50'}} />
                    {props.bars && props.bars.map((bar, i) =>
                        <Marker key={i} icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png" position={{ lat: bar.geometry.location.lat(), lng: bar.geometry.location.lng() }} />
                    )}
                    {props.places && props.places.map((place, i) =>
                        <Marker key={i} icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png" position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />
                    )}
                    {props.directions && <DirectionsRenderer directions={props.directions} />}
                    {this.displaygeolocation()}
                </GoogleMap>
            )
        });
        return <Map/>
    }
}

export default MyMapComponent;

