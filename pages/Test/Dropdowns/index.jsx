// import { useRouter } from 'next/router';

// const PageNotFound = () => {
//   const router = useRouter();

//   const handleGoBack = () => {
//     router.push('/');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
//       <div className="max-w-md w-full bg-white rounded-2xl  p-8 text-center ">
//         {/* 404 Icon or Illustration */}
//         <div className="mb-6">
//           <svg
//             className="mx-auto h-24 w-24 text-red-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//         </div>

//         {/* Title */}
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
//           404 - Page Not Found
//         </h1>

//         {/* Message */}
//         <p className="text-lg text-gray-600 mb-8">
//           Oops! It looks like the page you're looking for doesn't exist or has been moved.
//         </p>

//         {/* Button */}
//         <button
//           onClick={handleGoBack}
//           className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
//         >
//           Go Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PageNotFound;