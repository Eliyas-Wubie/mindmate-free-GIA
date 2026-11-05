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
  borderRadius: "2px",
  px: { xs: 0.8, sm: 1, md: 2.2 },
  py: { xs: 0.65, sm: 0.8, md: 1.4 },
  minWidth: { sm: 124, md: 190 },
  background: "#1c1c1a",
  border: "1px solid rgba(242,240,235,0.08)",
  boxShadow: "none",
};

const panelBase = {
  background: "#1c1c1a",
  border: "1px solid rgba(242,240,235,0.06)",
  boxShadow: "none",
};

const boardGlow = {
  borderRadius: { xs: "28px", md: "34px" },
  background: "#1c1c1a",
  p: "1px",
  boxShadow: "none",
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
    [],
  );

  const smallLetters = useMemo(
    () => Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)),
    [],
  );

  function generateLetters() {
    const shuffled = [...smallLetters]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
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
      numberOfTrials >= 1
        ? (prev * numberOfTrials + newValue) / nextTrials
        : newValue,
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
  const currentTimer =
    lastSpeed !== null ? (lastSpeed / 1000).toFixed(2) : "0.00";
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
            borderRadius: "2px",
            background: "#1c1c1a",
            color: "#fff",
            border: "1px solid rgba(242,240,235,0.08)",
          },
        }}
      >
        <DialogTitle>Perceptual Speed Rules</DialogTitle>
        <DialogContent>
          <Typography paragraph sx={{ color: "rgba(242,240,235,0.82)" }}>
            Count how many of the four letter pairs are actually the same letter
            in upper and lower case. Pairs with different letters do not count.
          </Typography>
          <Typography sx={{ color: "rgba(242,240,235,0.82)" }}>
            This mode focuses on fast visual scanning, pattern recognition, and
            clean decision-making under time pressure.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenRulePopup(false)}
            sx={{ color: "#f2f0eb" }}
          >
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1, md: 1.8 },
          }}
        >
          <Box
            sx={{
              width: { xs: 44, sm: 50, md: 62 },
              height: { xs: 44, sm: 50, md: 62 },
              borderRadius: { xs: "16px", sm: "18px", md: "20px" },
              display: "grid",
              placeItems: "center",
              background: "#1c1c1a",
              boxShadow: "none",
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
                color: "rgba(242,240,235,0.75)",
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#f2f0eb",
              }}
            >
              <SpeedRoundedIcon sx={{ fontSize: { xs: 14, sm: 15, md: 20 } }} />
              <Typography
                sx={{
                  color: "rgba(242,240,235,0.68)",
                  fontSize: { xs: "0.58rem", sm: "0.62rem", md: "0.8rem" },
                }}
              >
                AVG SPEED
              </Typography>
            </Box>
            <Typography
              sx={{
                mt: 0.2,
                fontSize: { xs: "0.74rem", sm: "0.8rem", md: "1.15rem" },
                fontWeight: 700,
              }}
            >
              {roundAverageSpeed} sec
            </Typography>
          </Box>

          <Box sx={metricCardStyles}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#f2f0eb",
              }}
            >
              <TrackChangesRoundedIcon
                sx={{ fontSize: { xs: 14, sm: 15, md: 20 } }}
              />
              <Typography
                sx={{
                  color: "rgba(242,240,235,0.68)",
                  fontSize: { xs: "0.58rem", sm: "0.62rem", md: "0.8rem" },
                }}
              >
                ACCURACY
              </Typography>
            </Box>
            <Typography
              sx={{
                mt: 0.2,
                fontSize: { xs: "0.74rem", sm: "0.8rem", md: "1.15rem" },
                fontWeight: 700,
              }}
            >
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
            <HelpOutlineRoundedIcon
              titleAccess="Show exercise rules"
              sx={{ fontSize: { xs: 18, sm: 19, md: 24 } }}
            />
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          ...panelBase,
          borderRadius: "2px",
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
              fontFamily: '"DM Sans", Arial, sans-serif',
              fontSize: { xs: "1.65rem", sm: "1.9rem", md: "3.8rem" },
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.92,
              color: "#fff",
              textShadow: "none",
            }}
          >
            {currentTimer}
            <Box
              component="span"
              sx={{
                ml: 0.45,
                fontSize: { xs: "0.65rem", sm: "0.75rem", md: "1.6rem" },
                color: "#f2f0eb",
              }}
            >
              SEC
            </Box>
          </Typography>
        </Box>

        <Box
          sx={{
            px: { xs: 0.35, sm: 0.5, md: 2 },
            pb: { xs: 0.55, sm: 0.7, md: 1.5 },
            flexShrink: 0,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: { xs: 6, sm: 7, md: 11 },
              borderRadius: 999,
              backgroundColor: "rgba(28,28,26,0.8)",
              border: "1px solid rgba(242,240,235,0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: "#f2f0eb",
                boxShadow: "none",
              },
            }}
          />
          <Typography
            sx={{
              textAlign: "center",
              color: "rgba(242,240,235,0.72)",
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
              background: "#1c1c1a",
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
                backgroundImage: "#1c1c1a",
                backgroundSize: {
                  xs: "28px 28px",
                  sm: "32px 32px",
                  md: "42px 42px",
                },
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
                  color:
                    gotIt === "yes"
                      ? "#b9cbaa"
                      : gotIt === "no"
                        ? "#d5a794"
                        : "transparent",
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
                  borderRadius: "2px",
                  background: "rgba(28,28,26,0.85)",
                  border: "1px solid rgba(242,240,235,0.08)",
                  color: "rgba(242,240,235,0.92)",
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
                          borderRadius: "2px",
                          display: "grid",
                          placeItems: "center",
                          background:
                            "linear-gradient(180deg, rgba(242,240,235,1) 0%, rgba(242,240,235,0.98) 100%)",
                          boxShadow: {
                            xs: "0 0 10px rgba(242,240,235,0.12), 0 8px 16px rgba(28,28,26,0.16)",
                            md: "0 0 18px rgba(242,240,235,0.18), 0 14px 26px rgba(28,28,26,0.22)",
                          },
                          "@media (max-width:900px)": {
                            minHeight: 62,
                            borderRadius: "2px",
                            background: "#1c1c1a",
                          },
                          "@media (max-width:600px)": {
                            minHeight: 50,
                            borderRadius: "2px",
                            background: "#1c1c1a",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: "60%",
                            aspectRatio: "1 / 1",
                            borderRadius: "2px",
                            border: "3px solid rgba(242,240,235,0.95)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff",
                            "@media (max-width:900px)": {
                              width: "66%",
                              borderRadius: "2px",
                              border: "2px solid rgba(242,240,235,0.95)",
                            },
                            "@media (max-width:600px)": {
                              width: "62%",
                              borderRadius: "2px",
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
                      color: "rgba(242,240,235,0.9)",
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
                          borderRadius: "2px",
                          fontSize: {
                            xs: "0.62rem",
                            sm: "0.62rem",
                            md: "0.95rem",
                          },
                          fontWeight: 800,
                          color: "#fff",
                          background:
                            num === nonVaryCounter ? "#1c1c1a" : "#1c1c1a",
                          border: "1px solid rgba(28,28,26,0.55)",
                          boxShadow: {
                            xs: "inset 0 1px 0 rgba(242,240,235,0.12)",
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
                <Box
                  sx={{
                    textAlign: "center",
                    px: 2,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1.4rem", md: "2rem" },
                      fontWeight: 800,
                    }}
                  >
                    Test completed
                  </Typography>
                  <Typography sx={{ mt: 1, color: "rgba(242,240,235,0.8)" }}>
                    Accuracy: {roundAccuracy}% | Average Speed:{" "}
                    {roundAverageSpeed} sec
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
            color: "#92908d",
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
