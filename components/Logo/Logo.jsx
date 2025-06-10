import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Loader from "../Layout/Loader";
import { fetchMerchant } from "@/slices/MerchantSlice";

const Logo = ({
  alt,
  imageClassName,
  imageStyle,
  textClassName,
  textStyle,
  showName,
}) => {

   const [logoPath, setLogoPath] = useState(null);
  const [merchantName, setMerchantName] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLogoPath(localStorage.getItem("LogoPath"));
      setMerchantName(localStorage.getItem("MerchantName"));
    }
  }, []);
  return (
    <div className="flex flex-col items-center">
       {logoPath && (
        <Image
          src={logoPath}
          alt={alt}
          width={100}
          height={100}
          className={`object-contain ${imageClassName}`}
          style={imageStyle}
          priority
        />
      )}
      {showName && merchantName && (
        <p
          className={`${textClassName} whitespace-nowrap overflow-hidden text-ellipsis`}
          style={textStyle}
        >
          {merchantName}
        </p>
      )}

    </div>
  );
};

export default Logo;
