import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

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

  const capLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const smallLetters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const vary = [true, false];
  // select 4 small letters randomly
  function generateLetters() {
    setLetterPairs([]);
    setTimeTaken(Date.now());
    const randomSmallLetters = smallLetters
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    console.log(randomSmallLetters);
    // iterate through the selected small letters
    randomSmallLetters.map((item) => {
      const randomVary = vary[Math.floor(Math.random() * vary.length)];
      if (randomVary) {
        setLetterPairs((prev) => [
          ...prev,
          [item, capLetters[Math.floor(Math.random() * capLetters.length)]],
        ]);
      } else {
        setLetterPairs((prev) => [...prev, [item, item.toUpperCase()]]);
        setNonVaryCounter((prev) => prev + 1);
      }
    });
  }
  function submitAnswer(answer) {
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
    if (answer === nonVaryCounter) {
      console.log("correct", answer, nonVaryCounter);
      setNumberOfCorrects((prev) => {
        const newCorrect = prev + 1;
        setNumberOfTrials((prev) => {
          const newValue = prev + 1;
          setAccuracy((p) => {
            console.log("haaa", {newCorrect,newValue})
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
      setGotIt("yes");
      setNonVaryCounter(0);
      generateLetters();
    } else {
      console.log("incorrect", answer, nonVaryCounter);
      setNumberOfTrials((prev) => {
        const newValue = prev + 1;
        setAccuracy((p) => {
            console.log("haaa", {numberOfCorrects,numberOfTrials})

          if (newValue >= 1) {
            const newAccuracy = (numberOfCorrects / newValue) * 100;
            return newAccuracy;
          } else {
            return 0;
          }
        });
        return newValue;
      });
      setGotIt("no");
      setNonVaryCounter(0);
      generateLetters();
    }
  }

  useEffect(() => {
    generateLetters();
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
      {numberOfTrials <= limit ? <Box>
              <Box
        key="questions"
        sx={{ display: "flex", flexDirection: "row", gap: 4, width: "100%" }}
      >
        {letterPairs.map((letterPair, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                marginBottom: "20px",
              }}
            >
              <Typography sx={{ fontSize: "25px", color:"black" }}>{letterPair[0]}</Typography>
              <Typography sx={{ fontSize: "25px", color:"black" }}>{letterPair[1]}</Typography>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <Button
          onClick={() => submitAnswer(0)}
          sx={{ backgroundColor: "grey", color: "white", fontSize: "16px" }}
        >
          0
        </Button>
        <Button
          onClick={() => submitAnswer(1)}
          sx={{ backgroundColor: "grey", color: "white", fontSize: "16px" }}
        >
          1
        </Button>
        <Button
          onClick={() => submitAnswer(2)}
          sx={{ backgroundColor: "grey", color: "white", fontSize: "16px" }}
        >
          2
        </Button>
        <Button
          onClick={() => submitAnswer(3)}
          sx={{ backgroundColor: "grey", color: "white", fontSize: "16px" }}
        >
          3
        </Button>
        <Button
          onClick={() => submitAnswer(4)}
          sx={{ backgroundColor: "grey", color: "white", fontSize: "16px" }}
        >
          4
        </Button>
      </Box>
      </Box>:""}

    </Box>
  );
};
export default SpaceVis;
