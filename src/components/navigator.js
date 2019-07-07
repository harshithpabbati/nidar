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
            <div id="header" m={0} className={className(this.state.search ? 'loaded' : null)}>
                {
                    !this.state.search ?
                        <div className="title">Start a Trip</div>
                        : null
                }
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
            {
                this.state.search ?
                <RouteMap from={this.state.source} to={this.state.destination} /> : null
            }
        </>
        )
    }
}

export default Navigator;