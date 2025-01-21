import CreateSpentApp from "./app";
import { secrets } from "./constants";

const app = CreateSpentApp();

app.listen(3000, () => {
  console.log(
    "App listening on http://localhost:3000/endpoint/name\n\nTracking changes in repository"
  );
});
