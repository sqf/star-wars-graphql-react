import React from 'react';

import {configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {MockedProvider} from 'react-apollo/test-utils';

import Modal from 'react-modal';

import PlanetModal from './PlanetModal';
import {GET_PLANET_QUERY} from './PlanetModal';

configure({adapter: new Adapter()});

const SOME_FAKE_PLANET_ID = 'cGxhbmV0czo3';
const SOME_FAKE_PLANET_NAME = 'Endor';
const SOME_FAKE_PLANET_DIAMETER = 10200;
const SOME_FAKE_PLANET_ROTATION_PERIOD = 24;
const SOME_FAKE_PLANET_ORBITAL_PERIOD = 4818;
const SOME_FAKE_PLANET_GRAVITY = '1 standard';
const SOME_FAKE_PLANET_POPULATION = 1000;
const SOME_FAKE_PLANET_CLIMATES = ['temperate', 'tropical'];
const SOME_FAKE_PLANET_TERRAINS = ['jungle', 'rainforests'];
const SOME_FAKE_PLANET_SURFACE_WATER = 8;
const SOME_FAKE_PLANET_RESIDENTS = [{name: 'Luke Skywalker'}, {name: 'C-3PO'}, {name: 'Darth Vader'}];
const SOME_FAKE_PLANET_FILMS = [{title: 'A New Hope'}, {title: 'Return of the Jedi'}, {title: 'The Phantom Menace'}];

const EXPECTED_CLIMATES_OUTPUT = 'temperate, tropical';
const EXPECTED_TERRAINS_OUTPUT = 'jungle, rainforests';
const EXPECTED_RESIDENTS_OUTPUT = 'Luke Skywalker, C-3PO, Darth Vader';
const EXPECTED_FILMS_OUTPUT = 'A New Hope, Return of the Jedi, The Phantom Menace';

describe('<PlanetModal />', () => {
    const wait = (time = 0) => new Promise(res => setTimeout(res, time));
    const executeMockProviderTestCase = (wrapperInstance) => {
        return wait(100).then(() => wrapperInstance.update());
    };

    const queryMock =
        {
            request: {
                query: GET_PLANET_QUERY,
                variables: {
                    selectedPlanetId: SOME_FAKE_PLANET_ID
                }
            },
            result: {
                data: {
                    planet: {
                        id: SOME_FAKE_PLANET_ID,
                        name: SOME_FAKE_PLANET_NAME,
                        diameter: SOME_FAKE_PLANET_DIAMETER,
                        rotationPeriod: SOME_FAKE_PLANET_ROTATION_PERIOD,
                        orbitalPeriod: SOME_FAKE_PLANET_ORBITAL_PERIOD,
                        gravity: SOME_FAKE_PLANET_GRAVITY,
                        population: SOME_FAKE_PLANET_POPULATION,
                        climates: SOME_FAKE_PLANET_CLIMATES,
                        terrains: SOME_FAKE_PLANET_TERRAINS,
                        surfaceWater: SOME_FAKE_PLANET_SURFACE_WATER,
                        residentConnection: {
                            residents: SOME_FAKE_PLANET_RESIDENTS
                        },
                        filmConnection: {
                            films: SOME_FAKE_PLANET_FILMS
                        }
                    }
                }
            }
        };

    it('should render a modal', () => {
        const wrapper = shallow(<PlanetModal shouldBeVisible={true} setShoudShowPlanetDetails={() => {
        }}/>);
        expect(wrapper.find(Modal)).toHaveLength(1);
    });

    it('should call setShoudShowPlanetDetails method with argument set to false when close button is clicked', () => {
        const clickCallback = jest.fn();
        const wrapper = shallow(<PlanetModal shouldBeVisible={true} setShoudShowPlanetDetails={clickCallback} />);

        wrapper.find('CloseButton').simulate("click");

        expect(clickCallback).toHaveBeenCalledWith(false);
    });

    describe('Planet attributes', () => {
        const wrapper = mount(
            <MockedProvider mocks={[queryMock]} addTypename={false}>
                <PlanetModal shouldBeVisible={true} setShoudShowPlanetDetails={() => {
                }} selectedPlanetId={SOME_FAKE_PLANET_ID} />
            </MockedProvider>
        );

        it('should render a table inside modal', () => {
            expect(wrapper.find('table')).toHaveLength(1);
        });

        it('should render correct name value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[11]).toEqual(SOME_FAKE_PLANET_NAME);
            });
        });

        it('should render correct diameter value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[12]).toEqual(SOME_FAKE_PLANET_DIAMETER.toString());
            });
        });

        it('should render correct rotation period value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[13]).toEqual(SOME_FAKE_PLANET_ROTATION_PERIOD.toString());
            });
        });

        it('should render correct orbital period value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[14]).toEqual(SOME_FAKE_PLANET_ORBITAL_PERIOD.toString());
            });
        });

        it('should render correct gravity value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[15]).toEqual(SOME_FAKE_PLANET_GRAVITY);
            });
        });

        it('should render correct population value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[16]).toEqual(SOME_FAKE_PLANET_POPULATION.toString());
            });
        });

        it('should render correct climates value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[17]).toEqual(EXPECTED_CLIMATES_OUTPUT);
            });
        });

        it('should render correct terrains value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[18]).toEqual(EXPECTED_TERRAINS_OUTPUT);
            });
        });

        it('should render correct surface water value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[19]).toEqual(SOME_FAKE_PLANET_SURFACE_WATER.toString());
            });
        });

        it('should render correct planet residents value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[20]).toEqual(EXPECTED_RESIDENTS_OUTPUT);
            });
        });

        it('should render correct planet films value when query succeeds', () => {
            return executeMockProviderTestCase(wrapper).then(() => {
                const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
                expect(rows[21]).toEqual(EXPECTED_FILMS_OUTPUT);
            });
        });
    });
});