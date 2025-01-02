// components/Loader.js
import React from 'react';
import App from '@/components/App';

const Loader = () => (

  <div class="fixed inset-0 bg-transparent flex items-center justify-center z-50">
    <div class="relative w-24 h-24">
      <div class="absolute w-full h-full">

        <div class="absolute w-full h-full flex items-center justify-center">
          <div class="absolute w-1/2 h-1/2 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div class="absolute w-1/2 h-1/2 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <div class="absolute w-1/2 h-1/2 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <div class="absolute w-1/2 h-1/2 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  </div>


);

export default Loader;
