import React, { useEffect, useState } from 'react'
import appProvider from './Createcontext'
function DataProvider(props) {

    const [overlays, setOverlays] = useState([]);
    const [currentOverlay, setCurrentOverlay] = useState({
        id: 1,
        content: "",
        position: {
            top: 0,
            left: 0,
        },
    });


    const [checkupdate, setCheckupdate] = useState(false);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {

        try {
            fetch('http://localhost:5000/get_overlay', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    console.log(data.data)
                    if (data.success == 'Overlay found') {
                        setOverlays(data.data)
                        setRefresh(false)
                    }
                    else {
                        setOverlays([])
                        setRefresh(false)
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        } catch (error) {
            console.log(error);
        }
    }, [refresh]);


    const setupdatedData = () => {
        console.log(currentOverlay._id)
        const update = {
            id: currentOverlay._id,
            content: currentOverlay.content,
            top: parseInt(currentOverlay.position.top),
            left: parseInt(currentOverlay.position.left),
        }

        try {
            fetch('http://localhost:5000/update_overlay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(update),
            }
            ).then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            }).then(data => {
                if (data.success == 'Overlay updated successfully') {
                    setRefresh(true)
                    setCheckupdate(false)
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
    }

    return (
        <div>
            <appProvider.Provider
                value={{
                    overlays,
                    setOverlays,
                    currentOverlay,
                    setCurrentOverlay,
                    setRefresh,
                    checkupdate,
                    setCheckupdate,
                    setupdatedData,
                }}
            >
                {props.children}
            </appProvider.Provider>
        </div>
    )
}

export default DataProvider