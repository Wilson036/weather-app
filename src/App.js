import { useWeatherAPI } from 'hooks/useWeatherAPI';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { getMoment } from 'utils/helper';
import WeatherCard from 'views/WeatherCard';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

function App() {
  const [weatherInfo, fetchData] = useWeatherAPI({
    locationName: LOCATION_NAME,
    cityName: LOCATION_FORECAST_NAME,
    autherizeKey: AUTHORIZATION_KEY,
  });

  const [currecnTheme, setCurrentTheme] = useState('light');
  const moment = useMemo(() => getMoment(LOCATION_FORECAST_NAME), []);
  useEffect(() => setCurrentTheme(moment === 'day' ? 'light' : 'dark'), [
    moment,
  ]);
  return (
    <ThemeProvider theme={theme[currecnTheme]}>
      <Container>
        <WeatherCard
          fetchData={fetchData}
          moment={moment}
          weatherInfo={weatherInfo}
        ></WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;

const AUTHORIZATION_KEY = 'CWB-9E163ECD-9B12-43E7-8C7E-8C380EF33A6B';
const LOCATION_NAME = '臺北';
const LOCATION_FORECAST_NAME = '臺北市';
