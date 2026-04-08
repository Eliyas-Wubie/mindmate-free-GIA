import { useEffect, useMemo, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SpaceVis from "../games/SpaceVis";
import PercSpeed from "../games/PercSpeed";
import NumSpeed from "../games/NumSpeed";
import styles from "../component/nav.module.css";

const drawerWidth = 320;

const shellStyles = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  background:
    "radial-gradient(circle at 15% 20%, rgba(241, 61, 194, 0.18) 0%, rgba(241, 61, 194, 0) 26%), radial-gradient(circle at 90% 18%, rgba(72, 124, 255, 0.22) 0%, rgba(72, 124, 255, 0) 24%), radial-gradient(circle at 82% 88%, rgba(184, 59, 255, 0.16) 0%, rgba(184, 59, 255, 0) 24%), linear-gradient(135deg, #090915 0%, #120c24 48%, #14091f 100%)",
  position: "relative",
  overflowX: "hidden",
  overflowY: "hidden",
};

const glassPanel = {
  background:
    "linear-gradient(180deg, rgba(20, 17, 43, 0.94) 0%, rgba(18, 15, 36, 0.9) 100%)",
  border: "1px solid rgba(159, 121, 255, 0.18)",
  boxShadow:
    "0 24px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  backdropFilter: "blur(18px)",
};

export default function Navbar() {
  const [game, setGame] = useState(null);
  const [running, setRunning] = useState(null);
  const [limit, setLimit] = useState(10);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleOnChange(e) {
    const rawValue = e.target.value;
    const value = parseInt(rawValue, 10);

    if (rawValue === "" || Number.isNaN(value)) {
      setLimit(10);
      return;
    }

    setLimit(Math.max(1, Math.min(100, value)));
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
        text: "Spatial Visualization",
        subtitle: "Rotate / Decide / Win",
        id: "vis",
        icon: <SportsEsportsRoundedIcon fontSize="small" />,
      },
      {
        text: "Perceptual Speed",
        subtitle: "React / Faster / Sharper",
        id: "perc",
        icon: <BoltRoundedIcon fontSize="small" />,
      },
      {
        text: "Number Speed & Accuracy",
        subtitle: "Think / Calculate / Master",
        id: "num",
        icon: <TagRoundedIcon fontSize="small" />,
      },
    ],
    []
  );

  const activeGame = menuItems.find((item) => item.id === game);

  const drawerContent = (
    <Box sx={{ height: "100%", p: { xs: 1.25, md: 1 } }}>
      <Box
        sx={{
          ...glassPanel,
          borderRadius: "28px",
          height: "100%",
          p: 1.7,
          color: "#F5F0FF",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflow: "hidden",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"Bahnschrift", "Trebuchet MS", sans-serif',
              fontSize: "1.8rem",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            Mind
            <Box component="span" sx={{ color: "#ff4fc9" }}>
              Mate
            </Box>
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              color: "rgba(219, 205, 255, 0.7)",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Train / Focus / Win
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "0.98rem",
              fontWeight: 700,
              color: "#FFFFFF",
              mb: 0.8,
            }}
          >
            GIA Game list
          </Typography>

          <List sx={{ p: 0, display: "flex", flexDirection: "column", gap: 0.7 }}>
            {menuItems.map((item) => {
              const selected = game === item.id;

              return (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setGame(item.id);
                      setMobileOpen(false);
                    }}
                    sx={{
                      borderRadius: "20px",
                      px: 2,
                      py: 0.95,
                      alignItems: "center",
                      background: selected
                        ? "linear-gradient(90deg, rgba(100, 56, 255, 0.75) 0%, rgba(255, 77, 199, 0.72) 100%)"
                        : "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)",
                      border: selected
                        ? "1px solid rgba(255, 143, 230, 0.55)"
                        : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: selected
                        ? "0 0 0 1px rgba(82, 174, 255, 0.26), 0 16px 26px rgba(255, 52, 181, 0.22), inset 0 0 24px rgba(255, 255, 255, 0.08)"
                        : "none",
                      "&:hover": {
                        background: selected
                          ? "linear-gradient(90deg, rgba(100, 56, 255, 0.8) 0%, rgba(255, 77, 199, 0.78) 100%)"
                          : "rgba(255,255,255,0.05)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        mr: 1.55,
                        width: 34,
                        height: 34,
                        borderRadius: "14px",
                        display: "grid",
                        placeItems: "center",
                        color: selected ? "#fff" : "#d38fff",
                        background: selected
                          ? "rgba(255,255,255,0.12)"
                          : "linear-gradient(180deg, rgba(148, 76, 255, 0.16) 0%, rgba(255, 82, 191, 0.08) 100%)",
                      }}
                    >
                      {item.icon}
                    </Box>

                    <ListItemText
                      primary={item.text}
                      secondary={item.subtitle}
                      primaryTypographyProps={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: "#fff",
                        lineHeight: 1.2,
                      }}
                      secondaryTypographyProps={{
                        fontSize: "0.7rem",
                        color: selected
                          ? "rgba(255,255,255,0.78)"
                          : "rgba(214, 201, 255, 0.62)",
                        mt: 0.35,
                      }}
                    />

                    <ChevronRightRoundedIcon
                      sx={{ color: selected ? "#fff" : "rgba(220, 205, 255, 0.55)" }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Box
          sx={{
            borderRadius: "24px",
            p: 1.25,
            color: "#fff",
            background:
              "radial-gradient(circle at 55% 58%, rgba(230, 74, 255, 0.35) 0%, rgba(230, 74, 255, 0) 24%), radial-gradient(circle at 75% 20%, rgba(55, 120, 255, 0.2) 0%, rgba(55, 120, 255, 0) 30%), linear-gradient(135deg, rgba(36, 23, 70, 0.96) 0%, rgba(16, 16, 41, 0.98) 100%)",
            border: "1px solid rgba(139, 111, 255, 0.24)",
          }}
        >
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, lineHeight: 1 }}>
            LEVEL UP
          </Typography>
          <Typography
            sx={{
              color: "#ff54c8",
              fontWeight: 700,
              letterSpacing: "0.08em",
              mt: 0.4,
            }}
          >
            YOUR BRAIN
          </Typography>

          <Box
            sx={{
              mt: 0.8,
              borderRadius: "22px",
              minHeight: 74,
              background:
                "radial-gradient(circle at 50% 70%, rgba(255, 72, 199, 0.28) 0%, rgba(255, 72, 199, 0) 28%), url('/pics/MindMate logo with colorful brain design.png') center / contain no-repeat",
            }}
          />

          <Typography sx={{ mt: 0.55, color: "rgba(255,255,255,0.82)", fontSize: "0.8rem" }}>
            Short games.
          </Typography>
          <Typography sx={{ color: "#ff61c6", fontWeight: 700, fontSize: "0.8rem" }}>
            Big impact.
          </Typography>
          <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: "0.8rem" }}>
            Real results.
          </Typography>
        </Box>

      </Box>
    </Box>
  );

  return (
    <Box sx={shellStyles}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.45,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 90%)",
        }}
      />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "transparent",
          boxShadow: "none",
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Toolbar
          sx={{
            minHeight: "72px !important",
            px: { xs: 1.25, md: 2.2 },
            py: 0.8,
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              edge="start"
              sx={{
                display: { md: "none" },
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(16, 14, 32, 0.68)",
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            <img
              src="/pics/MindMate logo with colorful brain design.png"
              className={styles.logo}
              onClick={() => {
                setGame(null);
                setMobileOpen(false);
              }}
              alt="MindMate Logo"
            />
          </Box>

          <Box
            sx={{
              ...glassPanel,
              borderRadius: "22px",
              px: 1.2,
              py: 0.75,
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              color: "#fff",
            }}
          >
            <TextField
              variant="standard"
              type="number"
              value={limit}
              onChange={handleOnChange}
              inputProps={{
                min: 1,
                max: 100,
                step: 1,
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <TuneRoundedIcon sx={{ fontSize: 18, color: "#f4a2ff" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 112,
                "& .MuiInputBase-root": {
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                },
                "& input": {
                  padding: 0,
                  textAlign: "right",
                },
              }}
            />
            <Typography sx={{ color: "rgba(255,255,255,0.68)", fontWeight: 500 }}>
              Limit
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flexGrow: 1, pt: "72px", height: "100vh" }}>
        <Box
          sx={{
            width: { md: drawerWidth },
            flexShrink: 0,
            display: { xs: "none", md: "block" },
            height: "calc(100vh - 72px)",
          }}
        >
          {drawerContent}
        </Box>

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
              background: "rgba(5,5,14,0.45)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            },
          }}
        >
          <Toolbar sx={{ minHeight: "72px !important" }} />
          {drawerContent}
        </Drawer>

        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
            p: { xs: 0.85, sm: 1, md: 1 },
            display: "flex",
            height: "calc(100vh - 72px)",
          }}
        >
          <Box
            sx={{
              ...glassPanel,
              height: "100%",
              width: "100%",
              borderRadius: { xs: "28px", md: "32px" },
              p: { xs: 0.85, md: 1 },
              overflow: "hidden",
              position: "relative",
              display: "flex",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(circle at 18% 70%, rgba(255, 61, 186, 0.14) 0%, rgba(255, 61, 186, 0) 30%), radial-gradient(circle at 88% 64%, rgba(63, 129, 255, 0.15) 0%, rgba(63, 129, 255, 0) 28%)",
              }}
            />

            {running ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  overflow: "hidden",
                }}
              >
                {running}
              </Box>
            ) : (
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  minHeight: "calc(100vh - 180px)",
                  display: "grid",
                  placeItems: "center",
                  px: 2,
                }}
              >
                <Box sx={{ maxWidth: 860, textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "22px",
                      mx: "auto",
                      mb: 2,
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      background:
                        "linear-gradient(180deg, rgba(161, 83, 255, 0.9) 0%, rgba(104, 71, 255, 0.95) 100%)",
                      boxShadow: "0 16px 34px rgba(166, 79, 255, 0.3)",
                    }}
                  >
                    <SpaceDashboardRoundedIcon />
                  </Box>

                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "2rem", md: "3.25rem" },
                      fontWeight: 800,
                      letterSpacing: "-0.05em",
                      lineHeight: 0.96,
                    }}
                  >
                    Train faster with a sharper brain-gym UI
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1.5,
                      color: "rgba(222, 214, 255, 0.78)",
                      fontSize: { xs: "1rem", md: "1.15rem" },
                    }}
                  >
                    Pick a test from the left and jump into a neon dashboard designed
                    around speed, focus, and feedback.
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "center",
                      gap: 1.4,
                      flexWrap: "wrap",
                    }}
                  >
                    {menuItems.map((item) => (
                      <Box
                        key={item.id}
                        onClick={() => setGame(item.id)}
                        sx={{
                          minWidth: 220,
                          p: 2,
                          borderRadius: "20px",
                          cursor: "pointer",
                          color: "#fff",
                          background:
                            item.id === activeGame?.id
                              ? "linear-gradient(90deg, rgba(97, 65, 255, 0.78) 0%, rgba(255, 77, 196, 0.75) 100%)"
                              : "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow:
                            item.id === activeGame?.id
                              ? "0 16px 28px rgba(255, 66, 193, 0.2)"
                              : "none",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                          {item.icon}
                          <Typography sx={{ fontWeight: 700 }}>{item.text}</Typography>
                        </Box>
                        <Typography
                          sx={{ mt: 0.6, color: "rgba(240,235,255,0.72)", fontSize: "0.9rem" }}
                        >
                          {item.subtitle}
                        </Typography>
                      </Box>
                    ))}
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
