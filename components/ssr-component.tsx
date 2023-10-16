import Link from "next/link";

export interface Root {
  meta: string;
  data: Data;
}

export interface Data {
  posts: Children[]
}


export interface Children {
  title: string;
  url:string;
  creationTs:number;
}
// export interface Data2 {
//   title: string;
//   url: string;
//   created_utc: number;
// }

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

const fetchDataSSR = async (): Promise<Root> => {
 
    const data = await fetch(
      "https://9gag.com/v1/group-posts/type/fresh", { cache: 'no-store' }
    );
    const res: Root = await data.json();
    return res;
  
};

const SSRComponent = async () => {
  const SSRData = await fetchDataSSR();
  return (
    <div>
      <h1>
        <strong>SSR Component</strong>
      </h1>
      {SSRData.data.posts.map((val, i) => (
        <div key={i}>
          <p>ASK Reddit Title: {val.title}</p>
          <Link href={val.url}>{val.url}</Link>
          <h2>Created at: {convertUTCJapanTime(val.creationTs)}</h2>
        </div>
      ))}
      <Link href="https://9gag.com/v1/group-posts/type/fresh">
        <h1>Compare stale data above to fresh data in 9gag API</h1>
      </Link>
    </div>
  );
};

export default SSRComponent;
