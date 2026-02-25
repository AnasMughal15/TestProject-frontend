import { useRouteError } from 'react-router-dom';

import PageContent from '../components/PageContent';
import t from '../locales/en.json';

function ErrorPage() {
  const error = useRouteError();

  let title = t.errors.title_generic;
  let message = t.errors.message_generic;

  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 404) {
    title = t.errors.title_notFound;
    message = t.errors.message_notFound;
  }

  return (
    <>
      <PageContent title={title}>
        <p>{message}</p>
      </PageContent>
    </>
  );
}

export default ErrorPage;
