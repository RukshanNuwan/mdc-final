import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { GoogleLoginButton } from 'react-social-login-buttons';

import { auth, googleAuthProvider } from '../../config/firebase.config';

const Login = () => {
  const [error, setError] = useState();

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      localStorage.setItem('token', result.user.accessToken);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/');
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
          <div className="card border border-light-subtle rounded-3 shadow-sm d-flex justify-content-center align-items-center">
            <div className="card-body p-3 p-md-4 p-xl-5">
              <div className="text-center">
                <div className="p-5">
                  <img src="./title.png" alt="logo" className="img img-fluid" />
                </div>
                {error && <span variant="danger">{error}</span>}
                <GoogleLoginButton
                  onClick={handleGoogleSignIn}
                  style={{ fontSize: '1rem' }}
                  className="d-flex justify-content-center"
                >
                  <span>Login with Google</span>
                </GoogleLoginButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
