const dboo = require('dboo');
let axios = require('axios');
const cheerio = require('cheerio');

function removeFormatting(x) {
  // Remove various html tags that may appear in texts:
  x = x.replace(/<span.*?>/gis, "");
  x = x.replace(/<.*?>/gis, "");
  x = x.replace(/<\/.*?>/gis, "");
  x = x.replace(/<!--/gis, "");
  x = x.replace(/<br>/gis, "");
  x = x.replace(/<br\/>/gis, "");
  x = x.replace(/-->/gis, "");
  // Replace multiple white spaces with one space:
  x = x.replace(/\s+/g, " ");
  // Remove any symbols that are not part of any unicode alphabets
  x = x.replace(/[^\s\p{L}\p{P}\p{N}\p{M}\p{Z}\p{Sm}\p{Sc}_,'"\/()\-+=?&%#@!~.<>;:]+?/guis,"")
  return x;
}

function replaceLn(x) {
  x = x.replace(/\r\n/gis, " ")
  x = x.replace(/\n/gis, " ");
  return x;
}

// textToLine will simply break text up into lines,
// clean out any formatting code and return an array of strings
// Assumes one format in string (i.e. not a mix of <li> and <br/> etc
function textToLineItems(text) {
  // 1. <li></li> items
  let reListItems = /<li.*?>(.*?)<\/li.*?>/gis;
  //items = text.match(reListItems);
  let items = [];
  let res = reListItems.exec(text)
  while (res != null) {
    items.push(res[1]);
    res = reListItems.exec(text);
  }
  // 2. <tr></tr> separated
  if (items.length == 0) {
    let reTableRows = /<tr.*?>(.*?)<\/tr.*?>/gis;
    let res = reTableRows.exec(text)
    while (res != null) {
      items.push(res[1]);
      res = reTableRows.exec(text);
    }
  }
  // 3. <br/> separated
  if (items.length == 0) {
    let reBR = /<br\/>/gis;
    items = text.split(reBR);
  }
  // 3. \cr\lf
  if (items.length == 1) {
    items = text.split("\r\n");
  }
  // 4. \lf
  if (items.length == 1) {
    items = text.split("\n");
  }
  items = items.map(x => removeFormatting(replaceLn(x.toString())).trim());
  items = items.filter(x => x.length > 0);
  return items;
}

class SiteConfig {
  host;
  receiptsEnclosingElement;
  valid;
  confirmed;
  
  constructor(host, enclosingElement) {
    this.host = host;
    this.receiptsEnclosingElement = enclosingElement;
    this.valid = true;
    this.confirmed = false;
  }
};

dboo.class(SiteConfig, [{"host": dboo.string},
  {"receiptsEnclosingElement": dboo.string},
  {"valid": dboo.bool},
  {"confirmed": dboo.bool}
  ]);

class SiteConfigs {
  configs = new Map();
  odb;
  
  constructor(odb) {
    this.odb = odb;
  }
  setODB(odb) {
    this.odb = odb;
  }
  get(hostname) {
    // if (this.configs.has(hostname)) {
    //   return this.configs.get(hostname);
    // }
    let results = [];
    if (this.odb.query(results, "select<SiteConfig>(eq(host, '" + hostname + "'))") == 1) {
      this.configs.set(hostname, results[0]);
      return this.configs.get(hostname);
    }
    let sc = new SiteConfig(hostname, "");
    sc.valid = false;
    this.odb.commit(sc);
    return sc;
  }
  markInvalid(sc) {
    sc.valid = false;
    this.odb.commit(sc);
  }
  set(cfg) {
    let results = [];
    this.odb.query(results, "select<SiteConfig>(eq(host, '" + cfg.host + "'))");
    if (results.length == 1) {
      results[0].receiptsEnclosingElement = cfg.receiptsEnclosingElement;
      results[0].valid = true;
      this.odb.commit(results[0]);
      this.configs.set(results[0].host, results[0]);
    } else {
      this.odb.commit(cfg);
      this.configs.set(cfg.host, cfg);
    }
  }
  init(cfg) {
    let results = [];
    this.odb.query(results, "select<SiteConfig>(eq(host, '" + cfg.host + "'))");
    if (results.length == 1) {
      return;
    }
    this.odb.commit(cfg);
    this.configs.set(cfg.host, cfg);
  }
};

let siteConfigs = new SiteConfigs();
function init(odb) {
  siteConfigs.setODB(odb);
  siteConfigs.set(new SiteConfig("www.coop.se", "div[class=IngredientList]"));
  siteConfigs.set(new SiteConfig("www.ica.se", "div[id=ingredients-section]"));
  siteConfigs.set(new SiteConfig("www.jamieoliver.com", "div[class=recipe-ingredients]"));
  siteConfigs.set(new SiteConfig("www.bbcgoodfood.com", ".recipe-template__ingredients"));
  siteConfigs.set(new SiteConfig("www.citygross.se", ".c-recipe-details__ingredients"));
  // recepten.se requires looping of found group:
  siteConfigs.set(new SiteConfig("www.recepten.se", ".ingredients"));
  siteConfigs.set(new SiteConfig("www.koket.se", ".ingredients_wrapper__sCru5"));
  siteConfigs.set(new SiteConfig("www.kungsornen.se", ".ingredients-list"));
  
  // includes some kind of label character:
  siteConfigs.set(new SiteConfig("www.vegrecipesofindia.com", ".wprm-recipe-ingredients-container"));
  
  // arla is not straight forward, need to read from json inside script tag
  siteConfigs.set(new SiteConfig("www.kidspot.com.au", "div[class=recipe-ingredients-section]"));
  siteConfigs.set(new SiteConfig("www.sbs.com.au", "div[class=field-name-field-ingredients]"));
  siteConfigs.set(new SiteConfig("www.foodfolder.se", "div[class=ingredients]"));
  siteConfigs.set(new SiteConfig("www.feastingathome.com", "div[class=tasty-recipes-ingredients]"));
  siteConfigs.set(new SiteConfig("www.healthyfitnessmeals.com", "div[class=wprm-recipe-ingredients-container]"));
}

function isURL(text) {
  let re = /^(http|https):\/\//;
  return re.test(text);
}
function getHostname(url) {
  var matches = url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
  var domain = matches && matches[1];
  return domain;
}
function parseText(text, handler) {
  if (text.includes(":")) {
    if (isURL(text)) {
      axios.get(text)
        .then(function (response) {
          const root = cheerio.load(response.data, {decodeEntities: false});
          let host = getHostname(text);
          let config = siteConfigs.get(host);
          if (config != null && config.valid) {
            let parsedData = root(config.receiptsEnclosingElement).html();
            if (parsedData != null) {
              handler(textToLineItems(parsedData));
            } else {
              handler(["No data in fetch for:", text]);
            }
          } else {
            handler(["No parser for: " + host, text]);
          }
        })
        .catch(function (error) {
          handler(["Error processing: " + text, error.toString()]);
        });
      return;
    } else if (text.indexOf("parser:") == 0) {
      // Add a new parser
      let parts = text.split(":");
      if (parts.length > 2) {
        let host = parts[1];
        if (host) {
          let filter = text.substr(8 + host.length);
          siteConfigs.set(new SiteConfig(host, filter));
          handler(["Parser for " + host + " added: '" + filter + "'"]);
          return;
        }
      }
    }
  }
  handler(textToLineItems(text));
}

exports.init = init;
exports.parse = parseText;
exports.SiteConfig = SiteConfig;
