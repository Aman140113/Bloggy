import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";

const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// 🔑 tell express where your views are
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

let blogs = [];

app.get("/", (req, res) => {
  res.render("index", { blogs });   // ✅ only "index", no full path
});

app.post("/submit", (req, res) => {
  const blog = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content
  };

  blogs.push(blog);
  res.redirect("/");
});

app.get("/blogs/:id", (req, res) => {
  const blogId = req.params.id;
  const blog = blogs.find(b => b.id === blogId);

  if (blog) {
    res.render("blog", { blog });   // ✅ only "blog", not full path
  } else {
    res.status(404).send("Blog not found");
  }
});

app.get("/blogs/:id/edit", (req, res) => {
  const blogId = req.params.id;
  const blog = blogs.find(b => b.id === blogId);
  if (!blog) {
    return res.status(404).send("Blog not found");
  }
  res.render("edit", { blog });
});

app.put("/blogs/:id", (req, res) => {
  const blogId = req.params.id;
  const { title, content } = req.body;
  const blog = blogs.find(b => b.id === blogId);
  if (!blog) {
    return res.status(404).send("Blog not found");
  }
  blog.title = title;
  blog.content = content;
  res.redirect(`/blogs/${blogId}`);
});

app.delete("/blogs/:id", (req, res) => {
  const blogId = req.params.id;
  blogs = blogs.filter(b => b.id !== blogId);
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
