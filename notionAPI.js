const axios = require("axios");
require("dotenv").config();

async function getNotionData() {
  const notionToken = "secret_iiz4IxI5UAryijWmKj8hjyQp8g0sgNGVhRQqfJWmycj";
  const databaseId = "6535660468a342eb9b30dda6ee045059";

  const headers = {
    Authorization: `Bearer ${notionToken}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  };

  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {}, // empty body for the POST request
      { headers: headers }
    );

    console.log("response", response);
  } catch (error) {
    console.error(
      `Failed to fetch data from Notion: ${
        error.response?.data || error.message
      }`
    );
    throw error;
  }
}

// Use the function
getNotionData()
  .then((restaurants) => {
    console.log(restaurants);
  })
  .catch((error) => {
    console.error(error);
  });

// const { Client } = require("@notionhq/client");

// // Initializing a client
// const notion = new Client({
//   auth: "secret_NwbIYVS9gGApRUXvbCqKpnUSKiX9MtD4Wk7uOc4p0pn",
// });

// const getUsers = async () => {
//   const listUsersResponse = await notion.users.list({});
// };
