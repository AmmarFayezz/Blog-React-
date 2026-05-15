import jsonServer from "json-server";
import auth from "json-server-auth";

const app = jsonServer.create();
const router = jsonServer.router("./db.json");
const middlewares = jsonServer.defaults();

app.use(middlewares);

app.db = router.db;

app.use(
  auth.rewriter({
    posts: 644,
    users: 600,
  }),
);

app.use(auth);
app.use(router);

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
