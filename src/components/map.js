/*global google*/
import React from "react"
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps"

class MyMapComponent extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        let from = this.props.from;
        let to = this.props.to;
        const Map = compose(
            withProps({
                googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCaK8qoLfQ8WW7M4XGe60O1_LpVrBE6yyk",
                loadingElement: <div style={{ height: `100%` }} />,
                containerElement: <div style={{ height: `100vh` }} />,
                mapElement: <div style={{ height: `100%` }} />,
            }),
            withScriptjs,
            withGoogleMap,
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
            return (
                <GoogleMap
                    defaultZoom={8}
                    defaultCenter={{ lat: 51.508530, lng: -0.076132 }}
                >
                    {props.directions && <DirectionsRenderer directions={props.directions} />}
                </GoogleMap>
            )
        })
        return <Map/>
    }
}

export default MyMapComponent;

