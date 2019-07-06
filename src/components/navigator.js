import React from "react"
import RouteMap from "./routeMap";

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
        const source = this.source.value;

        this.setState({
            search: true,
            destination: destination,
            source: source
        })
    }

    render(){
        console.log(this.state.searchTerm);
        return (
            <div>
                <div id="searchbox">
                    <input value={this.state.source}
                        ref={(from) => this.source = from}
                    />
                    <input
                        ref={(destination) => this.destination = destination}
                    />
                    <button onClick={this.handleSearch}>Search</button>
                </div>
                {
                    this.state.search ?
                    <RouteMap from={this.state.source} to={this.state.destination} /> :
                        <div style={{ height: `100vh`, background: "#111" }} />
                }
            </div>
        )
    }
}

export default Navigator;