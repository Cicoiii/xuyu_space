definePlugin('@plugins/com.msgbyte.linkmeta', ['@capital/common', 'react', '@capital/component'], (function (common, React, component) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const Translate = {
    linkmetaService: common.localTrans({
      "zh-CN": "Url\u5143\u6570\u636E\u670D\u52A1",
      "en-US": "Link Meta Service"
    })
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  const word = '[a-fA-F\\d:]';
  const b = options => options && options.includeBoundaries ?
  	`(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` :
  	'';

  const v4 = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';

  const v6seg = '[a-fA-F\\d]{1,4}';
  const v6 = `
(?:
(?:${v6seg}:){7}(?:${v6seg}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(?::${v6seg}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(?::${v6seg}){0,1}:${v4}|(?::${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(?::${v6seg}){0,2}:${v4}|(?::${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(?::${v6seg}){0,3}:${v4}|(?::${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(?::${v6seg}){0,4}:${v4}|(?::${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

  // Pre-compile only the exact regexes because adding a global flag make regexes stateful
  const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
  const v4exact = new RegExp(`^${v4}$`);
  const v6exact = new RegExp(`^${v6}$`);

  const ip = options => options && options.exact ?
  	v46Exact :
  	new RegExp(`(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(options)})`, 'g');

  ip.v4 = options => options && options.exact ? v4exact : new RegExp(`${b(options)}${v4}${b(options)}`, 'g');
  ip.v6 = options => options && options.exact ? v6exact : new RegExp(`${b(options)}${v6}${b(options)}`, 'g');

  var ipRegex$1 = ip;

  var require$$1 = [
  	"aaa",
  	"aarp",
  	"abarth",
  	"abb",
  	"abbott",
  	"abbvie",
  	"abc",
  	"able",
  	"abogado",
  	"abudhabi",
  	"ac",
  	"academy",
  	"accenture",
  	"accountant",
  	"accountants",
  	"aco",
  	"actor",
  	"ad",
  	"adac",
  	"ads",
  	"adult",
  	"ae",
  	"aeg",
  	"aero",
  	"aetna",
  	"af",
  	"afl",
  	"africa",
  	"ag",
  	"agakhan",
  	"agency",
  	"ai",
  	"aig",
  	"airbus",
  	"airforce",
  	"airtel",
  	"akdn",
  	"al",
  	"alfaromeo",
  	"alibaba",
  	"alipay",
  	"allfinanz",
  	"allstate",
  	"ally",
  	"alsace",
  	"alstom",
  	"am",
  	"amazon",
  	"americanexpress",
  	"americanfamily",
  	"amex",
  	"amfam",
  	"amica",
  	"amsterdam",
  	"analytics",
  	"android",
  	"anquan",
  	"anz",
  	"ao",
  	"aol",
  	"apartments",
  	"app",
  	"apple",
  	"aq",
  	"aquarelle",
  	"ar",
  	"arab",
  	"aramco",
  	"archi",
  	"army",
  	"arpa",
  	"art",
  	"arte",
  	"as",
  	"asda",
  	"asia",
  	"associates",
  	"at",
  	"athleta",
  	"attorney",
  	"au",
  	"auction",
  	"audi",
  	"audible",
  	"audio",
  	"auspost",
  	"author",
  	"auto",
  	"autos",
  	"avianca",
  	"aw",
  	"aws",
  	"ax",
  	"axa",
  	"az",
  	"azure",
  	"ba",
  	"baby",
  	"baidu",
  	"banamex",
  	"bananarepublic",
  	"band",
  	"bank",
  	"bar",
  	"barcelona",
  	"barclaycard",
  	"barclays",
  	"barefoot",
  	"bargains",
  	"baseball",
  	"basketball",
  	"bauhaus",
  	"bayern",
  	"bb",
  	"bbc",
  	"bbt",
  	"bbva",
  	"bcg",
  	"bcn",
  	"bd",
  	"be",
  	"beats",
  	"beauty",
  	"beer",
  	"bentley",
  	"berlin",
  	"best",
  	"bestbuy",
  	"bet",
  	"bf",
  	"bg",
  	"bh",
  	"bharti",
  	"bi",
  	"bible",
  	"bid",
  	"bike",
  	"bing",
  	"bingo",
  	"bio",
  	"biz",
  	"bj",
  	"black",
  	"blackfriday",
  	"blockbuster",
  	"blog",
  	"bloomberg",
  	"blue",
  	"bm",
  	"bms",
  	"bmw",
  	"bn",
  	"bnpparibas",
  	"bo",
  	"boats",
  	"boehringer",
  	"bofa",
  	"bom",
  	"bond",
  	"boo",
  	"book",
  	"booking",
  	"bosch",
  	"bostik",
  	"boston",
  	"bot",
  	"boutique",
  	"box",
  	"br",
  	"bradesco",
  	"bridgestone",
  	"broadway",
  	"broker",
  	"brother",
  	"brussels",
  	"bs",
  	"bt",
  	"bugatti",
  	"build",
  	"builders",
  	"business",
  	"buy",
  	"buzz",
  	"bv",
  	"bw",
  	"by",
  	"bz",
  	"bzh",
  	"ca",
  	"cab",
  	"cafe",
  	"cal",
  	"call",
  	"calvinklein",
  	"cam",
  	"camera",
  	"camp",
  	"cancerresearch",
  	"canon",
  	"capetown",
  	"capital",
  	"capitalone",
  	"car",
  	"caravan",
  	"cards",
  	"care",
  	"career",
  	"careers",
  	"cars",
  	"casa",
  	"case",
  	"cash",
  	"casino",
  	"cat",
  	"catering",
  	"catholic",
  	"cba",
  	"cbn",
  	"cbre",
  	"cbs",
  	"cc",
  	"cd",
  	"center",
  	"ceo",
  	"cern",
  	"cf",
  	"cfa",
  	"cfd",
  	"cg",
  	"ch",
  	"chanel",
  	"channel",
  	"charity",
  	"chase",
  	"chat",
  	"cheap",
  	"chintai",
  	"christmas",
  	"chrome",
  	"church",
  	"ci",
  	"cipriani",
  	"circle",
  	"cisco",
  	"citadel",
  	"citi",
  	"citic",
  	"city",
  	"cityeats",
  	"ck",
  	"cl",
  	"claims",
  	"cleaning",
  	"click",
  	"clinic",
  	"clinique",
  	"clothing",
  	"cloud",
  	"club",
  	"clubmed",
  	"cm",
  	"cn",
  	"co",
  	"coach",
  	"codes",
  	"coffee",
  	"college",
  	"cologne",
  	"com",
  	"comcast",
  	"commbank",
  	"community",
  	"company",
  	"compare",
  	"computer",
  	"comsec",
  	"condos",
  	"construction",
  	"consulting",
  	"contact",
  	"contractors",
  	"cooking",
  	"cookingchannel",
  	"cool",
  	"coop",
  	"corsica",
  	"country",
  	"coupon",
  	"coupons",
  	"courses",
  	"cpa",
  	"cr",
  	"credit",
  	"creditcard",
  	"creditunion",
  	"cricket",
  	"crown",
  	"crs",
  	"cruise",
  	"cruises",
  	"cu",
  	"cuisinella",
  	"cv",
  	"cw",
  	"cx",
  	"cy",
  	"cymru",
  	"cyou",
  	"cz",
  	"dabur",
  	"dad",
  	"dance",
  	"data",
  	"date",
  	"dating",
  	"datsun",
  	"day",
  	"dclk",
  	"dds",
  	"de",
  	"deal",
  	"dealer",
  	"deals",
  	"degree",
  	"delivery",
  	"dell",
  	"deloitte",
  	"delta",
  	"democrat",
  	"dental",
  	"dentist",
  	"desi",
  	"design",
  	"dev",
  	"dhl",
  	"diamonds",
  	"diet",
  	"digital",
  	"direct",
  	"directory",
  	"discount",
  	"discover",
  	"dish",
  	"diy",
  	"dj",
  	"dk",
  	"dm",
  	"dnp",
  	"do",
  	"docs",
  	"doctor",
  	"dog",
  	"domains",
  	"dot",
  	"download",
  	"drive",
  	"dtv",
  	"dubai",
  	"dunlop",
  	"dupont",
  	"durban",
  	"dvag",
  	"dvr",
  	"dz",
  	"earth",
  	"eat",
  	"ec",
  	"eco",
  	"edeka",
  	"edu",
  	"education",
  	"ee",
  	"eg",
  	"email",
  	"emerck",
  	"energy",
  	"engineer",
  	"engineering",
  	"enterprises",
  	"epson",
  	"equipment",
  	"er",
  	"ericsson",
  	"erni",
  	"es",
  	"esq",
  	"estate",
  	"et",
  	"etisalat",
  	"eu",
  	"eurovision",
  	"eus",
  	"events",
  	"exchange",
  	"expert",
  	"exposed",
  	"express",
  	"extraspace",
  	"fage",
  	"fail",
  	"fairwinds",
  	"faith",
  	"family",
  	"fan",
  	"fans",
  	"farm",
  	"farmers",
  	"fashion",
  	"fast",
  	"fedex",
  	"feedback",
  	"ferrari",
  	"ferrero",
  	"fi",
  	"fiat",
  	"fidelity",
  	"fido",
  	"film",
  	"final",
  	"finance",
  	"financial",
  	"fire",
  	"firestone",
  	"firmdale",
  	"fish",
  	"fishing",
  	"fit",
  	"fitness",
  	"fj",
  	"fk",
  	"flickr",
  	"flights",
  	"flir",
  	"florist",
  	"flowers",
  	"fly",
  	"fm",
  	"fo",
  	"foo",
  	"food",
  	"foodnetwork",
  	"football",
  	"ford",
  	"forex",
  	"forsale",
  	"forum",
  	"foundation",
  	"fox",
  	"fr",
  	"free",
  	"fresenius",
  	"frl",
  	"frogans",
  	"frontdoor",
  	"frontier",
  	"ftr",
  	"fujitsu",
  	"fun",
  	"fund",
  	"furniture",
  	"futbol",
  	"fyi",
  	"ga",
  	"gal",
  	"gallery",
  	"gallo",
  	"gallup",
  	"game",
  	"games",
  	"gap",
  	"garden",
  	"gay",
  	"gb",
  	"gbiz",
  	"gd",
  	"gdn",
  	"ge",
  	"gea",
  	"gent",
  	"genting",
  	"george",
  	"gf",
  	"gg",
  	"ggee",
  	"gh",
  	"gi",
  	"gift",
  	"gifts",
  	"gives",
  	"giving",
  	"gl",
  	"glass",
  	"gle",
  	"global",
  	"globo",
  	"gm",
  	"gmail",
  	"gmbh",
  	"gmo",
  	"gmx",
  	"gn",
  	"godaddy",
  	"gold",
  	"goldpoint",
  	"golf",
  	"goo",
  	"goodyear",
  	"goog",
  	"google",
  	"gop",
  	"got",
  	"gov",
  	"gp",
  	"gq",
  	"gr",
  	"grainger",
  	"graphics",
  	"gratis",
  	"green",
  	"gripe",
  	"grocery",
  	"group",
  	"gs",
  	"gt",
  	"gu",
  	"guardian",
  	"gucci",
  	"guge",
  	"guide",
  	"guitars",
  	"guru",
  	"gw",
  	"gy",
  	"hair",
  	"hamburg",
  	"hangout",
  	"haus",
  	"hbo",
  	"hdfc",
  	"hdfcbank",
  	"health",
  	"healthcare",
  	"help",
  	"helsinki",
  	"here",
  	"hermes",
  	"hgtv",
  	"hiphop",
  	"hisamitsu",
  	"hitachi",
  	"hiv",
  	"hk",
  	"hkt",
  	"hm",
  	"hn",
  	"hockey",
  	"holdings",
  	"holiday",
  	"homedepot",
  	"homegoods",
  	"homes",
  	"homesense",
  	"honda",
  	"horse",
  	"hospital",
  	"host",
  	"hosting",
  	"hot",
  	"hoteles",
  	"hotels",
  	"hotmail",
  	"house",
  	"how",
  	"hr",
  	"hsbc",
  	"ht",
  	"hu",
  	"hughes",
  	"hyatt",
  	"hyundai",
  	"ibm",
  	"icbc",
  	"ice",
  	"icu",
  	"id",
  	"ie",
  	"ieee",
  	"ifm",
  	"ikano",
  	"il",
  	"im",
  	"imamat",
  	"imdb",
  	"immo",
  	"immobilien",
  	"in",
  	"inc",
  	"industries",
  	"infiniti",
  	"info",
  	"ing",
  	"ink",
  	"institute",
  	"insurance",
  	"insure",
  	"int",
  	"international",
  	"intuit",
  	"investments",
  	"io",
  	"ipiranga",
  	"iq",
  	"ir",
  	"irish",
  	"is",
  	"ismaili",
  	"ist",
  	"istanbul",
  	"it",
  	"itau",
  	"itv",
  	"jaguar",
  	"java",
  	"jcb",
  	"je",
  	"jeep",
  	"jetzt",
  	"jewelry",
  	"jio",
  	"jll",
  	"jm",
  	"jmp",
  	"jnj",
  	"jo",
  	"jobs",
  	"joburg",
  	"jot",
  	"joy",
  	"jp",
  	"jpmorgan",
  	"jprs",
  	"juegos",
  	"juniper",
  	"kaufen",
  	"kddi",
  	"ke",
  	"kerryhotels",
  	"kerrylogistics",
  	"kerryproperties",
  	"kfh",
  	"kg",
  	"kh",
  	"ki",
  	"kia",
  	"kids",
  	"kim",
  	"kinder",
  	"kindle",
  	"kitchen",
  	"kiwi",
  	"km",
  	"kn",
  	"koeln",
  	"komatsu",
  	"kosher",
  	"kp",
  	"kpmg",
  	"kpn",
  	"kr",
  	"krd",
  	"kred",
  	"kuokgroup",
  	"kw",
  	"ky",
  	"kyoto",
  	"kz",
  	"la",
  	"lacaixa",
  	"lamborghini",
  	"lamer",
  	"lancaster",
  	"lancia",
  	"land",
  	"landrover",
  	"lanxess",
  	"lasalle",
  	"lat",
  	"latino",
  	"latrobe",
  	"law",
  	"lawyer",
  	"lb",
  	"lc",
  	"lds",
  	"lease",
  	"leclerc",
  	"lefrak",
  	"legal",
  	"lego",
  	"lexus",
  	"lgbt",
  	"li",
  	"lidl",
  	"life",
  	"lifeinsurance",
  	"lifestyle",
  	"lighting",
  	"like",
  	"lilly",
  	"limited",
  	"limo",
  	"lincoln",
  	"linde",
  	"link",
  	"lipsy",
  	"live",
  	"living",
  	"lk",
  	"llc",
  	"llp",
  	"loan",
  	"loans",
  	"locker",
  	"locus",
  	"loft",
  	"lol",
  	"london",
  	"lotte",
  	"lotto",
  	"love",
  	"lpl",
  	"lplfinancial",
  	"lr",
  	"ls",
  	"lt",
  	"ltd",
  	"ltda",
  	"lu",
  	"lundbeck",
  	"luxe",
  	"luxury",
  	"lv",
  	"ly",
  	"ma",
  	"macys",
  	"madrid",
  	"maif",
  	"maison",
  	"makeup",
  	"man",
  	"management",
  	"mango",
  	"map",
  	"market",
  	"marketing",
  	"markets",
  	"marriott",
  	"marshalls",
  	"maserati",
  	"mattel",
  	"mba",
  	"mc",
  	"mckinsey",
  	"md",
  	"me",
  	"med",
  	"media",
  	"meet",
  	"melbourne",
  	"meme",
  	"memorial",
  	"men",
  	"menu",
  	"merckmsd",
  	"mg",
  	"mh",
  	"miami",
  	"microsoft",
  	"mil",
  	"mini",
  	"mint",
  	"mit",
  	"mitsubishi",
  	"mk",
  	"ml",
  	"mlb",
  	"mls",
  	"mm",
  	"mma",
  	"mn",
  	"mo",
  	"mobi",
  	"mobile",
  	"moda",
  	"moe",
  	"moi",
  	"mom",
  	"monash",
  	"money",
  	"monster",
  	"mormon",
  	"mortgage",
  	"moscow",
  	"moto",
  	"motorcycles",
  	"mov",
  	"movie",
  	"mp",
  	"mq",
  	"mr",
  	"ms",
  	"msd",
  	"mt",
  	"mtn",
  	"mtr",
  	"mu",
  	"museum",
  	"music",
  	"mutual",
  	"mv",
  	"mw",
  	"mx",
  	"my",
  	"mz",
  	"na",
  	"nab",
  	"nagoya",
  	"name",
  	"natura",
  	"navy",
  	"nba",
  	"nc",
  	"ne",
  	"nec",
  	"net",
  	"netbank",
  	"netflix",
  	"network",
  	"neustar",
  	"new",
  	"news",
  	"next",
  	"nextdirect",
  	"nexus",
  	"nf",
  	"nfl",
  	"ng",
  	"ngo",
  	"nhk",
  	"ni",
  	"nico",
  	"nike",
  	"nikon",
  	"ninja",
  	"nissan",
  	"nissay",
  	"nl",
  	"no",
  	"nokia",
  	"northwesternmutual",
  	"norton",
  	"now",
  	"nowruz",
  	"nowtv",
  	"np",
  	"nr",
  	"nra",
  	"nrw",
  	"ntt",
  	"nu",
  	"nyc",
  	"nz",
  	"obi",
  	"observer",
  	"office",
  	"okinawa",
  	"olayan",
  	"olayangroup",
  	"oldnavy",
  	"ollo",
  	"om",
  	"omega",
  	"one",
  	"ong",
  	"onl",
  	"online",
  	"ooo",
  	"open",
  	"oracle",
  	"orange",
  	"org",
  	"organic",
  	"origins",
  	"osaka",
  	"otsuka",
  	"ott",
  	"ovh",
  	"pa",
  	"page",
  	"panasonic",
  	"paris",
  	"pars",
  	"partners",
  	"parts",
  	"party",
  	"passagens",
  	"pay",
  	"pccw",
  	"pe",
  	"pet",
  	"pf",
  	"pfizer",
  	"pg",
  	"ph",
  	"pharmacy",
  	"phd",
  	"philips",
  	"phone",
  	"photo",
  	"photography",
  	"photos",
  	"physio",
  	"pics",
  	"pictet",
  	"pictures",
  	"pid",
  	"pin",
  	"ping",
  	"pink",
  	"pioneer",
  	"pizza",
  	"pk",
  	"pl",
  	"place",
  	"play",
  	"playstation",
  	"plumbing",
  	"plus",
  	"pm",
  	"pn",
  	"pnc",
  	"pohl",
  	"poker",
  	"politie",
  	"porn",
  	"post",
  	"pr",
  	"pramerica",
  	"praxi",
  	"press",
  	"prime",
  	"pro",
  	"prod",
  	"productions",
  	"prof",
  	"progressive",
  	"promo",
  	"properties",
  	"property",
  	"protection",
  	"pru",
  	"prudential",
  	"ps",
  	"pt",
  	"pub",
  	"pw",
  	"pwc",
  	"py",
  	"qa",
  	"qpon",
  	"quebec",
  	"quest",
  	"racing",
  	"radio",
  	"re",
  	"read",
  	"realestate",
  	"realtor",
  	"realty",
  	"recipes",
  	"red",
  	"redstone",
  	"redumbrella",
  	"rehab",
  	"reise",
  	"reisen",
  	"reit",
  	"reliance",
  	"ren",
  	"rent",
  	"rentals",
  	"repair",
  	"report",
  	"republican",
  	"rest",
  	"restaurant",
  	"review",
  	"reviews",
  	"rexroth",
  	"rich",
  	"richardli",
  	"ricoh",
  	"ril",
  	"rio",
  	"rip",
  	"ro",
  	"rocher",
  	"rocks",
  	"rodeo",
  	"rogers",
  	"room",
  	"rs",
  	"rsvp",
  	"ru",
  	"rugby",
  	"ruhr",
  	"run",
  	"rw",
  	"rwe",
  	"ryukyu",
  	"sa",
  	"saarland",
  	"safe",
  	"safety",
  	"sakura",
  	"sale",
  	"salon",
  	"samsclub",
  	"samsung",
  	"sandvik",
  	"sandvikcoromant",
  	"sanofi",
  	"sap",
  	"sarl",
  	"sas",
  	"save",
  	"saxo",
  	"sb",
  	"sbi",
  	"sbs",
  	"sc",
  	"sca",
  	"scb",
  	"schaeffler",
  	"schmidt",
  	"scholarships",
  	"school",
  	"schule",
  	"schwarz",
  	"science",
  	"scot",
  	"sd",
  	"se",
  	"search",
  	"seat",
  	"secure",
  	"security",
  	"seek",
  	"select",
  	"sener",
  	"services",
  	"ses",
  	"seven",
  	"sew",
  	"sex",
  	"sexy",
  	"sfr",
  	"sg",
  	"sh",
  	"shangrila",
  	"sharp",
  	"shaw",
  	"shell",
  	"shia",
  	"shiksha",
  	"shoes",
  	"shop",
  	"shopping",
  	"shouji",
  	"show",
  	"showtime",
  	"si",
  	"silk",
  	"sina",
  	"singles",
  	"site",
  	"sj",
  	"sk",
  	"ski",
  	"skin",
  	"sky",
  	"skype",
  	"sl",
  	"sling",
  	"sm",
  	"smart",
  	"smile",
  	"sn",
  	"sncf",
  	"so",
  	"soccer",
  	"social",
  	"softbank",
  	"software",
  	"sohu",
  	"solar",
  	"solutions",
  	"song",
  	"sony",
  	"soy",
  	"spa",
  	"space",
  	"sport",
  	"spot",
  	"sr",
  	"srl",
  	"ss",
  	"st",
  	"stada",
  	"staples",
  	"star",
  	"statebank",
  	"statefarm",
  	"stc",
  	"stcgroup",
  	"stockholm",
  	"storage",
  	"store",
  	"stream",
  	"studio",
  	"study",
  	"style",
  	"su",
  	"sucks",
  	"supplies",
  	"supply",
  	"support",
  	"surf",
  	"surgery",
  	"suzuki",
  	"sv",
  	"swatch",
  	"swiss",
  	"sx",
  	"sy",
  	"sydney",
  	"systems",
  	"sz",
  	"tab",
  	"taipei",
  	"talk",
  	"taobao",
  	"target",
  	"tatamotors",
  	"tatar",
  	"tattoo",
  	"tax",
  	"taxi",
  	"tc",
  	"tci",
  	"td",
  	"tdk",
  	"team",
  	"tech",
  	"technology",
  	"tel",
  	"temasek",
  	"tennis",
  	"teva",
  	"tf",
  	"tg",
  	"th",
  	"thd",
  	"theater",
  	"theatre",
  	"tiaa",
  	"tickets",
  	"tienda",
  	"tiffany",
  	"tips",
  	"tires",
  	"tirol",
  	"tj",
  	"tjmaxx",
  	"tjx",
  	"tk",
  	"tkmaxx",
  	"tl",
  	"tm",
  	"tmall",
  	"tn",
  	"to",
  	"today",
  	"tokyo",
  	"tools",
  	"top",
  	"toray",
  	"toshiba",
  	"total",
  	"tours",
  	"town",
  	"toyota",
  	"toys",
  	"tr",
  	"trade",
  	"trading",
  	"training",
  	"travel",
  	"travelchannel",
  	"travelers",
  	"travelersinsurance",
  	"trust",
  	"trv",
  	"tt",
  	"tube",
  	"tui",
  	"tunes",
  	"tushu",
  	"tv",
  	"tvs",
  	"tw",
  	"tz",
  	"ua",
  	"ubank",
  	"ubs",
  	"ug",
  	"uk",
  	"unicom",
  	"university",
  	"uno",
  	"uol",
  	"ups",
  	"us",
  	"uy",
  	"uz",
  	"va",
  	"vacations",
  	"vana",
  	"vanguard",
  	"vc",
  	"ve",
  	"vegas",
  	"ventures",
  	"verisign",
  	"vermögensberater",
  	"vermögensberatung",
  	"versicherung",
  	"vet",
  	"vg",
  	"vi",
  	"viajes",
  	"video",
  	"vig",
  	"viking",
  	"villas",
  	"vin",
  	"vip",
  	"virgin",
  	"visa",
  	"vision",
  	"viva",
  	"vivo",
  	"vlaanderen",
  	"vn",
  	"vodka",
  	"volkswagen",
  	"volvo",
  	"vote",
  	"voting",
  	"voto",
  	"voyage",
  	"vu",
  	"vuelos",
  	"wales",
  	"walmart",
  	"walter",
  	"wang",
  	"wanggou",
  	"watch",
  	"watches",
  	"weather",
  	"weatherchannel",
  	"webcam",
  	"weber",
  	"website",
  	"wed",
  	"wedding",
  	"weibo",
  	"weir",
  	"wf",
  	"whoswho",
  	"wien",
  	"wiki",
  	"williamhill",
  	"win",
  	"windows",
  	"wine",
  	"winners",
  	"wme",
  	"wolterskluwer",
  	"woodside",
  	"work",
  	"works",
  	"world",
  	"wow",
  	"ws",
  	"wtc",
  	"wtf",
  	"xbox",
  	"xerox",
  	"xfinity",
  	"xihuan",
  	"xin",
  	"xxx",
  	"xyz",
  	"yachts",
  	"yahoo",
  	"yamaxun",
  	"yandex",
  	"ye",
  	"yodobashi",
  	"yoga",
  	"yokohama",
  	"you",
  	"youtube",
  	"yt",
  	"yun",
  	"za",
  	"zappos",
  	"zara",
  	"zero",
  	"zip",
  	"zm",
  	"zone",
  	"zuerich",
  	"zw",
  	"ελ",
  	"ευ",
  	"бг",
  	"бел",
  	"дети",
  	"ею",
  	"католик",
  	"ком",
  	"мкд",
  	"мон",
  	"москва",
  	"онлайн",
  	"орг",
  	"рус",
  	"рф",
  	"сайт",
  	"срб",
  	"укр",
  	"қаз",
  	"հայ",
  	"ישראל",
  	"קום",
  	"ابوظبي",
  	"اتصالات",
  	"ارامكو",
  	"الاردن",
  	"البحرين",
  	"الجزائر",
  	"السعودية",
  	"العليان",
  	"المغرب",
  	"امارات",
  	"ایران",
  	"بارت",
  	"بازار",
  	"بيتك",
  	"بھارت",
  	"تونس",
  	"سودان",
  	"سورية",
  	"شبكة",
  	"عراق",
  	"عرب",
  	"عمان",
  	"فلسطين",
  	"قطر",
  	"كاثوليك",
  	"كوم",
  	"مصر",
  	"مليسيا",
  	"موريتانيا",
  	"موقع",
  	"همراه",
  	"پاکستان",
  	"ڀارت",
  	"कॉम",
  	"नेट",
  	"भारत",
  	"भारतम्",
  	"भारोत",
  	"संगठन",
  	"বাংলা",
  	"ভারত",
  	"ভাৰত",
  	"ਭਾਰਤ",
  	"ભારત",
  	"ଭାରତ",
  	"இந்தியா",
  	"இலங்கை",
  	"சிங்கப்பூர்",
  	"భారత్",
  	"ಭಾರತ",
  	"ഭാരതം",
  	"ලංකා",
  	"คอม",
  	"ไทย",
  	"ລາວ",
  	"გე",
  	"みんな",
  	"アマゾン",
  	"クラウド",
  	"グーグル",
  	"コム",
  	"ストア",
  	"セール",
  	"ファッション",
  	"ポイント",
  	"世界",
  	"中信",
  	"中国",
  	"中國",
  	"中文网",
  	"亚马逊",
  	"企业",
  	"佛山",
  	"信息",
  	"健康",
  	"八卦",
  	"公司",
  	"公益",
  	"台湾",
  	"台灣",
  	"商城",
  	"商店",
  	"商标",
  	"嘉里",
  	"嘉里大酒店",
  	"在线",
  	"大拿",
  	"天主教",
  	"娱乐",
  	"家電",
  	"广东",
  	"微博",
  	"慈善",
  	"我爱你",
  	"手机",
  	"招聘",
  	"政务",
  	"政府",
  	"新加坡",
  	"新闻",
  	"时尚",
  	"書籍",
  	"机构",
  	"淡马锡",
  	"游戏",
  	"澳門",
  	"点看",
  	"移动",
  	"组织机构",
  	"网址",
  	"网店",
  	"网站",
  	"网络",
  	"联通",
  	"诺基亚",
  	"谷歌",
  	"购物",
  	"通販",
  	"集团",
  	"電訊盈科",
  	"飞利浦",
  	"食品",
  	"餐厅",
  	"香格里拉",
  	"香港",
  	"닷넷",
  	"닷컴",
  	"삼성",
  	"한국"
  ];

  const ipRegex = ipRegex$1;
  const tlds = require$$1;

  var urlRegex = options => {
  	options = {
  		strict: true,
  		...options
  	};

  	const protocol = `(?:(?:[a-z]+:)?//)${options.strict ? '' : '?'}`;
  	const auth = '(?:\\S+(?::\\S*)?@)?';
  	const ip = ipRegex.v4().source;
  	const host = '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
  	const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
  	const tld = `(?:\\.${options.strict ? '(?:[a-z\\u00a1-\\uffff]{2,})' : `(?:${tlds.sort((a, b) => b.length - a.length).join('|')})`})\\.?`;
  	const port = '(?::\\d{2,5})?';
  	const path = '(?:[/?#][^\\s"]*)?';
  	const regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${ip}|${host}${domain}${tld})${port}${path}`;

  	return options.exact ? new RegExp(`(?:^${regex}$)`, 'i') : new RegExp(regex, 'ig');
  };

  const request = common.createPluginRequest("com.msgbyte.linkmeta");

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = ".plugin-linkmeta-previewer {\n  background-color: var(--tc-content-background-color);\n  border: 1px solid rgba(148, 163, 184, 0.28);\n  border-radius: 8px;\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);\n  margin-top: 6px;\n  max-width: min(520px, 92%);\n  overflow: hidden;\n  padding: 0;\n  transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease;\n  width: 100%;\n}\n.plugin-linkmeta-previewer:hover {\n  border-color: rgba(88, 101, 242, 0.38);\n  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.12);\n  transform: translateY(-1px);\n}\n.plugin-linkmeta-previewer .basic {\n  cursor: pointer;\n  display: flex;\n  min-height: 116px;\n}\n.plugin-linkmeta-previewer .basic .summary {\n  flex: 1;\n  min-width: 0;\n  padding: 12px 14px;\n}\n.plugin-linkmeta-previewer .basic .summary .source,\n.plugin-linkmeta-previewer .basic .summary .url {\n  align-items: center;\n  color: var(--tc-text-secondary-color);\n  display: flex;\n  font-size: 12px;\n  gap: 6px;\n  line-height: 18px;\n  min-width: 0;\n}\n.plugin-linkmeta-previewer .basic .summary .source {\n  margin-bottom: 6px;\n}\n.plugin-linkmeta-previewer .basic .summary .source span {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.plugin-linkmeta-previewer .basic .summary .favicon {\n  border-radius: 4px;\n  flex: 0 0 auto;\n  height: 16px;\n  object-fit: cover;\n  width: 16px;\n}\n.plugin-linkmeta-previewer .basic .summary .title {\n  color: var(--tc-text-color);\n  font-weight: bold;\n  line-height: 20px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  word-break: break-word;\n}\n.plugin-linkmeta-previewer .basic .summary .description {\n  color: var(--tc-text-secondary-color);\n  display: -webkit-box;\n  font-size: 13px;\n  line-height: 19px;\n  margin-top: 6px;\n  overflow: hidden;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  word-break: break-word;\n}\n.plugin-linkmeta-previewer .basic .summary .url {\n  margin-top: 10px;\n}\n.plugin-linkmeta-previewer .basic .summary .url span {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.plugin-linkmeta-previewer .basic .summary .url svg {\n  flex: 0 0 auto;\n}\n.plugin-linkmeta-previewer .basic .image {\n  align-items: stretch;\n  background: rgba(148, 163, 184, 0.12);\n  display: flex;\n  flex: 0 0 148px;\n  max-height: 148px;\n  max-width: 148px;\n  min-height: 116px;\n  overflow: hidden;\n}\n.plugin-linkmeta-previewer .basic .image .ant-image,\n.plugin-linkmeta-previewer .basic .image img {\n  height: 100%;\n  width: 100%;\n}\n.plugin-linkmeta-previewer .basic .image img {\n  object-fit: cover;\n}\n.plugin-linkmeta-previewer .video {\n  border-top: 1px solid rgba(148, 163, 184, 0.2);\n  max-width: 100%;\n  position: relative;\n}\n.plugin-linkmeta-previewer .video .openfull {\n  position: absolute;\n  left: 8px;\n  top: 8px;\n  padding: 4px;\n  border-radius: 3px;\n  background-color: rgba(0, 0, 0, 0.2);\n  color: white;\n  font-size: 20px;\n}\n.plugin-linkmeta-previewer .video .openfull:hover {\n  background-color: rgba(0, 0, 0, 0.4);\n}\n.plugin-linkmeta-previewer .video iframe {\n  aspect-ratio: 16 / 9;\n  border: 0;\n  display: block;\n  width: 100%;\n}\n.plugin-linkmeta-previewer .video video {\n  display: block;\n  max-height: 420px;\n  width: 100%;\n}\n.plugin-linkmeta-previewer audio {\n  display: block;\n  min-width: 280px;\n  padding: 12px;\n  width: 100%;\n}\n@media screen and (max-width: 719px) {\n  .plugin-linkmeta-previewer .basic {\n    flex-direction: column;\n  }\n  .plugin-linkmeta-previewer .basic .image {\n    flex-basis: auto;\n    max-width: 100%;\n    max-height: 220px;\n    min-height: 160px;\n    order: -1;\n  }\n  .plugin-linkmeta-previewer .video iframe {\n    max-width: 100%;\n  }\n}\n";
  n(css,{});

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */

  var isArray$3 = Array.isArray;

  var isArray_1 = isArray$3;

  /** Detect free variable `global` from Node.js. */

  var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal$1;

  var freeGlobal = _freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root$3 = freeGlobal || freeSelf || Function('return this')();

  var _root = root$3;

  var root$2 = _root;

  /** Built-in value references. */
  var Symbol$3 = root$2.Symbol;

  var _Symbol = Symbol$3;

  var Symbol$2 = _Symbol;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$4.toString;

  /** Built-in value references. */
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty$3.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag$1;

  /** Used for built-in method references. */

  var objectProto$3 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto$3.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString$1(value) {
    return nativeObjectToString.call(value);
  }

  var _objectToString = objectToString$1;

  var Symbol$1 = _Symbol,
      getRawTag = _getRawTag,
      objectToString = _objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag$2(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  var _baseGetTag = baseGetTag$2;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */

  function isObjectLike$1(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike$1;

  var baseGetTag$1 = _baseGetTag,
      isObjectLike = isObjectLike_1;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol$3(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag$1(value) == symbolTag);
  }

  var isSymbol_1 = isSymbol$3;

  var isArray$2 = isArray_1,
      isSymbol$2 = isSymbol_1;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey$1(value, object) {
    if (isArray$2(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol$2(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }

  var _isKey = isKey$1;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */

  function isObject$2(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject$2;

  var baseGetTag = _baseGetTag,
      isObject$1 = isObject_1;

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction$1(value) {
    if (!isObject$1(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction$1;

  var root$1 = _root;

  /** Used to detect overreaching core-js shims. */
  var coreJsData$1 = root$1['__core-js_shared__'];

  var _coreJsData = coreJsData$1;

  var coreJsData = _coreJsData;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked$1(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  var _isMasked = isMasked$1;

  /** Used for built-in method references. */

  var funcProto$1 = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource$1(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  var _toSource = toSource$1;

  var isFunction = isFunction_1,
      isMasked = _isMasked,
      isObject = isObject_1,
      toSource = _toSource;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative$1(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  var _baseIsNative = baseIsNative$1;

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */

  function getValue$1(object, key) {
    return object == null ? undefined : object[key];
  }

  var _getValue = getValue$1;

  var baseIsNative = _baseIsNative,
      getValue = _getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative$2(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative$2;

  var getNative$1 = _getNative;

  /* Built-in method references that are verified to be native. */
  var nativeCreate$4 = getNative$1(Object, 'create');

  var _nativeCreate = nativeCreate$4;

  var nativeCreate$3 = _nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear$1() {
    this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
    this.size = 0;
  }

  var _hashClear = hashClear$1;

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */

  function hashDelete$1(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var _hashDelete = hashDelete$1;

  var nativeCreate$2 = _nativeCreate;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet$1(key) {
    var data = this.__data__;
    if (nativeCreate$2) {
      var result = data[key];
      return result === HASH_UNDEFINED$1 ? undefined : result;
    }
    return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet$1;

  var nativeCreate$1 = _nativeCreate;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas$1(key) {
    var data = this.__data__;
    return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
  }

  var _hashHas = hashHas$1;

  var nativeCreate = _nativeCreate;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet$1(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    return this;
  }

  var _hashSet = hashSet$1;

  var hashClear = _hashClear,
      hashDelete = _hashDelete,
      hashGet = _hashGet,
      hashHas = _hashHas,
      hashSet = _hashSet;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash$1.prototype.clear = hashClear;
  Hash$1.prototype['delete'] = hashDelete;
  Hash$1.prototype.get = hashGet;
  Hash$1.prototype.has = hashHas;
  Hash$1.prototype.set = hashSet;

  var _Hash = Hash$1;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */

  function listCacheClear$1() {
    this.__data__ = [];
    this.size = 0;
  }

  var _listCacheClear = listCacheClear$1;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */

  function eq$1(value, other) {
    return value === other || (value !== value && other !== other);
  }

  var eq_1 = eq$1;

  var eq = eq_1;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf$4(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  var _assocIndexOf = assocIndexOf$4;

  var assocIndexOf$3 = _assocIndexOf;

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete$1(key) {
    var data = this.__data__,
        index = assocIndexOf$3(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  var _listCacheDelete = listCacheDelete$1;

  var assocIndexOf$2 = _assocIndexOf;

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet$1(key) {
    var data = this.__data__,
        index = assocIndexOf$2(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  var _listCacheGet = listCacheGet$1;

  var assocIndexOf$1 = _assocIndexOf;

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas$1(key) {
    return assocIndexOf$1(this.__data__, key) > -1;
  }

  var _listCacheHas = listCacheHas$1;

  var assocIndexOf = _assocIndexOf;

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet$1(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  var _listCacheSet = listCacheSet$1;

  var listCacheClear = _listCacheClear,
      listCacheDelete = _listCacheDelete,
      listCacheGet = _listCacheGet,
      listCacheHas = _listCacheHas,
      listCacheSet = _listCacheSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache$1.prototype.clear = listCacheClear;
  ListCache$1.prototype['delete'] = listCacheDelete;
  ListCache$1.prototype.get = listCacheGet;
  ListCache$1.prototype.has = listCacheHas;
  ListCache$1.prototype.set = listCacheSet;

  var _ListCache = ListCache$1;

  var getNative = _getNative,
      root = _root;

  /* Built-in method references that are verified to be native. */
  var Map$1 = getNative(root, 'Map');

  var _Map = Map$1;

  var Hash = _Hash,
      ListCache = _ListCache,
      Map = _Map;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear$1() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map || ListCache),
      'string': new Hash
    };
  }

  var _mapCacheClear = mapCacheClear$1;

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */

  function isKeyable$1(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  var _isKeyable = isKeyable$1;

  var isKeyable = _isKeyable;

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData$4(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  var _getMapData = getMapData$4;

  var getMapData$3 = _getMapData;

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete$1(key) {
    var result = getMapData$3(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  var _mapCacheDelete = mapCacheDelete$1;

  var getMapData$2 = _getMapData;

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet$1(key) {
    return getMapData$2(this, key).get(key);
  }

  var _mapCacheGet = mapCacheGet$1;

  var getMapData$1 = _getMapData;

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas$1(key) {
    return getMapData$1(this, key).has(key);
  }

  var _mapCacheHas = mapCacheHas$1;

  var getMapData = _getMapData;

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet$1(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  var _mapCacheSet = mapCacheSet$1;

  var mapCacheClear = _mapCacheClear,
      mapCacheDelete = _mapCacheDelete,
      mapCacheGet = _mapCacheGet,
      mapCacheHas = _mapCacheHas,
      mapCacheSet = _mapCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache$1.prototype.clear = mapCacheClear;
  MapCache$1.prototype['delete'] = mapCacheDelete;
  MapCache$1.prototype.get = mapCacheGet;
  MapCache$1.prototype.has = mapCacheHas;
  MapCache$1.prototype.set = mapCacheSet;

  var _MapCache = MapCache$1;

  var MapCache = _MapCache;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize$1(func, resolver) {
    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize$1.Cache || MapCache);
    return memoized;
  }

  // Expose `MapCache`.
  memoize$1.Cache = MapCache;

  var memoize_1 = memoize$1;

  var memoize = memoize_1;

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped$1(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  var _memoizeCapped = memoizeCapped$1;

  var memoizeCapped = _memoizeCapped;

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath$1 = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  var _stringToPath = stringToPath$1;

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */

  function arrayMap$1(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  var _arrayMap = arrayMap$1;

  var Symbol = _Symbol,
      arrayMap = _arrayMap,
      isArray$1 = isArray_1,
      isSymbol$1 = isSymbol_1;

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString$1(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray$1(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString$1) + '';
    }
    if (isSymbol$1(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
  }

  var _baseToString = baseToString$1;

  var baseToString = _baseToString;

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString$1(value) {
    return value == null ? '' : baseToString(value);
  }

  var toString_1 = toString$1;

  var isArray = isArray_1,
      isKey = _isKey,
      stringToPath = _stringToPath,
      toString = toString_1;

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath$1(value, object) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }

  var _castPath = castPath$1;

  var isSymbol = isSymbol_1;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey$1(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  var _toKey = toKey$1;

  var castPath = _castPath,
      toKey = _toKey;

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet$1(object, path) {
    path = castPath(path, object);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return (index && index == length) ? object : undefined;
  }

  var _baseGet = baseGet$1;

  var baseGet = _baseGet;

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  var get_1 = get;

  function getDisplayHost(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (e) {
      return url;
    }
  }
  const UrlMetaBase = React__default["default"].memo(({ meta }) => {
    const imageUrl = get_1(meta, "images.0");
    const videoUrl = get_1(meta, "videos.0");
    const siteName = get_1(meta, "siteName") || getDisplayHost(meta.url);
    const title = get_1(meta, "title") || siteName;
    const description = get_1(meta, "description");
    const favicon = get_1(meta, "favicons.0");
    return /* @__PURE__ */ React__default["default"].createElement(React__default["default"].Fragment, null, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "basic",
      onClick: () => window.open(meta.url)
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "summary"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "source"
    }, favicon && /* @__PURE__ */ React__default["default"].createElement("img", {
      className: "favicon",
      src: common.parseUrlStr(favicon),
      alt: ""
    }), /* @__PURE__ */ React__default["default"].createElement("span", null, siteName)), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "title"
    }, title), description && /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "description"
    }, description), /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "url"
    }, /* @__PURE__ */ React__default["default"].createElement("span", null, getDisplayHost(meta.url)), /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:open-in-new"
    }))), imageUrl && /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "image"
    }, /* @__PURE__ */ React__default["default"].createElement(component.Image, {
      preview: true,
      src: common.parseUrlStr(imageUrl)
    }))), videoUrl && /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "video"
    }, /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "openfull",
      onClick: (e) => {
        e.stopPropagation();
        window.open(videoUrl);
      }
    }, /* @__PURE__ */ React__default["default"].createElement(component.Icon, {
      icon: "mdi:open-in-new"
    })), /* @__PURE__ */ React__default["default"].createElement("iframe", {
      src: videoUrl
    })));
  });
  UrlMetaBase.displayName = "UrlMetaBase";

  const UrlMetaVideo = React__default["default"].memo(({ meta }) => {
    return /* @__PURE__ */ React__default["default"].createElement("video", {
      src: meta.url,
      controls: true
    });
  });
  UrlMetaVideo.displayName = "UrlMetaVideo";

  const MAX_HEIGHT = 320;
  const MAX_WIDTH = 320;
  const UrlMetaImage = React__default["default"].memo(({ meta }) => {
    return /* @__PURE__ */ React__default["default"].createElement(component.Image, {
      preview: true,
      src: common.parseUrlStr(meta.url),
      style: {
        maxHeight: MAX_HEIGHT,
        maxWidth: MAX_WIDTH,
        width: "auto"
      }
    });
  });
  UrlMetaImage.displayName = "UrlMetaImage";

  const UrlMetaAudio = React__default["default"].memo(({ meta }) => {
    return /* @__PURE__ */ React__default["default"].createElement("audio", {
      src: meta.url,
      controls: true
    });
  });
  UrlMetaAudio.displayName = "UrlMetaAudio";

  const UrlMetaRender = React__default["default"].memo(({ meta }) => {
    const contentType = get_1(meta, "contentType", "");
    if (contentType.startsWith("video/")) {
      return /* @__PURE__ */ React__default["default"].createElement("div", {
        className: "plugin-linkmeta-previewer"
      }, /* @__PURE__ */ React__default["default"].createElement(UrlMetaVideo, {
        meta
      }));
    }
    if (contentType.startsWith("image/")) {
      return /* @__PURE__ */ React__default["default"].createElement("div", {
        className: "plugin-linkmeta-previewer"
      }, /* @__PURE__ */ React__default["default"].createElement(UrlMetaImage, {
        meta
      }));
    }
    if (contentType.startsWith("audio/")) {
      return /* @__PURE__ */ React__default["default"].createElement("div", {
        className: "plugin-linkmeta-previewer"
      }, /* @__PURE__ */ React__default["default"].createElement(UrlMetaAudio, {
        meta
      }));
    }
    if (contentType.startsWith("application/")) {
      return null;
    }
    if (meta["title"] === "" && meta["siteName"] === "") {
      return null;
    }
    return /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-linkmeta-previewer"
    }, /* @__PURE__ */ React__default["default"].createElement(UrlMetaBase, {
      meta
    }));
  });
  UrlMetaRender.displayName = "UrlMetaRender";

  const metaCache = {};
  const UrlMetaPreviewer = React__default["default"].memo((props) => {
    const {
      error,
      value: meta,
      loading
    } = common.useAsync(async () => {
      if (metaCache[props.url] !== void 0) {
        return metaCache[props.url];
      }
      try {
        const { data } = await request.post("fetch", {
          url: props.url
        });
        metaCache[props.url] = data;
        return data;
      } catch (e) {
        console.warn("[linkmeta] fetch url meta info error", e);
        metaCache[props.url] = null;
        return null;
      }
    }, [props.url]);
    if (error || meta === null) {
      return null;
    }
    return loading ? /* @__PURE__ */ React__default["default"].createElement("div", {
      className: "plugin-linkmeta-previewer"
    }, /* @__PURE__ */ React__default["default"].createElement(component.LoadingSpinner, null)) : /* @__PURE__ */ React__default["default"].createElement(UrlMetaRender, {
      meta
    });
  });
  UrlMetaPreviewer.displayName = "UrlMetaPreviewer";

  function normalizeMatchedUrl(url) {
    return url.replace(/[),.;!?，。；！？]+$/, "");
  }
  common.regMessageExtraParser({
    name: "com.msgbyte.linkmeta/urlParser",
    render({ content }) {
      const matched = String(common.getMessageTextDecorators().serialize(String(content))).match(urlRegex());
      if (matched) {
        const urlMatch = matched.map(normalizeMatchedUrl).filter((m, index, list) => list.indexOf(m) === index).filter((m) => !m.startsWith(window.location.origin)).filter((m) => {
          const text = String(content);
          return !text.includes(`](${m})`);
        });
        if (urlMatch.length > 0 && typeof urlMatch[0] === "string") {
          return /* @__PURE__ */ React__default["default"].createElement(UrlMetaPreviewer, {
            url: urlMatch[0]
          });
        }
      }
      return null;
    }
  });
  common.regInspectService({
    name: "plugin:com.msgbyte.linkmeta",
    label: Translate.linkmetaService
  });

}));
//# sourceMappingURL=index.js.map
