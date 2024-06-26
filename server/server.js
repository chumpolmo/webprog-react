const express = require("express");
const cors = require("cors");
const Distance = require("geo-distance");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/checkin", (req, res) => {
  console.log('' + Distance('10 m').human_readable());
  let resChkIn = false;
  let ​DestTo = {
    lat: 59.914,
    lon: 10.752
  };
  let SourFrom = {
    lat: 52.523,
    lon: 13.412
  };
  let resDist = Distance.between(DestTo, SourFrom);
  
  console.log('' + resDist.human_readable());
  if (resDist <= Distance('10 m')) {
    console.log('Nice Training!');
    resChkIn = true;
  } else {
    console.log('Bad Training, please try again!');
    resChkIn = false;
  }
  res.json({ 
    activity_id: "pm041011062024",
    user_id: "Hl4WB0vGapYrpenaZA6Z1cZn1OA3",
    message: "Hello from server!",
    result: resChkIn});
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
