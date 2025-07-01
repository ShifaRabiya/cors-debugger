import { useState ,useEffect } from 'react';
import './App.css';
import { Sun, Moon, Play, Code, Server, Copy, Check } from 'lucide-react';
import Editor from "@monaco-editor/react"

function App() {
  const [theme, setTheme] = useState('dark');
  const [frontendCode, setFrontendCode] = useState('// frontend code here...');
  const [backendCode, setBackendCode] = useState('# backend code here...');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState({frontend: false, backend: false});
  const [mousePosition, setMousePosition] = useState({x:0, y:0});
  const [resultMessage, setResultMessage] = useState('');
  const [resultType, setResultType] = useState('');

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleRun = async () => {
    setIsRunning(true);
    setResultMessage('');
    try {
      console.log("Sending request...");

      const response = await fetch("http://127.0.0.1:5000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frontendCode,
          backendCode,
        }),
      });

      console.log("Request sent.");

      const data = await response.json();
      setResultMessage(data.message || "Success");
      setResultType(data.message?.toLowerCase().includes("error") ? "error" : "success");

    } catch (error) {
      console.error("Error sending code:", error);
      setResultMessage("Something went wrong.");
      setResultType("error");
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try{
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({...prev, [type]: true }));
      setTimeout(() => setCopied(prev => ({...prev, [type]: false})), 2000);
    }
    catch (err) {
      console.error("Copy failed", err);
    }
  };

  return(
    <div className={`app-container ${theme}`}>
      <div className="mouse-glow" style={{
        left: mousePosition.x - 200,
        top: mousePosition.y - 200
      }}></div>

      <header className="app-header">
        <div className="header-left">
          <h1 className="logo-text">CORS Debugger</h1>
        </div>
        <div className='controls'>
          <button onClick={toggleTheme} className='theme-toggle'>
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      <main className='app-main'>
        <section className='editor-section'>
          <div className='editor-block'>
            <div className='editor-header'>
              <Code />
              <div>
                <h3>Client Code</h3>
                <p>React Code</p>
              </div>
              <button onClick={() => copyToClipboard(frontendCode, 'frontend')}>
                {copied.frontend ? <Check className="success" /> : <Copy />}
              </button>
          </div>
          <Editor
            height="300px"
            language='javascript'
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            value={frontendCode}
            onChange={(value) => setFrontendCode(value)}
            className='monaco-editor'
            options={{
              fontSize: 14,
              minimap: {enabled: false},
              wordWrap: 'on',
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              tabsize: 2,
            }}
          />
          </div>

          <div className='editor-block'>
            <div className='editor-header'>
              <Server />
              <div>
                <h3>Server Code</h3>
                <p>Flask Code</p>
              </div>
              <button onClick={() => copyToClipboard(backendCode, 'backend')}>
                {copied.backend ? <Check className="success" /> : <Copy />}
              </button>
          </div>
          <Editor
            height="300px"
            language='python'
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            value={backendCode}
            onChange={(value) => setBackendCode(value)}
            className='monaco-editor'
            options={{
              fontSize: 14,
              minimap: {enabled: false},
              wordWrap: 'on',
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              tabsize: 2,
            }}
          />
          </div>
        </section>

        <div className='run-button-container'>
          <button className="run-button" onClick={handleRun} disabled={isRunning}>
            {isRunning ? "Running..." : (<><Play /> Run</>)}
          </button>

          {resultMessage && (
            <div className={`result-box ${resultType}`}>
              {resultMessage}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;