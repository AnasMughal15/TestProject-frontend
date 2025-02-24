import { redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';

  if (mode !== 'login' && mode !== 'signup') {
    return new Response(JSON.stringify({ message: 'Unsupported mode.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await request.formData();
  const authData = {
    name: data.get('name'),
    email: data.get('email'),
    password: data.get('password'),
    user_type: data.get('userType'),
  };
    
  const response = await fetch(`${import.meta.env.VITE_API_URL}/` + mode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    return new Response(JSON.stringify({ message: 'Could not authenticate user.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem('token', token);

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expiration', expiration.toISOString());


  return redirect('/');
}
