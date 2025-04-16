import mongoose from "mongoose"

const db = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log(`MongoDB Connected Succesfully!`)
    })
    .catch((err) => {
        console.log(`Error Connecting to MongoDB, Awwww~!`);
    })
}

export default db