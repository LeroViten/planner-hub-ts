import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <>
      <h1>The page you're looking for is not found! 😢</h1>
      <p>
        Go back to <Link to="/"> main page </Link>
      </p>
    </>
  );
}
