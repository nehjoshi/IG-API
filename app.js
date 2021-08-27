const express = require('express');
const dotenv = require("dotenv");
const Instagram = require("instagram-web-api");
const GitHub = require('github-api');
const app = express();
app.use(express.json())
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
dotenv.config();

const port = process.env.PORT || 5000;
const client = new Instagram({ 
username: process.env.UNAME, 
password: process.env.PWORD });
let main;
client
  .login()
  .then(() => {
    client
      .getProfile()
      .then(mainResponse => {
        main = mainResponse;
        console.log("logged in!");
      })
  });

  const gh = new GitHub({
    username: process.env.GHUNAME,
    password: process.env.GHPWORD
 });

app.get('/', (req, res) => {
  res.render('index.ejs');
})
app.post('/', async (req, res) => {
  const {username} = req.body;
  // const user = await gh.getUser('nehjoshi');
  // user.listStarredRepos()
  // .then(resp => {
  //   console.log(resp);
  // })
  // console.log(user)
  try {
  const uname = await client.getUserByUsername({username: username});
  return res.json({message: uname});
  } catch(e){
    return res.json({error: e});
  }

})
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})