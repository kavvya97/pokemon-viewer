import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  // Type assertion to specify that error is of type Error
  const routeError = error as Error;

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{routeError?.message}</i>
      </p>
    </div>
  );
}
