import { Location } from '../../services/location.service';

export const mockLocation: Location = { zipCode: '84606', country: 'United States' };
export const mockMultipleLocations: Location[] = [
    mockLocation,
    { zipCode: '75248', country: 'UnitedStates' },
];
