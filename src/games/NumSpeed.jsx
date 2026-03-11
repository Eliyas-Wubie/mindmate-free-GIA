import { useState, useEffect } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

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
    setTimeTaken((prev) => {
      const newValue = Date.now() - prev;
      setLastSpeed(newValue);
      setAverageSpeed((prev) =>
        numberOfTrials >= 1
          ? (prev * (numberOfTrials - 1) + newValue) / numberOfTrials
          : newValue
      );
      return newValue;
    });

    if (ans === answer) {
      setGotIt("yes");
      setNumberOfCorrects((prev) => {
        const newCorrect = prev + 1;
        setNumberOfTrials((prev) => {
          const newValue = prev + 1;
          setAccuracy((_) => (newValue >= 1 ? (newCorrect / newValue) * 100 : 0));
          return newValue;
        });
        return newCorrect;
      });
    } else {
      setGotIt("no");
      setNumberOfTrials((prev) => {
        const newValue = prev + 1;
        setAccuracy((_) =>
          newValue >= 1 ? (numberOfCorrects / newValue) * 100 : 0
        );
        return newValue;
      });
    }
    generateNumbers();
  };

  useEffect(() => {
    generateNumbers();
  }, []);

  const roundaverageSpeed = averageSpeed.toFixed(3);
  const roundaccuracy = accuracy.toFixed(3);

  return (
    <Box sx={{ width: "100%",  position: "relative" }}>
      {/* Question Mark Button */}
      <IconButton
        onClick={() => setOpenRule(true)}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "rgb(45,145,244)",
          color: "white",
          "&:hover": { backgroundColor: "rgb(35,125,224)" },
        }}
      >
        <HelpOutlineIcon />
      </IconButton>

      {/* Stats */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "rgb(45, 145, 244)",
          color: "white",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        
        }}
      >
        <Typography sx={{ fontSize: { xs: "14px", sm: "20px", md: "30px" } }}>
          Average Speed: {roundaverageSpeed}
        </Typography>
        <Typography sx={{ fontSize: { xs: "14px", sm: "20px", md: "30px" } }}>
          Accuracy: {roundaccuracy}%
        </Typography>
      </Box>

      {/* Last speed */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "rgb(71, 144, 216)",
          color: "white",
    
          mb: { xs: 6, sm: 8 },
          fontSize: { xs: "18px", sm: "25px", md: "40px" },
          textAlign: "center",
        }}
      >
        {lastSpeed / 1000} sec
      </Box>

      {/* Correct / Incorrect */}
      {gotIt && (
        <Box
          sx={{
            fontSize: { xs: "20px", sm: "30px", md: "40px" },
            color: gotIt === "yes" ? "green" : "red",
            width: "100%",
            textAlign: "center",
            mb: { xs: 3, sm: 4 },
          }}
        >
          {gotIt === "yes" ? "✔" : "❌"}
        </Box>
      )}

      {/* Numbers */}
      {numberOfTrials <= limit && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 1, sm: 2, md: 4 },
            mb: { xs: 2, sm: 3 },
          }}
        >
          {numbers.map((num, index) => (
            <Button
              key={index}
              onClick={() => submitAnswer(num)}
              sx={{
                backgroundColor: "rgb(45, 145, 244)",
                color: "white",
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
                minWidth: { xs: "50px", sm: "60px", md: "80px" },
                minHeight: { xs: "35px", sm: "40px", md: "50px" },
              }}
            >
              {num}
            </Button>
          ))}
        </Box>
      )}

      {/* Rule Dialog */}
      <Dialog open={openRule} onClose={() => setOpenRule(false)}>
        <DialogTitle>Rule</DialogTitle>
        <DialogContent>
          <Typography>
            Select the number that is the most different or stands out the most from the others.
          </Typography>
          <Typography>
            Carefully compare each option and choose the one that is farthest in value or pattern.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NumSpeed;