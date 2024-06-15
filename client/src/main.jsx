import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider>

    <Auth0Provider
      domain="dev-ile5meo27a1tql5b.us.auth0.com"
      clientId="GV6sQ6iyTIVS91b1SPBQ30LE9izAxCeV"
      authorizationParams={{
        redirect_uri:"http://localhost:5173"
      }}
      audience="http://localhost:8000"
      scope="openid profile email"
>
        <App />
    </Auth0Provider>
    </MantineProvider>

  </React.StrictMode>
);
