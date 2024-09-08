import React, { useEffect, useState } from 'react';
import Graph from './components/Graph';
import './App.css'
import classNames from 'classnames'

const App = () => {


  const [vertexInput, setVertexInput] = useState('');
  const [topInput, settopInput] = useState('');
  const [onvert, setonvert] = useState(false)

  

  const [vertices, setvertices] = useState(null)
  const [edges, setedges] = useState(null)
  
  const [verticesPosition, setPosition] = useState({})
  
  const [openset, setopenset] = useState(false)

  // useEffect(() => { vertices && console.log(vertices)}, [vertices])
  // useEffect(() => { edges && console.log(edges)}, [edges])


  const [vertinfo, setvertinfo] = useState(null)
  const [edgeinfo, setedgeinfo] = useState(null)

  function JSONparse(value) {
    return JSON.parse(String(value)
        .replace('{', '[')
        .replace(/\(/g, '[')
        .replace(/\)/g, ']')
        .replace('}', ']')
      )
  }

  const ChangeTop = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9{},]/g, '');
    setVertexInput(value);
    const regex = /^\{(\d+(,\d+)*)?\}$/;
    if (regex.test(value)) {
      setvertinfo(value)
      value = JSONparse(value)
      
      setvertices(value)
      

      const newPositions = {};
      value.forEach(vertex => {
        if (!verticesPosition[vertex]) {
          newPositions[vertex] = {
            x: Math.random() * 200 + (window.innerWidth /2 - 100),
            y: Math.random() * 200 + (window.innerHeight /2 - 100),
          };
        } else {
          newPositions[vertex] = verticesPosition[vertex]; // Сохраняем старые позиции
        }
      });
      setPosition(prev => ({ ...prev, ...newPositions }));
    }
  };
  const ChangeArcs = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9{}(),]/g, '');
    settopInput(value);
    const regex = /^\{(\(\d+,\d+\)(,\(\d+,\d+\))*)?\}$/;
    if (regex.test(value)) {
      setedgeinfo(value)
      value = JSONparse(value)
      setedges(value)
    }
  };

    return (
      <>
        <form action="">
          <div className="settings">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" begin="indefinite"
            onClick={() => setopenset(!openset)}>
              <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434L8.932.727zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z"/>
              
            </svg>
            <ul className={classNames({openset, nonopen: !openset})}>
              <li><label><input type="checkbox" onChange={(e) => setonvert(!onvert)} checked={onvert}/>Ориентированный граф</label></li>
            </ul>
          </div>
          <input type="text" value={vertexInput} onChange={ChangeTop} placeholder='Вершины'/>
          <input type="text" onChange={ChangeArcs} value={topInput} placeholder={onvert ? 'Дуги' : 'Ребра '}/>
        </form>
        <Graph vertices={vertices} edges={edges} vPosition={verticesPosition} setPos={setPosition} onvert={onvert}/>
        {(vertinfo || edgeinfo) && <div className='infogarf'>
          {vertinfo && <p>Вершины: {vertinfo}</p>}
          {edgeinfo && <p>{onvert ? 'Дуги: ' : 'Ребра: '}{edgeinfo}</p>}
        </div>}
      </>
    );
};

export default App;