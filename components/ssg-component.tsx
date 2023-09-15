import Link from "next/link";

export interface Root {
  kind: string;
  data: Data;
}

export interface Data {
  after: string;
  dist: number;
  modhash: string;
  geo_filter: string;
  children: Children[];
  before: any;
}

export interface Children {
  kind: string;
  data: Data2;
}

export interface Data2 {
  title: string;
  url: string;
}

export interface MediaEmbed {}

export interface SecureMediaEmbed {}

export interface Gildings {}

const fetchDataSSG = async (): Promise<Root> => {
  try {
    const data = await fetch(
      "https://www.reddit.com/r/AskReddit/new.json?limit=3"
    );
    const res: Root = await data.json();
    return res;
  } catch (err) {
    throw new Error("error happened on server");
  }
};

const SSGComponent = async () => {
  const SSGData = await fetchDataSSG();
  return (
    <div>
      <h1>
        <strong>SSG Component</strong>
      </h1>
      {SSGData.data.children.map((val, i) => (
        <div key={i}>
          <p>ASK Reddit Title: {val.data.title}</p>
          <Link href={val.data.url}>{val.data.url}</Link>
        </div>
      ))}
      <Link href="https://www.reddit.com/r/AskReddit/new.json?limit=3">
        <h1>Compare stale data above and fresh data in reddit API</h1>
      </Link>
    </div>
  );
};

export default SSGComponent;
