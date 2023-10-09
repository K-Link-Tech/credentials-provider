import React, { useState } from "react";
import axios from "../api/axios";
import RegisterForm from "../components/RegisterForm";
import { useErrorBoundary } from "react-error-boundary";

interface INewUserPayload {
  error: boolean;
  username?: string;
  password?: string;
  errorMessage?: string;
}

const REGISTER_URL = "/register";

const Register: React.FC = () => {
  const AddUserHandler = async (newUserPayload: INewUserPayload) => {
    const { showBoundary } = useErrorBoundary();
    // TODO: add REST API call and update database
      // throw new Error("Invalid username and/or password entry!");
    await axios
      .post(
        REGISTER_URL,
        JSON.stringify({
          user: newUserPayload.username,
          password: newUserPayload.password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((r) => {
        console.log(r);
      })
      .catch((error) => {
        showBoundary(error);
      });
  };

  return (
    <section>
      <RegisterForm onRegisterNewUser={AddUserHandler} />
    </section>
  );
};

export default Register;
