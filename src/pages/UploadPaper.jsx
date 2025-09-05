import React, { useEffect, useState } from 'react'
import { decodeToken, getToken } from "../utils/jwtUtils";
import api from '../api/api';
const UploadPaper = () => {
   useEffect(() => {
    api.get("/auth").then((res) => {
    });
  }, []);
  return (
    <div>
      Upload Paper
    </div>
  )
}

export default UploadPaper
