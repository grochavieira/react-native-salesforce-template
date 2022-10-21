export function stringEscape(VAR_string) {
  if (VAR_string == null || VAR_string == 'null') {
    return '';
  }
  return (typeof VAR_string == 'string' ?
    VAR_string.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
        case "\0":
            return "\\0";
        case "\x08":
            return "\\b";
        case "\x09":
            return "\\t";
        case "\x1a":
            return "\\z";
        case "\n":
            return "\\n";
        case "\r":
            return "\\r";
        case "'":
            return "''";
        case "\"":
        case "\\":
        case "%":
            return "";
      }
    }) : VAR_string
  );
}

// método para converter os resultados do banco de dados em um vetor
export function extractArrayFromDBResult(rows: any) {
  var arrayE = [];
  for (var m = 0; m < rows.length; m++) {
    arrayE.push(rows.item(m));
  }
  return arrayE;
};