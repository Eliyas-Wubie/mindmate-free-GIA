import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import vis from "../data/vis.json";

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
    const randomIndex = Math.floor(Math.random() * degrees.length);
    const randomDegree = degrees[randomIndex];
    const flipOptions = [true, false];
    const randomFlip = flipOptions[Math.floor(Math.random() * flipOptions.length)];
    return {
      flipped: randomFlip,
      image: (
        <div>
          <img
            src={image}
            alt="Rotated example"
            style={{
              transform: `rotate(${randomDegree}deg) ${randomFlip ? "scaleX(-1)" : ""}`,
              width: "100%",
              maxWidth: "100px",
              height: "auto",
            }}
          />
        </div>
      ),
    };
  }

  function submitAnswer(answer) {
    setUnmatchedCounter((prevUnmatched) => {
      const isCorrect = answer === 2 - prevUnmatched;
      const template = {
        answer,
        time: timeTaken,
        prevUnmatched,
        realAnswer: 3 - prevUnmatched,
        status: isCorrect ? "correct" : "incorrect",
        timestamp: Date.now(),
      };
      setTimeTaken((prev) => {
        const newValue = Date.now() - prev;
        template.time = newValue;
        setLastSpeed(newValue);
        setAverageSpeed((prev) => {
          if (numberOfTrials >= 1) {
            return (prev * (numberOfTrials - 1) + newValue) / numberOfTrials;
          } else {
            return newValue;
          }
        });
        return newValue;
      });

      if (isCorrect) {
        setGotIt("yes");
        setNumberOfCorrects((prev) => {
          const newCorrect = prev + 1;
          setNumberOfTrials((prev) => {
            const newValue = prev + 1;
            setAccuracy((p) => (newValue >= 1 ? (newCorrect / newValue) * 100 : 0));
            return newValue;
          });
          return newCorrect;
        });
      } else {
        setGotIt("no");
        setNumberOfTrials((prev) => {
          const newValue = prev + 1;
          setAccuracy((p) => (newValue >= 1 ? (numberOfCorrects / newValue) * 100 : 0));
          return newValue;
        });
      }

      setAnswerCollection((prev) => [...prev, template]);
      return 0;
    });
    handleStartPlaying();
  }

  function handleStartPlaying() {
    setTimeTaken(Date.now());
    const randomIndices = [];
    while (randomIndices.length < 2) {
      if (Images.length > 1) {
        const randomIndex = Math.floor(Math.random() * Images.length);
        if (!randomIndices.includes(randomIndex)) randomIndices.push(randomIndex);
      } else {
        randomIndices.push(0);
      }
    }
    setSelectedIndices(randomIndices);

    const tempImagePairs = [];
    for (const index of randomIndices) {
      const transformationResult1 = transformImage(Images[index]);
      const transformationResult2 = transformImage(Images[index]);
      const flipped1 = transformationResult1.flipped;
      const flipped2 = transformationResult2.flipped;
      if (flipped1 || flipped2) {
        if (flipped1 !== flipped2) {
          setUnmatchedCounter((prev) => prev + 1);
        }
      }
      tempImagePairs.push([transformationResult1.image, transformationResult2.image]);
    }
    setImagePairs(tempImagePairs);
    setPlaying(true);
  }

  useEffect(() => {
    handleStartPlaying();
  }, []);

  const roundaverageSpeed = averageSpeed.toFixed(3);
  const roundaccuracy = accuracy.toFixed(3);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        
      }}
    >
      {/* Responsive question mark button */}
      <Button
  onClick={() => setOpenRulePopup(true)}
  sx={{
    position: "absolute",
    top: { xs: 10, sm: 15 }, 
    right: { xs: 10, sm: 15 }, 
    fontSize: { xs: "16px", sm: "20px" },
    
    color: "white",
    minWidth: { xs: "35px", sm: "40px" },
    minHeight: { xs: "35px", sm: "40px" },
    borderRadius: "50%",
    "&:hover": { backgroundColor: "#0055cc" },
  }}
>
  <HelpOutlineIcon />
</Button>

      <Dialog open={openRulePopup} onClose={() => setOpenRulePopup(false)}>
        <DialogTitle>Game Rules</DialogTitle>
        <DialogContent>
          <p>
            1. Two images are shown per trial.<br />
            2. Click the number of unmatched images (0, 1, or 2).<br />
            3. Your accuracy and average speed are calculated automatically.<br />
            4. The game continues until you reach the trial limit.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRulePopup(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Stats */}
      <Box
        sx={{
          fontSize: { xs: "18px", sm: "30px" },
          color: "white",
          width: "100%",
          backgroundColor: "rgb(45, 145, 244)",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <Box sx={{ marginLeft: { xs: "3%", sm: "5%" } }}>
          Average Speed: {roundaverageSpeed}
        </Box>
        <Box sx={{ marginLeft: { xs: "3%", sm: "5%" } }}>Accuracy: {roundaccuracy}%</Box>
      </Box>

      <Box
        sx={{
          fontSize: { xs: "24px", sm: "40px" },
          color: "white",
          width: "100%",
          backgroundColor: "rgb(71, 144, 216)",
          marginBottom:"10px",
          textAlign: "center",
        }}
      >
        {lastSpeed / 1000} sec
      </Box>
      <Box sx={{ width: "90%", mt: 2 }}>
  <LinearProgress
    variant="determinate"
    value={(numberOfTrials / limit) * 100}
    sx={{
      height: 10,
      borderRadius: 5
    }}
  />

  <Typography sx={{ mt: 1, textAlign: "center", fontSize: "14px" }}>
    {numberOfTrials} / {limit} trials completed
  </Typography>
</Box>

      {/* Correct / incorrect */}
      {gotIt ? (
        <Box
          sx={{
            fontSize: { xs: "24px", sm: "40px" },
            color: gotIt === "yes" ? "green" : "red",
            width: "100%",
            backgroundColor: "white",
            marginBottom: { xs: "15px", sm: "30px" },
            textAlign: "center",
          }}
        >
          {gotIt === "yes" ? "✔" : "❌"}
        </Box>
      ) : (<Box
          sx={{
            fontSize: { xs: "24px", sm: "40px" },
            color: gotIt === "yes" ? "green" : "red",
            width: "100%",
            backgroundColor: "white",
            marginBottom: { xs: "15px", sm: "30px" },
            textAlign: "center",
          }}
        >
          {"💖"}
        </Box>)}

      {/* Images */}
      {numberOfTrials <= limit-1 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 4 },
            width: "100%",
            alignItems: "center",
          }}
        >
          {imagePairs.map((imagePair, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 4 },
                width: "100%",
                justifyContent: "center",
              }}
            >
              {imagePair[0]}
              {imagePair[1]}
            </Box>
          ))}

          {/* Answer buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: 1, sm: 4 },
              justifyContent: "center",
              mt: 2,
            }}
          >
            {[0, 1, 2].map((num) => (
              <Button
                key={num}
                onClick={() => submitAnswer(num)}
                sx={{
                  backgroundColor: "rgb(45, 145, 244)",
                  color: "white",
                  fontSize: { xs: "14px", sm: "16px" },
                  minWidth: { xs: "60px", sm: "80px" },
                  minHeight: { xs: "40px", sm: "50px" },
                }}
              >
                {num}
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SpaceVis;