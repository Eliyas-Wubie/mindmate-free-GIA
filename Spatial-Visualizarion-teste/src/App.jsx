import { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import SpaceVis from "./games/SpaceVis";
import PercSpeed from "./games/PercSpeed";
import NumSpeed from "./games/NumSpeed";

import "./App.css";

function App() {
  const [game, setGame] = useState(null);
  // const [running, setRunning] = useState(false);
  const [running,setRunning] = useState()
  const [limit,setLimit] = useState(50)
  function handleOnChange(e) {
    setLimit(prev=>parseInt(e.target.value));
  }
  useEffect(() => {
    if (game==="vis") {
      setRunning(<SpaceVis limit={limit} />);
    }
    else if (game==="perc") {
      setRunning(<PercSpeed limit={limit} />);
    }
        else if (game==="num") {
      setRunning(<NumSpeed limit={limit} />);
    }
  }, [game]);
  return (
    <Box
      key="main"
      sx={{
        backgroundColor: "#e1e1e1ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width:"50vw",
        minHeight:"80vh"
      }}
    >
      {game ? running : (
        <Box sx={{display:"flex", flexDirection:"column"}}>
          <Box sx={{fontSize:"2rem", marginBottom:"1rem"}}>Please select a game </Box>
          <TextField onChange={handleOnChange} placeholder="Insert Limit (default=50)" sx={{margin:"1rem"}}>Insert Limit</TextField>
          <Button onClick={()=>setGame("vis")}>Spacial Visualization</Button>
          <Button onClick={()=>setGame("perc")}>PerceptualSpeed</Button>
          <Button onClick={()=>setGame("num")}>Number Speed and Accuracy</Button>
        </Box>
      )}
    </Box>
  );
}

export default App;
