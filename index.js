// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const app = express();
// const PORT = 8080;

// const User = require("./models/UserModel");
// const Note = require("./models/NoteModel");
// const jwt = require("jsonwebtoken");
// const { authenticateToken } = require("./utilities");

// const mongoDB = () => {
//   mongoose.connect(process.env.MONGODB_API);
//   console.log("mongoDB connected");
// };
// mongoDB();

// app.use(express.json());

// app.use(cors({ origin: "*" }));

// app.post("/signup", async (req, res) => {
//   const { fullName, email, password } = req.body;

//   if (!fullName) {
//     return res.status(401).json({
//       error: true,
//       message: "Full name is required",
//     });
//   }
//   if (!email) {
//     return res.status(401).json({
//       error: true,
//       message: "Email is required",
//     });
//   }
//   if (!password) {
//     return res.status(401).json({
//       error: true,
//       message: "Email is required",
//     });
//   }

//   const isUser = await User.findOne({ email: email });

//   if (isUser) {
//     return res
//       .status(401)
//       .json({ error: true, message: "Email already exists" });
//   }

//   const user = new User({ fullName, email, password });

//   await user.save();

//   const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "36000m",
//   });
//   return res.json({
//     error: false,
//     user,
//     accessToken,
//     message: "Registration successful",
//   });
// });

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email) {
//     return res.status(401).json({ error: true, message: "Email is required" });
//   }
//   if (!password) {
//     return res
//       .status(401)
//       .json({ error: true, message: "Password is required" });
//   }
//   const userInfo = await User.findOne({ email: email, password: password });

//   if (!userInfo) {
//     return res
//       .status(401)
//       .json({ error: true, message: "Please enter valid mail and password" });
//   }
//   if (userInfo.email === email || userInfo.password === password) {
//     const user = { user: userInfo };
//     const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
//       expiresIn: "36000m",
//     });
//     return res.json({
//       error: false,
//       user,
//       accessToken,
//       message: "Login successful",
//     });
//   } else {
//     return res
//       .status(400)
//       .json({ error: true, message: "Invalid Credentials" });
//   }
// });

// app.get("/get-user", authenticateToken, async (req, res) => {
//   const { user } = req.user;

//   const isUser = await User.findOne({ _id: user._id });

//   if (!isUser) {
//     return res.status(401).json({ error: true, message: "User not found" });
//   }

//   return res.json({ error: false, user:isUser, message: "User found" });
// });

// app.post("/add-note", authenticateToken, async (req, res) => {
//   const { user } = req.user;
//   const { title, content, tags } = req.body;

//   if (!title) {
//     return res.status(400).json({ error: true, message: "Title is required" });
//   }

//   if (!content) {
//     return res
//       .status(400)
//       .json({ error: true, message: "Content is required" });
//   }

//   try {
//     const note = new Note({
//       title,
//       content,
//       tags: tags || [],
//       userId: user._id,
//     });

//     await note.save();
//     return res
//       .status(400)
//       .json({ error: false, note, message: "Note created successfully" });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: true, message: "Internal server error" });
//   }
// });

// app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
//   const noteId = req.params.noteId;
//   const { title, content, tags, isPinned } = req.body;
//   const { user } = req.user;

//   if (!title && !content && !tags) {
//     return res
//       .status(400)
//       .json({ error: true, message: "Notes cannot be edit" });
//   }

//   try {
//     const note = await Note.findOne({ _id: noteId, userId: user._id });

//     if (!note) {
//       return res.status(404).json({ error: true, message: "Note not found" });
//     }

//     if (title) note.title = title;
//     if (content) note.content = content;
//     if (tags) note.tags = tags;
//     if (isPinned) note.isPinned = isPinned;

//     await note.save();

//     return res.json({
//       error: false,
//       note,
//       message: "Note updated successfully",
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: true, message: "Internal server error" });
//   }
// });

// app.get("/get-all-notes", authenticateToken, async (req, res) => {
//   const { user } = req.user;

//   try {
//     const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

//     return res.json({
//       error: false,
//       notes,
//       message: "Notes retrieved successfully",
//     });
//   } catch (error) {
//     return res.status(404).json({
//       error: true,
//       message: "Internal server error",
//     });
//   }
// });

// app.get("/get-note/:noteId", authenticateToken, async (req, res) => {
//   const noteId = req.params.noteId;
//   const { user } = req.user;

//   try {
//     const note = await Note.findOne({
//       _id: noteId,
//       userId: user._id,
//     });

//     if (!note) {
//       return res.status(404).json({ error: true, message: "Note not found" });
//     }

//     return res.json({
//       error: false,
//       note,
//       message: "Note found successfully",
//     });
//   } catch (error) {
//     return res.status(404).json({
//       error: true,
//       message: "Internal server error",
//     });
//   }
// });

// app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
//   const noteId = req.params.noteId;
//   const { user } = req.user;

//   try {
//     const note = await Note.findOneAndDelete({
//       _id: noteId,
//       userId: user._id,
//     });

//     if (!note) {
//       return res.status(404).json({ error: true, message: "Note not found" });
//     }

//     return res.json({
//       error: false,
//       note,
//       message: "Note deleted successfully",
//     });
//   } catch (error) {
//     return res.status(404).json({
//       error: true,
//       message: "Internal server error",
//     });
//   }
// });

// app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
//   const noteId = req.params.noteId;
//   const { isPinned } = req.body;
//   const { user } = req.user;

//   try {
//     const note = await Note.findOne({ _id: noteId, userId: user._id });

//     if (!note) {
//       return res.status(404).json({ error: true, message: "Note not found" });
//     }

//     note.isPinned = isPinned;

//     await note.save();

//     return res.json({
//       error: false,
//       note,
//       message: "Note updated successfully",
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: true, message: "Internal server error" });
//   }
// });

// app.listen(PORT, () => {
//   console.log("server started on ", PORT);
// });

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const User = require("./models/UserModel");
const Note = require("./models/NoteModel");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

const mongoDB = () => {
  mongoose
    .connect(process.env.MONGODB_API, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("mongoDB connected"))
    .catch((error) => console.error("mongoDB connection error:", error));
};
mongoDB();

app.post("/sign-up", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Full name, email, and password are required",
    });
  }

  const isUser = await User.findOne({ email });

  if (isUser) {
    return res
      .status(409)
      .json({ error: true, message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ fullName, email, password: hashedPassword });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration successful",
  });
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Email and password are required" });
  }

  const userInfo = await User.findOne({ email });

  const userPassword = await bcrypt.compare(password, userInfo.password);

  if (!userInfo || !userPassword) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid email or password" });
  }

  const accessToken = jwt.sign(
    { user: userInfo },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return res.json({
    error: false,
    user: userInfo,
    accessToken,
    message: "Login successful",
  });
});

app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findById(user._id);

  if (!isUser) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  return res.json({ error: false, user: isUser, message: "User found" });
});

app.post("/add-note", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: true, message: "Title and content are required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note created successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "Notes retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.get("/get-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    return res.json({ error: false, note, message: "Note found successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOneAndDelete({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    return res.json({
      error: false,
      note,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.get("/search-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Searched Note",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
