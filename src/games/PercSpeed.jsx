import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";

const SpaceVis = ({ limit }) => {
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

  const vary = [true, false];

  function generateLetters() {
    const shuffled = [...smallLetters]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    const newPairs = [];
    let newNonVaryCount = 0;

    shuffled.forEach((item) => {
      const randomVary = vary[Math.floor(Math.random() * vary.length)];

      if (randomVary) {
        let randomCap = item.toUpperCase();
        while (randomCap === item.toUpperCase()) {
          randomCap = capLetters[Math.floor(Math.random() * capLetters.length)];
        }
        newPairs.push([item, randomCap]);
      } else {
        newPairs.push([item, item.toUpperCase()]);
        newNonVaryCount += 1;
      }
    });

    setLetterPairs(newPairs);
    setNonVaryCounter(newNonVaryCount);
    setTimeTaken(Date.now());
  }

  function submitAnswer(answer) {
    const newValue = Date.now() - timeTaken;
    setLastSpeed(newValue);

    const nextTrials = numberOfTrials + 1;
    const isCorrect = answer === nonVaryCounter;
    const nextCorrects = isCorrect ? numberOfCorrects + 1 : numberOfCorrects;

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
  const currentTimer = lastSpeed !== null ? (lastSpeed / 1000).toFixed(3) : "0";
  const progressValue = limit > 0 ? (numberOfTrials / limit) * 100 : 0;
  const trialsCompletedText = `${numberOfTrials} / ${limit} trials completed`;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: "30px",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.72) 10%, rgb(255, 255, 255) 100%)",

        boxShadow: "0 18px 40px rgba(75, 100, 155, 0.14)",
      }}
    >
      <Dialog open={openRulePopup} onClose={() => setOpenRulePopup(false)}>
        <DialogTitle>Game Rules (How to Play)</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            The screen shows four pairs of letters. Each pair may contain: the
            same letter in uppercase/lowercase form different letters The player
            must count how many pairs match. A match means both letters
            represent the same alphabet letter, regardless of case.
          </Typography>
          <Typography paragraph>
            What It Measures This test measures Perceptual Speed, including:
            Visual scanning speed Ability to detect small differences quickly
            Pattern recognition Sustained visual attention This ability is
            important for tasks such as: Data inspection Monitoring systems
            Quality control Rapid information processing
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRulePopup(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={{ flexShrink: 0 }}>
        <Box
          sx={{
            position: "relative",
            background:
              "linear-gradient(135deg, #59B2FF 0%, #2D91F4 46%, #2A67F5 100%)",
            color: "white",
            px: { xs: 1.5, sm: 2, md: 3 },
            pt: { xs: 1.2, sm: 1.5, md: 2 },
            pb: { xs: 0.9, sm: 1.2, md: 1.5 },
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          <Button
            onClick={() => setOpenRulePopup(true)}
            sx={{
              position: "absolute",
              top: { xs: 6, sm: 10 },
              right: { xs: 6, sm: 10 },
              minWidth: "unset",
              width: { xs: 32, sm: 38 },
              height: { xs: 32, sm: 38 },
              borderRadius: "50%",
              color: "rgba(255,255,255,0.95)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.10)",
              },
            }}
          >
            <HelpOutlineIcon fontSize="small" />
          </Button>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "52px 1fr 52px" },
              alignItems: "center",
              gap: 1,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.9,
              }}
            >
              <SpeedRoundedIcon sx={{ fontSize: 38 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "0.95rem", sm: "1.2rem", md: "1.65rem" },
                  fontWeight: 500,
                  lineHeight: 1.15,
                }}
              >
                Average Speed: {roundAverageSpeed} sec
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.5rem" },
                  fontWeight: 400,
                  lineHeight: 1.15,
                  mt: 0.35,
                }}
              >
                Accuracy: {roundAccuracy}%
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.85,
              }}
            >
              <TrackChangesRoundedIcon sx={{ fontSize: 38 }} />
            </Box>
          </Box>
        </Box>

        {/* Timer */}
        <Box
          sx={{
            background:
              "linear-gradient(180deg, rgba(79,155,237,0.92) 0%, rgba(53,119,222,0.92) 100%)",
            color: "white",
            textAlign: "center",
            py: { xs: 0.55, sm: 0.75, md: 1 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            {currentTimer} sec
          </Typography>
        </Box>

        {/* Progress */}
        <Box
          sx={{
            px: { xs: 1.5, sm: 2.5, md: 4 },
            py: { xs: 0.8, sm: 1, md: 1.2 },
            background:
              "linear-gradient(180deg, rgba(249,250,255,0.98) 0%, rgba(241,245,252,0.98) 100%)",
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: { xs: 6, sm: 8, md: 10 },
              borderRadius: 999,
              backgroundColor: "rgba(123, 182, 242, 0.30)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: "linear-gradient(90deg, #67ff95 0%, #05b10b 100%)",
              },
            }}
          />
          <Typography
            sx={{
              textAlign: "center",
              color: "#334155",
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
              mt: 0.6,
              fontWeight: 500,
            }}
          >
            {trialsCompletedText}
          </Typography>
        </Box>
      </Box>

      {/* Main */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: { xs: 0.6, sm: 0.9, md: 1.2 },
          display: "flex",
          background:
            "linear-gradient(180deg, rgba(249,250,255,0.98) 0%, rgba(241,245,252,0.98) 100%)",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: "22px",
            background:
              "linear-gradient(180deg, rgb(249, 250, 255) 0%, rgb(255, 255, 255) 100%)",

            boxShadow: "0 12px 26px rgba(95,115,155,0.12)",
            p: { xs: 0.6, sm: 0.9, md: 1.2 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Feedback */}
          <Box
            sx={{
              flexShrink: 0,
              textAlign: "center",
              minHeight: { xs: 24, sm: 28, md: 34 },
              mb: { xs: 0.2, sm: 0.4, md: 0.7 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {gotIt && (
              <Typography
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.6rem" },
                  lineHeight: 1,
                }}
              >
                {gotIt === "yes" ? "✅" : "❌"}
              </Typography>
            )}
          </Box>

          {/* Playground */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              borderRadius: "20px",
              p: { xs: 0.6, sm: 0.9, md: 1.2 },
              background:
                "radial-gradient(circle at top left, rgba(235,245,255,0.95) 0%, rgba(194,220,255,0.85) 40%, rgba(181,211,251,0.90) 100%)",
              border: "1px solid rgba(170,200,240,0.30)",
              boxShadow: "inset 0 1px 10px rgba(255,255,255,0.28)",
              display: "flex",
            }}
          >
            <Box
              sx={{
                width: "100%",
                minHeight: 0,
                borderRadius: "22px",
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(240,245,255,0.88) 100%)",
                border: "1px solid rgba(180,200,235,0.45)",
                boxShadow: "0 10px 24px rgba(90,110,155,0.15)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Board */}
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  px: { xs: 0.8, sm: 1.2, md: 1.8 },
                  py: { xs: 0.8, sm: 1.2, md: 1.8 },
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(243,246,252,0.95) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {numberOfTrials < limit ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      minHeight: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "clamp(6px, 1vw, 16px)",
                        width: "min(100%, 720px)",
                        maxHeight: "100%",
                        alignItems: "stretch",
                      }}
                    >
                      {letterPairs.map((letterPair, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: "80%",
                            aspectRatio: "1 / 1",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255,255,255,0.96)",
                            border: "clamp(2px, 0.25vw, 4px) solid #FF5B5B",
                            boxShadow: "0 8px 18px rgba(100,110,140,0.16)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 0,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              lineHeight: 1,
                              gap: "clamp(0px, 0.4vh, 2px)",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "clamp(1rem, 3.2vw, 3rem)",
                                color: "#111827",
                                fontWeight: 400,
                                lineHeight: 0.92,
                              }}
                            >
                              {letterPair[0]}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "clamp(1rem, 3.2vw, 3rem)",
                                color: "#111827",
                                fontWeight: 400,
                                lineHeight: 0.92,
                              }}
                            >
                              {letterPair[1]}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", px: 2 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.25rem", md: "1.7rem" },
                        fontWeight: 700,
                        color: "#1F2A44",
                      }}
                    >
                      Test completed
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1,
                        color: "#64748B",
                        fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                      }}
                    >
                      Accuracy: {roundAccuracy}% • Average Speed:{" "}
                      {roundAverageSpeed} sec
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Answers */}
              {numberOfTrials < limit && (
                <Box
                  sx={{
                    flexShrink: 0,
                    px: { xs: 0.8, sm: 1.2, md: 1.8 },
                    py: { xs: 0.8, sm: 1, md: 1.3 },
                    borderTop: "1px solid rgba(190,205,230,0.55)",
                    background:
                      "linear-gradient(180deg, rgba(248,250,255,0.92) 0%, rgba(236,241,249,0.92) 100%)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "clamp(6px, 1vw, 16px)",
                      flexWrap: "wrap",
                    }}
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <Button
                        key={num}
                        onClick={() => submitAnswer(num)}
                        sx={{
                          minWidth: "clamp(42px, 7vw, 90px)",
                          height: "clamp(34px, 5vh, 52px)",
                          borderRadius: "12px",
                          fontSize: "clamp(0.85rem, 1.4vw, 1.35rem)",
                          fontWeight: 500,
                          color: "white",
                          background:
                            num === 2
                              ? "linear-gradient(135deg, #4AB7FF 0%, #2D91F4 50%, #2A8CF0 100%)"
                              : "linear-gradient(135deg, #57AEFF 0%, #2D91F4 58%, #257CE7 100%)",
                          boxShadow: "0 8px 18px rgba(45,145,244,0.26)",
                          border: "1px solid rgba(255,255,255,0.28)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #69BAFF 0%, #3698F7 58%, #2B83EC 100%)",
                          },
                        }}
                      >
                        {num}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SpaceVis;
