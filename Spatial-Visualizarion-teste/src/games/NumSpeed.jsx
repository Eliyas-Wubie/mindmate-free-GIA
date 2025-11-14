import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
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
  //generate 3 numbers between 1 and 99
  const generateNumbers = () => {
    let num1 = Math.floor(Math.random() * 12) + 1;
    let num2 = Math.floor(Math.random() * 12) + 1;
    let num3 = Math.floor(Math.random() * 12) + 1;
    // get the min, max, and median of the numbers
    let min = Math.min(num1, num2, num3);
    let max = Math.max(num1, num2, num3);
    let median = num1 + num2 + num3 - min - max;
    let dif1 = Math.abs(median - min);
    let dif2 = Math.abs(median - max);
    while (dif1 === dif2 || num1===num2 || num1===num3 || num2===num3) {
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      num3 = Math.floor(Math.random() * 12) + 1;
      min = Math.min(num1, num2, num3);
      max = Math.max(num1, num2, num3);
      median = num1 + num2 + num3 - min - max;
      dif1 = Math.abs(median - min);
      dif2 = Math.abs(median - max);
    }
    setNumbers((prev) => [num1, num2, num3]);
    if (dif1 > dif2) {
      setAnswer(min);
    } else {
      setAnswer(max);
    }
    setTimeTaken(Date.now());
  };
  const submitAnswer = (ans) => {
    setTimeTaken((prev) => {
      const newValue = Date.now() - prev;
      // template.time = newValue;
      // new
      setLastSpeed(newValue);
      setAverageSpeed((prev) => {
        if (numberOfTrials >= 1) {
          const newAverage =
            (prev * (numberOfTrials - 1) + newValue) / numberOfTrials;
          return newAverage;
        } else {
          return newValue;
        }
      });
      // end new
      return newValue;
    });
    if (ans === answer) {
      console.log("correct", ans, answer);
      setGotIt("yes");
      setNumberOfCorrects((prev) => {
        const newCorrect = prev + 1;
        setNumberOfTrials((prev) => {
          const newValue = prev + 1;
          setAccuracy((p) => {
            console.log("haaa", { newCorrect, newValue });
            if (newValue >= 1) {
              const newAccuracy = (newCorrect / newValue) * 100;
              return newAccuracy;
            } else {
              return 0;
            }
          });
          return newValue;
        });
        return newCorrect;
      });
      generateNumbers();
    } else {
      console.log("incorrect", ans, answer);
      setGotIt("no");
      setNumberOfTrials((prev) => {
        const newValue = prev + 1;
        setAccuracy((p) => {
          console.log("haaa", { numberOfCorrects, numberOfTrials });

          if (newValue >= 1) {
            const newAccuracy = (numberOfCorrects / newValue) * 100;
            return newAccuracy;
          } else {
            return 0;
          }
        });
        return newValue;
      });
      generateNumbers();
    }
  };
  useEffect(() => {
    generateNumbers();
  }, []);
  return (
    <Box>
      <Box
        sx={{
          fontSize: "30px",
          color: "white",
          width: "100%",
          backgroundColor: "#242424",
        }}
      >
        Average Speed: {averageSpeed} Accuracy: {accuracy}%
      </Box>

      <Box
        sx={{
          fontSize: "40px",
          color: "white",
          width: "100%",
          backgroundColor: "black",
        }}
      >
        {lastSpeed / 1000} sec
      </Box>
      {gotIt ? (
        gotIt === "yes" ? (
          <Box
            sx={{
              fontSize: "40px",
              color: "green",
              width: "100%",
              backgroundColor: "white",
              marginBottom: "30px",
            }}
          >
            ✔
          </Box>
        ) : (
          <Box
            sx={{
              fontSize: "40px",
              color: "red",
              width: "100%",
              backgroundColor: "white",
              marginBottom: "30px",
            }}
          >
            ❌
          </Box>
        )
      ) : (
        ""
      )}
      {numberOfTrials <= limit ? (
        <Box
          key="questions"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 4,
            color: "white",
            margin:"1rem"
          }}
        >
          {numbers.map((num, index) => (
            <Button
              key={index}
              onClick={() => submitAnswer(num)}
              sx={{ color: "white", fontSize:"1.5rem", background:"grey" }}
            >
              {num}
            </Button>
          ))}
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};
export default NumSpeed;
