import React from "react"
import RouteMap from "./routeMap";

import { Row, Col} from "srx";

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
            <Row id="header">
                <Col width={[12,4,3]} style={{ textAlign: "center"}} p={0} m={0}>
                    <h1 style={{ paddingBottom: "1rem", margin: 0}}>Nidar</h1>
                </Col>
                <Col width={[12,8,9]}>
                    <div id="searchbox">
                        <input placeholder="My Current GPS Location"
                            ref={(from) => this.source = from}
                        />
                        <input
                            ref={(destination) => this.destination = destination}
                        />
                        <button onClick={this.handleSearch}>Start</button>
                    </div>
                </Col>
            </Row>
            {
                this.state.search ?
                <RouteMap from={this.state.source} to={this.state.destination} /> :
                    <div style={{ height: `100vh`, background: "#111" }} />
            }
        </>
        )
    }
}

export default Navigator;