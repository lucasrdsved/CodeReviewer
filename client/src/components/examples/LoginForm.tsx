import LoginForm from '../LoginForm';

export default function LoginFormExample() {
  const handleLogin = (userType: 'student' | 'trainer', username: string) => {
    console.log('Login example:', { userType, username });
  };

  return <LoginForm onLogin={handleLogin} />;
}