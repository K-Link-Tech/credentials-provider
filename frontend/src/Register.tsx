import React, { useRef, useState, useEffect } from "react";
import { FaInfoCircle, FaCheck, FaTimes } from "react-icons/fa";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_\s]{1,150}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,50}$/;

const Register = () => {
  const userRef: React.RefObject<HTMLInputElement> = React.createRef();
  const pwdRef: React.RefObject<HTMLInputElement> = React.createRef();
  const confirmPwdRef: React.RefObject<HTMLInputElement> = React.createRef();
  const errRef: React.RefObject<HTMLInputElement> = React.createRef();

  const [user, setUser] = useState("");
  const [isValidName, setIsValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [isValidPwd, setIsValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [isValidMatch, setIsValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setIsValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setIsValidPwd(PASSWORD_REGEX.test(pwd));
  }, [pwd]);

  useEffect(() => {
    setIsValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Register</h1>
      <form>
        {/* Username */}
        <label htmlFor="username">
          Username:
          <FaCheck
            className={isValidName ? "valid" : "hide"}
            style={{ color: "green" }}
          />
          <FaTimes
            className={!isValidName && user ? "invalid" : "hide"}
            style={{ color: "red" }}
          />
        </label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
          aria-invalid={!isValidName}
          aria-describedby="uidnote"
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
        />
        {/* Instructions for Username */}
        <p
          id="uidnote"
          className={userFocus && user && !isValidName ? "instructions" : "offscreen"}
        >
          <FaInfoCircle style={{ color: "red" }} />
          2 to 150 characters.
          <br />
          Must begin with a letter.
          <br />
          Only letters, numbers, underscores, hyphens, and spaces allowed.
        </p>

        {/* Password */}
        <label htmlFor="password">
          Password:
          <FaCheck
            className={isValidPwd ? "valid" : "hide"}
            style={{ color: "green" }}
          />
          <FaTimes
            className={!isValidPwd && pwd ? "invalid" : "hide"}
            style={{ color: "red" }}
          />
        </label>
        <input
          type="password"
          id="password"
          ref={pwdRef}
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
          aria-invalid={!isValidPwd}
          aria-describedby="pwdnote"
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />
        {/* Instructions for Password */}
        <p
          id="pwdnote"
          className={pwdFocus && !isValidPwd ? "instructions" : "offscreen"}
        >
          <FaInfoCircle />
          8 to 50 characters.
          <br />
          Must include uppercase and lowercase letters, a number, and a special
          character.
          <br />
          Allowed special characters: ! @ # $ % ^ & *
        </p>

        {/* Confirm Password */}
        <label htmlFor="confirm_pwd">
          Confirm Password:
          <FaCheck className={isValidMatch && matchPwd ? "valid" : "hide"} />
          <FaTimes className={!isValidMatch && matchPwd ? "invalid" : "hide"} />
        </label>
        <input
          type="password"
          id="confirm_pwd"
          ref={confirmPwdRef}
          onChange={(e) => setMatchPwd(e.target.value)}
          required
          aria-invalid={!isValidMatch}
          aria-describedby="confirmnote"
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />
        {/* Instructions for Confirm Password */}
        <p
          id="confirmnote"
          className={matchFocus && !isValidMatch ? "instructions" : "offscreen"}
        >
          <FaInfoCircle />
          Must match the first password input field!
        </p>
      </form>
    </section>
  );
};

export default Register;
