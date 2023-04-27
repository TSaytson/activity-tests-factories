import app from "./app";

const port = process.env.PORT || 5000;
console.log(port);
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});