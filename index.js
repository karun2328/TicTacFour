const express = require('express')
const fs=require('fs');
const path = require('path');

const app = express()
const port = 3000

app.use(express.static('public'));

app.use(express.json());

const gameStateFile=path.join(__dirname,'gameState.json');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

app.post('/gameState',(req,res)=>{
  fs.writeFile(gameStateFile,JSON.stringify(req.body),err=>{
    if(err){
      console.error("Failed to save gameState:",err);
      res.status(500).send("Error saving gameState");
    }else{
      res.send('gameState Saved');
    }
  });
});

app.get('/gameState', (req, res) => {
  if(!fs.existsSync(gameStateFile)){
    console.log("No gameState found")
    return res.json({user: null, browser: null})
  }

  fs.readFile(gameStateFile, (err, data) => {
    if (err) {
      console.error("Failed to read gameState:", err);
      return res.status(500).send('Error reading gameState');
    } 
    try{

      res.json(JSON.parse(data));
    }catch(parseErr){
      console.error("Invalid JSON");
      return res.status(500).send('Invalid gameState');


    }
    
  });
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})
