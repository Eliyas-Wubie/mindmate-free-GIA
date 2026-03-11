import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText  from "@mui/material/ListItemText"; 
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import styles from "../component/nav.module.css";
import SpaceVis from "../games/SpaceVis";
import PercSpeed from "../games/PercSpeed";
import NumSpeed from "../games/NumSpeed";

const drawerWidth = 300;

export default function Navbar() {
  const [game, setGame] = useState(null);
  const [running, setRunning] = useState(null);
  const [limit, setLimit] = useState(5);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleOnChange(e) {
    setLimit(parseInt(e.target.value));
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (game === "vis") setRunning(<SpaceVis limit={limit} />);
    else if (game === "perc") setRunning(<PercSpeed limit={limit} />);
    else if (game === "num") setRunning(<NumSpeed limit={limit} />);
    else setRunning(null);
  }, [game, limit]);

  const menuItems = [
    { text: "Spacial Visualization", id: "vis" },
    { text: "Percentage Speed", id: "perc" },
    { text: "Number Speed", id: "num" },
  ];

  // Sidebar content
  const drawer = (
    <Box sx={{ width: drawerWidth, p: 4 }}>
        
      <h2 className={styles.sidebartitle}>Test list</h2>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => {
                setGame(item.id);
                setMobileOpen(false); // close mobile drawer after selection
              }}
              selected={game === item.id}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "rgb(45, 145, 244)",

                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  
                  "&:hover": { backgroundColor: "#519ad6", borderRadius: "10px" },
                },
                "&:hover": { backgroundColor: "#519ad6", borderRadius: "10px" },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F6F9FC" }}>
      {/* Top Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          backgroundColor: "#F6F9FC",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Mobile burger icon for <900px */}
            <IconButton
              color="black"
              edge="start"
              sx={{ mr: 2, display: { md: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <img
              src="/pics/Logo maker project.png"
              className={styles.logo}
              onClick={() => setGame(null)}
              style={{ cursor: "pointer", height: "40px" }}
            />
          </Box>
          <TextField
            label="Limit"
            type="number"
            value={limit}
            onChange={handleOnChange}
            size="small"
            sx={{ width: { xs: 70, sm: 100 } }}
          />
        </Toolbar>
      </AppBar>
<Box sx={{ display: "flex", flexDirection: "", minHeight: "100vh", backgroundColor: "#F6F9FC" ,width:"100vw"}}>
      {/* Desktop sidebar for >=900px */}
      {/* Desktop sidebar for >=900px */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            overflow: "hidden", 
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Mobile sidebar for <900px */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            minWidth: "300px",
            maxWidth: "800px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
           
            backgroundColor: "#F6F9FC",
            
          
          }}
        >
          {running ? (
            running
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: { xs: "18px", sm: "26px" },
                }}
              >
                {`Select a test ${window.innerWidth < 900 ? "above" : "from the sidebar"}`}
              </Typography>
              <Box
                component="img"
                src="pics/Logical Reasoning Preparation Book_ 100 IQ Questions Available at AMAZON.png"
                sx={{ mt: 2, maxWidth: "90%", height: "auto", borderRadius: "10px" }}
              />
            </Box>
          )}
        </Box>
      </Box>
      </Box>
    </Box>
  );
}