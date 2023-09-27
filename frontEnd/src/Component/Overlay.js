import React, { useContext, useState } from 'react'
import appProvider from './context/Createcontext'
function Overlay() {
    const { currentOverlay, setCurrentOverlay, setRefresh, checkupdate, setupdatedData } = useContext(appProvider);
    const handleOverlaySave = () => {
        const nedata = {
            content: currentOverlay.content,
            top: parseInt(currentOverlay.position.top),
            left: parseInt(currentOverlay.position.left),
        }
        try {
            fetch('http://localhost:5000/add_overlay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(nedata),
            }
            ).then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            }).then(data => {
                if (data.success == 'Overlay added successfully') {
                    setRefresh(true)
                    setCurrentOverlay({
                        id: 1,
                        content: "",
                        position: {
                            top: 0,
                            left: 0,
                        },
                    })

                }
                else {
                    alert(data.error)
                }
            }
            ).catch(error => {
                console.error('Fetch error:', error);
            });

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className=" d-flex justify-content-center my-3 ">
                <div className="overlay-editor">
                    <h4 className="">Edit Overlay</h4>
                    <input className='input_box'
                        type="text"
                        placeholder="Content"
                        value={currentOverlay.content}
                        onChange={(e) =>
                            setCurrentOverlay(
                                {
                                    ...currentOverlay,
                                    content: e.target.value,
                                }
                            )
                        }


                    />
                    <input className='input_box'
                        type="number"
                        placeholder="Top"
                        value={currentOverlay.position.top}
                        onChange={(e) =>
                            setCurrentOverlay(
                                {
                                    ...currentOverlay,
                                    position: {
                                        ...currentOverlay.position,
                                        top: e.target.value,
                                    },
                                }
                            )
                        }

                    />
                    <input className='input_box'
                        type="number"
                        placeholder="Left"
                        value={currentOverlay.position.left}
                        onChange={(e) =>
                            setCurrentOverlay(
                                {
                                    ...currentOverlay,
                                    position: {
                                        ...currentOverlay.position,
                                        left: e.target.value,
                                    },
                                }
                            )
                        }

                    />
                    {
                        checkupdate ? (<button
                            onClick={setupdatedData}
                            style={{
                                width: "160px",
                                height: "40px",
                                marginRight: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                display: "inline-block",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            Update Overlay
                        </button>

                        )
                            : (
                                <button
                                    onClick={handleOverlaySave}
                                    style={{
                                        width: "160px",
                                        height: "40px",
                                        marginRight: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        display: "inline-block",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    Save Overlay
                                </button>
                            )
                    }
                </div>

            </div></div>
    )
}

export default Overlay