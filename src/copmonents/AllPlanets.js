import React from 'react';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import {ApolloProvider, Query} from "react-apollo";

const client = new ApolloClient({
    uri: "https://swapi.apis.guru/\n"
});

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
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            console.log(data);

            return data.allPlanets.planets.map(({id, created, name}) => (
                <tr key={id}>
                    <td>{name}</td>
                    <td>{created}</td>
                </tr>
            ));
        }}
    </Query>
);

function AllPlanets() {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <header className="App-header">
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Created</th>
                        </tr>
                        </thead>
                        <tbody>
                            <Planets/>
                        </tbody>
                    </table>
                </header>
            </div>
        </ApolloProvider>
    );
}

export default AllPlanets;