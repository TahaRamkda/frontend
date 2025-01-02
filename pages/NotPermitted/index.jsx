import App from '@/components/App';
import { useRouter } from 'next/router';

const NotPermitted = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/Dashboard');
  };

  return (

    <div style={styles.container}>
      <div style={styles.messageBox}>
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.message}>
          You do not have permission to access this page. If you believe this is an error, please contact your administrator.
        </p>
        <button onClick={handleGoBack} style={styles.button}>
          Go to Home
        </button>
      </div>
    </div>

  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
  messageBox: {
    padding: '20px 30px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    color: '#dc3545',
    marginBottom: '10px',
  },
  message: {
    fontSize: '16px',
    color: '#6c757d',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default NotPermitted;
