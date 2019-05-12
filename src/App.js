import React from 'react';
import {ApolloProvider} from "react-apollo";
import ApolloClient from "apollo-boost";
import './App.css'

import AllPlanets from "./components/AllPlanets";

const client = new ApolloClient({
    uri: "https://swapi.apis.guru/\n"
});


function App() {
    return (
        <div className="App">
            <ApolloProvider client={client}>
                <AllPlanets/>
            </ApolloProvider>
        </div>
    );
}

export default App;
