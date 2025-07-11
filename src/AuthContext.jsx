import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";
const PASSWORD = "password";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(); //Stores token. norm: state, setState = useState
  const [location, setLocation] = useState("GATE"); // Track user location in the app

  /* 1)signup func takes in a username to send to the POST 
  /signup endpoint and set the location to "TABLET" */
  async function signup(username) {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, // from inpt
          password: PASSWORD,
        }),
      });
      const result = await response.json();
      console.log("Signup:", result);

      /*Check the success property in API and
  "if result success is true {
  save the token in react state and
  update location to 'tablet'/ show the next screen 
  OR ELSE,
  give a error message"
  */
      if (result.success) {
        setToken(result.token);
        setLocation("TABLET");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }

  //********************************from index */
  /*B) Sends a GET request to /authenticate.
Attaches the token in the header using Bearer <token> format.
*/
  async function authenticate() {
    try {
      const response = await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        setLocation("TUNNEL"); // Move to final scene
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const value = {
    location,
    signup,
    authenticate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
