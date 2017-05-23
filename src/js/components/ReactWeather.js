import React, { PropTypes } from 'react';
import OWApi from '../OWApi';
import utils from '../utils';
import TodayForecast from './TodayForecast';
import DaysForecast from './DaysForecast';
import WeatherIcon from './WeatherIcon';
import '../../css/components/ReactWeather.scss';

const propTypes = {
  unit: PropTypes.oneOf(['metric', 'imperial']),
  type: PropTypes.oneOf(['geo', 'city']),
  lat: PropTypes.string,
  lon: PropTypes.string,
  city: PropTypes.string,
  forecast: PropTypes.oneOf(['today', '5days']),
  apikey: PropTypes.string.isRequired
};

const defaultProps = {
  unit: 'metric',
  type: 'geo',
  forecast: 'today'
};

class ReactWeather extends React.Component {
  constructor(props) {
    super(props);
    this.api = new OWApi(props.unit, props.apikey);
    this.state = {
      data: null
    };
  }
  render() {
    const { unit, forecast } = this.props;
    const data = this.state.data;
    if (data) {
      const days = data.days;
      const today = days[0];
      const todayIcon = utils.getIcon(today.weather.icon);
      return (
        <div className="rw-box">
          <div className={`rw-main type-${forecast}`}>
            <div className="rw-box-left">
              <h2>{data.city.name}</h2>
              <TodayForecast todayData={today} unit={unit} />
            </div>
            <div className="rw-box-right">
              <WeatherIcon name={todayIcon} />
            </div>
          </div>
          <DaysForecast unit={unit} forecast={forecast} daysData={days} />
        </div>
      );
    }
    return (<div>Loading...</div>);
  }
  componentDidMount() {
    this.getWeatherData();
  }
  getWeatherData() {
    const self = this;
    const forecast = self.props.forecast;
    const params = self._getParams();
    let promise = null;
    if (forecast === 'today') {
      promise = self.api.getWeatherData(params);
    } else if (forecast === '5days') {
      params.cnt = 5;
      promise = self.api.getForecastData(params);
    }
    promise.then((data) => {
      self.setState({
        data
      });
    });
  }
  _getParams() {
    const { type, lon, lat, city } = this.props;
    switch (type) {
      case 'city':
        return { q: city };
      default:
        return { lon, lat };
    }
  }
}

ReactWeather.propTypes = propTypes;
ReactWeather.defaultProps = defaultProps;

export default ReactWeather;