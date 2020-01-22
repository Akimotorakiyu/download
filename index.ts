import * as http from "http";

const data = [
  ["name", "age"],
  ["Jack", "16"],
  ["Alice", "14"]
];

const csvData = data
  .map(ele => {
    return ele.join(",");
  })
  .join("\n");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=data.csv");

  res.write(csvData);
  res.end();
});

server.listen(3000, () => {
  console.log(server.address());
});
