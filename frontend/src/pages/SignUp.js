import axios from "axios";
import React, { useState } from "react";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    password: ""
  });

  const { email, name, password } = inputs;

  const onChange = (e) => {
    const value = e.target.value;
    const id = e.target.id;
    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    singupUser();
  }
  
  const singupUser = async () => {
    try {
      const response = await axios.post('http://43.201.78.190:8080/api/signup',
        {
          "memberEmail": email,
          "memberPassword": name,
          "memberName": password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then((response) => {
          window.alert('회원가입완료');
          console.log(response)
      })
    } catch (e) {
      console.log(e);
    }

  }


  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일 : </label>
          <input type="text" id="email" value={email} onChange={onChange}/>
        </div>
        <div>
          <label>이름 : </label>
          <input type="text" id="name" value={name} onChange={onChange}/>
        </div>
        <div>
          <label>비밀번호</label>
          <input type="text" id="password" value={password} onChange={onChange}/>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </>
  )
}

export default SignUp;