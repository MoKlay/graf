import React, {useEffect, useState} from 'react';

const Graph = ({ vertices = null, edges = [], vPosition, setPos, onvert }) => {
    
    const [loopVector, setloopVector] = useState({})
    const [draggingVertex, setDraggingVertex] = useState(null);
    const [localEdges, setLocalEdges] = useState(null)
    
    useEffect(() => {
        if (edges && edges.length !== 0) {
            let arcs = []
            edges.forEach(el => {
                arcs.push({start: el[0], end: el[1]})
            });
            setLocalEdges(arcs)
        }
    }, [edges])
    // Функции перемещения
    const handleMouseDown = (key) => setDraggingVertex(key)
    

    const [isDragging, setIsDragging] = useState(false);
    const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const handleMouseDownSvg = (e) => {
        if (e.button === 1) { 
            setIsDragging(true);
            setPrevMousePos({ x: e.clientX, y: e.clientY });
        }
    }
    const handleMouseMove = (event) => {
        if (draggingVertex) {
            const updatedVertices = { ...vPosition };
            updatedVertices[draggingVertex] = {
                x: event.clientX - offset.x,
                y: event.clientY - offset.y -60
            };
            setPos(updatedVertices);
        }
        if (isDragging) {
            const dx = event.clientX - prevMousePos.x;
            const dy = event.clientY - prevMousePos.y;
            setOffset((prevOffset) => ({
                x: prevOffset.x + dx,
                y: prevOffset.y + dy,
            }));
            setPrevMousePos({ x: event.clientX, y: event.clientY });
        }
    };
    // ---
    const handleMouseUp = () => {
        setDraggingVertex(null)
        setIsDragging(false);
    }
    return (
        <svg
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDownSvg}
        >
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="15" refY="5" orient="auto">
                    <path d="M0,3 L8,5 L0,7" fill='black'/>
                </marker>
            </defs>
            {localEdges && Array.isArray(localEdges) && localEdges.map((value, i) => {
                if (value.start !== value.end) {
                    const start = vPosition[value.start];
                    const end = vPosition[value.end];
                    if (start && end) {
                        return (
                            <line
                                key={i}
                                x1={start.x + offset.x}
                                y1={start.y +offset.y}
                                x2={end.x+ offset.x}
                                y2={end.y+offset.y}
                                stroke="black"
                                strokeWidth={2}
                                markerEnd={onvert && "url(#arrow)"}
                            />
                        );
                    }
                }
                else {
                    const start = vPosition[value.start];
                    if (start) {
                        const x = offset.x + start.x
                        const y = offset.y + start.y
                        let updateloop = {}
                        if (!loopVector[value.start]) {
                            
                            updateloop[value.start] = {
                                x1: Math.random() *1000 -500, 
                                y1: Math.random() *1000 -500,
                                x2: Math.random() *1000 -500, 
                                y2: Math.random() *1000 -500}
                            setloopVector(prev => ({...prev, ...updateloop}))
                        }
                        const pathData = updateloop[value.start] || loopVector[value.start];
                        return (
                            <path
                                key={`loop-${i}`}
                                d={`M ${x} ${y} C ${x + pathData.x1} ${y - pathData.y1} ${x + pathData.x2} ${y + pathData.y2} ${x} ${y}`}
                                stroke="black"
                                fill="none"
                                strokeWidth={2}
                            />
                        );
                    }
                }
                return null; 
            })}

            {/* Отрисовка вершин */}
            {vertices && vertices.map((value, index) => {
                const x = vPosition[value].x + offset.x
                const y = vPosition[value].y + offset.y
                return (
                <>
                    <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r={15}
                        fill="black"
                        onMouseDown={() => handleMouseDown(value)}
                    />
                    <text
                        key={`text-${index}`}
                        x={x}
                        y={y + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        style={{pointerEvents: 'none'}}
                    >
                        {value}
                    </text>
                </>
            )})}
        </svg>
    );
};

export default Graph;