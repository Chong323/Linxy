import React from 'react';
import { render } from '@testing-library/react-native';
import AppNavigator from '../AppNavigator';

describe('AppNavigator', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<AppNavigator />);
    expect(toJSON()).toBeTruthy();
  });
});
