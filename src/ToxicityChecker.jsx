import React, { useState, useEffect } from 'react';

function ToxicityChecker() {
    const [model, setModel] = useState(null);
    const [text, setText] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const threshold = 0.8; // Minimum confidence threshold

    useEffect(() => {
        async function loadModel() {
            try {
                setLoading(true);
                const toxicityModel = await toxicity.load(threshold);
                setModel(toxicityModel);
            } catch (error) {
                console.error("Failed to load model:", error);
            } finally {
                setLoading(false);
            }
        }

        loadModel();
    }, []);

    const analyzeToxicity = async () => {
        if (model && text.trim()) {
            setLoading(true);
            try {
                const predictionResult = await model.classify(text);
                setPredictions(predictionResult);
            } catch (error) {
                console.error("Analysis failed:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            boxSizing: 'border-box',
        },
        title: {
            textAlign: 'center',
            color: '#333',
            marginBottom: '20px',
        },
        textareaContainer: {
            width: '100%',
            marginBottom: '15px',
        },
        textarea: {
            width: '100%',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '16px',
            resize: 'vertical',
            minHeight: '100px',
            boxSizing: 'border-box',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
        },
        button: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonDisabled: {
            backgroundColor: '#cccccc',
            cursor: 'not-allowed',
        },
        resultsContainer: {
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        resultsList: {
            listStyleType: 'none',
            padding: 0,
        },
        resultItem: {
            padding: '10px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        toxic: {
            color: '#d32f2f',
            fontWeight: 'bold',
        },
        notToxic: {
            color: '#388e3c',
        },
        loadingText: {
            textAlign: 'center',
            color: '#666',
            fontStyle: 'italic',
        },
        label:{
            color: '#333',
            fontWeight: 'bold',
            marginRight: '10px',
            textTransform: 'capitalize',
        }
        // Media query styles applied through conditional rendering
    };

    // Responsive adjustments for mobile
    const getMobileStyles = () => {
        if (window.innerWidth <= 480) {
            return {
                container: {
                    padding: '10px',
                },
                textarea: {
                    fontSize: '14px',
                },
                button: {
                    padding: '8px 16px',
                    fontSize: '14px',
                },
            };
        }
        return {};
    };

    // Combine base styles with responsive styles
    const responsiveStyles = {...styles, ...getMobileStyles()};

    return (
        <div style={responsiveStyles.container}>
            <h2 style={responsiveStyles.title}>Toxicity Checker</h2>

            <div style={responsiveStyles.textareaContainer}>
                <textarea
                    style={responsiveStyles.textarea}
                    rows="4"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to analyze for toxicity"
                />
            </div>

            <div style={responsiveStyles.buttonContainer}>
                <button 
                    onClick={analyzeToxicity} 
                    disabled={!model || loading || !text.trim()}
                    style={{
                        ...responsiveStyles.button,
                        ...((!model || loading || !text.trim()) ? responsiveStyles.buttonDisabled : {})
                    }}
                >
                    {loading ? 'Processing...' : 'Analyze Toxicity'}
                </button>
            </div>

            {loading && model && <p style={responsiveStyles.loadingText}>Analyzing text...</p>}
            {!model && <p style={responsiveStyles.loadingText}>Loading toxicity model...</p>}

            {predictions.length > 0 && (
                <div style={responsiveStyles.resultsContainer}>
                    <h3 style={responsiveStyles.title}>Analysis Results:</h3>
                    <ul style={responsiveStyles.resultsList}>
                        {predictions.map((prediction) => {
                            const isToxic = prediction.results[0].probabilities[1] > threshold;
                            const percentage = (prediction.results[0].probabilities[1] * 100).toFixed(2);
                            
                            return (
                                <li key={prediction.label} style={responsiveStyles.resultItem}>
                                    <span style={responsiveStyles.label}>{prediction.label.charAt(0).toUpperCase() + prediction.label.slice(1)}</span>
                                    <span style={isToxic ? responsiveStyles.toxic : responsiveStyles.notToxic}>
                                        {isToxic ? 'Toxic' : 'Not Toxic'} ({percentage}%)
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ToxicityChecker;




// import React, { useState, useEffect } from 'react';

// function ToxicityChecker() {
//     const [model, setModel] = useState(null);
//     const [text, setText] = useState('');
//     const [predictions, setPredictions] = useState([]);
//     const threshold = 0.8; // Minimum confidence threshold

//     useEffect(() => {
//         async function loadModel() {
//             const toxicityModel = await toxicity.load(threshold);
//             setModel(toxicityModel);
//         }

//         loadModel();
//     }, []);

//     const analyzeToxicity = async () => {
//         if (model) {
//             const predictionResult = await model.classify(text);
//             setPredictions(predictionResult);
//             console.log(predictionResult)
//         }
//     };

//     return (
//         <div>
//             <textarea
//                 rows="4"
//                 cols="50"
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Enter text to analyze"
//             />
//             <button onClick={analyzeToxicity} disabled={!model}>
//                 Analyze
//             </button>

//             {predictions.length > 0 && (
//                 <div>
//                     <h3>Predictions:</h3>
                    
//                   <ul>
//                       {predictions.map((prediction) => (
//                           <li key={prediction.label}>
//                               {prediction.label}:" "
//                               {prediction.results[0].probabilities[1] > threshold ? 'Toxic' : 'Not Toxic'} ({(prediction.results[0].probabilities[1] * 100).toFixed(2)}%)
//                           </li>
//                       ))}
//                   </ul>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ToxicityChecker;