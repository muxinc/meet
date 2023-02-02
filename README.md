# Mux Meet

Mux Meet is a video conferencing app powered by [Mux Real-Time Video](https://mux.com/real-time-video), written in React, using the [Next.js](https://nextjs.org/) framework.

![Four users in a Mux Meet call](https://user-images.githubusercontent.com/1211390/216212346-b319d137-0d2e-405a-bbab-703cc32763b3.jpg)

# Getting Started

In order for Meet to connect to Mux's APIs, an access token and signing key must be provided. These are generated in the Mux Dashboard and should be set as environment variables.

The easiest way to use Mux Meet is to deploy it to Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=Mux%20Meet&demo-description=Real-time%20conferencing%20(meeting)%20SaaS%20app%2C%20built%20with%20Next.js%2C%20Mux%2C%20and%20Vercel&demo-url=https%3A%2F%2Fmuxmeet.vercel.app%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F7ISNSvmomH7w7KUPCy8gn0%2F97ab315dcd21aa1d4b23e54dc123b562%2Fmux-meet.png&project-name=Mux%20Meet&repository-name=mux-meet&repository-url=https%3A%2F%2Fgithub.com%2Fmuxinc%2Fmeet&from=templates&skippable-integrations=1&env=MUX_TOKEN_ID%2CMUX_TOKEN_SECRET%2CMUX_SIGNING_KEY%2CMUX_PRIVATE_KEY&envDescription=How%20to%20get%20these%20env%20variables%3A&envLink=https%3A%2F%2Fgithub.com%2Fmuxinc%2Fmeet%23getting-started)

After creating your project, you will be prompted to configure it.

![Configure Vercel Environment Variables](https://user-images.githubusercontent.com/1211390/216212169-251d87ef-83ae-4b9b-82e8-ae42cb430b02.jpg)

In a separate window, open https://dashboard.mux.com and sign in. You will need to create an account, if you don't already have one.

From the [Mux Dashboard](https://dashboard.mux.com), open Settings from the bottom left and click Access Tokens. Then click "Generate new token" and select Mux Video from the list of permissions. Optionally, give the access token a name like Mux Meet.

![Create new Mux Access Token](https://user-images.githubusercontent.com/1211390/216212226-d98b377b-7105-4db7-89f7-8b3f6aadd805.jpg)

Once your token is generated, copy and paste the ID and Secret as the values for `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` in Vercel.

Now go back to https://dashboard.mux.com to generate the Signing Key.

From the [Mux Dashboard](https://dashboard.mux.com), open Settings from the bottom left and click Signing Keys. Then click "Generate new key" and make sure you use the same environment as you did for the Access Token. The Product selection should default to Video.

![Create new Mux Signing Key](https://user-images.githubusercontent.com/1211390/216212263-f8fe2d0a-e8f4-4ba6-8197-bbbe745c9cb1.jpg)

Once your key is generated, copy and paste the ID and Secret as the values for `MUX_SIGNING_KEY` and `MUX_PRIVATE_KEY` in Vercel.

_Both the Access Token and Signing Key are sensitive. DO NOT MAKE THEM PUBLIC. It is safe to store them in Vercel as Environment Variables or locally during development._

Once all 4 environment variables are filled in. Click Deploy for Vercel to build and start your app.

## Cleanup Spaces after Meeting

Joining a new Space creates a Space in Mux, but in order to clean up Spaces after a meeting is over, set up a simple [webhook from Mux](https://docs.mux.com/guides/video/listen-for-webhooks).

From the [Mux Dashboard](https://dashboard.mux.com), open Settings from the bottom left and click Webhooks. Then click "Generate new webhook" and make sure you use the same environment as you did for the Access Token. The URL to notify will be your app's URL + `/api/webhooks`.

![Create new Mux webhook](https://user-images.githubusercontent.com/1211390/216212296-93dad4a3-1b91-4402-8eed-c0325dea0d69.jpg)

Now generate the Webhook and copy the Signing Secret by clicking Show Signing Secret.

Configure your deployed app with a new environment variable named `WEBHOOK_SECRET` with the value of the Webhook Signing Secret.

_Make sure you redeploy for your new environment variable to take affect._

## Limit Access

To limit the number of active Spaces, set an integer value for an environment variable `ACTIVE_SPACE_LIMIT`.

To limit the amount of time participants are allowed to spend in a temporary Space, set an integer value in seconds for an environment variable `SPACE_DURATION_SECONDS`.

# Develop locally

Create an .env.local file at the root of the repo with the following secrets:

```bash
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_SIGNING_KEY=
MUX_PRIVATE_KEY=
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

# Learn More

## Mux

- [Mux Real-Time Video](https://mux.com/real-time-video)
- [Real-Time Video in React](https://docs.mux.com/guides/video/send-and-receive-real-time-video-from-a-react-application)
- [Real-Time Video on Android](https://docs.mux.com/guides/video/send-and-receive-real-time-video-from-an-android-application)
- [Real-Time Video on iOS](https://docs.mux.com/guides/video/send-and-receive-real-time-video-from-an-ios-application)

## Next.js

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
