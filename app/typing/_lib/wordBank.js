export const COMMON_WORDS = [
  "the","of","and","to","in","is","you","that","it","he","was","for","on",
  "are","as","with","his","they","at","be","this","from","we","can","had",
  "have","what","were","there","use","each","which","she","do","how","their",
  "if","will","up","other","about","out","many","then","them","these","so",
  "some","her","would","make","like","him","into","time","has","look","two",
  "more","write","go","see","number","no","way","could","people","my","than",
  "first","water","been","call","who","oil","its","now","find","long","down",
  "day","did","get","come","made","may","part","over","new","sound","take",
  "only","little","work","know","place","year","live","me","back","give",
  "most","very","after","thing","our","just","name","good","sentence","man",
  "think","say","great","where","help","through","much","before","line",
  "right","too","mean","old","any","same","tell","boy","follow","came",
  "want","show","also","around","form","three","small","set","put","end",
  "why","again","turn","here","off","went","need","should","home","big",
  "high","every","near","add","food","between","own","below","country",
  "plant","last","school","father","keep","tree","never","start","city",
  "earth","eye","light","thought","head","under","story","saw","left",
  "few","while","along","might","close","something","seem","next","hard",
  "open","example","begin","life","always","those","both","paper","together",
  "got","group","often","run","important","until","children","side","feet",
];

export function generateWordSequence(count) {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
  }
  return words;
}
