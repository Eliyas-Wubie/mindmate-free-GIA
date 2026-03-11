import { useEffect, useState } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

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

  const capLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const smallLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
  const vary = [true, false];

  function generateLetters() {
    setLetterPairs([]);
    setTimeTaken(Date.now());
    const randomSmallLetters = smallLetters.sort(() => Math.random() - 0.5).slice(0, 4);

    randomSmallLetters.forEach((item) => {
      const randomVary = vary[Math.floor(Math.random() * vary.length)];
      if (randomVary) {
        setLetterPairs((prev) => {
          let randomCap = item.toUpperCase();
          while (randomCap === item.toUpperCase()) {
            randomCap = capLetters[Math.floor(Math.random() * capLetters.length)];
          }
          return [...prev, [item, randomCap]];
        });
      } else {
        setLetterPairs((prev) => [...prev, [item, item.toUpperCase()]]);
        setNonVaryCounter((prev) => prev + 1);
      }
    });
  }

  function submitAnswer(answer) {
    setTimeTaken((prev) => {
      const newValue = Date.now() - prev;
      setLastSpeed(newValue);
      setAverageSpeed((prev) =>
        numberOfTrials >= 1 ? (prev * (numberOfTrials - 1) + newValue) / numberOfTrials : newValue
      );
      return newValue;
    });

    if (answer === nonVaryCounter) {
      setNumberOfCorrects((prev) => {
        const newCorrect = prev + 1;
        setNumberOfTrials((prev) => {
          const newValue = prev + 1;
          setAccuracy((_) => (newValue >= 1 ? (newCorrect / newValue) * 100 : 0));
          return newValue;
        });
        return newCorrect;
      });
      setGotIt("yes");
    } else {
      setNumberOfTrials((prev) => {
        const newValue = prev + 1;
        setAccuracy((_) => (newValue >= 1 ? (numberOfCorrects / newValue) * 100 : 0));
        return newValue;
      });
      setGotIt("no");
    }

    setNonVaryCounter(0);
    generateLetters();
  }

  useEffect(() => {
    generateLetters();
  }, []);

  const roundaverageSpeed = averageSpeed.toFixed(3);
  const roundaccuracy = accuracy.toFixed(3);

  return (
    <Box sx={{ position: "relative", width: "100%",  }}>
      {/* Question mark button */}
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


      {/* Rule Dialog */}
      <Dialog open={openRulePopup} onClose={() => setOpenRulePopup(false)}>
        <DialogTitle>Rule</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Select the number that is the most different or stands out the most from the others.
          </Typography>
          <Typography paragraph>
            Carefully compare each option and choose the one that is farthest in value or pattern.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRulePopup(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Stats */}
      <Box
        sx={{
          fontSize: { xs: "20px", sm: "26px", md: "30px" },
          color: "white",
          width: "100%",
          backgroundColor: "rgb(45, 145, 244)",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          
        }}
      >
        <Box sx={{ marginLeft: { xs: "3%", sm: "5%" } }}>Average Speed: {roundaverageSpeed}</Box>
        <Box sx={{ marginLeft: { xs: "3%", sm: "5%" } }}>Accuracy: {roundaccuracy}%</Box>
      </Box>

      {/* Last speed */}
      <Box
        sx={{
          fontSize: { xs: "24px", sm: "32px", md: "40px" },
          color: "white",
          width: "100%",
          backgroundColor: "rgb(71, 144, 216)",
          marginBottom: { xs: "4%", sm: "6%", md: "6%" },
          textAlign: "center",
        }}
      >
        {lastSpeed / 1000} sec
      </Box>

      {/* Correct / incorrect */}
      {gotIt && (
        <Box
          sx={{
            fontSize: { xs: "24px", sm: "32px", md: "40px" },
            color: gotIt === "yes" ? "green" : "red",
            width: "100%",
            backgroundColor: gotIt === "yes" ? "#89e0" : "white",
            marginBottom: { xs: "8px", sm: "12px", md: "10px" },
            textAlign: "center",
          }}
        >
          {gotIt === "yes" ? "✔" : "❌"}
        </Box>
      )}

      {/* Letter pairs */}
      {numberOfTrials <= limit && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: { xs: 2, sm: 3, md: 4 },
            mb: 4,
          }}
        >
          {letterPairs.map((letterPair, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1, sm: 2 },
                alignItems: "center",
                padding: { xs: "8px", sm: "10px", md: "0px" },
                borderRadius: "8px",
                backgroundColor: { xs: "#f0f0f0", sm: "#f9f9f9", md: "transparent" },
              }}
            >
              <Typography sx={{ fontSize: { xs: "18px", sm: "22px", md: "25px" }, color: "black" }}>
                {letterPair[0]}
              </Typography>
              <Typography sx={{ fontSize: { xs: "18px", sm: "22px", md: "25px" }, color: "black" }}>
                {letterPair[1]}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Answer buttons */}
      {numberOfTrials <= limit && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(5, auto)" },
            gap: { xs: 2, sm: 3, md: 4 },
            justifyContent: "center",
          }}
        >
          {[0, 1, 2, 3, 4].map((num) => (
            <Button
              key={num}
              onClick={() => submitAnswer(num)}
              sx={{
                backgroundColor: "rgb(45, 145, 244)",
                color: "white",
                fontSize: { xs: "14px", sm: "16px" },
                minWidth: { xs: "50px", sm: "70px" },
                minHeight: { xs: "35px", sm: "45px" },
              }}
            >
              {num}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SpaceVis;