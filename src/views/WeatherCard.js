import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { ReactComponent as RainIcon } from '../images/rain.svg';
import { ReactComponent as AirFlowIcon } from '../images/airFlow.svg';
import { ReactComponent as RefreshIcon } from '../images/refresh.svg';
import { ReactComponent as LoadingIcon } from '../images/loading.svg';
import { ReactComponent as CogIcon } from './../images/cog.svg';
import WeatherIcon from 'components/WeatherIcon';
import { Link } from 'react-router-dom';

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  box-sizing: border-box;
  padding: 30px 15px;
  background-color: ${({ theme }) => theme.foregroundColor};
`;

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
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

function WeatherCard({ cityName, weatherInfo, fetchData, moment }) {
  const {
    Weather,
    WDSD,
    TEMP,
    WeatherCode,
    rainPossibilities,
    observationTime,
    isLoading,
  } = weatherInfo;

  return (
    <WeatherCardWrapper>
      <Link to="/setting">
        <Cog />
      </Link>
      <Location>{cityName}</Location>
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
    </WeatherCardWrapper>
  );
}

export default WeatherCard;
