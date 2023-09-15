import { createHmac } from 'crypto';
// import { revalidatePath } from 'next/cache';

export default async function handleWebhook(req, res) {
  console.log("🚀 ~ file: revalidate.js:4 ~ handleWebhook ~ req:", req.body)
  // verify the webhook signature request against the
  // unmodified, unparsed body
  const body = await getRawBody(req);
  if (!body) {
    res.status(400).send('Bad request (no body)');
    return;
  }

  const jsonBody = JSON.parse(body);

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

    const issueNumber = jsonBody.issue?.number;
    console.log("🚀 ~ file: revalidate.js:34 ~ handleWebhook ~ issueNumber:", issueNumber)

    // issue opened or edited
    // comment created or edited
    // console.log('⚡️ ⚡️ ⚡️ [Next.js] Revalidating /');
    console.log();
    // // how does it work under the hood?
    // await res.revalidate('/');
    if (issueNumber) {
      console.log(`⚡️ ⚡️ ⚡️ [Next.js] Revalidating /${issueNumber}`);
      await res.revalidate(`/${issueNumber}`);      
      // revalidatePath(`/${issueNumber}`);    
    }

    return res.status(200).send('Success!');
  } else {
    return res.status(403).send('Forbidden');
  }
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let bodyChunks = [];
    req.on('end', () => {
      const rawBody = Buffer.concat(bodyChunks).toString('utf8');
      resolve(rawBody);
    });
    req.on('data', (chunk) => bodyChunks.push(chunk));
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
