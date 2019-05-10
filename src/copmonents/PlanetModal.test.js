import React from 'react';

import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import PlanetModal from './PlanetModal';
import Modal from 'react-modal';

configure({adapter: new Adapter()});

describe('<PlanetModal />', () => {
    it('should render modal', () => {
        const wrapper = shallow(<PlanetModal shouldBeVisible={true} setShoudShowPlanetDetails={() => {
        }}/>);
        expect(wrapper.find(Modal)).toHaveLength(1);
    });
});