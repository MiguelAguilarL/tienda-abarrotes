import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/datos')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
          Datos desde MySQL
        </h1>
        <ul className="space-y-3">
          {data.map(item => (
            <li
              key={item.id}
              className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg font-medium border border-blue-100"
            >
              {item.nombre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;