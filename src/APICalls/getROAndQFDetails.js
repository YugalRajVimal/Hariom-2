import axios from "axios";

const getROAndQFDetails = async (roId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/get-ro-and-qf-details/${roId}`,
      { headers: { Authorization: `${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

export default getROAndQFDetails;



