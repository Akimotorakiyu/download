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
/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 * @param str 
 */
function encodeRFC5987ValueChars(str) {
  return (
    encodeURIComponent(str)
      // 注意，仅管 RFC3986 保留 "!"，但 RFC5987 并没有
      // 所以我们并不需要过滤它
      .replace(/['()]/g, escape) // i.e., %27 %28 %29
      .replace(/\*/g, "%2A")
      // 下面的并不是 RFC5987 中 URI 编码必须的
      // 所以对于 |`^ 这3个字符我们可以稍稍提高一点可读性
      .replace(/%(?:7C|60|5E)/g, unescape)
  );
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 * @param str 
 */
function makeDispositionFileNameField(fileName: string) {
  return `filename*=UTF-8''${encodeRFC5987ValueChars(fileName)}`;
}

const server = http.createServer((req, res) => {
  const fileName = makeDispositionFileNameField("CSV表格.csv");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; ${fileName}`);

  res.write(csvData);
  res.end();
});

server.listen(3000, () => {
  console.log(server.address());
});
