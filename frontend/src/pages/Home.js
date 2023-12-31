import React, {useEffect, useState} from 'react';
import axios from 'axios';


const Home = () => {

  const [hello, setHello] = useState('')

  useEffect(() => {
    axios.get('http://13.125.206.131:8080/api/hello')
      .then(response => setHello(response.data))
      .catch(error => console.log(error))
  }, []);

  return (
    <div>
        백엔드에서 가져온 데이터!!!! : {hello}
    </div>
  );
}

export default Home;