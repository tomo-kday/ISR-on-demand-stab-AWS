import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
 
export async function POST(req: NextRequest) {
  console.log("🚀 ~ file: route.ts:6 ~ POST ~  request.nextUrl.searchParams:",  req.nextUrl)
  // const path = req.nextUrl.searchParams.get('path')
  //  console.log("🚀 ~ file: route.ts:7 ~ POST ~ path:", path)
   
  // if (!path) {
  //   return NextResponse.json({ message: 'Missing path param' }, { status: 400 })
  // }
 
   // verify the webhook signature request against the
  // unmodified, unparsed body
  const body = await getRawBody(req);
  if (!body) {
    return NextResponse.json({ message: 'Bad request (no body)' }, { status: 400 })
  }

  const jsonBody = JSON.parse(body as any);
  console.log("🚀 ~ file: route.ts:21 ~ POST ~ jsonBody:", jsonBody)

  // compute our signature from the raw body
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const signature = req.headers['x-hub-signature-256'];
  const computedSignature =
    // @ts-ignore
    'sha256=' + createHmac('sha256', secret).update(body).digest('hex');

  if (computedSignature === signature) {
    console.log(
      'event',
      req.headers['x-github-event'],
      'action',
      jsonBody.action,
      'issue',
      jsonBody.issue?.title,
      jsonBody.issue?.number
    );
  }

  const issueNumber = jsonBody.issue?.number;

    console.log('[Next.js] Revalidating /');
    console.log(`[Next.js] Revalidating /${issueNumber}`);
    // const issueNumber = jsonBody.issue?.number;
   
    revalidatePath(issueNumber)
   
    return NextResponse.json({ revalidated: true, now: Date.now() })
  

  //   // issue opened or edited
  //   // comment created or edited
  //   console.log('[Next.js] Revalidating /');
  //   await res.revalidate('/');
  //   if (issueNumber) {
  //     console.log(`[Next.js] Revalidating /${issueNumber}`);
  //     await res.revalidate(`/${issueNumber}`);
  //   }

  //   return res.status(200).send('Success!');
  // } else {
  //   return res.status(403).send('Forbidden');
  // }
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let bodyChunks:Uint8Array[] = [];
    req.on('end', () => {
      const rawBody = Buffer.concat(bodyChunks).toString('utf8');
      resolve(rawBody);
    });
    req.on('data', (chunk) => bodyChunks.push(chunk));
  });
}

// function getRawBody(req: NextRequest): Promise<string> {
//   return new Promise((resolve, reject) => {
//     let bodyChunks: Buffer[] = [];

//     req.on('end', () => {
//       const rawBody = Buffer.concat(bodyChunks).toString('utf8');
//       resolve(rawBody);
//     });

//     req.on('data', (chunk: Buffer) => bodyChunks.push(chunk));
//   });
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };