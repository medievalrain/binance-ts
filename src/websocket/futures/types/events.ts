export type FuturesBookTickerEvent = {
  u: number;
  s: string;
  b: string;
  B: string;
  a: string;
  A: string;
};

export type FuturesBookDepthEvent = {
  e: "depthUpdate";
  E: number;
  T: number;
  U: number;
  u: number;
  pu: number;
  s: string;
  b: [string, string][];
  a: [string, string][];
};

export type FuturesAggTradeEvent = {
  e: "aggTrade";
  E: number;
  s: string;
  a: number;
  p: string;
  q: string;
  f: number;
  l: number;
  T: number;
  m: boolean;
};
