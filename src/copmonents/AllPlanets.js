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
    const [paginationState, setPaginationState] = useState({startCursor: null, endCursor: null});

    function handlePlanetClick() {
        setSelectedPlanetId(this.planetId);
        setShoudShowPlanetDetails(true);
    }

    function handleNextPageClick(pageInfo) {
        setPaginationState({startCursor: pageInfo.startCursor, endCursor: pageInfo.endCursor});
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
     variables={{ cursor: paginationState.endCursor }}>
            {({loading, error, data}) => {
                if (loading) return <tr><td>Loading...</td></tr>;
                if (error) return <tr><td>Error :(</td></tr>;

                let getPaginationLinksStyle = (isAvailable) => {
                    return {
                        opacity: isAvailable ? 1 : 0.4
                    }
                };

                const paginationComponents = (
                    <tr key={'pagination'} >
                        <td style={getPaginationLinksStyle(data.allPlanets.pageInfo.hasPreviousPage)}>Previous</td>
                        <td style={getPaginationLinksStyle(data.allPlanets.pageInfo.hasNextPage)} onClick={() => {handleNextPageClick(data.allPlanets.pageInfo)}}>Next</td>
                    </tr>);

                return [...data.allPlanets.planets.map(({id, name, gravity}) => (
                    <tr key={id}>
                        <td onClick={handlePlanetClick.bind({planetId: id})}>{name}</td>
                        <td>{gravity}</td>
                    </tr>
                )), paginationComponents];
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