import {
    Form,
    Link,
    useSearchParams,
    useActionData,
    useNavigation,
  } from 'react-router-dom';
  
  import classes from './AuthForm.module.css';
  import t from '../locales/en.json';

  function AuthForm() {
    const data = useActionData();
    const navigation = useNavigation();
  
    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get('mode') === 'login';
    const isSubmitting = navigation.state === 'submitting';
  
    return (
      <>
        <Form method="post" className={classes.form}>
          <h1>{isLogin ? t.auth.title_login : t.auth.title_signup}</h1>
          {data && data.errors && (
            <ul className={classes.errorMessage}>
              {Object.values(data.errors).map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
          {data && data.message && <p>{data.message}</p>}
          <p>
            <label htmlFor="email">{t.auth.label_email}</label>
            <input id="email" type="email" name="email" required />
          </p>
          <p>
            <label htmlFor="image">{t.auth.label_password}</label>
            <input id="password" type="password" name="password" required />
          </p>
          {!isLogin &&
          <div>
            <p>
            <label htmlFor="name">{t.auth.label_name}</label>
            <input id="name" type="name" name="name" required />
          </p>
          <div>
            <label>{t.auth.label_userType}</label>
            <div className={classes.radioGroup}>
              <div className={classes.radioOption}>
                <input
                  type="radio"
                  id="developer"
                  name="userType"
                  value="developer"
                  required
                />
                <label htmlFor="developer">{t.auth.role_developer}</label>
              </div>
              <div className={classes.radioOption}>
                <input
                  type="radio"
                  id="manager"
                  name="userType"
                  value="manager"
                  required
                />
                <label htmlFor="manager">{t.auth.role_manager}</label>
              </div>
              <div className={classes.radioOption}>
                <input
                  type="radio"
                  id="qa"
                  name="userType"
                  value="qa"
                  required
                />
                <label htmlFor="qa">{t.auth.role_qa}</label>
              </div>
            </div>
          </div>
          </div>
          }

          <div className={classes.actions}>
            <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
              {isLogin ? t.auth.link_createUser : t.auth.link_login}
            </Link>
            <button disabled={isSubmitting}>
              {isSubmitting ? t.auth.btn_submitting : t.auth.btn_save}
            </button>
          </div>
        </Form>
      </>
    );
  }
  
  export default AuthForm;
  