const GetContent = require("./GetContent.js");
const fs = require("fs");
const { Parser } = require("json2csv");

var instance = "c25";
var agent_id = "1384";
var access_token = "**Your**Token**";
var start_date = "09/07/2024";
var end_date = "10/07/2024";

async function test() {
  let GetContent_resp = "";
  GetContent_resp = await GetContent("1", instance, agent_id, access_token, start_date, end_date);
  // console.log("\n GetFiles_resp: ", GetFiles_resp);
  if (GetContent_resp === "failed") {
    console.log("\n GetContent_resp failed");
    return false;
  }
  var all_GetContent_resp = [];
  all_GetContent_resp = GetContent_resp.content;

  if (GetContent_resp.page > 1) {
    for (let i = 2; i <= GetContent_resp.page; i++) {
      GetContent_resp = await GetContent(i, instance, agent_id, access_token, start_date, end_date);
      // console.log("\n GetFiles_resp2: ", GetFiles_resp);
      if (GetContent_resp === "failed") {
        console.log("\n GetContent_resp failed");
        return false;
      } else {
        GetContent_resp.content.forEach((element) => {
          all_GetContent_resp.push(element);
        });
      }
    }
  }
  //   console.log("all_GetContent_resp2: ", all_GetContent_resp);
  let GetContent_respfiltered = all_GetContent_resp.filter((item) => item.message_properties.length > 0);
  //   console.log("\n GetContent_respfiltered", GetContent_respfiltered);

  let csv_content = [];

  GetContent_respfiltered.forEach((item) => {
    if (item.message_properties.length > 1) {
      item.message_properties.forEach((prop) => {
        let [document_name, document_url] = prop.value.split("|");
        let result = {
          user_id: item.id,
          user_name: `${item.user.custom_properties.first_name} ${item.user.custom_properties.last_name}`,
          timestamp: item.created_at,
          user_query: item.user_query,
          tag: item.tags[0].name,
          document_name: document_name,
          document_url: document_url,
        };
        csv_content.push(result);
      });
    } else {
      let [document_name, document_url] = item.message_properties[0].value.split("|");
      let result = {
        user_id: item.id,
        user_name: `${item.user.custom_properties.first_name} ${item.user.custom_properties.last_name}`,
        timestamp: item.created_at,
        user_query: item.user_query,
        tag: item.tags[0].name,
        document_name: document_name,
        document_url: document_url,
      };
      csv_content.push(result);
    }
  });
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
test();
