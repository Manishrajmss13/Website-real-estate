import React, { useState } from "react";
import { useMutation } from "react-query";
import { bookVisit } from "../../utils/api";

const BookingModal = ({ opened, setOpened, email, propertyId }) => {
  const [value, setValue] = useState(null);
  const { mutate, isLoading } = useMutation({
    mutationFn: () => bookVisit(value, propertyId, email),
    onSuccess: () => {
      // Alert and close the modal after a successful booking
      alert("Booking successful!");
      setOpened(false);
    },
  });

  if (!opened) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        zIndex: 1,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        style={{
          backgroundColor: "#fefefe",
          margin: "auto",
          padding: "20px",
          border: "1px solid #888",
          width: "80%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "#aaa",
            float: "right",
            fontSize: "28px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => setOpened(false)}
        >
          &times;
        </span>
        <h2>Select your date of visit</h2>
        <input
          type="date"
          value={value ? value.toISOString().substr(0, 10) : ""}
          onChange={(e) => setValue(new Date(e.target.value))}
          min={new Date().toISOString().split("T")[0]}
          style={{
            marginTop: "10px",
            padding: "10px",
            width: "calc(100% - 22px)", // adjust for padding
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => mutate()}
          disabled={!value || isLoading}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Booking..." : "Book visit"}
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
