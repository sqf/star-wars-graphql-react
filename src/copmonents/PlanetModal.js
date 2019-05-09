import React from 'react'
import Modal from 'react-modal';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

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
          }
        }
    `}
            variables={{selectedPlanetId: props.selectedPlanetId}}>
            {({loading, error, data}) => {
                if (loading) return <Tr><Td>Loading...</Td></Tr>;
                if (error) return <Td><Td>Error :(</Td></Td>;

                function displayArray(array) {
                    const arrayLength = array.length;
                     return array.map((element, index) => {
                        let arrayElementToDisplay;
                        const isLastElement = (arrayLength === index + 1);
                        if (!isLastElement)
                            arrayElementToDisplay=(<span key={index}>{element}, </span>);
                        else
                            arrayElementToDisplay=(<span key={index}>{element}</span>);

                        return arrayElementToDisplay;
                    });
                }

                return (
                    <Tr>
                    <Td>{data.planet.name}</Td>
                    <Td>{data.planet.diameter}</Td>
                    <Td>{data.planet.rotationPeriod}</Td>
                    <Td>{data.planet.orbitalPeriod}</Td>
                    <Td>{data.planet.gravity}</Td>
                    <Td>{data.planet.population}</Td>
                    <Td>{displayArray(data.planet.climates)}</Td>
                    <Td>{displayArray(data.planet.terrains)}</Td>
                    <Td>{data.planet.surfaceWater}</Td>
                    </Tr>
                )
            }}
        </Query>
    );
    return (
        <Modal isOpen={props.shouldBeVisible} contentLabel="Planet Modal" >
            <CloseButton onClick={() => {
                props.setShoudShowPlanetDetails(false)
            }}>close</CloseButton>
            <ModalCard>
            <Table>
                <tbody>
                <Tr>
                <Td>name</Td>
                <Td>diameter</Td>
                <Td>rotationPeriod</Td>
                <Td>orbitalPeriod</Td>
                <Td>gravity</Td>
                <Td>population</Td>
                <Td>climates</Td>
                <Td>terrains</Td>
                <Td>surfaceWater</Td>
                </Tr>
                <Planet/>
                </tbody>
            </Table>
            </ModalCard>
        </Modal>
    )
}

const Table = styled.table`
    borderCollapse: 'collapse'
`;

const Tr = styled.tr`
    display: block;
    float: left;
    border: 1px solid black;
`;

const Td = styled.td`
    display: block;
    border: 1px solid black;
    height: 23px;
    padding: 3px;
`;

const ModalCard = styled.div`
  position: relative;
  min-width: 320px;
  z-index: 10;
  margin: 50px;
  background: white;
  border-radius: 5px;
  padding: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  background: transparent;
  padding: 10px;
  &:hover {
    cursor: pointer;
  }`;

export default PlanetModal;