/*global google*/
import React from "react"
import {compose, withProps, withHandlers, withState, lifecycle} from "recompose"
import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer, Marker} from "react-google-maps"
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";
import dataFetch from '../utils/dataFetch';

class RouteMap extends React.Component{

    fetchAPIData = async () => {
        const query = `
                            {
                              darkIncident{
                                latitude
                                longitude
                              }                   
                            }
                        `;
        const response =  await dataFetch({ query });
        if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
           return response;
        }
    };
    fetchStalkData = async () => {
        const query = `
                            {
                              stalkerIncident{
                                latitude
                                longitude
                              }                   
                            }
                        `;
        const response =  await dataFetch({ query });
        if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
            return response;
        }
    };
    fetchCatcallData = async () => {
        const query = `
                            {
                              catCallIncident{
                                latitude
                                longitude
                              }                   
                            }
                        `;
        const response =  await dataFetch({ query });
        if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
            return response;
        }
    };
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
            withState('catcallIncidents', 'updateCatcallIncidents', []),
            withState('stalkIncidents', 'updateStalkIncidents', []),
            withState('darkIncidents', 'updateDarkIncidents', []),
            withState('policeStations', 'updatePoliceStations', []),
            withState('hospitals', 'updateHospitals', ''),
            withState('bars', 'updateBars', ''),
            withHandlers(() => {
                const refs = {
                    map: undefined,
                };
                return {
                    onMapMounted: () => ref => {
                        refs.map = ref
                    },
                    fetchHeatMapData: async ({ updateCatcallIncidents, updateStalkIncidents, updateDarkIncidents, updatePoliceStations, updateHospitals, updateBars }) => {
                        const data = await this.fetchAPIData();
                        updateDarkIncidents(data.data.darkIncident);

                        const stalkdata = await this.fetchStalkData();
                        updateStalkIncidents(stalkdata.data.stalkerIncident);

                        const catcalldata = await this.fetchCatcallData();
                        updateCatcallIncidents(catcalldata.data.catCallIncident);

                        const bounds = refs.map.getBounds();
                        const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);

                        const request = {
                            bounds: bounds,
                            radius: 5000,
                        };

                        service.nearbySearch({...request, type: ["police"]}, (results, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                updatePoliceStations(results);
                            }
                        });

                        service.nearbySearch({...request, type: ["hospital"]}, (results, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                updateHospitals(results);
                            }
                        });

                        service.nearbySearch({...request, type: ["bar"]}, (results, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                updateBars(results);
                            }
                        });
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
                        provideRouteAlternatives: true
                    };
                    DirectionsService.route(
                        directionsRequest,
                        (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                                const distance = result.routes[0].legs[0].distance.value*0.001;
                                this.setState({
                                    distance,
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
            let options = {
                mapTypeControl: false,
                streetViewControl: false,
                gestureHandling: false,
                zoomControl: false,
                fullscreenControl: false
            };

            const data = [];
            // eslint-disable-next-line array-callback-return
            props.bars && props.bars.map((bar) => {
                data.push(new window.google.maps.LatLng(bar.geometry.location.lat(), bar.geometry.location.lng()))
            });

            const positiveMarkers = [];
            // eslint-disable-next-line array-callback-return
            props.policeStations && props.policeStations.map((place) => {
                positiveMarkers.push(new window.google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()))
            });
            // eslint-disable-next-line array-callback-return
            props.hospitals && props.hospitals.map((place) => {
                positiveMarkers.push(new window.google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()))
            });


            return (
                props.distance < 9 ?
                    <>
                        <GoogleMap
                            onTilesLoaded={props.fetchHeatMapData}
                            ref={props.onMapMounted}
                            onBoundsChanged={props.fetchHeatMapData}
                            zoom={10}
                            options={options}
                        >
                            <HeatmapLayer data={data} options={{radius: 150, maxIntensity: 5}} />
                            <HeatmapLayer data={positiveMarkers} options={{radius: 200, maxIntensity: 10}} />
                            {props.darkIncidents && props.darkIncidents.map((place, i) => (
                                    <Marker key={i} icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                            position={{lat: Number(place.latitude), lng: Number(place.longitude)}}/>
                                )
                            )}
                            {props.catcallIncidents && props.catcallIncidents.map((place, i) => (
                                    <Marker key={i} icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                            position={{lat: Number(place.latitude), lng: Number(place.longitude)}}/>
                                )
                            )}
                            {props.stalkIncidents && props.stalkIncidents.map((place, i) => (
                                    <Marker key={i} icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                            position={{lat: Number(place.latitude), lng: Number(place.longitude)}}/>
                                )
                            )}
                            {props.directions && <DirectionsRenderer directions={props.directions} />}
                        </GoogleMap>
                        </>
                        : null
            )
        });
        return <Map/>
    }
}

export default RouteMap;

