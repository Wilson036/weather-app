import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import dayjs from 'dayjs';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg';
import WeatherIcon from 'components/WeatherIcon';
import { getMoment } from 'utils/helper';

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
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }
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
  const [currecnTheme, setCurrentTheme] = useState('light');
  const [weatherInfo, setWeatherInfo] = useState({
    locationName: '',
    Weather: '',
    WeatherCode: 0,
    comfortability: '',
    WDSD: 0,
    TEMP: 0,
    rainPossibilities: 0,
    observationTime: new Date(),
    isLoading: false,
  });

  const {
    locationName,
    Weather,
    WDSD,
    TEMP,
    WeatherCode,
    rainPossibilities,
    observationTime,
    isLoading,
  } = weatherInfo;

  const moment = useMemo(() => getMoment(LOCATION_FORECAST_NAME), []);

  const fetchData = useCallback(async () => {
    const [currentWeather, weatherForcast] = await Promise.all([
      getWeatherData(),
      getWeatherForcastData(),
    ]);

    setWeatherInfo((prevState) => ({
      ...prevState,
      ...weatherForcast,
      ...currentWeather,
      isLoading: false,
    }));
  }, []);
  useEffect(() => {
    fetchData();
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [fetchData]);

  return (
    <ThemeProvider theme={theme[currecnTheme]}>
      <Container>
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>{Weather}</Description>
          <CurrentWeather>
            <Temperature>
              {Number(TEMP)} <Celsius>C</Celsius>
            </Temperature>
            <WeatherIcon weatherCode={WeatherCode} moment={moment} />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon />
            {WDSD} m/h
          </AirFlow>
          <Rain>
            <RainIcon />
            {Math.round(rainPossibilities)}%
          </Rain>
          <Refresh
            isLoading={isLoading}
            onClick={() => {
              fetchData();
            }}
          >
            最後觀測時間：{' '}
            {new Intl.DateTimeFormat('zh-TW', {
              hour: 'numeric',
              minute: 'numeric',
            }).format(dayjs(observationTime))}
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;

const AUTHORIZATION_KEY = 'CWB-9E163ECD-9B12-43E7-8C7E-8C380EF33A6B';
const LOCATION_NAME = '臺北';
const LOCATION_FORECAST_NAME = '臺北市';
const getWeatherData = () => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
  )
    .then((resp) => resp.json())
    .then(({ records }) => {
      const { weatherElement, locationName, time } = records.location[0];
      const observationTime = time.obs;

      return weatherElement.reduce(
        (data, { elementName, elementValue }) => {
          if (['WDSD', 'TEMP', 'Weather'].includes(elementName)) {
            data[elementName] = elementValue;
          }
          return data;
        },
        { locationName, observationTime }
      );
    });
};
const getWeatherForcastData = () => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_FORECAST_NAME}`
  )
    .then((resp) => resp.json())
    .then(({ records }) => {
      console.table(records.location[0]);
      const { weatherElement } = records.location[0];
      const fetchData = weatherElement.reduce((data, { elementName, time }) => {
        if (['Wx', 'PoP', 'CI'].includes(elementName)) {
          data[elementName] = time[0].parameter;
        }
        return data;
      }, {});
      const { Wx, PoP, CI } = fetchData;

      return {
        description: Wx.parameterName,
        WeatherCode: Wx.parameterValue,
        rainPossibilities: PoP.parameterName,
        comfortability: CI.parameterName,
      };
    });
};
