import React, { useEffect, useState } from "react";
import "../asset/css/getcode.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchDiscountCodes } from "../services/api";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const GetCode = () => {
  const [discountCodes, setDiscountCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDiscountCodes = async () => {
      try {
        setLoading(true);
        const data = await fetchDiscountCodes();
        setDiscountCodes(data);
      } catch (error) {
        console.error("Failed to load discount codes", error);
      } finally {
        setLoading(false);
      }
    };
    loadDiscountCodes();
  }, []);

  return (
    <div className="containerx">
      <div className="headerx">
        <button className="back-button" onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        Discount Codes from LUXE STORE
      </div>
      <div className="content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="discount-codes">
            {discountCodes.map((codeObj) => (
              <div key={codeObj.id} className="discount-card">
                <div className="store-name">LUXE STORE</div>
                <div className="details">
                <p className="discount-name">{codeObj.discount_name}</p>
                  <p className="discount-name">Discount: {codeObj.percentage}% off product price</p>
                  <p className="min-spend">Minimum spend: 0 Baht</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetCode;
