import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import db from "./db.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/content:daw", async(req,res)=>{
    const daw = req.params.daw
    const {authorization} = req.headers
    const token = authorization.replace("Bearer", "").trim();
    try{
        const user = await db.collection("sessions").findOne({token:token});
        if (!user) return res.send(404);
        const userInfo = await db.collection("users").findOne({email:user.email});
        const userLevel = userInfo[daw];
        const content = await db.collection("content").findOne({name:daw});
        const contentLevel = content[userLevel]
        res.send(contentLevel);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.post("/level:daw", async(req,res)=>{
    const daw = req.params.daw
    const newLevel = req.body.level
    const {authorization} = req.headers
    const token = authorization.replace("Bearer", "").trim();
    try{
        const user = await db.collection("sessions").findOne({token:token});
        if (!user) return res.send(404);
        await db.collection("users").updateOne({email:user.email},{$set:{[daw]:newLevel}})
        res.sendStatus(200);
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.post("/login", async (req,res) => {
        
        const {email,password,name} = req.body
        const token = uuid()
        try{
                const users = db.collection("users")
                const user = await user.findOne({email})
                const sessions = db.collection("sessions")
                if(user){
                        if (user && bcrypt.compareSync(password, user.encryptedPassword)){              
                                await sessions.insertOne({email,token})
                                return res.send(token)
                        } else{
                                return res.send("password denied")
                        }
                }

                const encryptedPassword = bcrypt.hashSync(password, 10);
                await users.insertOne({ name, email, encryptedPassword})
                await sessions.insertOne({ email, token })
                res.send(token)
        }catch(error){
                res.send(error)
        }
})

app.listen(process.env.PORT,()=>console.log(`Server listening on port ${process.env.PORT}`))