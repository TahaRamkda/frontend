import { useRouter } from 'next/router';

const PageNotFound = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center  ">
        {/* 404 Icon or Illustration */}
       

       
        {/* Button */}
        <button
          onClick={handleGoBack}
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;