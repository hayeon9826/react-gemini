import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

export default function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("비밀번호는 8자리 이상 입력해주세요");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast("회원가입에 성공했습니다");
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>회원가입</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호 (최소 8자리)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">회원가입</button>
    </form>
  );
}
