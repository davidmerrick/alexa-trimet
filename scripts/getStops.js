import axios from 'axios'

const TRIMET_API_KEY = process.env.TRIMET_API_KEY || "foo"; // TriMet API doesn't actually enforce the API key

let url = `https://developer.trimet.org/ws/V1/routeConfig?appId=${TRIMET_API_KEY}&json=true`;
async function getRoutes() {
    let response = await axios.get(url);
    let data = response.data;
    let resultSet = data.resultSet;
    resultSet.route.forEach(item => {
        console.log(item.route);
    });
};

getRoutes();