import axios from "axios";
import React, { useEffect, useState } from "react";

const User = ({userData}) => {
  return (
    <tr>
      <td>{userData.email}</td>
      <td>{userData.name}</td>
    </tr>
  )
}

const UserList = () => {
  const [users, setUser] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/members');
      const Info = response.data.map((user) => {
        return {
          email: user.memberEmail,
          name: user.memberName,
        };
      });
      setUser(Info);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>이메일</th>
          <th>이름</th>
        </tr>
      </thead>
      <tbody>
        {users &&
          users.map(user => <User userData={user} />)}
      </tbody>
    </table>
  );
}

export default UserList;