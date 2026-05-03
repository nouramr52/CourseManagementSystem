const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//connect react to backend