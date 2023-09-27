import React, { useState, useContext } from "react";
import ReactPlayer from "react-player/lazy";
import Overlay from "./Overlay";
import appProvider from "./context/Createcontext";
const LiveStream = () => {
  const [url, setUrl] = useState(""); // State to store the RTSP URL
  const [playing, setPlaying] = useState(false);

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };
  const { overlays, setCurrentOverlay, setRefresh, setCheckupdate } =
    useContext(appProvider);

  const handleOverlayClick = (overlay) => {
    setCheckupdate(true);
    setCurrentOverlay(overlay);
  };

  const handleOverlayDelete = (overlay) => {
    const position = {
      top: parseInt(overlay.position.top),
      left: parseInt(overlay.position.left),
    };
    console.log(position);

    try {
      fetch("http://localhost:5000/delete_overlay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(position),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          if (data.success == "Overlay deleted successfully") {
            setRefresh(true);
            setCheckupdate(false);
            setCurrentOverlay({
              id: 1,
              content: "",
              position: {
                top: 0,
                left: 0,
              },
            });
          } else {
            alert(data.error);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container ">
      <h1 className="text-center my-4 text-uppercase ">Live Stream App</h1>
      <div className="d-flex  justify-content-center ">
        <input
          className="input_url"
          type="text"
          placeholder="Enter RTSP URL"
          value={url}
          onChange={handleInputChange}
        />
        <button
          className="btn  btn-success buttons-play-pause ms-2"
          onClick={handlePlay}
        >
          Play
        </button>
        <button
          className="btn btn-danger buttons-play-pause ms-2"
          onClick={handlePause}
        >
          Pause
        </button>
      </div>

      <Overlay />
      <div className=" position-relative">
        <div className="mx-auto">
          {url && (
            <ReactPlayer
              url={url}
              controls
              playing={playing}
              width="65%"
              height="30%"
              style={{
                margin: "auto",
              }}
            />
          )}
          {overlays.map((overlay, index) => (
            <div
              key={index}
              className="overlay"
              style={{
                top: overlay.position.top + 10,
                left: overlay.position.left + 240,
                position: "absolute",
              }}
              onClick={() => {
                handleOverlayClick(overlay);
              }}
            >
              <span
                className="text-white "
                style={{
                  backgroundColor: "green",
                  padding: "5px 15px",
                  borderRadius: "5px",
                }}
              >
                {overlay.content}
              </span>
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleOverlayDelete(overlay)}
                style={{
                  borderRadius: "50%",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
