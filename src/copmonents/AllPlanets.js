import React, {useState} from 'react';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import {ApolloProvider, Query} from "react-apollo";
import PlanetModal from "./PlanetModal";

const client = new ApolloClient({
    uri: "https://swapi.apis.guru/\n"
});

function AllPlanets() {
    const [shoudShowPlanetDetails, setShoudShowPlanetDetails] = useState(false);
    const [selectedPlanetId, setSelectedPlanetId] = useState(null);
    function handlePlanetClick() {
        setSelectedPlanetId(this.planetId);
        setShoudShowPlanetDetails(true);
    }

    const Planets = () => (
        <Query
            query={gql`
      {
        allPlanets {
          totalCount
          planets {
            id
            name
            diameter
            rotationPeriod
            orbitalPeriod
            gravity
            population
            climates
            terrains
            surfaceWater
            created
            edited
            id
          }
        }
      }
    `}>
            {({loading, error, data}) => {
                if (loading) return <tr><td>Loading...</td></tr>;
                if (error) return <tr><td>Error :(</td></tr>;

                return data.allPlanets.planets.map(({id, name, gravity}) => (
                    <tr key={id}>
                        <td onClick={handlePlanetClick.bind({planetId: id})}>{name}</td>
                        <td>{gravity}</td>
                    </tr>
                ));
            }}
        </Query>
    );

    return (
        <ApolloProvider client={client}>
            <div className="App">
                <header className="App-header">
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gravity</th>
                        </tr>
                        </thead>
                        <tbody>
                            <Planets/>
                        </tbody>
                    </table>
                </header>
            </div>
            <PlanetModal
                shouldBeVisible={shoudShowPlanetDetails}
                setShoudShowPlanetDetails={setShoudShowPlanetDetails}
                selectedPlanetId={selectedPlanetId}
            />
        </ApolloProvider>
    );
}

export default AllPlanets;