import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import dayjs from 'dayjs';
import { ReactComponent as DayCloudy } from './images/day-cloudy.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  box-sizing: border-box;
  padding: 30px 15px;
  background-color: ${({ theme }) => theme.foregroundColor}; ;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const StyledSvg = styled.div`
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const AirFlow = styled(StyledSvg)`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
`;

const Rain = styled(StyledSvg)`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const DayCloudyIcon = styled(DayCloudy)`
  flex-basis: 30%;
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

const AUTHORIZATION_KEY = 'CWB-9E163ECD-9B12-43E7-8C7E-8C380EF33A6B';
const LOCATION_NAME = '臺北';

function App() {
  const [currecnTheme, setCurrentTheme] = useState('light');
  const [currentWeather, setCurrentWeather] = useState({
    locationName: '臺北市',
    Weather: '多雲時晴',
    WDSD: 1.1,
    TEMP: 22.3,
    rainPossibilities: 48.3,
    observationTime: '2020-12-12 22:10:00',
  });

  useEffect(() => {
    getWeatherData();
  }, []);
  const getWeatherData = () => {
    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
    )
      .then((resp) => resp.json())
      .then(({ records }) => {
        console.log(records);
        const locationData = records.location[0];
        const weatherInfo = locationData.weatherElement;
        const locationName = locationData.locationName;
        const observationTime = locationData.time.obs;

        const weatherData = weatherInfo.reduce(
          (data, { elementName, elementValue }) => {
            if (['WDSD', 'TEMP', 'Weather'].includes(elementName)) {
              data[elementName] = elementValue;
            }
            return data;
          },
          { locationName, observationTime }
        );

        setCurrentWeather({
          ...currentWeather,
          ...weatherData,
        });
      });
  };
  return (
    <ThemeProvider theme={theme[currecnTheme]}>
      <Container>
        <WeatherCard>
          <Location>{currentWeather.locationName}</Location>
          <Description>{currentWeather.Weather}</Description>
          <CurrentWeather>
            <Temperature>
              {Number(currentWeather.TEMP)} <Celsius>C</Celsius>
            </Temperature>
            <DayCloudyIcon />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon />
            {currentWeather.WDSD} m/h
          </AirFlow>
          <Rain>
            <RainIcon />
            {Math.round(currentWeather.rainPossibilities)}%
          </Rain>
          <Refresh onClick={getWeatherData}>
            最後觀測時間：{' '}
            {new Intl.DateTimeFormat('zh-TW', {
              hour: 'numeric',
              minute: 'numeric',
            }).format(dayjs(currentWeather.observationTime))}
            <RefreshIcon />
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
