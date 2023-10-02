import React from "react";
import { FaInfoCircle, FaCheck, FaTimes } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";

const USER_REGEX: RegExp = /^[a-zA-Z][a-zA-Z0-9-_\s]{1,150}$/;
const PASSWORD_REGEX: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,50}$/;

const Register: React.FC = () => {
  const userRef: React.RefObject<HTMLInputElement> = React.createRef();
  const errRef: React.RefObject<HTMLInputElement> = React.createRef();

  const [user, setUser] = useState("");
  const [isValidName, setIsValidName] = useState(false);
  const [isUserFocused, setIsUserFocused] = useState(false);

  const [pwd, setPwd] = useState("");
  const [isValidPwd, setIsValidPwd] = useState(false);
  const [isPwdFocused, setIsPwdFocused] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [isValidMatch, setIsValidMatch] = useState(false);
  const [isMatchFocused, setIsMatchFocused] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    userRef.current?.focus();
  });

  useEffect(() => {
    setIsValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setIsValidPwd(PASSWORD_REGEX.test(pwd));
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
        <label htmlFor="username">
          Username:
          <FaCheck
            className={isValidName ? "valid" : "hide"}
            style={{ color: "green" }}
          />
          <FaTimes
            className={isValidName || !user ? "hide" : "invalid"}
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
          aria-invalid={isValidName ? "false" : "true"}
          aria-describedby="uidnote"
          onFocus={() => setIsUserFocused(true)}
          onBlur={() => setIsUserFocused(false)}
        />
        <p
          id="uidnote"
          className={
            isUserFocused && user && !isValidName ? "instructions" : "offscreen"
          }
        >
          <FaInfoCircle style={{ color: "red" }} />
          2 to 150 characters.
          <br />
          Must begin with a letter.
          <br />
          Only letters, numbers, underscores, hyphens and spaces allowed.
        </p>

        <label htmlFor="password">
          Password:
          <FaCheck
            className={isValidPwd ? "valid" : "hide"}
            style={{ color: "green" }}
          />
          <FaTimes
            className={isValidPwd || !pwd ? "hide" : "invalid"}
            style={{ color: "red" }}
          />
        </label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
          aria-invalid={isValidPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          onFocus={() => setIsPwdFocused(true)}
          onBlur={() => setIsPwdFocused(false)}
        />
        <p
          id="pwdnote"
          className={isPwdFocused && !isValidPwd ? "instructions" : "offscreen"}
        >
          <FaInfoCircle />
          8 to 50 characters.
          <br />
          Must include uppercase and lowercase letters, a number and a special
          character.
          <br />
          Allowed special characters:
          <span aria-label="exclamation mark">!</span>
          <span aria-label="at symbol">@</span>
          <span aria-label="hashtag">#</span>
          <span aria-label="dollar sign">$</span>
          <span aria-label="percent">%</span>
        </p>
      </form>
    </section>
  );
};

export default Register;
