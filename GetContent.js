const GetContent = async (page, instance, agent_id, access_token) => {
  //   let url = `https://c25.avaamo.com/api/v1/agents/1100/query_insights.json?per_page=100&page=&utc_offset=19800&start_date=01/07/2024&end_date=09/07/2024`;
  let url = `https://${instance}.avaamo.com/api/v1/agents/${agent_id}/query_insights.json?per_page=100&page=${page}&utc_offset=19800&start_date=09/07/2024&end_date=10/07/2024`;
  let args = {
      method: "GET",
      headers: {
        "Access-Token": access_token,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    },
    jsonResponse = await fetch(url, args)
      .then((res) => {
        // console.log("\n updateAttributes res :",res)
        console.log("\n GetFiles res.status :", res.status);
        if (res.status == 200) {
          return res.json();
        } else return "failed";
      })
      .then((json) => {
        // console.log("\n GetFiles Response : \n", json);
        if (json === "failed") return "failed";
        // else return json.files;
        else
          return {
            page: json.total_pages,
            content: json.queries,
          };
      })
      .catch((err) => {
        console.log("\nError", err);
        return "failed";
      });
  //   console.log("\n jsonResponse: ", jsonResponse);
  return jsonResponse;
};
// console.log(GetContent());

module.exports = GetContent;
