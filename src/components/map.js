import React from 'react';
import ReactMapGL, {GeolocateControl } from 'react-map-gl';

export default class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: 1920,
                height: 850,
                latitude: 10.854048087105012,
                longitude: 76.27108330006735,
                zoom: 8,
            }
        };
    }

    render() {
        console.log(this.state.viewport);
        const geolocateStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            padding: '10px'
        };
        return (
            <React.Fragment>
                <ReactMapGL
                    style={{marginTop: '3vh'}}
                    {...this.state.viewport}
                    onViewportChange={(viewport) => this.setState({viewport})}
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                    mapboxApiAccessToken='pk.eyJ1IjoiaGFyc2hpdGgxMzA0IiwiYSI6ImNqdzZxcGo5cjFjajU0NHMwcnRhaWZ0ZDUifQ.bltu3KQyJLDKHKdO1TKdFw'
                >
                    <div style={geolocateStyle}>
                        <GeolocateControl
                            onViewportChange={(viewport) => this.setState({viewport})}
                            positionOptions={{enableHighAccuracy: true}}
                            trackUserLocation={true}
                        />
                    </div>
                </ReactMapGL>
            </React.Fragment>
        );
    }
}
