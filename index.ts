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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
// here is an alternative to the above function
// function encodeRFC5987ValueChars2(str) {
//   return encodeURIComponent(str).
//     // Note that although RFC3986 reserves "!", RFC5987 does not,
//     // so we do not need to escape it
//     replace(/['()*]/g, c => "%" + c.charCodeAt(0).toString(16)). // i.e., %27 %28 %29 %2a (Note that valid encoding of "*" is %2A
//                                                                  // which necessitates calling toUpperCase() to properly encode)
//     // The following are not required for percent-encoding per RFC5987,
//     // so we can allow for a little better readability over the wire: |`^
//     replace(/%(7C|60|5E)/g, (str, hex) => String.fromCharCode(parseInt(hex, 16)));
// }