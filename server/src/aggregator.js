const dboo = require("dboo");
const lists = require('./lists.js');
const snowball = require('node-snowball');
const fs = require('fs');

class Config {
  languages = [];
  categoryUnknown = null;
  constructor(unknown = null) {
    this.languages = [];
    this.categoryUnknown = unknown;
  }
}

dboo.class(Config, [
  {"languages":dboo.array(dboo.string)},
  {"categoryUnknown": lists.Category}
  ]);

class Word extends lists.ItemType {
  translations = [];
  stems = [];
  constructor(translations = [], languages = []) {
    super();
    this.translations = translations;
    this.stems = [];
    for (let i = 0; i < translations.length; ++i) {
      if (languages[i] && languages[i].trim().length > 0) {
        this.stems.push( snowball.stemword(translations[i], languages[i]));
      }
    }
  }
  title(langIx)  {
    if (langIx < this.translations.length) {
        return this.translations[langIx];
    }
    return this.translations[0];
  }
};

dboo.class(Word, lists.ItemType, [
  {"translations":dboo.array(dboo.string)},
  {"stems":dboo.array(dboo.string)}
  ]);

class WordCategory extends lists.Category {
  words = [];
  languages = [];
  constructor(name = "", lang = []) {
    super(name);
    this.words = [];
    this.languages = lang;
  }
};

dboo.class(WordCategory, lists.Category, [
  {"words":dboo.array(Word)},
  {"languages":dboo.array(dboo.string)}
  ]);

let cfg = null;

function init(odb) {
  let cfgs = [];
  odb.query(cfgs, "select<Config>()");
  if (cfgs.length > 0) {
    cfg = cfgs[0];
  } else {
    cfg = new Config();
    cfg.languages = [];
    odb.commit(cfg);
  }
  if (!cfg.categoryUnknown) {
    cfg.categoryUnknown = new WordCategory("Other");
    odb.commit(cfg);
  }
}

function languageIx(language) {
  // Just use first part of locale string (i.e. en of en_GB)
  language = language.split(/-_:;,.\\s/)[0];
  let langIx = 0;
  if (cfg) {
    langIx = cfg.languages.indexOf(language);
    if (langIx == -1) {
      langIx = 0;
    }
  }
  return langIx;
}

function findCategory(odb, text) {
  let words = text.toLowerCase().split(/\s/);
  
  let dwords = [];
  for (let i = 0; i < words.length - 1; ++i) {
    dwords.push(`${words[i]} ${words[i+1]}`);
  }
  words = words.concat(dwords);
  
  words = words.map(itm => dboo.escape_string(itm));
  let stems = new Set();
  for (let l of cfg.languages) {
    for (let itm of words) {
      stems.add(snowball.stemword(itm, l));
    }
  }
  
  // for (let s of stems) {
  //   console.log(s);
  // }
  if (stems.size > 0) {
    let qar = '{';
    for (let w of stems) {
      if (qar.length > 1) qar = qar + ", "
      qar = qar + "'" + w + "'";
    }
    qar = qar + '}';
  
    let wordQuery = `select<Word>(in_seq(stems, ${qar}))`;
    let foundWords = [];
    odb.query(foundWords, wordQuery);
    if (foundWords.length == 0) {
      return undefined;
    }
    foundWords.sort(function (a, b) {
      return b.length - a.length;
    });
    let wordId = odb.objectid(foundWords[0]);
    let catQuery = `select<WordCategory>(in_seq(words, {'${wordId}'}))`;
    let categories = [];
    odb.query(categories, catQuery);
  
    if (categories.length > 0) {
      return [foundWords[0], categories[0]];
    }
  }  return undefined;
}

function mapItem(odb, item) {
  let wordAndCat = findCategory(odb, item.summary);
  if (wordAndCat) {
    item.itemType = wordAndCat[0];
    item.category = wordAndCat[1];
  } else {
    item.category = cfg.categoryUnknown;
  }
  
  return item;
}

function mapAllItems(odb, shoppinglist) {
  for (let itm of shoppinglist.items) {
    mapItem(odb, itm);
  }
}


function initData(odb, folder) {
  // These erase should work, but there is a bug with node version that causes a crash
  odb.query("erase<Word>()");
  odb.query("erase<WordCategory>()");
  odb.query("erase<Config>()");
  init(odb);
  let allLanguages = new Set();
  for (let l of cfg.languages) {
    allLanguages.add(l);
  }
  fs.readdirSync(folder).forEach(file => {
    console.log(file);
    let text = fs.readFileSync(`${folder}/${file}`, "utf-8");
    let textByLine = text.split("\n");
    
    let langLine = textByLine[1].replace(/^{/, '').replace(/}$/, '');
    console.log(langLine);
    let languages = langLine.split(",");
    console.log(languages);
    for (let l of languages) {
      if (l && l.trim().length > 0) {
        let ltrimmed = l.trim();
        if (!allLanguages.has(ltrimmed)) {
          allLanguages.add(ltrimmed);
          cfg.languages = Array.from(allLanguages);
        }
      }
    }
    
    let cat = new WordCategory(textByLine[0], cfg.languages);
    for (let i = 2; i < textByLine.length; ++i) {
      let tr = textByLine[i].split(",");
      if (tr.length > 0) {
        let w = tr.map(w => w.trim().toLowerCase());
        cat.words.push(new Word(w, cfg.languages));
      }
    }
    console.log(cat);
    odb.commit(cat);
  });
  // This erase should work, but there is a bug with node version that causes a crash
  odb.query("erase<Config>()");
  odb.commit(cfg);
}



exports.Config=Config
exports.Word=Word
exports.WordCategory=WordCategory
exports.mapAllItems=mapAllItems
exports.init=init
exports.initData=initData
exports.languageIx=languageIx
