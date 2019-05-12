import React, {Fragment, useState} from 'react';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import {ApolloProvider, Query} from "react-apollo";
import styled from "styled-components";
import PlanetModal from "./PlanetModal";

const client = new ApolloClient({
    uri: "https://swapi.apis.guru/\n"
});

const OFFSET = 10;

const GET_ALL_PLANETS_QUERY = gql`
      query AllPlanets($first: Int, $last: Int, $cursorBefore: String, $cursorAfter: String) {
        allPlanets(first: $first, last: $last, before: $cursorBefore, after: $cursorAfter) {
          pageInfo {
            startCursor
            endCursor
          }
          planets {
            id
            name
            diameter
          }
          totalCount
        }
      }
    `;

function AllPlanets() {
    const [shoudShowPlanetDetails, setShoudShowPlanetDetails] = useState(false);
    const [selectedPlanetId, setSelectedPlanetId] = useState(null);
    const [paginationState, setPaginationState] = useState({first: OFFSET, last: null, startCursor: null, endCursor: null, counter: 0});

    function handlePlanetClick() {
        setSelectedPlanetId(this.planetId);
        setShoudShowPlanetDetails(true);
    }

    function handleNextPageClick() {
        if (this.isNextPageAvailable)
            setPaginationState({first: OFFSET, last: null, startCursor: null, endCursor: this.pageInfo.endCursor, counter: paginationState.counter + 1});
    }

    function handlePreviousPageClick() {
        if (this.isPreviousPageAvailable)
            setPaginationState({first: null, last: OFFSET, startCursor: this.pageInfo.startCursor, endCursor: null, counter: paginationState.counter - 1});
    }

    const PlanetsList = () => (
        <Query
            query={GET_ALL_PLANETS_QUERY}
     variables={{ first: paginationState.first, last: paginationState.last, cursorBefore: paginationState.startCursor, cursorAfter: paginationState.endCursor }}>
            {({loading, error, data}) => {
                if (loading) return <div>Loading...</div>;
                if (error) return <div>Error :(</div>;

                const pageComponent = data.allPlanets.planets.map(({id, name, diameter}) => (
                    <tr key={id}>
                        <PlanetAttributeName onClick={handlePlanetClick.bind({planetId: id})}>{name}</PlanetAttributeName>
                        <td>{diameter}</td>
                    </tr>
                ));

                const isPreviousPageAvailable = paginationState.counter > 0;
                const isNextPageAvailable = paginationState.counter + 1 < data.allPlanets.totalCount / OFFSET;
                const paginationComponents = (
                    <div>
                        <PaginationComopnent isAvailable={isPreviousPageAvailable}
                            onClick={handlePreviousPageClick.bind({isPreviousPageAvailable, pageInfo: data.allPlanets.pageInfo})}>
                            Previous
                        </PaginationComopnent>
                        <PaginationComopnent isAvailable={isNextPageAvailable}
                            onClick={handleNextPageClick.bind({isNextPageAvailable, pageInfo: data.allPlanets.pageInfo})}>
                            Next
                        </PaginationComopnent>
                    </div>);

                return (
                    <Fragment>
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Diameter</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pageComponent}
                            </tbody>
                        </table>
                        {paginationComponents}
                    </Fragment>
                );
            }}
        </Query>
    );

    return (
        <ApolloProvider client={client}>
            <PlanetsList />
            <PlanetModal
                shouldBeVisible={shoudShowPlanetDetails}
                setShoudShowPlanetDetails={setShoudShowPlanetDetails}
                selectedPlanetId={selectedPlanetId} />
        </ApolloProvider>
    );
}

const PaginationComopnent = styled.span`
    margin: 5px;
    opacity:  ${props => props.isAvailable ? 1 : 0.4};
    color: yellow;
    text-decoration: ${props => props.isAvailable ? 'underline' : 'none'};
    :hover {
        ${props => {
            if (props.isAvailable) 
                return 'color: red';
            }
        }
    }
`;

const PlanetAttributeName = styled.td`
    text-decoration: underline;
    :hover {
        color: red;
    }
`;

export default AllPlanets;