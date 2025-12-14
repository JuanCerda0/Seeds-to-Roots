import { useState } from 'react';

function ConnectionTest() {
  const [backendStatus, setBackendStatus] = useState('No probado');
  const [loginStatus, setLoginStatus] = useState('No probado');
  const [productStatus, setProductStatus] = useState('No probado');
  const [registerStatus, setRegisterStatus] = useState('No probado');
  const [results, setResults] = useState({});

  const API_BASE_URL = 'http://localhost:8080';

  // Test 1: Verificar endpoint de prueba
  const testBackendHealth = async () => {
    try {
      setBackendStatus('🔄 Probando...');
      const response = await fetch(`${API_BASE_URL}/api/test`);
      if (response.ok) {
        const data = await response.text();
        setBackendStatus('✅ Conectado');
        setResults(prev => ({ ...prev, backend: data }));
      } else {
        setBackendStatus(`⚠️ Respuesta: ${response.status}`);
      }
    } catch (error) {
      setBackendStatus('❌ Error: ' + error.message);
      setResults(prev => ({ ...prev, backend: error.message }));
    }
  };

  // Test 2: Probar login
  const testLogin = async () => {
    try {
      setLoginStatus('🔄 Probando...');
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setLoginStatus('✅ Endpoint funciona - Login exitoso');
        setResults(prev => ({ ...prev, login: data }));
      } else if (response.status === 401) {
        setLoginStatus('✅ Endpoint funciona (credenciales incorrectas es normal)');
        setResults(prev => ({ ...prev, login: data }));
      } else {
        setLoginStatus(`⚠️ Respuesta: ${response.status}`);
        setResults(prev => ({ ...prev, login: data }));
      }
    } catch (error) {
      setLoginStatus('❌ Error: ' + error.message);
      setResults(prev => ({ ...prev, login: error.message }));
    }
  };

  // Test 3: Probar registro
  const testRegister = async () => {
    try {
      setRegisterStatus('🔄 Probando...');
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: 'Usuario Test',
          email: `test${Date.now()}@example.com`,
          password: 'password123'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRegisterStatus('✅ Registro exitoso');
        setResults(prev => ({ ...prev, register: data }));
      } else {
        setRegisterStatus(`⚠️ Respuesta: ${response.status} - ${data.message || 'Error'}`);
        setResults(prev => ({ ...prev, register: data }));
      }
    } catch (error) {
      setRegisterStatus('❌ Error: ' + error.message);
      setResults(prev => ({ ...prev, register: error.message }));
    }
  };

  // Test 4: Probar productos
  const testProducts = async () => {
    try {
      setProductStatus('🔄 Probando...');
      const response = await fetch(`${API_BASE_URL}/api/productos`);
      
      if (response.ok) {
        const data = await response.json();
        setProductStatus(`✅ Conectado - ${data.length || 0} productos`);
        setResults(prev => ({ ...prev, products: data }));
      } else {
        setProductStatus(`⚠️ Respuesta: ${response.status}`);
      }
    } catch (error) {
      setProductStatus('❌ Error: ' + error.message);
      setResults(prev => ({ ...prev, products: error.message }));
    }
  };

  const runAllTests = () => {
    setResults({});
    testBackendHealth();
    setTimeout(testLogin, 500);
    setTimeout(testRegister, 1000);
    setTimeout(testProducts, 1500);
  };

  const clearResults = () => {
    setResults({});
    setBackendStatus('No probado');
    setLoginStatus('No probado');
    setRegisterStatus('No probado');
    setProductStatus('No probado');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1000px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '30px' }}>
        <h1 style={{ color: '#2c3e50', borderBottom: '3px solid #3498db', paddingBottom: '15px', margin: '0 0 25px 0' }}>
          🔧 Test de Conexión Backend ↔️ Frontend
        </h1>
        
        <div style={{ backgroundColor: '#e8f4f8', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #b8dce8' }}>
          <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>🎯 Backend URL:</strong> <code>{API_BASE_URL}</code></p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>🌐 Frontend URL:</strong> <code>{window.location.origin}</code></p>
          <p style={{ margin: '10px 0 5px 0', fontSize: '13px', color: '#555' }}>
            ⚠️ Asegúrate de que el backend esté corriendo en el puerto 8080
          </p>
        </div>

        <div style={{ display: 'grid', gap: '15px', marginBottom: '25px' }}>
          {/* Test Backend General */}
          <div style={{ 
            padding: '20px', 
            border: '2px solid #e0e0e0', 
            borderRadius: '10px',
            backgroundColor: '#fafafa',
            transition: 'all 0.3s'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#34495e', fontSize: '18px' }}>
              1️⃣ Conexión General al Backend
            </h3>
            <p style={{ margin: '15px 0', fontSize: '16px', fontWeight: '500' }}>{backendStatus}</p>
            <button 
              onClick={testBackendHealth}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              🔍 Probar Conexión
            </button>
          </div>

          {/* Test Login */}
          <div style={{ 
            padding: '20px', 
            border: '2px solid #e0e0e0', 
            borderRadius: '10px',
            backgroundColor: '#fafafa'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#34495e', fontSize: '18px' }}>
              2️⃣ Endpoint de Login (POST /api/auth/login)
            </h3>
            <p style={{ margin: '15px 0', fontSize: '16px', fontWeight: '500' }}>{loginStatus}</p>
            <button 
              onClick={testLogin}
              style={{
                padding: '12px 24px',
                backgroundColor: '#9b59b6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#8e44ad'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#9b59b6'}
            >
              🔐 Probar Login
            </button>
          </div>

          {/* Test Registro */}
          <div style={{ 
            padding: '20px', 
            border: '2px solid #e0e0e0', 
            borderRadius: '10px',
            backgroundColor: '#fafafa'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#34495e', fontSize: '18px' }}>
              3️⃣ Endpoint de Registro (POST /api/auth/register)
            </h3>
            <p style={{ margin: '15px 0', fontSize: '16px', fontWeight: '500' }}>{registerStatus}</p>
            <button 
              onClick={testRegister}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1abc9c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#16a085'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1abc9c'}
            >
              ✍️ Probar Registro
            </button>
          </div>

          {/* Test Productos */}
          <div style={{ 
            padding: '20px', 
            border: '2px solid #e0e0e0', 
            borderRadius: '10px',
            backgroundColor: '#fafafa'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#34495e', fontSize: '18px' }}>
              4️⃣ Endpoint de Productos (GET /api/productos)
            </h3>
            <p style={{ margin: '15px 0', fontSize: '16px', fontWeight: '500' }}>{productStatus}</p>
            <button 
              onClick={testProducts}
              style={{
                padding: '12px 24px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
            >
              🛒 Probar Productos
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <button 
            onClick={runAllTests}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
          >
            🚀 Ejecutar Todos los Tests
          </button>
          
          <button 
            onClick={clearResults}
            style={{
              padding: '16px 24px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7f8c8d'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#95a5a6'}
          >
            🗑️ Limpiar
          </button>
        </div>

        {/* Resultados */}
        {Object.keys(results).length > 0 && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '10px',
            border: '2px solid #dee2e6'
          }}>
            <h3 style={{ color: '#2c3e50', marginTop: 0, fontSize: '18px' }}>📊 Resultados Detallados:</h3>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '20px', 
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '13px',
              border: '1px solid #e0e0e0',
              maxHeight: '400px',
              lineHeight: '1.5'
            }}>
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        {/* Ayuda */}
        <div style={{ 
          marginTop: '25px', 
          padding: '20px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '10px',
          border: '2px solid #ffc107'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#856404', fontSize: '16px' }}>💡 Solución de Problemas Comunes:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404', lineHeight: '1.8' }}>
            <li><strong>Backend no responde:</strong> Verifica que Spring Boot esté corriendo en puerto 8080</li>
            <li><strong>Error CORS:</strong> Revisa CorsConfig.java y asegúrate que permite http://localhost:5173</li>
            <li><strong>404 Not Found:</strong> Verifica que los endpoints en los controllers coincidan con las URLs</li>
            <li><strong>401 Unauthorized:</strong> Es normal en el test de login (credenciales de prueba)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ConnectionTest;