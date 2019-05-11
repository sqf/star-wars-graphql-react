import React from 'react';

import {configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from 'react-apollo/test-utils';

import Modal from 'react-modal';

import PlanetModal from './PlanetModal';
import { GET_PLANET_QUERY } from './PlanetModal';

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

describe('<PlanetModal />', () => {

    const wait = (time = 0) => new Promise(res => setTimeout(res, time));
    const executeMockProviderTestCase = (wrapperInstance) => {
        return wait(100).then(() => wrapperInstance.update());
    };

    const mocks = [
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
        }
    ];

    it('should render modal', () => {
        const wrapper = shallow(<PlanetModal shouldBeVisible={true} setShoudShowPlanetDetails={() => {}}/>);
        expect(wrapper.find(Modal)).toHaveLength(1);
    });

    it('should render correct name when query succeds', () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks} addTypename={false}>
                <PlanetModal shouldBeVisible={true} setShoudShowPlanetDetails={() => {}} selectedPlanetId={SOME_FAKE_PLANET_ID} />
            </MockedProvider>
        );
        // expect(wrapper.find(Modal)).toHaveLength(1);
        return executeMockProviderTestCase(wrapper).then(() => {
            const rows = wrapper.find('tbody').find('tr').find('td').map(column => column.text());
            expect(rows[11]).toEqual(SOME_FAKE_PLANET_NAME);
            expect(wrapper.find("table").length).toEqual(1);
        });
    });
});