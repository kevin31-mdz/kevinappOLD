import React, { useState, useEffect } from 'react';

const CONFIG = {
  API_URL: "http://localhost:3001/api"
};

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function App() {
  const [mes, setMes] = useState('Abril');
  const [forecast, setForecast] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch forecast del mes
      const forecastRes = await fetch(`${CONFIG.API_URL}/getForecast?month=${mes}`);
      const forecastData = await forecastRes.json();
      setForecast(forecastData);

      // Fetch resumen mensual
      const resumenRes = await fetch(`${CONFIG.API_URL}/getResumenMensual`);
      const resumenData = await resumenRes.json();
      setResumen(resumenData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mes]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      <header>
        <h1>💰 Control Financiero</h1>
        <select value={mes} onChange={(e) => setMes(e.target.value)}>
          {MESES.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </header>

      <main>
        {forecast && (
          <section className="forecast">
            <h2>Forecast {mes}</h2>
            <div className="cards">
              <div className="card ingresos">
                <span>Ingresos</span>
                <strong>${forecast.ingresos?.toLocaleString() || 0}</strong>
              </div>
              <div className="card gastos">
                <span>Gastos</span>
                <strong>${forecast.gastos?.toLocaleString() || 0}</strong>
              </div>
              <div className="card ahorro">
                <span>Ahorro</span>
                <strong>${forecast.ahorro?.toLocaleString() || 0}</strong>
              </div>
            </div>
          </section>
        )}

        {resumen && (
          <section className="resumen">
            <h2>Resumen Anual</h2>
            <pre>{JSON.stringify(resumen, null, 2)}</pre>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
