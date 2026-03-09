import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import vis from "../data/vis.json";
import { use } from "react";
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

  //new
  const [gotIt, setGotIt] = useState(null);
  const [lastSpeed, setLastSpeed] = useState(null);
  //end new
  const Images = [
    // "/pics/F.png",
    // "/pics/G.png",
    // "/pics/J.png",
    // "/pics/P.png",
    // "/pics/Q.png",
    "/pics/R.png",
    // "/pics/S.png",
  ];

  function transformImage(image) {
    const degrees = [0, 90, 180, 270];
    const randomIndex = Math.floor(Math.random() * degrees.length);
    const randomDegree = degrees[randomIndex];
    const flipOptions = [true, false];
    const randomFlip =
      flipOptions[Math.floor(Math.random() * flipOptions.length)];
    return {
      flipped: randomFlip,
      image: (
        <div>
          <img
            src={image}
            alt="Rotated example"
            style={{
              transform: `rotate(${randomDegree}deg) ${
                randomFlip ? "scaleX(-1)" : ""
              }`,
              width: "100px",
              height: "auto",
            }}
          />
        </div>
      ),
    };
  }

  function submitAnswer(answer) {
    setUnmatchedCounter((prevUnmatched) => {
      console.log("ℹℹ", prevUnmatched);
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
      //new
      if (isCorrect) {
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
      } else {
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
      }
      // end new
      console.log(isCorrect ? "correct" : "incorrect", template);
      setAnswerCollection((prev) => [...prev, template]);
      return 0; // if you don't want to change it here
    });
    handleStartPlaying();
  }

  function handleStartPlaying() {
    // select 3 distinct numbers from 0 to length of images
    setTimeTaken(Date.now());
    const randomIndices = [];
    while (randomIndices.length < 2) {
        if (Images.length >1){
            const randomIndex = Math.floor(Math.random() * Images.length);
            if (!randomIndices.includes(randomIndex)) {
              randomIndices.push(randomIndex);
            }
        }
        else{
              randomIndices.push(0);
        }
    }
    setSelectedIndices((prev) => randomIndices);
    //import each image and rotate them
    const tempImagePairs = [];
    for (const index of randomIndices) {
      console.log(randomIndices);
      const transformationResult1 = transformImage(Images[index]);
      const transformationResult2 = transformImage(Images[index]);
      const rotatedImage1 = transformationResult1.image;
      const rotatedImage2 = transformationResult2.image;
      const flipped1 = transformationResult1.flipped;
      const flipped2 = transformationResult2.flipped;
      console.log(flipped1, flipped2);
      if (flipped1 || flipped2) {
        if (flipped1 !== flipped2) {
          setUnmatchedCounter((prev) => {
            console.log("adding one to flipped", prev + 1);
            const newValue = prev + 1;
            return newValue;
          });
        }
      }
      tempImagePairs.push([rotatedImage1, rotatedImage2]);
    }
    setImagePairs(tempImagePairs);
    setPlaying(true);
    console.log(unmatchedCounter);
  }
  
  useEffect(() => {
    handleStartPlaying();
  }, []);

  useEffect(() => {
    console.log("unmatched counter changed", unmatchedCounter);
  }, [unmatchedCounter]);
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* new */}
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
        gotIt === "yes"  ? (
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
      {/* end new */}
      {numberOfTrials <= limit ? <Box>
              <Box
        key="questions"
        sx={{ display: "flex", flexDirection: "row", gap: 4 }}
      >
        {imagePairs.map((imagePair, index) => {
          console.log("🎶🎶🎶🎶", imagePair);
          return (
            <Box
              key={index}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {imagePair[0]}
              {imagePair[1]}
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
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
        {/* <Button
          onClick={() => submitAnswer(3)}
          sx={{ backgroundColor: "grey", color: "white", fontSize: "16px" }}
        >
          3
        </Button> */}
      </Box>
      </Box>:""}

    </Box>
  );
};
export default SpaceVis;
