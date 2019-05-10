import React from 'react'
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

function PlanetModal(props) {
    if (process.env.NODE_ENV !== 'test')
        Modal.setAppElement('#root');
    let PlanetAttributes = () => (
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
            residentConnection {
                residents {
                    name
                }
            }
            filmConnection {
                films {
                    title
                }
            }
          }
        }
    `}
            variables={{selectedPlanetId: props.selectedPlanetId}}>
            {({loading, error, data}) => {
                if (loading) return <Tr><Td>Loading...</Td></Tr>;
                if (error) return <Tr><Td>Error :(</Td></Tr>;

                function displayArray(array) {
                    const arrayLength = array.length;
                    return array.map((element, index) => {
                        let arrayElementToDisplay;
                        const isLastElement = (arrayLength === index + 1);
                        if (!isLastElement)
                            arrayElementToDisplay = (<span key={index}>{element}, </span>);
                        else
                            arrayElementToDisplay = (<span key={index}>{element}</span>);

                        return arrayElementToDisplay;
                    });
                }

                function displayResidents(residents) {
                    const numberOfResidents = residents.length;
                    return residents.map((resident, index) => {
                        let residentToDisplay;
                        const isLastResident = (numberOfResidents === index + 1);
                        if (!isLastResident)
                            residentToDisplay = (<span key={index}>{resident.name}, </span>);
                        else
                            residentToDisplay = (<span key={index}>{resident.name}</span>);

                        return residentToDisplay;
                    });
                }

                function displayFilms(films) {
                    const numberOfFilms = films.length;
                    return films.map((film, index) => {
                        let filmToDisplay;
                        const isLastFilm = (numberOfFilms === index + 1);
                        if (!isLastFilm)
                            filmToDisplay = (<span key={index}>{film.title}, </span>);
                        else
                            filmToDisplay = (<span key={index}>{film.title}</span>);

                        return filmToDisplay;
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
                        <Td>{displayResidents(data.planet.residentConnection.residents)}</Td>
                        <Td>{displayFilms(data.planet.filmConnection.films)}</Td>
                    </Tr>
                )
            }}
        </Query>
    );
    return (
        <Modal isOpen={props.shouldBeVisible} contentLabel="Planet Modal">
            <CloseButton onClick={() => {
                props.setShoudShowPlanetDetails(false)
            }}>close</CloseButton>
            <ModalCard>
                <Table>
                    <thead>
                    <tr><Th>Planet Attributes</Th></tr>
                    </thead>
                    <tbody>
                    <Tr>
                        <Td planetAttributeName>Name</Td>
                        <Td planetAttributeName>Diameter</Td>
                        <Td planetAttributeName>Rotation period</Td>
                        <Td planetAttributeName>Orbital period</Td>
                        <Td planetAttributeName>Gravity</Td>
                        <Td planetAttributeName>Population</Td>
                        <Td planetAttributeName>Climates</Td>
                        <Td planetAttributeName>Terrains</Td>
                        <Td planetAttributeName>Surface water</Td>
                        <Td planetAttributeName>Residents</Td>
                        <Td planetAttributeName>Films</Td>
                    </Tr>
                    <PlanetAttributes/>
                    </tbody>
                </Table>
            </ModalCard>
        </Modal>
    )
}

const Table = styled.table`
    borderCollapse: 'collapse';
`;

const Th = styled.th`
    color: red;
`;

const Tr = styled.tr`
    display: block;
    float: left;
    border: 1px solid black; 
`;

const Td = styled.td`
    display: block;
    border: 1px solid black;
    min-height: 23px;
    padding: 3px;
    font-weight: ${props => props.planetAttributeName ? "bold" : "normal"};
`;

const ModalCard = styled.div`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  z-index: 10;
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

// PropTypes
PlanetModal.propTypes = {
    shouldBeVisible: PropTypes.bool.isRequired,
    setShoudShowPlanetDetails: PropTypes.func.isRequired,
    selectedPlanetId: PropTypes.string
};

export default PlanetModal;