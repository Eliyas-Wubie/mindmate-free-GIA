import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PsychologyAltRoundedIcon from "@mui/icons-material/PsychologyAltRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useEffect, useMemo, useState } from "react";
import { Box, TextField, InputAdornment, Paper } from "@mui/material";
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
    const value = parseInt(e.target.value, 10);

    if (isNaN(value)) {
      setLimit(1);
      return;
    }

    setLimit(Math.max(1, Math.min(99, value)));
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  useEffect(() => {
    if (game === "vis") setRunning(<SpaceVis limit={limit} />);
    else if (game === "perc") setRunning(<PercSpeed limit={limit} />);
    else if (game === "num") setRunning(<NumSpeed limit={limit} />);
    else setRunning(null);
  }, [game, limit]);

  const menuItems = useMemo(
    () => [
      {
        text: "Spatial Visualisation",
        id: "vis",
        icon: <PsychologyAltRoundedIcon fontSize="small" />,
      },
      {
        text: "Perceptual Speed",
        id: "perc",
        icon: <InsightsRoundedIcon fontSize="small" />,
      },
      {
        text: "Number Speed & Accuracy",
        id: "num",
        icon: <NumbersRoundedIcon fontSize="small" />,
      },
    ],
    []
  );

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        p: 2,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,247,255,0.96) 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          mt: { xs: 1, md: 1 },
          borderRadius: "28px",
          p: 3,
          minHeight: "calc(100vh - 110px)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(240,245,255,0.90) 100%)",
          border: "1px solid rgba(160,190,255,0.20)",
          boxShadow: "0 10px 30px rgba(58, 97, 168, 0.10)",
        }}
      >
        <Typography
          sx={{  fontFamily: "'Courier Prime', monospace",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#1e4297",
            mb: 2.5,
          }}
        >
          GIA Game list
        </Typography>

        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  setGame(item.id);
                  setMobileOpen(false);
                }}
                selected={game === item.id}
                sx={{
                  borderRadius: "18px",
                  px: 2,
                  py: 1.5,
                  transition: "all 0.25s ease",
                  color: game === item.id ? "white" : "#334155",
                  background:
                    game === item.id
                      ? "linear-gradient(135deg, #53A8FF 0%, #2D91F4 55%, #2877E3 100%)"
                      : "transparent",
                  boxShadow:
                    game === item.id
                      ? "0 10px 24px rgba(45, 145, 244, 0.28)"
                      : "none",
                  "&:hover": {
                    background:
                      game === item.id
                        ? "linear-gradient(135deg, #53A8FF 0%, #2D91F4 55%, #2877E3 100%)"
                        : "rgba(45, 145, 244, 0.08)",
                  },
                }}
              >
                <Box sx={{ mr: 1.5, display: "flex", alignItems: "center" }}>
                  {item.icon}
                </Box>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: game === item.id ? 700 : 500,
                    fontSize: "1rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at top left, #EEF6FF 0%, #EAF2FF 38%, #F8FAFF 72%, #F4F7FF 100%)",
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: 64,
          justifyContent: "center",
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(130,160,220,0.16)",
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Toolbar
          sx={{
            minHeight: "64px !important",
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 1.5, md: 2.5 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              edge="start"
              sx={{
                mr: 0.5,
                display: { md: "none" },
                color: "#334155",
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            <img
              src="/pics/MindMate logo with colorful brain design.png"
              className={styles.logo}
              onClick={() => setGame(null)}
              style={{
                cursor: "pointer",
                height: "120px",
                objectFit: "contain",
              }}
              alt="MindMate Logo"
            />
          </Box>

          <TextField
            label="Limit"
            type="number"
            value={limit}
            onChange={handleOnChange}
            size="small"
            sx={{
              width: 110,
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                backgroundColor: "rgba(255,255,255,0.94)",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <TuneRoundedIcon sx={{ fontSize: 18, color: "#60A5FA" }} />
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          pt: "64px",
          minHeight: "100vh",
        }}
      >
        {/* Desktop Sidebar */}
        <Box
          sx={{
            width: { md: drawerWidth },
            flexShrink: 0,
            display: { xs: "none", md: "block" },
          }}
        >
          {drawerContent}
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              borderRight: "none",
              background: "transparent",
              boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
            p: { xs: 1.5, sm: 2, md: 2.5 },
          }}
        >
          <Box
            sx={{
              minHeight: "calc(100vh - 96px)",
              borderRadius: { xs: "24px", md: "30px" },
              p: { xs: 2, md: 2.5 },
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255, 255, 255, 0.92) 100%)",
              border: "1px solid rgba(146, 180, 255, 0.20)",
              boxShadow: "0 14px 40px rgba(70, 95, 150, 0.12)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {running ? (
              <Box sx={{ width: "100%" }}>{running}</Box>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  width: "100%",
                  maxWidth: 780,
                  display:"flex",
                  justifyContent:"center",
                  alignContent:"center",
                  flexDirection:"column",
                }}
              >
                <Typography
                  sx={{
                    color: "#1F2A44",
                    fontWeight: 800,
                    fontSize: { xs: "1.35rem", sm: "2rem" },
                    mb: 1,
                  }}
                >
                  Select a test
                </Typography>

                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                    mb: 3,
                  }}
                >
                  Practice pattern recognition, percentage speed, and number speed
                  in a focused interface.
                </Typography>

                <Box
                  
                  sx={{
                    mt: 1,
                    width: "100%",
                    maxWidth: 480,
                    padding:"20px",
                    height: "auto",
                    borderRadius: "24px",
                    boxShadow: "0 12px 30px rgba(55,90,160,0.16)",
                    border: "1px solid rgba(140,170,240,0.18)",
                    display:"flex",
                    flexDirection:"column",
                    gap:10, 
                    alignSelf:"center"                   
                  }}
                >   <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center" ,alignItems:"center"}}  
                onClick={() => {
                  setGame("vis");
                  setMobileOpen(false);
                }}><PsychologyAltRoundedIcon fontSize="large" /> Spatial Visualisation</Box>
                <Box sx={{display:"flex",justifyContent:"space-around"}}>
                  <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center" ,alignItems:"center"}}
                  onClick={() => {
                  setGame("perc");
                  setMobileOpen(false);
                }}
                  ><InsightsRoundedIcon fontSize="large" /> Perceptual Speed</Box>
                  <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center" ,alignItems:"center"}}
                  onClick={() => {
                  setGame("num");
                  setMobileOpen(false);
                }}
                  ><NumbersRoundedIcon fontSize="large" /> Number Speed & Accuracy</Box>
                </Box>
                
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}