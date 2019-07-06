import React from "react"
import RouteMap from "./routeMap";

import '../styles/navigator.sass';


class Navigator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            search: false
        };

        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(){
        const query = this.input.value;
        this.setState({ search: true, searchTerm: query})
    }

    render(){
        console.log(this.state.searchTerm);
        return (
            <div>
                <div id="searchbox">
                    <input
                        ref={(userInput) => this.input = userInput}
                    />
                    <button onClick={this.handleSearch}>Search</button>
                </div>
                {
                    this.state.search ?
                    <RouteMap from="Lulu Mall" to={this.state.searchTerm} /> :
                        <div style={{ height: `100vh`, background: "#111" }} />
                }
            </div>
        )
    }
}

export default Navigator;