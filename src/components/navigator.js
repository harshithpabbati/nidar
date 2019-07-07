import React from "react"
import RouteMap from "./routeMap";
import className from 'classnames';

import '../styles/navigator.sass';


class Navigator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            destination: '',
            source: '',
            latitude: '',
            longitude: '',
            distance: 0,
            distanceSet: false,
            search: false,
        };

        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        this.getMyLocation()
    }

    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation;

        if (location) {
            location.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    source: position.coords.latitude +","+position.coords.longitude
                })
            }, (error) => {
                this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
            })
        }

    }

    handleSearch(){
        const destination = this.destination.value;
        let source = "";
        if(this.source.value!=='')
            source = this.source.value;
        else
            source = this.state.source;

        this.setState({
            search: true,
            destination: destination,
            source: source
        })
    }

    render(){
        return (
        <>
            <div id="header" className={className(this.state.search ? 'loaded' : null)}>
                {
                    !this.state.search ?
                        <>
                            <div className="title">Start a Trip</div>
                            <div className="col-lg-3 col-md-6 col-12">
                                <div id="searchbox">
                                    <input placeholder="Your Location"
                                        ref={(from) => this.source = from}
                                    />
                                    <input
                                        placeholder="Choose Destination"
                                        ref={(destination) => this.destination = destination}
                                    />
                                    <button onClick={this.handleSearch}>Start</button>
                                </div>
                            </div>
                        </> :
                        <div className="d-flex">
                            <i className="fa fa-arrow-left pr-2" />
                            {this.state.distance.toPrecision(2)} KM to your destination
                        </div>
                }
            </div>
            {
                this.state.search ?
                <RouteMap
                    from={this.state.source}
                    to={this.state.destination}
                    distance={(d)=> !this.state.distanceSet ? this.setState({distance: d, distanceSet: true}) : null }
                /> : null
            }
        </>
        )
    }
}

export default Navigator;