
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-halomed-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-halomed-700">
          HaloMed Pharmacy Management System
        </h1>
        <p className="text-xl text-halomed-600">
          Redirecting to login page...
        </p>
      </div>
    </div>
  );
};

export default Index;
