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
  created_utc: number;
}

const convertUTCJapanTime = (utc: number) => {
  const utcTimestamp = utc * 1000; // Multiply by 1000 to convert seconds to milliseconds

  // Create a Date object from the UTC timestamp
  const utcDate = new Date(utcTimestamp);

  // Create an Intl.DateTimeFormat object with the timeZone option set to 'Asia/Tokyo' (Japan Standard Time)
  const japanTimeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false, // Use 24-hour format
  });

  // Format the UTC date to Japan time
  const japanTime = japanTimeFormatter.format(utcDate);

  return japanTime;
};

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
          <h2>Created at: {convertUTCJapanTime(val.data.created_utc)}</h2>
        </div>
      ))}
      <Link href="https://www.reddit.com/r/AskReddit/new.json?limit=3">
        <h1>Compare stale data above to fresh data in reddit API</h1>
      </Link>
    </div>
  );
};

export default SSGComponent;
