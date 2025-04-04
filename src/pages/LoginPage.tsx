import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import * as styles from "./AuthPage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast.success("로그인에 성공했습니다");
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleClickRegister = () => {
    navigate("/register");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <h1 className={styles.authFormTitle}>Login</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.authFormInput}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.authFormInput}
        required
      />
      <button
        type="submit"
        className={styles.authFormBtn}
        disabled={!email && !password}
      >
        로그인
      </button>
      <button
        type="button"
        onClick={handleClickRegister}
        className={styles.secondaryBtn}
      >
        회원가입 하기
      </button>
    </form>
  );
}
