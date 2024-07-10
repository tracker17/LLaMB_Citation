const GetContent = require("./GetContent.js");
const fs = require("fs");
const { Parser } = require("json2csv");

const instance = "c25";
const agent_id = "1384";
const access_token = "933efe7bfb404c0a9df50a09b8904c4e";

async function fetchAllContent() {
  let GetContent_resp = await GetContent("1", instance, agent_id, access_token);
  if (GetContent_resp === "failed") {
    console.log("\n GetContent_resp failed");
    return [];
  }
  let all_GetContent_resp = [...GetContent_resp.content];
  for (let i = 2; i <= GetContent_resp.page; i++) {
    GetContent_resp = await GetContent(i, instance, agent_id, access_token);
    if (GetContent_resp === "failed") {
      console.log("\n GetContent_resp failed");
      return all_GetContent_resp;
    }
    all_GetContent_resp = [...all_GetContent_resp, ...GetContent_resp.content];
  }
  return all_GetContent_resp;
}

async function processContent() {
  const all_GetContent_resp = await fetchAllContent();
  const GetContent_respfiltered = all_GetContent_resp.filter((item) => item.message_properties.length > 0);

  const csv_content = GetContent_respfiltered.flatMap((item) =>
    item.message_properties.map((prop) => {
      const [document_name, document_url] = prop.value.split("|");
      return {
        user_id: item.id,
        user_name: `${item.user.custom_properties.first_name} ${item.user.custom_properties.last_name}`,
        timestamp: item.created_at,
        user_query: item.user_query,
        tag: item.tags[0].name,
        document_name,
        document_url,
      };
    })
  );
  console.log(csv_content);

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(csv_content);

  fs.writeFile("output.csv", csv, (err) => {
    if (err) {
      console.error("Error writing to CSV file", err);
    } else {
      console.log("CSV file has been written successfully");
    }
  });
}

processContent();
