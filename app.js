
import express from "express";
import fs from "fs";
import mime from "mime";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// enable CORS for development
/*
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));
//}*/
const allowedOrigins = [
    "http://localhost:5173",
    "https://a4-moetko.vercel.app",
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods:"GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization"
    })
);

app.use(express.json());

// MongoDB connection
const url = process.env.MONGODB_URI;
const dbconnect = new MongoClient(url);
let collection = null;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// configure session
app.use(
    session({
        secret: "secret123",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            //secure: false, // set to `true` in production with HTTPS
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        },
    })
);

// initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

const callbackURL =
    process.env.NODE_ENV === "production"
        ? "https://a4-moetko.vercel.app/auth/github/callback"
        : "http://localhost:3000/auth/github/callback";

passport.use(
    new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = {
                id: profile.id,
                username: profile.username,
                displayName: profile.displayName,
            };
            done(null, user);
        }
    )
);

// serialize and deserialize user sessions
passport.serializeUser((user, done) => {
    console.log("Serializing user:", user); // log user being serialized
    done(null, user);
});


passport.deserializeUser((user, done) => {
    console.log("Deserializing user:", user); // log user being deserialized
    done(null, user);
});
app.get("/auth/status", (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated(), user: req.user });
});

// middleware to protect routes
const ensureAuthenticated = (req, res, next) => {
    console.log("req.isAuthenticated:", req.isAuthenticated());
    console.log("req.user:", req.user);
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/github"); // redirect to GitHub authentication if not logged in
};

async function run() {
    try {
        await dbconnect.connect();
        console.log("Connected to MongoDB!");
        collection = dbconnect.db("taskManager").collection("tasks");

        /*
        app.get("/auth/github", (req, res) => {
            console.log("Redirecting to GitHub OAuth...");
            res.set("Cache-Control", "no-store"); // prevents caching
            res.redirect(
                `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&prompt=login`
            ); idk if this is working 2:06
        });*/



        app.get("/auth/github", (req, res) => {
            console.log("Redirecting to GitHub OAuth...");
            res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&prompt=login`);
        });


/*
                app.get(
                    "/auth/github/callback",
                    passport.authenticate("github", { failureRedirect: "/login" }),
                    (req, res) => {
                        console.log("GitHub Authentication Successful:", req.user);
                        res.redirect("http://localhost:5173/tasks"); // redirect to frontend tasks page
                    }
                );*/

        const frontendURL =
            process.env.NODE_ENV === "production"
                ? "https://a4-moetko.vercel.app"
                : "http://localhost:5173";

        app.get(
            "/auth/github/callback",
            passport.authenticate("github", { failureRedirect: "/login" }),
            (req, res) => {
                console.log("GitHub Authentication Successful:", req.user);
                res.redirect(`${frontendURL}/tasks`);
            }
        );

        app.post("/logout", (req, res, next) => {
            req.logout((err) => {
                if (err) {
                    return next(err);
                }
                req.session.destroy(() => {
                    res.clearCookie("connect.sid", { path: "/" }); // clear session cookie
                    console.log(" User logged out, session destroyed.");
                    res.status(200).json({ message: "Logged out successfully" });
                });
            });
        });

        app.use("/tasks", ensureAuthenticated);
        app.use("/completed-tasks", ensureAuthenticated);

        // get all tasks for the user
        // get all incomplete tasks for the user
        app.get("/tasks", async (req, res) => {
            console.log("Incoming request to /tasks");
            try {
                const username = req.user.username;
                const results = await collection.find({ username, completed_at: { $exists: false } }).toArray();
                res.json(results);
            } catch (err) {
                console.error("Error fetching tasks:", err);
                res.status(500).json({ message: "Error fetching tasks" });
            }
        });

        // add a new task
        app.post("/tasks", async (req, res) => {
            try {
                const { task, priority, deadline } = req.body;
                const username = req.user.username;

                if (!task || !priority || !deadline) {
                    return res.status(400).json({ message: "All fields are required" });
                }

                const createdAt = new Date().toISOString().split("T")[0];
                const newTask = {
                    username,
                    task,
                    priority,
                    created_at: createdAt,
                    deadline,
                    days_until_deadline: computeDaysUntilDeadline(deadline, createdAt),
                };

                await collection.insertOne(newTask);
                res.json({ message: "Task added successfully", task: newTask });
            } catch (err) {
                console.error("Error adding task:", err);
                res.status(500).json({ message: "Error adding task" });
            }
        });

        // get completed tasks for the user
        app.get("/completed-tasks", async (req, res) => {
            try {
                const username = req.user.username;
                const results = await collection.find({ username, completed_at: { $exists: true } }).toArray();
                res.json(results);
            } catch (err) {
                console.error("Error fetching completed tasks:", err);
                res.status(500).json({ message: "Error fetching completed tasks" });
            }
        });

        // mark a task as complete
        app.put("/tasks/complete", async (req, res) => {
            try {
                const { id } = req.body;
                const username = req.user.username;

                if (!id) {
                    return res.status(400).json({ message: "Task ID is required" });
                }

                const result = await collection.updateOne(
                    { _id: new ObjectId(id), username },
                    { $set: { completed_at: new Date().toISOString() } }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: "Task not found or unauthorized" });
                }

                res.json({ message: "Task marked as completed" });
            } catch (err) {
                console.error("Error marking task as completed:", err);
                res.status(500).json({ message: "Error marking task as completed" });
            }
        });

        app.put("/tasks/update", async (req, res) => {
            try {
                const { id, task, priority, deadline } = req.body;
                const username = req.user.username;

                if (!id) {
                    return res.status(400).json({ message: "Task ID is required" });
                }

                const updateFields = {};
                if (task) updateFields.task = task;
                if (priority) updateFields.priority = priority;
                if (deadline) updateFields.deadline = deadline;

                const result = await collection.updateOne(
                    { _id: new ObjectId(id), username },
                    { $set: updateFields }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: "Task not found or unauthorized" });
                }

                res.json({ message: "Task updated successfully" });
            } catch (err) {
                console.error("Error updating task:", err);
                res.status(500).json({ message: "Error updating task" });
            }
        });


        // delete a task
        app.delete("/tasks", async (req, res) => {
            try {
                const { id } = req.body;
                const username = req.user.username;
                const result = await collection.deleteOne({ _id: new ObjectId(id), username });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: "Task not found or unauthorized" });
                }

                res.json({ message: "Task deleted successfully" });
            } catch (err) {
                console.error("Error deleting task:", err);
                res.status(500).json({ message: "Error deleting task" });
            }
        });
/*
        // serve React static files (production)
        if (process.env.NODE_ENV === "production") {
            app.use(express.static(path.join(__dirname, "dist")));
            app.get("*", (req, res) => {
                res.sendFile(path.join(__dirname, "dist", "index.html"));
            });
        }*/

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

// compute days until the deadline
const computeDaysUntilDeadline = (deadline, createdAt) => {
    const deadlineDate = new Date(deadline);
    const createdDate = new Date(createdAt);
    return Math.ceil((deadlineDate - createdDate) / (1000 * 60 * 60 * 24));
};

run().catch((err) => console.error("Error initializing server:", err));

//added
if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
}



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
