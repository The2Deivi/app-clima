import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(true);
    }, 3000);

    const success = (pos) => {
      console.log(pos);
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    };

    const error = () => {
      setHasError(true);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  console.log(coords);

  useEffect(() => {
    if (coords) {
      const API_KEY = "adbf3e28022763d0a21145ec071aca7c";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`;

      axios
        .get(url)
        .then((res) => {
          setWeather(res.data);
          const celsius = (res.data.main.temp - 273.15).toFixed(1);
          const fahrenheit = ((celsius * 9) / 5 + 32).toFixed(1);
          setTemp({ celsius, fahrenheit });
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
  }, [coords]);

  console.log(weather);

  return (
    <div className="app">
      {isLoading ? (
        <div>
          <h1>loading...</h1>
          {showMessage && <p>Por favor, "Permitir" ubicación</p>}
        </div>
      ) : hasError ? (
        <h1>
          Para obtener la información, por favor dar "Permitir" ubicación...
        </h1>
      ) : (
        <WeatherCard weather={weather} temp={temp} />
      )}
    </div>
  );
}

export default App;