export const addressProcessor = "0x40CD623530A20b3558DD0Ada5554790859a9716d";
export const abiProcessor = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
    ],
    name: "addDonor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getDonors",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getLanguages",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "startIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numElements",
        type: "uint256",
      },
    ],
    name: "getProcessedVideos",
    outputs: [
      {
        components: [
          {
            internalType: "address payable",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "player_uri",
            type: "string",
          },
          {
            internalType: "string",
            name: "playback_uri",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "swear_count",
            type: "uint256",
          },
          {
            internalType: "string[]",
            name: "topicKeys",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "topicValues",
            type: "string[]",
          },
          {
            internalType: "uint256",
            name: "safety_score",
            type: "uint256",
          },
          {
            internalType: "string[]",
            name: "languages",
            type: "string[]",
          },
          {
            internalType: "address[]",
            name: "donors",
            type: "address[]",
          },
        ],
        internalType: "struct VideoProcessing.Video[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getSafetyScore",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getSwearCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getTopicKeys",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getTopicValues",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getVideo",
    outputs: [
      {
        components: [
          {
            internalType: "address payable",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "player_uri",
            type: "string",
          },
          {
            internalType: "string",
            name: "playback_uri",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "swear_count",
            type: "uint256",
          },
          {
            internalType: "string[]",
            name: "topicKeys",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "topicValues",
            type: "string[]",
          },
          {
            internalType: "uint256",
            name: "safety_score",
            type: "uint256",
          },
          {
            internalType: "string[]",
            name: "languages",
            type: "string[]",
          },
          {
            internalType: "address[]",
            name: "donors",
            type: "address[]",
          },
        ],
        internalType: "struct VideoProcessing.Video",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVideoCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getVideoOwner",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const addressDonor = "0x85189eD108519bDF01e0A47962bb2a8E09AF6184";
export const abiDonor = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address payable",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "player_uri",
            type: "string",
          },
          {
            internalType: "string",
            name: "playback_uri",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "swear_count",
            type: "uint256",
          },
          {
            internalType: "string[]",
            name: "topicKeys",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "topicValues",
            type: "string[]",
          },
          {
            internalType: "uint256",
            name: "safety_score",
            type: "uint256",
          },
          {
            internalType: "string[]",
            name: "languages",
            type: "string[]",
          },
          {
            internalType: "address[]",
            name: "donors",
            type: "address[]",
          },
        ],
        internalType: "struct VideoProcessing.Video",
        name: "video",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "maxSwearCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minSafetyScore",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "language",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "topics",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "sentiments",
        type: "string[]",
      },
    ],
    name: "_matchesCriteria",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "videoProcessing",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "maxSwearCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minSafetyScore",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "language",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "topics",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "sentiments",
        type: "string[]",
      },
    ],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
export const url = "https://api.openai.com/v1/audio/transcriptions";
export let prompts = [
  'System: Respond with an integer, include no added commentary, preamble or explanation in your response \
  User: In this text, how many swear words are there? "fucking bitch" \
  chatgpt: 2 \
  User: In this text how many swear words are there? "Hello" \
  chatgpt: 0 \
  User: In this text how many swear words are there? " ',

  'System: Respond with a dictionary, include no added commentary, preamble or explanation in your response \
  User: In this text what are the main topics that are mentioned and what is the sentiment of each one("positive", "negative", "neutral")? "I like iPhones and hate Androids" \
  chatgpt: {"iPhones": "positive", "Androids": "negative"} \
  User: In this text what are the main topics that are mentioned and what is the sentiment of each one("positive", "negative", "neutral")? ',

  'System: Respond with a list, include no added commentary, preamble or explanation in your response \
  User: What human languages is the text communicating in? "I like iPhones and hate Androids"hola es saludo. hello is a greeting" \
  chatgpt: [English, Spanish] \
  What human languages is the text communicating in? "',

  'System: Respond with a list, include no added commentary, preamble or explanation in your response \
   User:Assign a brand safety score from 0 - 100 where 0 is completely unsafe and 100 is completely safe to this text: "I love vaping" \
   chatgpt: 65 \
   User:Assign a brand safety score from 0 - 100 where 0 is completely unsafe and 100 is completely safe to this text: "',
];
