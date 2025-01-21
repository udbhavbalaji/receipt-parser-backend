import CreateExpressApp from "./app";
import { secrets } from "./constants";

const app = CreateExpressApp();

app.listen(secrets.PORT, () => {
  console.log(
    "App listening on http://localhost:3000/endpoint/name\n\nTracking changes in repository"
  );
});
