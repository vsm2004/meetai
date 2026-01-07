"use client";

import { useEffect, useState } from "react";
import CallUi from "./call-ui";
import { LoaderIcon } from "lucide-react";
import {
  StreamVideo,
  StreamCall,
  StreamVideoClient,
  Call,
  CallingState,
} from "@stream-io/video-react-sdk";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import "@stream-io/video-react-sdk/dist/css/styles.css";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: Props) => {
  const trpc = useTRPC();
  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions()
  );

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  // 1️⃣ Create Stream client
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_VIDEO_STREAM_API_KEY) {
      throw new Error("Missing Stream API key");
    }

    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_VIDEO_STREAM_API_KEY,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: async () => {
        const { token } = await generateToken();
        return token;
      },
    });

    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(null);
    };
  }, [userId, userName, userImage, generateToken]);

  // 2️⃣ Create (or get) the call on Stream
  useEffect(() => {
    if (!client) return;

    let isMounted = true;
    const _call = client.call("default", meetingId);

    const setupCall = async () => {
      await _call.getOrCreate(); // 🔑 REQUIRED
      _call.microphone.disable();

      if (isMounted) {
        setCall(_call);
      }
    };

    setupCall();

    return () => {
      isMounted = false;

      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
      }

      setCall(null);
    };
  }, [client, meetingId]);

  // 3️⃣ Loading state
  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  // 4️⃣ Render Stream context
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUi meetingId={meetingId} meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
};
