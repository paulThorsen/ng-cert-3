export const mockDallasWeather = {
    coord: { lon: -96.7942, lat: 32.9682 },
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    base: 'stations',
    main: {
        temp: 78.64,
        feels_like: 77.38,
        temp_min: 76.51,
        temp_max: 80.94,
        pressure: 1003,
        humidity: 25,
    },
    visibility: 10000,
    wind: { speed: 14, deg: 234, gust: 24 },
    clouds: { all: 0 },
    dt: 1677107082,
    sys: { type: 2, id: 2007952, country: 'US', sunrise: 1677071019, sunset: 1677111485 },
    timezone: -21600,
    id: 0,
    name: 'Dallas',
    cod: 200,
};
