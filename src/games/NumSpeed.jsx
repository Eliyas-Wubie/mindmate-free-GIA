import { useEffect, useState } from "react";
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
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const metricCardStyles = {
  borderRadius: "2px",
  px: { xs: 1.6, md: 2.2 },
  py: { xs: 1.2, md: 1.4 },
  minWidth: { md: 190 },
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

export default function NumSpeed({ limit }) {
  const [numbers, setNumbers] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [gotIt, setGotIt] = useState(null);
  const [lastSpeed, setLastSpeed] = useState(null);
  const [numberOfTrials, setNumberOfTrials] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [numberOfCorrects, setNumberOfCorrects] = useState(0);
  const [openRule, setOpenRule] = useState(false);

  function generateNumbers() {
    let num1 = Math.floor(Math.random() * 25) + 1;
    let num2 = Math.floor(Math.random() * 25) + 1;
    let num3 = Math.floor(Math.random() * 25) + 1;

    let min = Math.min(num1, num2, num3);
    let max = Math.max(num1, num2, num3);
    let median = num1 + num2 + num3 - min - max;
    let dif1 = Math.abs(median - min);
    let dif2 = Math.abs(median - max);

    while (dif1 === dif2 || num1 === num2 || num1 === num3 || num2 === num3) {
      num1 = Math.floor(Math.random() * 25) + 1;
      num2 = Math.floor(Math.random() * 25) + 1;
      num3 = Math.floor(Math.random() * 25) + 1;

      min = Math.min(num1, num2, num3);
      max = Math.max(num1, num2, num3);
      median = num1 + num2 + num3 - min - max;
      dif1 = Math.abs(median - min);
      dif2 = Math.abs(median - max);
    }

    setNumbers([num1, num2, num3]);
    setAnswer(dif1 > dif2 ? min : max);
    setTimeTaken(Date.now());
  }

  function submitAnswer(ans) {
    const newTime = Date.now() - timeTaken;
    const isCorrect = ans === answer;
    const nextTrials = numberOfTrials + 1;
    const nextCorrects = isCorrect ? numberOfCorrects + 1 : numberOfCorrects;

    setLastSpeed(newTime);
    setAverageSpeed((prev) =>
      numberOfTrials > 0
        ? (prev * numberOfTrials + newTime) / nextTrials
        : newTime,
    );
    setNumberOfCorrects(nextCorrects);
    setNumberOfTrials(nextTrials);
    setAccuracy(nextTrials > 0 ? (nextCorrects / nextTrials) * 100 : 0);
    setGotIt(isCorrect ? "yes" : "no");

    if (nextTrials < limit) {
      setTimeout(() => {
        generateNumbers();
      }, 250);
    }
  }

  useEffect(() => {
    generateNumbers();
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
        open={openRule}
        onClose={() => setOpenRule(false)}
        PaperProps={{
          sx: {
            borderRadius: "2px",
            background: "#1c1c1a",
            color: "#fff",
            border: "1px solid rgba(242,240,235,0.08)",
          },
        }}
      >
        <DialogTitle>Number Speed Rules</DialogTitle>
        <DialogContent>
          <Typography paragraph sx={{ color: "rgba(242,240,235,0.82)" }}>
            You will see three different numbers. Two are closer together and
            one is the true outlier. Tap the number that stands out the most.
          </Typography>
          <Typography sx={{ color: "rgba(242,240,235,0.82)" }}>
            This mode measures fast comparison, numerical intuition, and clean
            accuracy under a time limit.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRule(false)} sx={{ color: "#f2f0eb" }}>
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
          gap: 1.5,
          mb: 1.2,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.8 }}>
          <Box
            sx={{
              width: 62,
              height: 62,
              borderRadius: "2px",
              display: "grid",
              placeItems: "center",
              background: "#1c1c1a",
              boxShadow: "none",
            }}
          >
            <TagRoundedIcon />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: "1.35rem", md: "1.7rem" },
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
              }}
            >
              Number Speed & Accuracy
            </Typography>
            <Typography sx={{ color: "rgba(242,240,235,0.75)", mt: 0.35 }}>
              Spot the outlier. Trust the pattern. Move quickly.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            gap: 1.2,
            flexWrap: "wrap",
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
              <SpeedRoundedIcon sx={{ fontSize: 20 }} />
              <Typography
                sx={{ color: "rgba(242,240,235,0.68)", fontSize: "0.8rem" }}
              >
                AVG SPEED
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.45, fontSize: "1.15rem", fontWeight: 700 }}>
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
              <TrackChangesRoundedIcon sx={{ fontSize: 20 }} />
              <Typography
                sx={{ color: "rgba(242,240,235,0.68)", fontSize: "0.8rem" }}
              >
                ACCURACY
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.45, fontSize: "1.15rem", fontWeight: 700 }}>
              {roundAccuracy}%
            </Typography>
          </Box>

          <Button
            onClick={() => setOpenRule(true)}
            sx={{
              minWidth: 54,
              borderRadius: "2px",
              color: "#fff",
              ...panelBase,
            }}
          >
            <HelpOutlineRoundedIcon />
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          ...panelBase,
          borderRadius: "2px",
          p: { xs: 1, md: 1.3 },
          overflow: "visible",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ textAlign: "center", py: { xs: 0.7, md: 1 } }}>
          <Typography
            sx={{
              fontFamily: '"DM Sans", Arial, sans-serif',
              fontSize: { xs: "2.6rem", md: "3.8rem" },
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
                ml: 1,
                fontSize: { xs: "1.1rem", md: "1.6rem" },
                color: "#f2f0eb",
              }}
            >
              SEC
            </Box>
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 0.8, md: 2 }, pb: 1.5, flexShrink: 0 }}>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 11,
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
              fontSize: "0.82rem",
              mt: 0.6,
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
              borderRadius: { xs: "27px", md: "33px" },
              background: "#1c1c1a",
              px: { xs: 1, md: 1.8 },
              py: { xs: 1, md: 1.4 },
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
                backgroundSize: "42px 42px",
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 0.8, md: 1.2 },
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
                }}
              >
                {gotIt === "yes" ? "Correct" : gotIt === "no" ? "Wrong" : "."}
              </Typography>
              <Box
                sx={{
                  px: 1.6,
                  py: 0.6,
                  borderRadius: "2px",
                  background: "rgba(28,28,26,0.85)",
                  border: "1px solid rgba(242,240,235,0.08)",
                  color: "rgba(242,240,235,0.92)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
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
                py: { xs: 1, md: 1.4 },
              }}
            >
              {numberOfTrials < limit ? (
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: { xs: 1, md: 1.3 },
                      flexWrap: "wrap",
                    }}
                  >
                    {numbers.map((num, index) => (
                      <Button
                        key={index}
                        onClick={() => submitAnswer(num)}
                        sx={{
                          minWidth: { xs: 88, md: 116 },
                          height: { xs: 58, md: 72 },
                          borderRadius: "2px",
                          fontSize: { xs: "1.45rem", md: "2rem" },
                          fontWeight: 800,
                          color: "#fff",
                          background: "#1c1c1a",
                          border: "1px solid rgba(242,240,235,0.12)",
                          boxShadow: "none",
                          backdropFilter: "blur(8px)",
                          "&:hover": {
                            background: "#1c1c1a",
                          },
                        }}
                      >
                        {num}
                      </Button>
                    ))}
                  </Box>

                  <Typography
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      color: "rgba(242,240,235,0.9)",
                      fontSize: { xs: "0.92rem", md: "1rem" },
                    }}
                  >
                    Tap the number that stands out the most
                  </Typography>
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
            pt: 1.2,
            textAlign: "center",
            color: "#92908d",
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Think Fast / Compare Clean / Stay Accurate
        </Box>
      </Box>
    </Box>
  );
}
