import React, { useEffect, useState } from "react";
import Webex from "webex";
import WebexSDKAdapter from "@webex/sdk-component-adapter";
import {
  useActivityStream,
  WebexDataProvider,
  WebexActivity,
  WebexActivityStream,
} from "@webex/components";
import { constructHydraId } from "@webex/common";

import {TestWebexActivity} from './components'
import "./App.css";

if (window.webexSDKAdapterSetLogLevel) {
  window.webexSDKAdapterSetLogLevel("debug");
}

const webexUtils = {
  constructHydraId,
};
window.webexUtils = webexUtils;

const Panel = ({ title, children }) => (
  <div className="panel">
    {title && <h2>{title}</h2>}
    {children}
  </div>
);

const TestPanel = ({ title = "Test Panel", roomID }) => {
  const [activitiesData, dispatch] = useActivityStream(roomID);
  return (
    <Panel>
      <h2>{title}</h2>
      <p>
        The following data is the result from the <code>useActivityStream</code>{" "}
        hook.
      </p>
      <pre>{JSON.stringify(activitiesData, null, 2)}</pre>
    </Panel>
  );
};

function fromSDKRoom(sdkConvo) {
  return {
    _id: sdkConvo.id,
    ID: constructHydraId("room", sdkConvo.id),
    type: sdkConvo.objectType,
    title: sdkConvo.displayName,
    created: sdkConvo.published,
    lastActivity: sdkConvo.lastReadableActivityDate,
    lastSeenActivityDate: sdkConvo.lastSeenActivityDate,
  };
}

const sampleIds = [
  "Y2lzY29zcGFyazovL3VzL01FU1NBR0UvMDIwMTk5YjAtOWIyNC0xMWVjLTkwOWItNTlkMDBjMDJjY2E5",
  "Y2lzY29zcGFyazovL3VzL01FU1NBR0UvZjU3ZjhiMjAtOWIyMy0xMWVjLTk1Y2MtZGI0NWUyYzgxZjFh",
  "Y2lzY29zcGFyazovL3VzL01FU1NBR0UvOTNmN2IyYzAtOWIyMi0xMWVjLTkwNWUtMTllMzg2MDZhOGEw",
];

function App() {
  const [adapterConnected, setAdapterConnected] = useState(false);
  const [adapterConnecting, setAdapterConnecting] = useState(false);
  const [accessToken, setAccessToken] = useState(
    `${process.env.WEBEX_ACCESS_TOKEN}`
  );
  const [roomID, setRoomID] = useState("Y2lzY29zcGFyazovL3VzL1JPT00vYmMyMjY2YjAtZDZjMy0xMWViLWFlZjUtNmQ3NzkwOGJmY2Ji");
  const [personID, setPersonID] = useState("");

  const [activityID, setActivityID] = useState("");
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({});
  const [activityIDs, setActivityIDs] = useState(sampleIds);
  const adapter = React.useRef();
  const [rooms, setRooms] = useState([]);

  const loadRooms = (e) => {
    adapter.current.datasource.internal.conversation.list().then((convos) => {
      console.log('conversations', convos);

      const data = convos
        .filter((c) => c.displayName !== undefined)
        .map((c) => fromSDKRoom(c))
        .sort();
      
        console.table(data);
      
      setRooms(data);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      roomID,
      personID,
      activityID,
      activityIDs,
    };
    window.ROOMID = data.roomID;
    setFormData(data);

    console.log("Submit Form", data);
    return false;
  };

  const handleConnect = async () => {
    const webex = new Webex({
      credentials: accessToken,
    });
    adapter.current = new WebexSDKAdapter(webex);
    setAdapterConnecting(true);
    await adapter.current.connect();
    setAdapterConnected(true);
    setAdapterConnecting(false);
    window.webexSDKAdapter = adapter.current;
    console.log("window.webexSDKAdapter", window.webexSDKAdapter);
  };

  const handleDisconnect = async () => {
    setAdapterConnecting(false);
    await adapter.current.disconnect();
    setAdapterConnected(false);
  };

  const handleCreateMessage = (e) => {
    e.preventDefault();
    adapter.current.datasource.messages
      .create({ text, roomId: roomID })
      .then(() => {
        setText("");
      });
    return false;
  };

  const handleRoomChange = (e) => {
    setRoomID(e.currentTarget.value);
  };

  let pastHandle = null;
  const handleLoadingPastActivities = () => {
    if(pastHandle){
      pastHandle.unsubscribe();
    }
    pastHandle = adapter.current.roomsAdapter.getPastActivities(roomID, 25).subscribe(console.table);
    adapter.current.roomsAdapter.hasMoreActivities(roomID);
  }


  useEffect(() => {
    async function doConnect() {
      await handleConnect();
    }
    //doConnect();

    return () => {
      handleDisconnect();
    };
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <h1>Webex Dev App</h1>
      </div>
      <div className="App-layout">
        <div className="App-sidebar">
          <Panel>
            <fieldset>
              <legend>Access Token</legend>
              <input
                type="text"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </fieldset>
            <fieldset>
              <legend>Adapter Status</legend>
              {!adapterConnected && !adapterConnecting && <p>Disconnected</p>}
              {adapterConnecting && <p>Connecting...</p>}
              {adapterConnected && <p className="success">Connected</p>}
            </fieldset>
            <button onClick={handleConnect} disabled={adapterConnected}>
              Connect
            </button>
            <button onClick={handleDisconnect} disabled={!adapterConnected}>
              Disconnect
            </button>
          </Panel>

          <Panel>
            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>Rooms</legend>
                <select onChange={handleRoomChange}>
                
                  {rooms &&
                    rooms.map((r) => (
                      <option key={r.ID} value={r.ID}>
                        {r.title}
                      </option>
                    ))}
                </select>
                <button onClick={loadRooms} type="button">
                  Load rooms
                </button>
              </fieldset>

              <fieldset>
                <legend>Past Activities</legend>
                <button onClick={handleLoadingPastActivities}>Fetch Past Activities</button>
              </fieldset>


              <fieldset>
                <legend>Room ID</legend>
                <input
                  type="text"
                  value={roomID}
                  onChange={(e) => setRoomID(e.target.value)}
                />
              </fieldset>
              <fieldset>
                <legend>Person ID</legend>
                <input
                  type="text"
                  value={personID}
                  onChange={(e) => setPersonID(e.target.value)}
                />
              </fieldset>
              <fieldset>
                <legend>Activity ID</legend>
                <input
                  type="text"
                  value={activityIDs.join(",")}
                  onChange={(e) => {
                    let ids = e.target.value.split(",");
                    let [id] = ids;
                    setActivityID(id);
                    setActivityIDs(ids);
                  }}
                />
              </fieldset>
              <button type="submit">Update</button>
              <button type="reset" onClick={() => setFormData({})}>
                Reset
              </button>
            </form>

            <fieldset>
              <legend>Debug</legend>
              <pre>formData: {JSON.stringify(formData, null, 2)}</pre>
            </fieldset>
          </Panel>
        </div>

        <div className="App-content">
          <Panel>
            <form onSubmit={handleCreateMessage}>
              <fieldset>
                
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">Send</button>
              </fieldset>
            </form>
          </Panel>


          {adapterConnected && (
            <WebexDataProvider adapter={adapter.current}>
              <TestWebexActivity roomID={formData.roomID || roomID}/>
              <Panel>
                <h2>WebexActivityStream (roomID)</h2>
                {!formData.roomID && <h3>Specifiy a roomID</h3>}
                {formData.roomID && (
                  <WebexActivityStream
                    roomID={formData.roomID}
                    style={{ height: 500 }}
                  />
                )}
              </Panel>
            

              
            </WebexDataProvider>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
