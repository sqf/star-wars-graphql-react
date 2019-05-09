import React from 'react'
import Modal from 'react-modal';
import {Query} from "react-apollo";
import gql from "graphql-tag";

function PlanetModal(props) {
    Modal.setAppElement('#root');
    let Planet = () => (
        <Query
            query={gql`
      query Planet($selectedPlanetId: ID) {
        planet(id: $selectedPlanetId) {
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
    `}
        variables={{ selectedPlanetId: props.selectedPlanetId }}>
            {({loading, error, data}) => {
                if (loading) return <span>Loading...</span>;
                if (error) return <span>Error :(</span>;

                console.log(data);

                return (
                    <li>
                        <span>{data.planet.name}</span>
                        <span>{data.planet.gravity}</span>
                    </li>
                )
            }}
        </Query>
    );
    return (
        <Modal
            isOpen={props.shouldBeVisible}
            contentLabel="Example Modal">

            <h2>Hello</h2>
            <button onClick={() => {props.setShoudShowPlanetDetails(false)}}>close</button>
            <div>I am a modal {props.selectedPlanetId}</div>
            <ul><Planet /></ul>
        </Modal>
    )
}

export default PlanetModal;