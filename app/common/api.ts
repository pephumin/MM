export const configAPI = {
  apiUrl: "https://siamsquare.org.uk/",
  appKey: "",
  // appUserHeader: "Basic a2lkX0h5SG9UX1JFZjo1MTkxMDJlZWFhMzQ0MzMyODFjN2MyODM3MGQ5OTIzMQ"
};


async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
    const data = await response.json();
    console.log("Data received:", data);
    return data;
  } 
  catch (error) { console.error("Fetch failed:", error); }
}

// Example usage:
const validUrl = "https://www.siamsquare.org.uk/data";
const invalidUrl = "https://api.example.com/nonexistent";

fetchData(validUrl); // Successful API call
fetchData(invalidUrl); // Will enter the catch b
