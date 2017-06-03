import axios from 'axios'

const TRIMET_API_KEY = process.env.TRIMET_API_KEY || "foo"; // TriMet API doesn't actually enforce the API key

const PORTLAND_LATLONG= "45.5423504,-122.7948456";
const MIN_LATLONG = "45.3606891,-122.8569389";
const MAX_LATLONG = "45.5590078,-122.1775599";

let url = `https://developer.trimet.org/ws/V1/stops?appId=${TRIMET_API_KEY}&json=true&ll=${PORTLAND_LATLONG}&bb=${MIN_LATLONG},${MAX_LATLONG}&feet=100000`;
async function getStops() {
    let response = await axios.get(url);
    let data = response.data;
    let resultSet = data.resultSet;
    resultSet.location.forEach(item => {
        console.log(item.locid);
    });
};

getStops();