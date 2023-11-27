require('dotenv').config()
const express=require ("express")
const cors=require ("cors")
const port=process.env.PORT || 5000;
const app=express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middleware
app.use(express.json());
app.use(cors());

//basic method

app.get('/', (req,res)=>{
res.send("Server is Working")
})
app.listen(port,()=>{
  console.log(`Server Port is : ${port}`)
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0jc6ar3.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const applicantCollection=client.db("brta").collection("applicant")
const subcribeEmail=client.db("brta").collection("subemail")
// const serviceCollection=client.db("esraqify").collection("services")
// const teamCollection=client.db("esraqify").collection("teams")

// get metehod
app.get("/applicants", async (req, res) => {
  try {
    const result = await applicantCollection.find().sort({ currentDate: -1 }).toArray();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/applicants/:email",async (req,res)=>{
  try {
    const email=req.params.email
    const query={email:email}
    const result= await applicantCollection.findOne(query);
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})

// applicant card data added to data base

app.post("/applicants" , async (req,res)=>{
  try {
    const applicantData=req.body;
    const result=await applicantCollection.insertOne(applicantData);
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})
// applicant card data added to data base
app.get('/detail/:id', async (req, res) => {
  try {
    const id=req.params.id;
    const query={_id:new ObjectId(id)}
    console.log(req.params.id)
    const result=await applicantCollection.findOne(query);
    res.send(result)
    
  } catch (error) {
  console.log(error)
  }
});





//ok
app.post("/subemail", async (req, res) => {
  try {
    const { email } = req.body;
    const existingEmail = await subcribeEmail.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already subscribed.' });
    }
   const result = await subcribeEmail.insertOne({ email });
   res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the length of the "applicant" collection
app.get("/applicantLength", async (req, res) => {
  try {
    const length = await applicantCollection.countDocuments();
    res.json({ length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the length of the "subemail" collection
app.get("/subemailLength", async (req, res) => {
  try {
    const length = await subcribeEmail.countDocuments();
    res.json({ length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// team card deleting from databsae
// app.delete('/delete//:id', async (req,res)=>{
//   try {
//     const teamCardDataId = req.params.id;
//     const query={_id: new ObjectId(teamCardDataId)};
//     const result=await teamCollection.deleteOne(query);
//     res.send(result);
//   } catch (error) {
//     console.log(error)
//   }
// })
// team card getting from databsae by id


// patch method


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


