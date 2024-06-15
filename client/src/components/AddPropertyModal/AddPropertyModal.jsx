import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createResidency } from "../../utils/api";
import useProperties from "../../hooks/useProperties";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./AddPropertyModal.css"; // Import the CSS file

// Leaflet marker icon fix for default icon not appearing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const AddPropertyModal = ({ opened, setOpened }) => {
  const { user } = useAuth0();
  const [imageURL, setImageURL] = useState(null);
  const [coordinates, setCoordinates] = useState([51.505, -0.09]); // Default coordinates for map
  const [propertyDetails, setPropertyDetails] = useState({
    title: "",
    description: "",
    price: 0,
    country: "",
    city: "",
    address: "",
    image: null,
    facilities: {
      bedrooms: 0,
      parkings: 0,
      bathrooms: 0,
    },
    userEmail: user?.email,
  });

  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "djzfa7lhf",
        uploadPreset: "bdf2aeeq",
        maxFiles: 1,
      },
      (err, result) => {
        if (result.event === "success") {
          setImageURL(result.info.secure_url);
        }
      }
    );
  }, []);

  const { refetch: refetchProperties } = useProperties();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => createResidency(propertyDetails),
    onError: ({ response }) =>
      toast.error(response.data.message, { position: "bottom-right" }),
    onSettled: () => {
      toast.success("Added Successfully", { position: "bottom-right" });
      setOpened(false);
      setPropertyDetails({
        title: "",
        description: "",
        price: 0,
        country: "",
        city: "",
        address: "",
        image: null,
        facilities: {
          bedrooms: 0,
          parkings: 0,
          bathrooms: 0,
        },
        userEmail: user?.email,
      });
      refetchProperties();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setPropertyDetails((prev) => ({ ...prev, image: imageURL }));
    mutate();
  };

  // Custom hook to update map view based on coordinates
  const UpdateMapView = ({ coords }) => {
    const map = useMap();
    map.setView(coords, 13); // Set map view to specified coordinates with zoom level 13
    return null; // Return null as no UI needs to be rendered by this hook
  };

  useEffect(() => {
    const geocodeAddress = async (address) => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates([parseFloat(lat), parseFloat(lon)]);
      }
    };

    const address = `${propertyDetails.address}, ${propertyDetails.city}, ${propertyDetails.country}`;
    if (address.trim() !== ", , ") {
      geocodeAddress(address);
    }
  }, [propertyDetails.address, propertyDetails.city, propertyDetails.country]);

  if (!opened) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h2>Add Property</h2>
          <div>
            <label>Country</label>
            <input
              type="text"
              value={propertyDetails.country}
              onChange={(e) =>
                setPropertyDetails({ ...propertyDetails, country: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>City</label>
            <input
              type="text"
              value={propertyDetails.city}
              onChange={(e) =>
                setPropertyDetails({ ...propertyDetails, city: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              value={propertyDetails.address}
              onChange={(e) =>
                setPropertyDetails({ ...propertyDetails, address: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={propertyDetails.title}
              onChange={(e) =>
                setPropertyDetails({ ...propertyDetails, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={propertyDetails.description}
              onChange={(e) =>
                setPropertyDetails({ ...propertyDetails, description: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              value={propertyDetails.price}
              onChange={(e) =>
                setPropertyDetails({ ...propertyDetails, price: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>No of Bedrooms</label>
            <input
              type="number"
              value={propertyDetails.facilities.bedrooms}
              onChange={(e) =>
                setPropertyDetails({
                  ...propertyDetails,
                  facilities: {
                    ...propertyDetails.facilities,
                    bedrooms: e.target.value,
                  },
                })
              }
              required
            />
          </div>
          <div>
            <label>No of Parkings</label>
            <input
              type="number"
              value={propertyDetails.facilities.parkings}
              onChange={(e) =>
                setPropertyDetails({
                  ...propertyDetails,
                  facilities: {
                    ...propertyDetails.facilities,
                    parkings: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label>No of Bathrooms</label>
            <input
              type="number"
              value={propertyDetails.facilities.bathrooms}
              onChange={(e) =>
                setPropertyDetails({
                  ...propertyDetails,
                  facilities: {
                    ...propertyDetails.facilities,
                    bathrooms: e.target.value,
                  },
                })
              }
              required
            />
          </div>
          <div>
            <label>Image Upload</label>
            <div
              className="uploadZone"
              onClick={() => widgetRef.current?.open()}
              style={{ border: "1px dashed grey", padding: "10px", cursor: "pointer" }}
            >
              {imageURL ? (
                <img src={imageURL} alt="Uploaded" style={{ width: "100px" }} />
              ) : (
                "Click to upload"
              )}
            </div>
          </div>
          <div>
            <label>Location</label>
            <MapContainer
              center={coordinates}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <UpdateMapView coords={coordinates} /> {/* Update map view based on coordinates */}
              <Marker position={coordinates}></Marker>
            </MapContainer>
          </div>
          <div>
            <button type="button" onClick={() => setOpened(false)}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;
