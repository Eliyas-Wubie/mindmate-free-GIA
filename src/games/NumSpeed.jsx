import { useState, useEffect } from "react";
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

const NumSpeed = ({ limit }) => {
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

  const generateNumbers = () => {
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
  };

  const submitAnswer = (ans) => {
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
  };

  useEffect(() => {
    generateNumbers();
  }, []);

  const roundaverageSpeed = (averageSpeed / 1000).toFixed(3);
  const roundaccuracy = accuracy.toFixed(3);
  const currentTimer = lastSpeed !== null ? (lastSpeed / 1000).toFixed(3) : "0";
  const progressValue = limit > 0 ? (numberOfTrials / limit) * 100 : 0;

  return (
    <Box
      sx={{
        width: "100%",
        // height: "calc(100vh - 120px)",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: "30px",
        // overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(235,243,255,0.94) 100%)",

        boxShadow: "0 18px 40px rgba(75, 100, 155, 0.14)",
      }}
    >
      <Dialog open={openRule} onClose={() => setOpenRule(false)}>
        <DialogTitle> Game Rules (How to Play)</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            The player is presented with three numbers. Two of the numbers are
            close to each other, while one number is further away. The task is
            to identify which number is the furthest from the other two. The
            player selects the outlier number.
          </Typography>
          <Typography paragraph>
            What It Measures - This test measures Numerical Processing Speed and
            Accuracy, including: Quick numerical comparison Quantitative
            reasoning Ability to detect numerical outliers Mental calculation
            speed It reflects how efficiently a person can process numeric
            information under time pressure.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRule(false)}>Close</Button>
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
            px: { xs: 1.5, sm: 2.5, md: 4 },
            pt: { xs: 1.5, sm: 2, md: 2.5 },
            pb: { xs: 1, sm: 1.5, md: 2 },
            borderTopLeftRadius:"32px",
            borderTopRightRadius:"32px"
          }}
        >
          <Button
            onClick={() => setOpenRule(true)}
            sx={{
              position: "absolute",
              top: { xs: 6, sm: 10 },
              right: { xs: 6, sm: 10 },
              minWidth: "unset",
              width: { xs: 34, sm: 40 },
              height: { xs: 34, sm: 40 },
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
              gridTemplateColumns: { xs: "1fr", md: "70px 1fr 70px" },
              alignItems: "center",
              gap: 1,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                opacity: 0.9,
              }}
            >
              <SpeedRoundedIcon sx={{ fontSize: 48 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.5rem", md: "2rem" },
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                Average Speed: {roundaverageSpeed} sec
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.35rem", md: "1.8rem" },
                  fontWeight: 400,
                  lineHeight: 1.2,
                  mt: 0.4,
                }}
              >
                Accuracy: {roundaccuracy}%
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
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
            py: { xs: 0.8, sm: 1.2, md: 1.5 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.6rem", sm: "2rem", md: "2.6rem" },
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
            px: { xs: 2, sm: 3, md: 5 },
            py: { xs: 1.2, sm: 1.5 },
            background:
              "#00000000",
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: { xs: 8, sm: 10, md: 12 },
              borderRadius: 999,
              backgroundColor: "rgba(77, 79, 81, 0.3)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: "linear-gradient(90deg, #21c173 0%, #05b10b 100%)",
              },
            }}
          />
          <Typography
            sx={{
              textAlign: "center",
              color: "#334155",
              fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1.05rem" },
              mt: 0.8,
              fontWeight: 500,
            }}
          >
            {numberOfTrials} / {limit} trials completed
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          // p: { xs: 1, sm: 1.5, md: 1.5 },
          display: "flex",
          background: "#00000000",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: "26px",
            background: "rgba(255,255,255,0.70)",
            border: "1px solid rgba(180,200,240,0.30)",
            boxShadow: "0 12px 26px rgba(95,115,155,0.12)",
            paddingX: { xs: 1, sm: 1.5, md: 2 },
            paddingBottom: { xs: 1, sm: 1.5, md: 2 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Feedback */}
          <Box
            sx={{
              textAlign: "center",
              // minHeight: { xs: 32, sm: 40, md: 48 },
              // mb: { xs: 0.5, sm: 1, md: 1.5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              // backgroundColor:"red",
              paddingY: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.5rem", sm: "1.9rem", md: "2.3rem" },
                lineHeight: 1,
              }}
            >
              {gotIt === "yes" ? "✅" : gotIt === "no" ? "❌" : ""}
            </Typography>
          </Box>

          {/* Play area */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              borderRadius: "22px",
              p: { xs: 1, sm: 1.5, md: 2 },
              background:
                "radial-gradient(circle at top left, rgba(235,245,255,0.95) 0%, rgba(194,220,255,0.85) 40%, rgba(181,211,251,0.90) 100%)",
              border: "1px solid rgba(170,200,240,0.30)",
              boxShadow: "inset 0 1px 10px rgba(255,255,255,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 650,
                height: "100%",
                minHeight: "200px",
                borderRadius: "24px",
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(240,245,255,0.88) 100%)",
                border: "1px solid rgba(180,200,235,0.45)",
                boxShadow: "0 10px 24px rgba(90,110,155,0.15)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Numbers area */}
              <Box
                sx={{
                  flex: 1,
                  // minHeight: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: { xs: 1, sm: 2, md: 2 },
                  py: { xs: 1.5, sm: 2, md: 2 },
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(243,246,252,0.95) 100%)",
                }}
              >
                {numberOfTrials < limit ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: { xs: 1, sm: 1.5, md: 2.5 },
                      flexWrap: "wrap",
                      width: "100%",
                      height: "100%"
                    }}
                  >
                    {numbers.map((num, index) => (
                      <Box
                        key={index}
                        onClick={() => submitAnswer(num)}
                        sx={{
                          minWidth: { xs: 70, sm: 90, md: 120 },
                          width: { xs: "10%", sm: "10%", md: "10%" },
                          maxWidth: 50,
                          height: "50%",
                          minHeight: "40px",
                          maxHeight: "80px",
                          // aspectRatio: "1 / 0.5",
                          borderRadius: "16px",
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,248,253,0.96) 100%)",
                          border: "3px solid #FF5B5B",
                          boxShadow: "0 8px 18px rgba(100,110,140,0.16)",
                          color: "#111827",
                          fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
                          fontWeight: 500,
                          "&:hover": {
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,245,252,0.98) 100%)",
                          },
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        {num}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", px: 2 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
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
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                      }}
                    >
                      Accuracy: {roundaccuracy}% • Average Speed:{" "}
                      {roundaverageSpeed} sec
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Bottom note */}
              {numberOfTrials < limit && (
                <Box
                  sx={{
                    flexShrink: 0,
                    px: { xs: 1, sm: 2, md: 3 },
                    py: { xs: 1, sm: 1.4, md: 2 },
                    borderTop: "1px solid rgba(190,205,230,0.55)",
                    background:
                      "linear-gradient(180deg, rgba(248,250,255,0.92) 0%, rgba(236,241,249,0.92) 100%)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#64748B",
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.05rem" },
                      fontWeight: 500,
                    }}
                  >
                    Tap the number that stands out the most
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NumSpeed;
