function replaceQueryString(string) {
  var arr = string.split("");
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == "'") {
      arr.splice(i, 0, "'");
      i++;
    }
  }
  return arr.join("");
}

module.exports = { replaceQueryString };
