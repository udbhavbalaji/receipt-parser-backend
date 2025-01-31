import CreateExpressApp from "./app";
import { secrets } from "./constants";
import db from "./prisma";
const app = CreateExpressApp();

app.listen(secrets.PORT, () => {
  console.log(
    "App listening on http://localhost:3000/endpoint/name\n\nTracking changes in repository"
  );
});
