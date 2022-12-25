import { Router } from "express";
import ScoreCard from "../models/ScoreCard"; 

// const saveUser = async (name, subject, score) => {
//     const existing = await ScoreCard.findOne({}); { name: name; subject: subject }
//     try {
//         if (existing) {
//             throw new Error(`data ${name}, ${subject} exists!!`);

//         }
//         const newUser = new ScoreCard({ name, subject, score });
//         console.log("Created user", newUser);
//         return newUser.save();
//     }
//     catch (e) { throw new Error("User creation error: " + e); }
// };

const deleteDB = async () => {
    try {
        await ScoreCard.deleteMany({});
        console.log("Database deleted");
    }
    catch (e) { throw new Error("Database deletion failed"); }
};

const router = Router(); 
router.delete("/cards", (_, res) => {
    deleteDB()
    res.send({message: 'Database cleared'})
}); 
router.post("/card", async(req, res) => {
    const name = req.body.name
    const subject = req.body.subject
    const score = req.body.score
    let message = ''
    // console.log(req.query)
    const newCard = new ScoreCard({ name, subject, score });
    // newCard.save();

    const filter = { "name": name, "subject": subject }
    const update = { "score": score }
    await ScoreCard.findOneAndUpdate(filter, { $set: update }, { upsert: true, new: true, rawResult:true })
    .then((result) => {
        if (result.lastErrorObject.updatedExisting == true) // Update exist score card
        {
            message = `Updating (${name}, ${subject}, ${score})`
        }
        else // Add a new one
        {
            message = `Adding (${name}, ${subject}, ${score})`
        }
        // console.log(result)
    })
    res.send({ message: message, card: newCard })
}); 
router.get("/cards", async(req, res) => {
    const queryType = req.query.type
    const queryString = req.query.queryString
    
    let filter = {}
    if (queryType === 'name') // filter = name
    { 
        filter = {'name': queryString}
    }
    else // filter = subject
    {
        filter = {'subject': queryString}
    }

    let messages = []
    const message = `${queryType} (${queryString}) not found!`

    await ScoreCard.find(filter)
    .then((result) => {
        // console.log(result[0])
        result.map((e) => {messages.push(`Found card with ${queryType}: (${e.name}, ${e.subject}, ${e.score})`)})
    })
    if (messages.length === 0) {
        res.send({ messages: null, message: message })
    }
    else{
        res.send({ messages: messages, message: message })
    }
});
export default router;
 