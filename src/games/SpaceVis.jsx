import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  LinearProgress,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";

const SpaceVis = ({ limit }) => {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [unmatchedCounter, setUnmatchedCounter] = useState(0);
  const [imagePairs, setImagePairs] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [answerCollection, setAnswerCollection] = useState([]);
  const [numberOfTrials, setNumberOfTrials] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [numberOfCorrects, setNumberOfCorrects] = useState(0);
  const [gotIt, setGotIt] = useState(null);
  const [lastSpeed, setLastSpeed] = useState(null);
  const [openRulePopup, setOpenRulePopup] = useState(false);

  const Images = ["/pics/R.png"];

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
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: "10px",
            backgroundColor: "rgba(255,255,255,0.98)",

            boxShadow: "0 8px 18px rgba(100,110,140,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 0,
            minHeight: 0,
            maxWidth: "70%"
          }}
        >
          <img
            src={image}
            alt="Rotated example"
            style={{
              transform: `rotate(${randomDegree}deg) ${randomFlip ? "scaleX(-1)" : ""}`,
              width: "clamp(120px, 10vw, 20vw)",
              height: "clamp(120px, 10vw, 20vw)",
              maxWidth: "70%",
              maxHeight: "70%",
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

    const template = {
      answer,
      time: newTime,
      prevUnmatched,
      realAnswer,
      status: isCorrect ? "correct" : "incorrect",
      timestamp: Date.now(),
    };

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
    setAnswerCollection((prev) => [...prev, template]);
    setUnmatchedCounter(0);

    if (nextTrials < limit) {
      setTimeout(() => {
        handleStartPlaying();
      }, 250);
    }
  }

  function handleStartPlaying() {
    setTimeTaken(Date.now());

    const randomIndices = [];
    while (randomIndices.length < 2) {
      if (Images.length > 1) {
        const randomIndex = Math.floor(Math.random() * Images.length);
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
      const transformationResult1 = transformImage(Images[index]);
      const transformationResult2 = transformImage(Images[index]);

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

    setUnmatchedCounter(unmatched);
    setImagePairs(tempImagePairs);
    setPlaying(true);
  }

  useEffect(() => {
    handleStartPlaying();
  }, []);

  const roundaverageSpeed = (averageSpeed / 1000).toFixed(3);
  const roundaccuracy = accuracy.toFixed(3);
  const currentTimer = lastSpeed !== null ? (lastSpeed / 1000).toFixed(3) : "0";
  const progressValue = limit > 0 ? (numberOfTrials / limit) * 100 : 0;

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
          "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(235,243,255,0.94) 100%)",

        boxShadow: "0 18px 40px rgba(75, 100, 155, 0.14)",
      }}
    >
      <Dialog open={openRulePopup} onClose={() => setOpenRulePopup(false)}>
        <DialogTitle>Game Rules (How to Play)</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            A target letter is shown. Two additional letters are displayed
            beside or below it. Each of the two letters may be: the same letter
            rotated, or a flipped / mirrored version, which does not count as a
            match. The player must decide how many of the two letters truly
            match the target. The response options are: 0 = neither matches 1 =
            only one matches 2 = both match The player must answer as quickly
            and accurately as possible.
          </Typography>
          <Typography paragraph>
            What It Measures This test measures: Mental rotation Spatial
            reasoning Ability to distinguish true rotation from mirror flipping
            Speed of visual-spatial judgment How It Measures Performance It is
            measured through: Average speed: how long the player takes per
            question Accuracy: how often the player correctly identifies whether
            0, 1, or 2 letters match Correct answers per minute: overall spatial
            processing efficiency
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
            px: { xs: 1.25, sm: 1.75, md: 2.5 },
            pt: { xs: 1, sm: 1.25, md: 1.6 },
            pb: { xs: 0.8, sm: 1, md: 1.2 },
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          <Button
            onClick={() => setOpenRulePopup(true)}
            sx={{
              position: "absolute",
              top: { xs: 4, sm: 8 },
              right: { xs: 4, sm: 8 },
              minWidth: "unset",
              width: { xs: 28, sm: 34 },
              height: { xs: 28, sm: 34 },
              borderRadius: "50%",
              color: "rgba(255,255,255,0.95)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.10)",
              },
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </Button>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "44px 1fr 44px" },
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
              <SpeedRoundedIcon sx={{ fontSize: 34 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.45rem" },
                  fontWeight: 500,
                  lineHeight: 1.15,
                }}
              >
                Average Speed: {roundaverageSpeed} sec
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "0.85rem", sm: "1rem", md: "1.3rem" },
                  fontWeight: 400,
                  lineHeight: 1.15,
                  mt: 0.25,
                }}
              >
                Accuracy: {roundaccuracy}%
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.85,
              }}
            ></Box>
          </Box>
        </Box>

        {/* Timer */}
        <Box
          sx={{
            background:
              "linear-gradient(180deg, rgba(79,155,237,0.92) 0%, rgba(53,119,222,0.92) 100%)",
            color: "white",
            textAlign: "center",
            py: { xs: 0.45, sm: 0.6, md: 0.85 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.7rem" },
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
            px: { xs: 1.25, sm: 2, md: 3 },
            py: { xs: 0.7, sm: 0.9 },
            background:
              "linear-gradient(180deg, rgba(249,250,255,0.98) 0%, rgba(241,245,252,0.98) 100%)",
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: { xs: 5, sm: 7, md: 9 },
              borderRadius: 999,
              backgroundColor: "rgba(106, 92, 92, 0.3)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: "linear-gradient(90deg, #4ba350 0%, #2fcd41 100%)",
              },
            }}
          />
          <Typography
            sx={{
              textAlign: "center",
              color: "#334155",
              fontSize: { xs: "0.72rem", sm: "0.8rem", md: "0.9rem" },
              mt: 0.5,
              fontWeight: 500,
            }}
          >
            {numberOfTrials} / {limit} trials completed
          </Typography>
        </Box>
      </Box>

      {/* Main */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: { xs: 0.5, sm: 0.75, md: 1 },
          display: "flex",
          background:
            "linear-gradient(180deg, rgba(249,250,255,0.98) 0%, rgba(241,245,252,0.98) 100%)",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: "20px",
            background:
              "linear-gradient(180deg, rgba(249,250,255,0.98) 0%, rgba(241,245,252,0.98) 100%)",

            p: { xs: 0.5, sm: 0.75, md: 1 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Feedback */}
          <Box
            sx={{
              flexShrink: 0,
              textAlign: "center",
              minHeight: { xs: 20, sm: 24, md: 30 },
              mb: { xs: 0.15, sm: 0.25, md: 0.4 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.35rem" },
                lineHeight: 1,
              }}
            >
              {gotIt === "yes" ? "✅" : gotIt === "no" ? "❌" : ""}
            </Typography>
          </Box>

          {/* Playground */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              borderRadius: "18px",
              p: { xs: 0.5, sm: 0.75, md: 1 },
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
                borderRadius: "18px",
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(240,245,255,0.88) 100%)",
                border: "1px solid rgba(180,200,235,0.45)",
                boxShadow: "0 10px 24px rgba(90,110,155,0.15)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Images area */}
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: { xs: 0.6, sm: 1, md: 1.4 },
                  py: { xs: 0.6, sm: 0.9, md: 1.2 },
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(243,246,252,0.95) 100%)",
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
                        display: "flex",
                        flexDirection: "row",
                        gap:2,
                        p:1

                      }}
                    >
                      {imagePairs.map((imagePair, index) => (
                        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap:1 }}>
                          {imagePair[0]}
                          {imagePair[1]}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.6rem" },
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
                      Accuracy: {roundaccuracy}% • Average Speed:{" "}
                      {roundaverageSpeed} sec
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Answer buttons */}
              {numberOfTrials < limit && (
                <Box
                  sx={{
                    flexShrink: 0,
                    px: { xs: 0.8, sm: 1.2, md: 1.6 },
                    py: { xs: 0.8, sm: 1, md: 1.2 },
                    borderTop: "1px solid rgba(190,205,230,0.55)",
                    background:
                      "linear-gradient(180deg, rgba(248,250,255,0.92) 0%, rgba(236,241,249,0.92) 100%)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "clamp(6px, 1vw, 14px)",
                      flexWrap: "wrap",
                    }}
                  >
                    {[0, 1, 2].map((num) => (
                      <Button
                        key={num}
                        onClick={() => submitAnswer(num)}
                        sx={{
                          minWidth: "clamp(44px, 7vw, 90px)",
                          height: "clamp(34px, 4.6vh, 52px)",
                          borderRadius: "12px",
                          fontSize: "clamp(0.85rem, 1.4vw, 1.3rem)",
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
