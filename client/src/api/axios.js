import axios from "axios";
 
const instancia = axios.create({
  baseURL:'https://restaurante-6.onrender.com',
  withCredentials: true
})

export default instancia
