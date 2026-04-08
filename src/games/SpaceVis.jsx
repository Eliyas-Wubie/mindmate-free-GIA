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
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const metricCardStyles = {
  borderRadius: "18px",
  px: { xs: 1, md: 1.35 },
  py: { xs: 0.7, md: 0.8 },
  minWidth: { md: 170 },
  background:
    "linear-gradient(180deg, rgba(22, 19, 43, 0.92) 0%, rgba(16, 14, 35, 0.9) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
};

const boardGlow = {
  borderRadius: { xs: "24px", md: "30px" },
  background:
    "linear-gradient(135deg, rgba(255, 78, 193, 0.92) 0%, rgba(104, 84, 255, 0.88) 48%, rgba(63, 145, 255, 0.92) 100%)",
  p: "1px",
  boxShadow:
    "0 0 0 1px rgba(255,255,255,0.05), 0 20px 48px rgba(0,0,0,0.3), 0 0 24px rgba(83, 123, 255, 0.22)",
  flex: 1,
  minHeight: 0,
};

const panelBase = {
  background:
    "linear-gradient(180deg, rgba(15, 13, 33, 0.95) 0%, rgba(10, 12, 30, 0.95) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
};

export default function SpaceVis({ limit }) {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [unmatchedCounter, setUnmatchedCounter] = useState(0);
  const [imagePairs, setImagePairs] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [numberOfTrials, setNumberOfTrials] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [numberOfCorrects, setNumberOfCorrects] = useState(0);
  const [gotIt, setGotIt] = useState(null);
  const [lastSpeed, setLastSpeed] = useState(null);
  const [openRulePopup, setOpenRulePopup] = useState(false);

  const images = ["/pics/R.png"];

  function transformImage(image) {
    const degrees = [0, 90, 180, 270];
    const randomDegree = degrees[Math.floor(Math.random() * degrees.length)];
    const flipOptions = [true, false];
    const randomFlip = flipOptions[Math.floor(Math.random() * flipOptions.length)];

    return {
      flipped: randomFlip,
      image: (
        <Box
          sx={{
            width: "clamp(74px, 8vw, 112px)",
            aspectRatio: "1 / 1",
            borderRadius: "16px",
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(246,241,255,0.98) 100%)",
            boxShadow: "0 0 16px rgba(255, 96, 210, 0.22), 0 12px 22px rgba(0,0,0,0.18)",
            "@media (min-width:600px) and (max-width:899px)": {
              width: "132px",
            },
          }}
        >
          <img
            src={image}
            alt="Rotated example"
            style={{
              transform: `rotate(${randomDegree}deg) ${randomFlip ? "scaleX(-1)" : ""}`,
              width: "68%",
              height: "68%",
              objectFit: "contain",
            }}
          />
        </Box>
      ),
    };
  }

  function submitAnswer(answer) {
    const prevUnmatched = unmatchedCounter;
    const realAnswer = 2 - prevUnmatched;
    const isCorrect = answer === realAnswer;
    const newTime = Date.now() - timeTaken;
    const nextTrials = numberOfTrials + 1;
    const nextCorrects = isCorrect ? numberOfCorrects + 1 : numberOfCorrects;

    setLastSpeed(newTime);
    setAverageSpeed((prev) =>
      numberOfTrials > 0 ? (prev * numberOfTrials + newTime) / nextTrials : newTime
    );
    setNumberOfCorrects(nextCorrects);
    setNumberOfTrials(nextTrials);
    setAccuracy(nextTrials > 0 ? (nextCorrects / nextTrials) * 100 : 0);
    setGotIt(isCorrect ? "yes" : "no");
    setUnmatchedCounter(0);

    if (nextTrials < limit) {
      setTimeout(() => {
        handleStartPlaying();
      }, 220);
    }
  }

  function handleStartPlaying() {
    setTimeTaken(Date.now());

    const randomIndices = [];
    while (randomIndices.length < 2) {
      if (images.length > 1) {
        const randomIndex = Math.floor(Math.random() * images.length);
        if (!randomIndices.includes(randomIndex)) randomIndices.push(randomIndex);
      } else {
        randomIndices.push(0);
      }
    }

    setSelectedIndices(randomIndices);

    const tempImagePairs = [];
    let unmatched = 0;

    for (const index of randomIndices) {
      const transformationResult1 = transformImage(images[index]);
      const transformationResult2 = transformImage(images[index]);

      const flipped1 = transformationResult1.flipped;
      const flipped2 = transformationResult2.flipped;

      if ((flipped1 || flipped2) && flipped1 !== flipped2) {
        unmatched += 1;
      }

      tempImagePairs.push([transformationResult1.image, transformationResult2.image]);
    }

    setSelectedIndices(randomIndices);
    setUnmatchedCounter(unmatched);
    setImagePairs(tempImagePairs);
  }

  useEffect(() => {
    handleStartPlaying();
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
        <DialogTitle>Spatial Visualization Rules</DialogTitle>
        <DialogContent>
          <Typography paragraph sx={{ color: "rgba(238,232,255,0.82)" }}>
            Count how many shapes are different from the target after rotation and
            mirror checks.
          </Typography>
          <Typography sx={{ color: "rgba(238,232,255,0.82)" }}>
            This mode measures mental rotation and fast spatial judgment.
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
          gap: 1,
          mb: 0.75,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "16px",
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(180deg, rgba(181, 91, 255, 0.95) 0%, rgba(120, 82, 255, 0.92) 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.08), 0 16px 24px rgba(164, 89, 255, 0.24)",
            }}
          >
            <Inventory2RoundedIcon sx={{ fontSize: 20 }} />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: "1.05rem", md: "1.35rem" },
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
              }}
            >
              Spatial Visualization
            </Typography>
            <Typography sx={{ color: "rgba(228, 220, 255, 0.75)", mt: 0.15, fontSize: "0.82rem" }}>
              Spot the Match. Think in 3D. Beat the Clock.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "stretch", gap: 0.7, flexWrap: "wrap" }}>
          <Box sx={metricCardStyles}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, color: "#c16aff" }}>
              <SpeedRoundedIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ color: "rgba(222,214,255,0.68)", fontSize: "0.68rem" }}>
                AVG SPEED
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.2, fontSize: "0.95rem", fontWeight: 700 }}>
              {roundAverageSpeed} sec
            </Typography>
          </Box>

          <Box sx={metricCardStyles}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, color: "#ff4fb7" }}>
              <TrackChangesRoundedIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ color: "rgba(222,214,255,0.68)", fontSize: "0.68rem" }}>
                ACCURACY
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.2, fontSize: "0.95rem", fontWeight: 700 }}>
              {roundAccuracy}%
            </Typography>
          </Box>

          <Button
            onClick={() => setOpenRulePopup(true)}
            sx={{ minWidth: 42, borderRadius: "18px", color: "#fff", ...panelBase }}
          >
            <HelpOutlineRoundedIcon sx={{ fontSize: 20 }} />
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          ...panelBase,
          borderRadius: "26px",
          p: { xs: 0.65, md: 0.85 },
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ textAlign: "center", py: 0.2, flexShrink: 0 }}>
          <Typography
            sx={{
              fontFamily: '"Bahnschrift", "Trebuchet MS", sans-serif',
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.92,
              color: "#fff",
              textShadow: "0 0 14px rgba(136, 96, 255, 0.3)",
            }}
          >
            {currentTimer}
            <Box component="span" sx={{ ml: 0.7, fontSize: { xs: "0.85rem", md: "1.1rem" }, color: "#ff4bb5" }}>
              SEC
            </Box>
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 0.4, md: 1 }, pb: 0.7, flexShrink: 0 }}>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 7,
              borderRadius: 999,
              backgroundColor: "rgba(18, 22, 48, 0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, rgba(255,75,181,1) 0%, rgba(185,91,255,1) 52%, rgba(85,214,255,1) 100%)",
              },
            }}
          />
          <Typography
            sx={{
              textAlign: "center",
              color: "rgba(224,218,255,0.72)",
              fontSize: "0.66rem",
              mt: 0.3,
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
              borderRadius: { xs: "23px", md: "29px" },
              background:
                "radial-gradient(circle at 15% 55%, rgba(255, 63, 180, 0.12) 0%, rgba(255, 63, 180, 0) 26%), radial-gradient(circle at 85% 75%, rgba(69, 142, 255, 0.15) 0%, rgba(69, 142, 255, 0) 30%), linear-gradient(180deg, rgba(17, 16, 40, 0.98) 0%, rgba(9, 14, 33, 0.98) 100%)",
              px: { xs: 0.7, md: 1 },
              py: { xs: 0.7, md: 0.85 },
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
                opacity: 0.22,
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.4,
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  minWidth: 64,
                  color:
                    gotIt === "yes"
                      ? "#7effb0"
                      : gotIt === "no"
                        ? "#ff8ab8"
                        : "transparent",
                  fontWeight: 700,
                  fontSize: { xs: "0.68rem", md: "0.8rem" },
                }}
              >
                {gotIt === "yes" ? "Correct" : gotIt === "no" ? "Wrong" : "."}
              </Typography>
              <Box
                sx={{
                  px: 0.9,
                  py: 0.3,
                  borderRadius: "999px",
                  background: "rgba(18, 21, 45, 0.85)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(236,230,255,0.92)",
                  fontWeight: 700,
                  fontSize: "0.72rem",
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
                py: 0.2,
                gap:{xs: 0.9, sm: 0.9,}
              }}
            >
              {numberOfTrials < limit ? (
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(2, 112px)",
                        sm: "repeat(2, 142px)",
                        md: "repeat(2, 112px)",
                      },
                      justifyContent: "center",
                      columnGap: { xs: 0.4, sm: 0.9, md: 0.9 },
                      rowGap: { xs: 0.5, sm: 0.5, md: 0.9 },
                    }}
                  >
                    {imagePairs.flat().map((image, index) => (
                      <Box key={`${selectedIndices.join("-")}-${index}`} sx={{ display: "grid", placeItems: "center", height:{ sm: 142, } }}>
                        {image }
                      </Box>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      mt: {
                        xs: "auto",
                        sm: "auto",
                        md: 0,
                      },
                      pt: {
                        xs: 1.25,
                        sm: 1.5,
                        md: 0,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        mt: { xs: 0.45, sm: 0.5, md: 0.75 },
                        textAlign: "center",
                        color: "rgba(237, 232, 255, 0.9)",
                        fontSize: { xs: "0.74rem", sm: "0.88rem", md: "0.84rem" },
                      }}
                    >
                      How many are different from the target?
                    </Typography>

                    <Box
                      sx={{
                        mt: { xs: 0.35, sm: 0.4, md: 0.55 },
                        display: "flex",
                        justifyContent: "center",
                        gap: { xs: 0.45, sm: 0.8, md: 0.7 },
                        flexWrap: "wrap",
                      }}
                    >
                      {[0, 1, 2].map((num) => {
                        const isPrimary = num === 1;
                        const isSecondary = num === 2;

                        return (
                          <Button
                            key={num}
                            onClick={() => submitAnswer(num)}
                            sx={{
                              minWidth: { xs: 74, sm: 96, md: 74 },
                              height: { xs: 32, sm: 38, md: 32 },
                              borderRadius: "999px",
                              fontSize: { xs: "0.8rem", sm: "0.92rem", md: "0.8rem" },
                              fontWeight: 800,
                              color: "#fff",
                              background: isPrimary
                                ? "linear-gradient(90deg, rgba(255,75,181,0.95) 0%, rgba(162,82,255,0.95) 100%)"
                                : isSecondary
                                  ? "linear-gradient(90deg, rgba(36,53,120,0.95) 0%, rgba(44,122,255,0.88) 100%)"
                                  : "linear-gradient(180deg, rgba(53, 42, 85, 0.95) 0%, rgba(36, 31, 60, 0.95) 100%)",
                              border: isPrimary
                                ? "1px solid rgba(255, 137, 226, 0.7)"
                                : isSecondary
                                  ? "1px solid rgba(93, 174, 255, 0.68)"
                                  : "1px solid rgba(143, 119, 214, 0.36)",
                              "&:hover": {
                                filter: "brightness(1.06)",
                              },
                            }}
                          >
                            {num}
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", px: 2, position: "relative", zIndex: 1 }}>
                  <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.6rem" }, fontWeight: 800 }}>
                    Test completed
                  </Typography>
                  <Typography sx={{ mt: 0.7, color: "rgba(229, 221, 255, 0.8)", fontSize: "0.85rem" }}>
                    Accuracy: {roundAccuracy}% | Average Speed: {roundAverageSpeed} sec
                  </Typography>
                  <Typography sx={{ mt: 0.8, color: gotIt === "yes" ? "#7effb0" : "#ff8ab8", fontSize: "0.82rem" }}>
                    Last answer: {gotIt === "yes" ? "Correct" : "Incorrect"}
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
            fontSize: "0.56rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          Train Smart / Get Faster / Stay Sharp
        </Box>
      </Box>
    </Box>
  );
}
