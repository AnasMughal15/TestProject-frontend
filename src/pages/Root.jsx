import { useEffect } from 'react';
import { Outlet, useLoaderData, useSubmit, useNavigation } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import { getTokenDuration } from '../util/auth';

function RootLayout() {
  const token = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' });
    }, tokenDuration);
  }, [token, submit]);

  return (
    <>
      {/* Top loading bar shown during route transitions */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-[#3a3a3a]">
          <div className="h-full bg-[#fab833] animate-pulse w-3/4" />
        </div>
      )}
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
