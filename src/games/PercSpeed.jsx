import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const metricCardStyles = {
  borderRadius: "20px",
  px: { xs: 0.8, sm: 1, md: 2.2 },
  py: { xs: 0.65, sm: 0.8, md: 1.4 },
  minWidth: { sm: 124, md: 190 },
  background:
    "linear-gradient(180deg, rgba(22, 19, 43, 0.92) 0%, rgba(16, 14, 35, 0.9) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
};

const panelBase = {
  background:
    "linear-gradient(180deg, rgba(15, 13, 33, 0.95) 0%, rgba(10, 12, 30, 0.95) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
};

const boardGlow = {
  borderRadius: { xs: "28px", md: "34px" },
  background:
    "linear-gradient(135deg, rgba(255, 78, 193, 0.92) 0%, rgba(104, 84, 255, 0.88) 48%, rgba(63, 145, 255, 0.92) 100%)",
  p: "1px",
  boxShadow:
    "0 0 0 1px rgba(255,255,255,0.05), 0 22px 54px rgba(0,0,0,0.34), 0 0 28px rgba(83, 123, 255, 0.24)",
};

export default function PercSpeed({ limit }) {
  const [letterPairs, setLetterPairs] = useState([]);
  const [nonVaryCounter, setNonVaryCounter] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [gotIt, setGotIt] = useState(null);
  const [lastSpeed, setLastSpeed] = useState(null);
  const [numberOfTrials, setNumberOfTrials] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [numberOfCorrects, setNumberOfCorrects] = useState(0);
  const [openRulePopup, setOpenRulePopup] = useState(false);

  const capLetters = useMemo(
    () => Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    []
  );

  const smallLetters = useMemo(
    () => Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)),
    []
  );

  function generateLetters() {
    const shuffled = [...smallLetters].sort(() => Math.random() - 0.5).slice(0, 4);
    const newPairs = [];
    let newNonVaryCount = 0;

    shuffled.forEach((item) => {
      const isMatch = Math.random() > 0.5;

      if (isMatch) {
        newPairs.push([item, item.toUpperCase()]);
        newNonVaryCount += 1;
        return;
      }

      let randomCap = item.toUpperCase();
      while (randomCap === item.toUpperCase()) {
        randomCap = capLetters[Math.floor(Math.random() * capLetters.length)];
      }
      newPairs.push([item, randomCap]);
    });

    setLetterPairs(newPairs);
    setNonVaryCounter(newNonVaryCount);
    setTimeTaken(Date.now());
  }

  function submitAnswer(answer) {
    const newValue = Date.now() - timeTaken;
    const nextTrials = numberOfTrials + 1;
    const isCorrect = answer === nonVaryCounter;
    const nextCorrects = isCorrect ? numberOfCorrects + 1 : numberOfCorrects;

    setLastSpeed(newValue);
    setAverageSpeed((prev) =>
      numberOfTrials >= 1 ? (prev * numberOfTrials + newValue) / nextTrials : newValue
    );
    setNumberOfCorrects(nextCorrects);
    setNumberOfTrials(nextTrials);
    setAccuracy(nextTrials >= 1 ? (nextCorrects / nextTrials) * 100 : 0);
    setGotIt(isCorrect ? "yes" : "no");

    if (nextTrials < limit) {
      setTimeout(() => {
        generateLetters();
      }, 250);
    }
  }

  useEffect(() => {
    generateLetters();
  }, []);

  const roundAverageSpeed = (averageSpeed / 1000).toFixed(3);
  const roundAccuracy = accuracy.toFixed(3);
  const currentTimer = lastSpeed !== null ? (lastSpeed / 1000).toFixed(2) : "0.00";
  const progressValue = limit > 0 ? (numberOfTrials / limit) * 100 : 0;
  const currentTrial = Math.min(numberOfTrials + 1, limit);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Dialog
        open={openRulePopup}
        onClose={() => setOpenRulePopup(false)}
        PaperProps={{
          sx: {
            borderRadius: "24px",
            background: "linear-gradient(180deg, #15102c 0%, #0f1128 100%)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      >
        <DialogTitle>Perceptual Speed Rules</DialogTitle>
        <DialogContent>
          <Typography paragraph sx={{ color: "rgba(238,232,255,0.82)" }}>
            Count how many of the four letter pairs are actually the same letter in
            upper and lower case. Pairs with different letters do not count.
          </Typography>
          <Typography sx={{ color: "rgba(238,232,255,0.82)" }}>
            This mode focuses on fast visual scanning, pattern recognition, and
            clean decision-making under time pressure.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRulePopup(false)} sx={{ color: "#ff6ecf" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 0.75, sm: 1, md: 1.5 },
          mb: { xs: 0.7, sm: 0.9, md: 1.2 },
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1, md: 1.8 } }}>
          <Box
            sx={{
              width: { xs: 44, sm: 50, md: 62 },
              height: { xs: 44, sm: 50, md: 62 },
              borderRadius: { xs: "16px", sm: "18px", md: "20px" },
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(180deg, rgba(255, 95, 192, 0.95) 0%, rgba(126, 84, 255, 0.92) 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.08), 0 18px 28px rgba(164, 89, 255, 0.28)",
            }}
          >
            <BoltRoundedIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: "0.98rem", sm: "1.08rem", md: "1.7rem" },
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
              }}
            >
              Perceptual Speed
            </Typography>
            <Typography
              sx={{
                color: "rgba(228, 220, 255, 0.75)",
                mt: 0.18,
                fontSize: { xs: "0.7rem", sm: "0.76rem", md: "1rem" },
                maxWidth: { xs: 170, sm: "none" },
                lineHeight: 1.2,
              }}
            >
              Scan the pairs. Count the matches. Answer instantly.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            gap: { xs: 0.45, sm: 0.7, md: 1.2 },
            flexWrap: "wrap",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Box sx={metricCardStyles}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#c16aff" }}>
              <SpeedRoundedIcon sx={{ fontSize: { xs: 14, sm: 15, md: 20 } }} />
              <Typography
                sx={{ color: "rgba(222,214,255,0.68)", fontSize: { xs: "0.58rem", sm: "0.62rem", md: "0.8rem" } }}
              >
                AVG SPEED
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.2, fontSize: { xs: "0.74rem", sm: "0.8rem", md: "1.15rem" }, fontWeight: 700 }}>
              {roundAverageSpeed} sec
            </Typography>
          </Box>

          <Box sx={metricCardStyles}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#ff4fb7" }}>
              <TrackChangesRoundedIcon sx={{ fontSize: { xs: 14, sm: 15, md: 20 } }} />
              <Typography
                sx={{ color: "rgba(222,214,255,0.68)", fontSize: { xs: "0.58rem", sm: "0.62rem", md: "0.8rem" } }}
              >
                ACCURACY
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.2, fontSize: { xs: "0.74rem", sm: "0.8rem", md: "1.15rem" }, fontWeight: 700 }}>
              {roundAccuracy}%
            </Typography>
          </Box>

          <Button
            onClick={() => setOpenRulePopup(true)}
            sx={{
              minWidth: { xs: 38, sm: 42, md: 54 },
              borderRadius: { xs: "15px", sm: "16px", md: "20px" },
              color: "#fff",
              ...panelBase,
              ml: { xs: "auto", sm: 0 },
            }}
          >
            <HelpOutlineRoundedIcon sx={{ fontSize: { xs: 18, sm: 19, md: 24 } }} />
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          ...panelBase,
          borderRadius: "28px",
          p: { xs: 0.65, sm: 0.8, md: 1.3 },
          overflow: "hidden",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ textAlign: "center", py: { xs: 0.2, sm: 0.3, md: 1 } }}>
          <Typography
            sx={{
              fontFamily: '"Bahnschrift", "Trebuchet MS", sans-serif',
              fontSize: { xs: "1.65rem", sm: "1.9rem", md: "3.8rem" },
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.92,
              color: "#fff",
              textShadow: "0 0 16px rgba(136, 96, 255, 0.34)",
            }}
          >
            {currentTimer}
            <Box
              component="span"
              sx={{ ml: 0.45, fontSize: { xs: "0.65rem", sm: "0.75rem", md: "1.6rem" }, color: "#ff4bb5" }}
            >
              SEC
            </Box>
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 0.35, sm: 0.5, md: 2 }, pb: { xs: 0.55, sm: 0.7, md: 1.5 }, flexShrink: 0 }}>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: { xs: 6, sm: 7, md: 11 },
              borderRadius: 999,
              backgroundColor: "rgba(18, 22, 48, 0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, rgba(255,75,181,1) 0%, rgba(185,91,255,1) 52%, rgba(85,214,255,1) 100%)",
                boxShadow: "0 0 16px rgba(88, 194, 255, 0.45)",
              },
            }}
          />
          <Typography
            sx={{
              textAlign: "center",
              color: "rgba(224,218,255,0.72)",
              fontSize: { xs: "0.56rem", sm: "0.6rem", md: "0.82rem" },
              mt: 0.25,
            }}
          >
            {numberOfTrials} / {limit} Trials Completed
          </Typography>
        </Box>

        <Box sx={boardGlow}>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: { xs: "22px", sm: "24px", md: "33px" },
              background:
                "radial-gradient(circle at 15% 55%, rgba(255, 63, 180, 0.16) 0%, rgba(255, 63, 180, 0) 26%), radial-gradient(circle at 85% 75%, rgba(69, 142, 255, 0.18) 0%, rgba(69, 142, 255, 0) 30%), linear-gradient(180deg, rgba(17, 16, 40, 0.98) 0%, rgba(9, 14, 33, 0.98) 100%)",
              px: { xs: 0.38, sm: 0.6, md: 1.8 },
              py: { xs: 0.38, sm: 0.6, md: 1.4 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.28,
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: { xs: "28px 28px", sm: "32px 32px", md: "42px 42px" },
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 0.4, sm: 0.5, md: 1.2 },
                flexShrink: 0,
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  color: gotIt === "yes" ? "#7effb0" : gotIt === "no" ? "#ff8ab8" : "transparent",
                  fontWeight: 700,
                  fontSize: { xs: "0.62rem", sm: "0.68rem", md: "1rem" },
                }}
              >
                {gotIt === "yes" ? "Correct" : gotIt === "no" ? "Wrong" : "."}
              </Typography>
              <Box
                sx={{
                  px: { xs: 0.6, sm: 0.8, md: 1.6 },
                  py: { xs: 0.2, sm: 0.24, md: 0.6 },
                  borderRadius: "999px",
                  background: "rgba(18, 21, 45, 0.85)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(236,230,255,0.92)",
                  fontWeight: 700,
                  fontSize: { xs: "0.62rem", sm: "0.68rem", md: "0.95rem" },
                }}
              >
                TRIAL {currentTrial}/{limit}
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                minHeight: 0,
                flex: 1,
                display: "grid",
                placeItems: "center",
                py: { xs: 0.35, sm: 0.45, md: 1.4 },
              }}
            >
              {numberOfTrials < limit ? (
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        sm: "repeat(4, minmax(62px, 1fr))",
                        md: "repeat(4, minmax(120px, 150px))",
                      },
                      justifyContent: "center",
                      gap: { xs: 0.55, sm: 0.6, md: 1.4 },
                      color: "black",
                      position: "relative",
                    }}
                  >
                    {letterPairs.map((letterPair, index) => (
                      <Box
                        key={index}
                        sx={{
                          minHeight: 96,
                          borderRadius: "20px",
                          display: "grid",
                          placeItems: "center",
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(246,241,255,0.98) 100%)",
                          boxShadow: {
                            xs: "0 0 10px rgba(255, 96, 210, 0.12), 0 8px 16px rgba(0,0,0,0.16)",
                            md: "0 0 18px rgba(255, 96, 210, 0.18), 0 14px 26px rgba(0,0,0,0.22)",
                          },
                          "@media (max-width:900px)": {
                            minHeight: 62,
                            borderRadius: "14px",
                            background:
                              "linear-gradient(180deg, rgba(29, 19, 56, 0.96) 0%, rgba(18, 16, 45, 0.98) 100%)",
                          },
                          "@media (max-width:600px)": {
                            minHeight: 50,
                            borderRadius: "12px",
                            background:
                              "linear-gradient(180deg, rgba(29, 19, 56, 0.96) 0%, rgba(18, 16, 45, 0.98) 100%)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: "60%",
                            aspectRatio: "1 / 1",
                            borderRadius: "14px",
                            border: "3px solid rgba(255, 91, 99, 0.95)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff",
                            "@media (max-width:900px)": {
                              width: "66%",
                              borderRadius: "11px",
                              border: "2px solid rgba(255, 91, 99, 0.95)",
                            },
                            "@media (max-width:600px)": {
                              width: "62%",
                              borderRadius: "10px",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1.8rem",
                              lineHeight: 1,
                              "@media (max-width:900px)": {
                                fontSize: "1rem",
                              },
                              "@media (max-width:600px)": {
                                fontSize: "0.92rem",
                              },
                            }}
                          >
                            {letterPair[0]}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1.8rem",
                              lineHeight: 1,
                              "@media (max-width:900px)": {
                                fontSize: "1rem",
                              },
                              "@media (max-width:600px)": {
                                fontSize: "0.92rem",
                              },
                            }}
                          >
                            {letterPair[1]}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Typography
                    sx={{
                      mt: { xs: 0.55, sm: 0.65, md: 2 },
                      textAlign: "center",
                      color: "rgba(237, 232, 255, 0.9)",
                      fontSize: { xs: "0.62rem", sm: "0.66rem", md: "1rem" },
                      letterSpacing: { xs: "0.01em", md: "normal" },
                    }}
                  >
                    How many matching pairs are on the board?
                  </Typography>

                  <Box
                    sx={{
                      mt: { xs: 0.45, sm: 0.5, md: 1.2 },
                      display: "flex",
                      justifyContent: "center",
                      gap: { xs: 0.3, sm: 0.35, md: 1.1 },
                      flexWrap: "wrap",
                      px: { xs: 0.35, sm: 0, md: 0 },
                    }}
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <Button
                        key={num}
                        onClick={() => submitAnswer(num)}
                        sx={{
                          minWidth: { xs: 42, sm: 44, md: 72 },
                          height: { xs: 24, sm: 24, md: 42 },
                          borderRadius: "999px",
                          fontSize: { xs: "0.62rem", sm: "0.62rem", md: "0.95rem" },
                          fontWeight: 800,
                          color: "#fff",
                          background:
                            num === nonVaryCounter
                              ? "linear-gradient(90deg, rgba(255,75,181,0.95) 0%, rgba(162,82,255,0.95) 100%)"
                              : "linear-gradient(90deg, rgba(36,53,120,0.95) 0%, rgba(44,122,255,0.88) 100%)",
                          border: "1px solid rgba(93, 174, 255, 0.55)",
                          boxShadow: {
                            xs: "inset 0 1px 0 rgba(255,255,255,0.12)",
                            md: "none",
                          },
                          "&:hover": {
                            filter: "brightness(1.06)",
                          },
                        }}
                      >
                        {num}
                      </Button>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", px: 2, position: "relative", zIndex: 1 }}>
                  <Typography sx={{ fontSize: { xs: "1.4rem", md: "2rem" }, fontWeight: 800 }}>
                    Test completed
                  </Typography>
                  <Typography sx={{ mt: 1, color: "rgba(229, 221, 255, 0.8)" }}>
                    Accuracy: {roundAccuracy}% | Average Speed: {roundAverageSpeed} sec
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            pt: 0.45,
            textAlign: "center",
            color: "rgba(168, 158, 210, 0.7)",
            fontSize: { xs: "0.46rem", sm: "0.48rem", md: "0.72rem" },
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Scan Fast / Read Clean / Stay Sharp
        </Box>
      </Box>
    </Box>
  );
}
