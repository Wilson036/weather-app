import { useCallback, useEffect, useMemo, useState } from 'react';
import { getMoment } from 'utils/helper';

const getWeatherData = (key, locationName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${key}&locationName=${locationName}`
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
const getWeatherForcastData = (key, cityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${key}&locationName=${cityName}`
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

export const useWeatherAPI = ({ locationName, cityName, autherizeKey }) => {
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

  const fetchData = useCallback(async () => {
    const [currentWeather, weatherForcast] = await Promise.all([
      getWeatherData(autherizeKey, locationName),
      getWeatherForcastData(autherizeKey, cityName),
    ]);

    setWeatherInfo((prevState) => ({
      ...prevState,
      ...weatherForcast,
      ...currentWeather,
      isLoading: false,
    }));
  }, [locationName, cityName, autherizeKey]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherInfo, fetchData];
};
