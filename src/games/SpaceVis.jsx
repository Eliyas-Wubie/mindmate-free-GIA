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
  borderRadius: "2px",
  px: { xs: 1, md: 1.35 },
  py: { xs: 0.7, md: 0.8 },
  minWidth: { md: 170 },
  background: "#1c1c1a",
  border: "1px solid rgba(242,240,235,0.08)",
  boxShadow: "none",
};

const boardGlow = {
  borderRadius: { xs: "24px", md: "30px" },
  background: "#1c1c1a",
  p: "1px",
  boxShadow: "none",
  flex: 1,
  minHeight: 0,
};

const panelBase = {
  background: "#1c1c1a",
  border: "1px solid rgba(242,240,235,0.06)",
  boxShadow: "none",
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
    const randomFlip =
      flipOptions[Math.floor(Math.random() * flipOptions.length)];

    return {
      flipped: randomFlip,
      image: (
        <Box
          sx={{
            width: "clamp(64px, min(8vw, 15vh), 112px)",
            aspectRatio: "1 / 1",
            borderRadius: "clamp(12px, 1.5vw, 16px)",
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(180deg, rgba(242,240,235,1) 0%, rgba(242,240,235,0.98) 100%)",
            boxShadow: "none",
            "@media (min-width:600px) and (max-width:899px)": {
              width: "132px",
            },
            "@media (max-height:820px)": {
              width: "clamp(58px, min(7vw, 12vh), 94px)",
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
      numberOfTrials > 0
        ? (prev * numberOfTrials + newTime) / nextTrials
        : newTime,
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
        if (!randomIndices.includes(randomIndex))
          randomIndices.push(randomIndex);
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

      tempImagePairs.push([
        transformationResult1.image,
        transformationResult2.image,
      ]);
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
  const currentTimer =
    lastSpeed !== null ? (lastSpeed / 1000).toFixed(2) : "0.00";
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
            borderRadius: "2px",
            background: "#1c1c1a",
            color: "#fff",
            border: "1px solid rgba(242,240,235,0.08)",
          },
        }}
      >
        <DialogTitle>Spatial Visualization Rules</DialogTitle>
        <DialogContent>
          <Typography paragraph sx={{ color: "rgba(242,240,235,0.82)" }}>
            Count how many shapes are different from the target after rotation
            and mirror checks.
          </Typography>
          <Typography sx={{ color: "rgba(242,240,235,0.82)" }}>
            This mode measures mental rotation and fast spatial judgment.
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
          gap: { xs: 1, md: 0.8, lg: 1 },
          mb: { xs: 0.75, md: 0.55, lg: 0.75 },
          flexShrink: 0,
          "@media (max-height:820px)": {
            mb: 0.45,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "2px",
              display: "grid",
              placeItems: "center",
              background: "#1c1c1a",
              boxShadow: "none",
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
            <Typography
              sx={{
                color: "rgba(242,240,235,0.75)",
                mt: 0.15,
                fontSize: "0.82rem",
              }}
            >
              Spot the Match. Think in 3D. Beat the Clock.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            gap: 0.7,
            flexWrap: "wrap",
          }}
        >
          <Box sx={metricCardStyles}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                color: "#f2f0eb",
              }}
            >
              <SpeedRoundedIcon sx={{ fontSize: 16 }} />
              <Typography
                sx={{ color: "rgba(242,240,235,0.68)", fontSize: "0.68rem" }}
              >
                AVG SPEED
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.2, fontSize: "0.95rem", fontWeight: 700 }}>
              {roundAverageSpeed} sec
            </Typography>
          </Box>

          <Box sx={metricCardStyles}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                color: "#f2f0eb",
              }}
            >
              <TrackChangesRoundedIcon sx={{ fontSize: 16 }} />
              <Typography
                sx={{ color: "rgba(242,240,235,0.68)", fontSize: "0.68rem" }}
              >
                ACCURACY
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.2, fontSize: "0.95rem", fontWeight: 700 }}>
              {roundAccuracy}%
            </Typography>
          </Box>

          <Button
            onClick={() => setOpenRulePopup(true)}
            sx={{
              minWidth: 42,
              borderRadius: "2px",
              color: "#fff",
              ...panelBase,
            }}
          >
            <HelpOutlineRoundedIcon
              titleAccess="Show exercise rules"
              sx={{ fontSize: 20 }}
            />
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          ...panelBase,
          borderRadius: "2px",
          p: { xs: 0.65, md: 0.7, lg: 0.85 },
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          "@media (max-height:820px)": {
            p: 0.55,
          },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 0.2, md: 0.1, lg: 0.2 },
            flexShrink: 0,
            "@media (max-height:820px)": {
              py: 0,
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", Arial, sans-serif',
              fontSize: { xs: "1.8rem", md: "2.1rem", lg: "2.5rem" },
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.92,
              color: "#fff",
              textShadow: "none",
              "@media (max-height:820px)": {
                fontSize: "1.85rem",
              },
            }}
          >
            {currentTimer}
            <Box
              component="span"
              sx={{
                ml: 0.7,
                fontSize: { xs: "0.85rem", md: "0.95rem", lg: "1.1rem" },
                color: "#f2f0eb",
              }}
            >
              SEC
            </Box>
          </Typography>
        </Box>

        <Box
          sx={{
            px: { xs: 0.4, md: 0.7, lg: 1 },
            pb: { xs: 0.7, md: 0.45, lg: 0.7 },
            flexShrink: 0,
            "@media (max-height:820px)": {
              pb: 0.35,
            },
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: { xs: 7, md: 6, lg: 7 },
              borderRadius: 999,
              backgroundColor: "rgba(28,28,26,0.8)",
              border: "1px solid rgba(242,240,235,0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: "#f2f0eb",
              },
            }}
          />
          <Typography
            sx={{
              textAlign: "center",
              color: "rgba(242,240,235,0.72)",
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
              background: "#1c1c1a",
              px: { xs: 0.7, md: 0.8, lg: 1 },
              py: { xs: 0.7, md: 0.7, lg: 0.85 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              "@media (max-height:820px)": {
                px: 0.7,
                py: 0.55,
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.22,
                backgroundImage: "#1c1c1a",
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
                      ? "#b9cbaa"
                      : gotIt === "no"
                        ? "#d5a794"
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
                  borderRadius: "2px",
                  background: "rgba(28,28,26,0.85)",
                  border: "1px solid rgba(242,240,235,0.08)",
                  color: "rgba(242,240,235,0.92)",
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
                py: { xs: 0.2, md: 0.1, lg: 0.2 },
                gap: { xs: 0.9, sm: 0.9, md: 0.6, lg: 0.9 },
                "@media (max-height:820px)": {
                  py: 0,
                  gap: 0.4,
                },
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
                        md: "repeat(2, clamp(92px, min(9vw, 15vh), 112px))",
                        lg: "repeat(2, 112px)",
                      },
                      justifyContent: "center",
                      columnGap: { xs: 0.4, sm: 0.9, md: 0.65, lg: 0.9 },
                      rowGap: { xs: 0.5, sm: 0.5, md: 0.65, lg: 0.9 },
                      "@media (max-height:820px)": {
                        gridTemplateColumns:
                          "repeat(2, clamp(84px, min(8vw, 12vh), 96px))",
                        columnGap: 0.5,
                        rowGap: 0.45,
                      },
                    }}
                  >
                    {imagePairs.flat().map((image, index) => (
                      <Box
                        key={`${selectedIndices.join("-")}-${index}`}
                        sx={{
                          display: "grid",
                          placeItems: "center",
                          height: {
                            xs: 112,
                            sm: 142,
                            md: "clamp(92px, min(9vw, 15vh), 112px)",
                            lg: 112,
                          },
                          "@media (max-height:820px)": {
                            height: "clamp(84px, min(8vw, 12vh), 96px)",
                          },
                        }}
                      >
                        {image}
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
                        md: 0.35,
                        lg: 0,
                      },
                      "@media (max-height:820px)": {
                        pt: 0.25,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        mt: { xs: 0.45, sm: 0.5, md: 0.55, lg: 0.75 },
                        textAlign: "center",
                        color: "rgba(242,240,235,0.9)",
                        fontSize: {
                          xs: "0.74rem",
                          sm: "0.88rem",
                          md: "0.84rem",
                        },
                        "@media (max-height:820px)": {
                          mt: 0.35,
                          fontSize: "0.78rem",
                        },
                      }}
                    >
                      How many are different from the target?
                    </Typography>

                    <Box
                      sx={{
                        mt: { xs: 0.35, sm: 0.4, md: 0.45, lg: 0.55 },
                        display: "flex",
                        justifyContent: "center",
                        gap: { xs: 0.45, sm: 0.8, md: 0.55, lg: 0.7 },
                        flexWrap: "wrap",
                        "@media (max-height:820px)": {
                          mt: 0.3,
                          gap: 0.45,
                        },
                      }}
                    >
                      {[0, 1, 2].map((num) => {

                        return (
                          <Button
                            key={num}
                            onClick={() => submitAnswer(num)}
                            sx={{
                              minWidth: { xs: 74, sm: 96, md: 68, lg: 74 },
                              height: { xs: 32, sm: 38, md: 30, lg: 32 },
                              borderRadius: "2px",
                              fontSize: {
                                xs: "0.8rem",
                                sm: "0.92rem",
                                md: "0.76rem",
                                lg: "0.8rem",
                              },
                              fontWeight: 800,
                              color: "#fff",
                              background: "#1c1c1a",
                              border: "1px solid transparent",
                              "&:hover": {
                                filter: "brightness(1.06)",
                              },
                              "@media (max-height:820px)": {
                                minWidth: 64,
                                height: 28,
                                fontSize: "0.72rem",
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
                      fontSize: { xs: "1.2rem", md: "1.6rem" },
                      fontWeight: 800,
                    }}
                  >
                    Test completed
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.7,
                      color: "rgba(242,240,235,0.8)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Accuracy: {roundAccuracy}% | Average Speed:{" "}
                    {roundAverageSpeed} sec
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.8,
                      color: gotIt === "yes" ? "#b9cbaa" : "#d5a794",
                      fontSize: "0.82rem",
                    }}
                  >
                    Last answer: {gotIt === "yes" ? "Correct" : "Incorrect"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            pt: { xs: 0.45, md: 0.35, lg: 0.45 },
            textAlign: "center",
            color: "#92908d",
            fontSize: "0.56rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            flexShrink: 0,
            "@media (max-height:820px)": {
              pt: 0.2,
              fontSize: "0.5rem",
            },
          }}
        >
          Train Smart / Get Faster / Stay Sharp
        </Box>
      </Box>
    </Box>
  );
}

