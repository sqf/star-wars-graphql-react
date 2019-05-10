import React, {useState, useEffect} from 'react';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import {ApolloProvider, Query} from "react-apollo";
import PlanetModal from "./PlanetModal";

const client = new ApolloClient({
    uri: "https://swapi.apis.guru/\n"
});

const FIRST = 10;

function AllPlanets() {
    const [shoudShowPlanetDetails, setShoudShowPlanetDetails] = useState(false);
    const [selectedPlanetId, setSelectedPlanetId] = useState(null);
    const [paginationState, setPaginationState] = useState({startCursor: 10, endCursor: null});

    function handlePlanetClick() {
        setSelectedPlanetId(this.planetId);
        setShoudShowPlanetDetails(true);
    }

    const Planets = () => (
        <Query
            query={gql`
      query AllPlanets($cursor: String) {
        allPlanets(first: 11, after: $cursor) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
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
    `}
     variables={{ cursor: null }}>
            {({loading, error, data}) => {
                if (loading) return <tr><td>Loading...</td></tr>;
                if (error) return <tr><td>Error :(</td></tr>;

                let getPaginationLinksStyle = (isAvailable) => {
                    return {
                        opacity: isAvailable ? 1 : 0.4
                    }
                };

                const shouldUpdatePaginationState =
                    (paginationState.startCursor !== data.allPlanets.pageInfo.startCursor) ||
                        (paginationState.endCursor !== data.allPlanets.pageInfo.endCursor);

                if (shouldUpdatePaginationState)
                    setPaginationState({startCursor: data.allPlanets.pageInfo.startCursor, endCursor: data.allPlanets.pageInfo.endCursor});

                return [...data.allPlanets.planets.map(({id, name, gravity}) => (
                    <tr key={id}>
                        <td onClick={handlePlanetClick.bind({planetId: id})}>{name}</td>
                        <td>{gravity}</td>
                    </tr>
                )), (<tr key={'pagination'} ><td style={getPaginationLinksStyle(data.allPlanets.pageInfo.hasPreviousPage)}>Previous</td><td style={getPaginationLinksStyle(data.allPlanets.pageInfo.hasNextPage)}>Next</td></tr>)];
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
                            <Planets />
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