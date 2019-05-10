import React, {useState, useEffect} from 'react';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import {ApolloProvider, Query} from "react-apollo";
import PlanetModal from "./PlanetModal";

const client = new ApolloClient({
    uri: "https://swapi.apis.guru/\n"
});

const OFFSET = 5;

function AllPlanets() {
    const [shoudShowPlanetDetails, setShoudShowPlanetDetails] = useState(false);
    const [selectedPlanetId, setSelectedPlanetId] = useState(null);
    const [paginationState, setPaginationState] = useState({first: OFFSET, last: null, startCursor: null, endCursor: null});

    function handlePlanetClick() {
        setSelectedPlanetId(this.planetId);
        setShoudShowPlanetDetails(true);
    }

    function handleNextPageClick(pageInfo) {
        setPaginationState({first: OFFSET, last: null, startCursor: null, endCursor: pageInfo.endCursor});
    }

    function handlePreviousPageClick(pageInfo) {
        setPaginationState({first: null, last: OFFSET, startCursor: pageInfo.startCursor, endCursor: null});
    }

    const Planets = () => (
        <Query
            query={gql`
      query AllPlanets($first: Int, $last: Int, $cursorBefore: String, $cursorAfter: String) {
        allPlanets(first: $first, last: $last, before: $cursorBefore, after: $cursorAfter) {
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
     variables={{ first: paginationState.first, last: paginationState.last, cursorBefore: paginationState.startCursor, cursorAfter: paginationState.endCursor }}>
            {({loading, error, data}) => {
                if (loading) return <tr><td>Loading...</td></tr>;
                if (error) return <tr><td>Error :(</td></tr>;

                let getPaginationLinksStyle = (isAvailable) => {
                    return {
                        opacity: isAvailable ? 1 : 0.4
                    }
                };

                console.log(data.allPlanets.pageInfo);
                const paginationComponents = (
                    <tr key={'pagination'} >
                        <td style={getPaginationLinksStyle(data.allPlanets.pageInfo.hasPreviousPage)} onClick={() => {handlePreviousPageClick(data.allPlanets.pageInfo)}}>Previous</td>
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